# nullspec7or — Portfolio & Tech Journal

Personal cybersecurity portfolio and blog for **Rupesh Kumar** (`nullspec7or`), Junior IT Security Engineer at Toucan Payments, Hyderabad.

Live site: **https://nullspec7or.github.io**

---

## Features

- **Horizontal scrolling portfolio** — sections stacked horizontally with smooth snap-scroll
- **Particle network background** — interactive, mouse-reactive
- **100% Markdown-driven** — all content edited via `data/portfolio.md`, zero HTML editing needed
- **Tech Journal (Blog)** — full-featured blog with syntax highlighting, tag filtering, search, read-time
- **GitHub Pages compatible** — static files, no build step required

---

## Project Structure

```
nullspec7or/
├── index.html              ← Portfolio (main page)
├── 404.html                ← Custom 404
├── .nojekyll               ← Prevents Jekyll processing
├── _config.yml             ← GitHub Pages config
├── data/
│   └── portfolio.md        ← ⭐ EDIT THIS to update your portfolio
├── assets/
│   └── images/
│       └── og-card.png     ← Social sharing thumbnail
└── blog/
    ├── index.html          ← Blog reader app
    └── posts/              ← ⭐ ADD .md FILES HERE for new blog posts
        ├── apache-spark-jwsfilter-exploit.md
        ├── nginx-docker-shell-injection.md
        ├── ad-attack-chains-domain-admin.md
        └── htb-ssrf-chain-rce.md
```

---

## How to Update Content

### Update Portfolio Info

Edit `data/portfolio.md`. All sections are clearly labeled:

- `## META` — name, handle, social links
- `## ABOUT` — bio paragraphs + skills list
- `## EXPERIENCE` — job entries
- `## ACHIEVEMENTS` — hall of fame, CVEs, conferences
- `## PROJECTS` — tools and research projects
- `## CERTIFICATIONS` — cert list
- `## BLOG_LINK` — blog CTA text

### Add a New Blog Post

1. Create a new `.md` file in `blog/posts/`
2. Add frontmatter at the top:

```markdown
---
title: "Your Post Title"
date: 2025-06-01
tags: [#tag1, #tag2, #tag3]
excerpt: One-line summary shown in search results and OG cards.
---

# Your Post Title

Content here...
```

3. Add the filename to the `POSTS` array in `blog/index.html`:

```javascript
const POSTS = [
  'your-new-post.md',
  // existing posts...
];
```

Read time is auto-calculated from word count (~200 WPM).

---

## Deploying to GitHub Pages

1. Create a repo named `nullspec7or.github.io` on GitHub
2. Push all files to the `main` branch
3. Go to **Settings → Pages → Source → Deploy from branch → main / root**
4. Site live at `https://nullspec7or.github.io` in ~2 minutes

---

## Navigation

| Key / Action | Result |
|---|---|
| Arrow Right / Left | Navigate sections |
| Click nav dots | Jump to section |
| Scroll (mouse/touch) | Move between sections |
| Click sidebar post | Open blog post |
| Type in search bar | Filter posts by title/tag |

---

## Tech Stack

- Vanilla HTML5 / CSS3 / JavaScript (zero frameworks, zero build step)
- [marked.js](https://marked.js.org/) — Markdown parsing
- [highlight.js](https://highlightjs.org/) — Code syntax highlighting
- Google Fonts — JetBrains Mono + Inter
- GitHub Pages — Hosting
