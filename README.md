# ⚡ CYBER//PORTFOLIO v2

> Hacker/Pentester portfolio with 7 sections: Hero · About · Experience · Certs · Bug Bounties · Blog · Contact  
> **Free hosting on GitHub Pages · Zero build tools · Zero dependencies**

---

## 🚀 Setup in 5 Minutes

### 1. Create your GitHub repo

Name it exactly: `yourhandle.github.io`  
This auto-deploys free at `https://yourhandle.github.io`

```bash
git clone https://github.com/yourhandle/yourhandle.github.io
cd yourhandle.github.io
# copy all portfolio files here
```

### 2. Edit `js/config.js` — your only required file to edit

Everything in the portfolio is driven by this one file:

| Key | What it controls |
|-----|-----------------|
| `handle` | Your hacker alias shown everywhere |
| `fullName` | Real name in meta/footer |
| `title` | Subtitle under your name |
| `taglines` | Rotating typed strings in hero |
| `stats` | Hero stat boxes (machines, bounties, CVEs…) |
| `about` | About section paragraphs (supports `<span>` HTML) |
| `skills` | Skill bars with level 0–100 |
| `experience` | Timeline entries — jobs, contracts, internships |
| `certs` | Certification cards |
| `bugBounties` | Bug bounty/VDP cards |
| `platforms` | HTB, THM, BugCrowd, HackerOne profile links |
| `socials` | Contact/social links |

### 3. Add writeups — edit `posts/posts.js`

Each post object:

```js
{
  id:         "unique-slug",
  title:      "Post Title",
  date:       "2025-03-15",
  difficulty: "easy|medium|hard|insane",
  platform:   "HackTheBox|TryHackMe|CTF|Research",
  tags:       ["web", "sqli", "ctf"],   // drives search + filter
  excerpt:    "Card description.",
  flags:      { user: "flag{...}", root: "flag{...}" },   // optional
  content:    `
    <h3>Section</h3>
    <p>Text</p>
    <pre><code>commands here</code></pre>
    <div class="flag-box">🚩 flag{value}</div>
  `
}
```

### 4. Enable GitHub Pages

1. Repo → **Settings** → **Pages**
2. Source: **GitHub Actions**
3. Push to `main` → auto-deploys via `.github/workflows/deploy.yml`

```bash
git add . && git commit -m "launch" && git push
```

Live at: `https://yourhandle.github.io` 🎉

---

## 📁 Structure

```
.
├── index.html                  ← Page structure (rarely edit)
├── css/style.css               ← All styles + CSS variables
├── js/
│   ├── config.js               ← ★ YOUR DATA — edit this
│   └── main.js                 ← App logic (don't need to edit)
├── posts/
│   └── posts.js                ← ★ YOUR WRITEUPS — edit this
└── .github/workflows/
    └── deploy.yml              ← Auto-deploy (don't need to edit)
```

---

## 🎨 Theming

All colors in `css/style.css` `:root`:

```css
--accent:  #00ff6e;    /* main green — change to any color */
--bg0:     #010a05;    /* darkest background */
--blue:    #00d4ff;    /* secondary accent */
--red:     #ff3e3e;    /* critical severity */
```

---

## 💡 Tips

- **Experience** · Set `redacted: true` for NDA/defense engagements — shows a redaction badge automatically
- **Bug Bounties** · Set `disclosed: false` for responsible disclosure — shows lock badge  
- **Custom domain** · Add a `CNAME` file with `yourdomain.com`, then set DNS A records to GitHub Pages IPs
- **Contact form** · Replace the form `onsubmit` with [Formspree](https://formspree.io) for real email delivery
- **Resume** · Set `resumeUrl` in config to a PDF link — shows "⬇ Resume" button in nav
- **CVE** · Fill the `cve` field on bounties with `"CVE-2025-XXXXX"` to display it on the card

---

## ✅ Sections

| # | Section | Driven by |
|---|---------|-----------|
| 01 | Hero | `config.js` → handle, taglines, stats |
| 02 | About | `config.js` → about, skills, platforms |
| 03 | Experience | `config.js` → experience[] timeline |
| 04 | Certifications | `config.js` → certs[] |
| 05 | Bug Bounties | `config.js` → bugBounties[] |
| 06 | Writeups/Blog | `posts/posts.js` → POSTS[] |
| 07 | Contact | `config.js` → socials[] |
