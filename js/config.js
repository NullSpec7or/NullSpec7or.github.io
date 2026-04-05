/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║           CYBER//PORTFOLIO — SITE CONFIGURATION              ║
 * ║  Edit this file only. No HTML/CSS knowledge needed.          ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

const CONFIG = {

  /* ── Identity ─────────────────────────────────────────────── */
  handle:      "NullSpec7or",                       // hacker alias shown in nav & hero
  fullName:    "Rupesh Kumar",                // used in footer, meta, experience
  title:       "Penetration Tester & Security Researcher",
  location:    "Hyderabad, IN",
  email:       "nullspec7or@gmail.com",
  pgp:         "Bleh",                // optional PGP key ID
  resumeUrl:   "#",                          // link to your CV PDF

  taglines: [
    "Penetration Tester",
    "Bug Bounty Hunter",
    "Red Team Operator",
    "Security Researcher",
    "CTF Player",
  ],

  /* ── Hero Stats ───────────────────────────────────────────── */
  stats: [
    { num: "60+",   label: "Machines Pwned"   },
    { num: "18",    label: "Bug Bounties"      },
    { num: "5",     label: "CVEs Discovered"   },
    { num: "Top3%", label: "HTB Global Rank"  },
  ],

  /* ── About ────────────────────────────────────────────────── */
  about: [
    "I'm a penetration tester and security researcher specialising in web application security, network infrastructure, Active Directory attacks, and vulnerability research across critical sectors — government, defense, fintech, railways, and automotive.",
    "My approach is methodical: understand the target deeply, chain low-severity issues into critical impact, document everything. I've reported vulnerabilities to national defense labs, central government ministries, and Fortune-class enterprises.",
    "Outside paid engagements, I sharpen my edge on <span class='hl'>HackTheBox</span>, <span class='hl'>TryHackMe</span>, and competitive CTFs. I publish detailed writeups so the community grows with me.",
  ],

  /* ── Skills ──────────────────────────────────────────────── */
  skills: [
    { name: "Web App Pentesting",     level: 93 },
    { name: "Network Penetration",    level: 87 },
    { name: "Active Directory",       level: 80 },
    { name: "Bug Bounty Hunting",     level: 88 },
    { name: "Reverse Engineering",    level: 65 },
    { name: "Python / Automation",    level: 82 },
    { name: "Cloud Security (AWS)",   level: 72 },
    { name: "OSINT & Recon",          level: 85 },
  ],

  /* ── Professional Experience ─────────────────────────────── */
  experience: [
    {
      role:    "Senior Penetration Tester",
      company: "CyberShield Pvt. Ltd.",
      type:    "Full-time",
      period:  "Jan 2024 – Present",
      location:"Hyderabad, IN",
      logo:    "🛡️",
      summary: "Lead red team engagements for BFSI and government clients across India. Scope includes web apps, APIs, thick clients, network infra, and cloud environments.",
      bullets: [
        "Conducted 20+ full-scope pentests including VAPT reports for RBI-regulated entities",
        "Discovered 3 zero-days in widely used banking middleware — coordinated responsible disclosure",
        "Built internal automation tooling in Python cutting report time by 40%",
        "Mentored a team of 4 junior testers; set methodology standards for the team",
      ],
      tags: ["Red Team", "BFSI", "API Security", "Zero-Day"],
    },
    {
      role:    "Security Researcher (Contract)",
      company: "DRDO — Defence Research & Development Organisation",
      type:    "Contract",
      period:  "Jun 2023 – Dec 2023",
      location:"Remote",
      logo:    "⚔️",
      summary: "Engaged under NDA to assess internal web portals, VPN infrastructure, and document management systems used by defence personnel.",
      bullets: [
        "Identified critical IDOR leading to exposure of restricted document metadata",
        "Reported SQL injection chain in admin portal — awarded Certificate of Appreciation",
        "All findings under strict NDA — details redacted per disclosure agreement",
      ],
      tags: ["Defense", "NDA", "IDOR", "SQLi"],
      redacted: true,
    },
    {
      role:    "Penetration Tester",
      company: "SecureNet Solutions",
      type:    "Full-time",
      period:  "Aug 2021 – Dec 2023",
      location:"Hyderabad, IN",
      logo:    "🔐",
      summary: "Performed black-box and grey-box assessments for SaaS, e-commerce, and healthcare clients. Wrote VAPT reports aligned with OWASP, PTES, and NIST standards.",
      bullets: [
        "Completed 50+ web application assessments across diverse industries",
        "Developed custom Burp Suite extensions for client-specific testing workflows",
        "Achieved OSCP certification during tenure; applied skills to real engagements immediately",
        "Presented findings directly to C-suite and board-level stakeholders",
      ],
      tags: ["VAPT", "OWASP", "Burp Suite", "Healthcare"],
    },
    {
      role:    "Security Intern",
      company: "TechGuard Labs",
      type:    "Internship",
      period:  "Jan 2021 – Jul 2021",
      location:"Hyderabad, IN",
      logo:    "🎓",
      summary: "Introduced to professional pentesting workflows, vulnerability management, and security documentation under senior researcher supervision.",
      bullets: [
        "Assisted in 10+ VAPT engagements; handled recon, scanning, and initial exploitation phases",
        "Wrote Python scripts for automated subdomain enumeration and port scanning",
        "Earned eJPT certification — validated foundational penetration testing skills",
      ],
      tags: ["Internship", "Python", "eJPT", "Recon"],
    },
  ],

  /* ── Certifications ──────────────────────────────────────── */
  certs: [
    { icon:"🏆", name:"OSCP",          issuer:"Offensive Security",    year:"2023", status:"active"      },
    { icon:"⚔️", name:"CRTO",          issuer:"Zero-Point Security",   year:"2025", status:"in-progress" },
    { icon:"🛡️", name:"CEH v12",       issuer:"EC-Council",            year:"2023", status:"active"      },
    { icon:"🎯", name:"BSCP",          issuer:"PortSwigger",           year:"2024", status:"active"      },
    { icon:"🔐", name:"eJPT",          issuer:"eLearnSecurity",        year:"2021", status:"active"      },
    { icon:"☁️", name:"AWS Security",  issuer:"Amazon Web Services",   year:"2025", status:"in-progress" },
  ],

  /* ── Bug Bounties & VDP ──────────────────────────────────── */
  bugBounties: [
    {
      icon:        "🏛️",
      org:         "Ministry of Finance — GOI",
      sector:      "Government",
      type:        "VDP",
      severity:    "Critical",
      reward:      "Hall of Fame",
      year:        "2024",
      description: "Stored XSS in citizen portal chained with CSRF leading to full account takeover of ministry officials.",
      cve:         "",
      disclosed:   false,
    },
    {
      icon:        "⚔️",
      org:         "DRDO (Redacted Division)",
      sector:      "Defense",
      type:        "Private",
      severity:    "Critical",
      reward:      "Certificate + ₹50,000",
      year:        "2023",
      description: "IDOR vulnerability exposing classified document metadata and researcher PII. Coordinated privately under NDA.",
      cve:         "",
      disclosed:   false,
    },
    {
      icon:        "🚂",
      org:         "Indian Railways — IRCTC",
      sector:      "Railways",
      type:        "VDP",
      severity:    "High",
      reward:      "Hall of Fame",
      year:        "2023",
      description: "SQL injection in ticketing API allowing extraction of passenger PII. Reported via CERT-In.",
      cve:         "",
      disclosed:   false,
    },
    {
      icon:        "🏦",
      org:         "Leading UPI Fintech (Redacted)",
      sector:      "Fintech",
      type:        "Bug Bounty",
      severity:    "High",
      reward:      "$2,500",
      year:        "2024",
      description: "Authentication bypass via JWT algorithm confusion (RS256→HS256) granting admin-level API access.",
      cve:         "",
      disclosed:   false,
    },
    {
      icon:        "🚗",
      org:         "Automotive OEM — Tier 1 (Redacted)",
      sector:      "Automotive",
      type:        "Bug Bounty",
      severity:    "Critical",
      reward:      "$5,000",
      year:        "2025",
      description: "RCE on vehicle telematics backend API via unsafe deserialization. Affected fleet management for 200k+ vehicles.",
      cve:         "CVE-2025-XXXXX",
      disclosed:   false,
    },
    {
      icon:        "💊",
      org:         "Global Pharma Corp (Redacted)",
      sector:      "Pharma",
      type:        "VDP",
      severity:    "High",
      reward:      "Hall of Fame + Swag",
      year:        "2024",
      description: "Exposed internal admin panel with default credentials and unrestricted file upload to RCE.",
      cve:         "",
      disclosed:   false,
    },
    {
      icon:        "🏥",
      org:         "State Health Department — GOI",
      sector:      "Government",
      type:        "VDP",
      severity:    "High",
      reward:      "Hall of Fame",
      year:        "2023",
      description: "Broken access control in hospital management system exposing patient health records.",
      cve:         "",
      disclosed:   false,
    },
    {
      icon:        "🪖",
      org:         "Military Procurement Portal (Redacted)",
      sector:      "Military",
      type:        "Private",
      severity:    "Critical",
      reward:      "Classified",
      year:        "2024",
      description: "Server-Side Request Forgery enabling internal network pivoting on procurement infrastructure.",
      cve:         "",
      disclosed:   false,
    },
  ],

  /* ── Platforms & Profiles ────────────────────────────────── */
  platforms: [
    { name:"HackTheBox",   rank:"Pro Hacker",  score:"12,450 pts", icon:"🟢", url:"https://app.hackthebox.com/profile/" },
    { name:"TryHackMe",    rank:"Top 3%",      score:"48 rooms",   icon:"🔴", url:"https://tryhackme.com/p/"        },
    { name:"BugCrowd",     rank:"Researcher",  score:"P1 × 3",     icon:"🟠", url:"https://bugcrowd.com/"           },
    { name:"HackerOne",    rank:"Hacker",      score:"Signal 6.7", icon:"⚪", url:"https://hackerone.com/"          },
  ],

  /* ── Social Links ────────────────────────────────────────── */
  socials: [
    { icon:"🐙", name:"GitHub",      handle:"@0xrk",         url:"https://github.com/NullSpec7or"               },
    { icon:"🐦", name:"Twitter / X", handle:"@0xrk",         url:"https://twitter.com/nullspec7or"              },
    { icon:"💼", name:"LinkedIn",    handle:"rahul-kumar",   url:"https://linkedin.com/in/rupeshkumar33"   },
    { icon:"📧", name:"Email",       handle:"rk@proton.me",  url:"mailto:nullspec7or@gmail.com"                   },
  ],

  /* ── SEO ─────────────────────────────────────────────────── */
  siteUrl:     "https://nullspec7or.github.io",
  description: "Penetration tester, bug bounty hunter & security researcher. Read writeups, view CVEs, and follow the journey of 0xRK.",
  keywords:    "penetration testing, bug bounty, hackthebox, ctf writeups, oscp, security researcher, drdo, red team",
};
