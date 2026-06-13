# PORTFOLIO DATA
# Edit this file to update your portfolio. All sections are driven from here.

---

## META
name: Rupesh Kumar
handle: nullspec7or
tagline: Red Teamer · Bug Hunter · Security Researcher
location: Hyderabad, India
email: nullspec7or@gmail.com
github: https://github.com/nullspec7or
linkedin: https://linkedin.com/in/nullspec7or
twitter: https://twitter.com/nullspec7or
blog_url: blog/index.html
avatar_initials: RK
og_description: Security researcher specializing in AD, Network, Web & Cloud pentesting. OWASP AppSec EU 2026 Speaker. DoE VDP Hall of Fame.

---

## ABOUT
I'm a Junior IT Security Engineer at **Toucan Payments**, Hyderabad — operating well above title level in vulnerability research, coordinated disclosures, and open-source security contributions.

My work spans **Active Directory**, **network infrastructure**, **web application security**, and **cloud environments**. I operate under the handle `nullspec7or` and have contributed upstream fixes to major open-source projects, presented at OWASP Global AppSec EU 2026 in Vienna, and earned recognition in the U.S. Department of Energy's VDP Hall of Fame.

I approach security research through an **assumption-chain** lens — questioning every inherited trust boundary and default configuration until the real attack surface reveals itself.

skills:
- Active Directory & Kerberos
- Web Application Pentesting
- Network Security & Pivoting
- Cloud Security (AWS)
- Red Teaming
- Vulnerability Research
- CVE Disclosure
- OSINT & Recon
- Exploit Development
- SIEM & Wazuh
- Python & Bash Scripting
- Threat Modeling

---

## EXPERIENCE

### Junior IT Security Engineer
company: Toucan Payments
period: 2023 — Present
location: Hyderabad, India
description: Conducting internal security assessments, vulnerability research, and implementing security controls for a fintech payments platform. Responsibilities span penetration testing, SIEM deployment, compliance work (PCI DSS), and coordinated disclosure of upstream open-source vulnerabilities.
highlights:
- Designed and deployed Wazuh SIEM on AWS (Mumbai region) for PCI DSS compliance
- Performed internal Active Directory penetration test; documented DA-equivalent group paths
- Authored coordinated disclosures for Apache Spark, Apache CouchDB, and NGINX Docker image
- Upstream security commit merged to official nginx/docker-nginx repository

### Security Researcher (Independent)
company: Independent / Bug Bounty
period: 2022 — Present
location: Remote
description: Independent vulnerability research targeting open-source infrastructure, HackerOne bug bounty programs, and VDP programs. Focus on authentication logic flaws, injection vulnerabilities, and privilege escalation chains.
highlights:
- Discovered JWSFilter authentication gap in Apache Spark REST Submission API (port 6066)
- Identified proxy authentication logic inversion bug in Apache CouchDB
- Researched HHVM/Meta attack surface across SSL, memory, and Thrift deserialization paths
- Redis official Docker image: nine findings including entrypoint privilege escalation

---

## ACHIEVEMENTS

### 🏛️ U.S. Department of Energy — VDP Hall of Fame
year: 2024
category: Hall of Fame
description: Recognized in the U.S. Department of Energy Vulnerability Disclosure Program Hall of Fame for responsible disclosure of a security vulnerability affecting DoE infrastructure.
icon: trophy

### 🎤 OWASP Global AppSec EU 2026 — Speaker
year: 2026
category: Conference
description: Selected as a speaker at OWASP Global AppSec EU 2026 in Vienna, Austria. Presenting research on the "Assumption-Chain Attack Surfaces" framework — a methodology for systematically identifying overlooked trust boundaries in infrastructure components.
icon: mic

### 🔓 NGINX Docker Image — Upstream CVE Disclosure
year: 2024
category: CVE / Disclosure
description: Discovered and coordinated disclosure of a shell injection vulnerability in the official NGINX Docker image (20-envsubst-on-templates.sh, NGINX_ENVSUBST_FILTER variable). Security fix merged upstream to nginx/docker-nginx repository.
icon: shield

### ⚡ Apache Spark — Authentication Bypass Research
year: 2025
category: Vulnerability Research
description: Full exploit chain demonstration against the unauthenticated REST Submission API (port 6066), targeting the JWSFilter availability gap. Professional CVE disclosure documentation produced and submitted.
icon: bolt

### 🔐 Apache CouchDB — Proxy Auth Logic Inversion
year: 2025
category: CVE / Disclosure
description: Identified a proxy authentication logic inversion bug in Apache CouchDB. Full CVE submission package prepared and submitted to security@apache.org.
icon: database

### 🐳 Redis Docker Image — Nine Security Findings
year: 2025
category: Security Research
description: Comprehensive security review of the official Redis Docker image uncovering nine findings including entrypoint privilege escalation, plaintext source tarball download, and build pipeline template injection.
icon: docker

### 🏗️ BloodHound CE CLI Tools
year: 2024
category: Tool Development
description: Built two Python CLI tools for BloodHound CE / Active Directory attack path analysis — bhcli (8 commands, APOC Dijkstra pathfinding, 24 edge-type action mappings with MITRE ATT&CK IDs) and Sudarshan (15+ modules, 45-test suite).
icon: code

---

## PROJECTS

### bhcli — BloodHound CE Attack Path Analyzer
tech: Python, Neo4j, BloodHound CE, MITRE ATT&CK
category: Tool
description: A CLI tool for automated Active Directory attack path analysis using BloodHound CE. Features 8 commands, APOC Dijkstra pathfinding, and 24 edge-type action mappings with MITRE ATT&CK IDs for each lateral movement technique.
status: Active
github: https://github.com/nullspec7or/bhcli

### Sudarshan — AD Security Analysis Framework
tech: Python, Neo4j, BloodHound CE
category: Framework
description: Comprehensive AD security analysis framework with 15+ modules and a mock Neo4j client for offline testing. Includes a 45-test suite covering all attack path scenarios and privilege escalation vectors.
status: Active
github: https://github.com/nullspec7or/sudarshan

### Assumption-Chain Attack Surface Framework
tech: Research, Methodology
category: Research
description: A structured methodology for identifying overlooked trust boundaries in infrastructure components by systematically questioning inherited assumptions at each layer. Anchored by the NGINX upstream commit and Apache Spark authentication findings.
status: In Progress

### Wazuh SIEM — AWS PCI DSS Deployment
tech: Wazuh, AWS, PCI DSS, Terraform
category: Infrastructure
description: Designed and deployed a production Wazuh SIEM on AWS Mumbai region for PCI DSS compliance, with block-based S3 archival strategy, custom detection rules, and automated alerting pipelines.
status: Deployed

### AD Pentest Cheatsheet
tech: Active Directory, Kali Linux, Windows, PowerShell
category: Reference
description: Comprehensive AD pentesting reference covering 15 attack phases and 200+ dual-platform commands with BloodHound, Impacket, CrackMapExec, and PowerView integration. Used internally and shared in the security community.
status: Active
github: https://github.com/nullspec7or/ad-cheatsheet

---

## CERTIFICATIONS
- OSCP (In Progress) — Offensive Security
- eJPT — eLearnSecurity

---

## BLOG_LINK
label: Read the Tech Journal
url: blog/index.html
description: Deep-dives into exploit research, CVE write-ups, AD attack chains, HTB walkthroughs, and security tooling.
