# nullspec7or.github.io

Portfolio + Blog for Rupesh Kumar — Offensive Security Engineer.

## Adding a New Blog Post

1. Create `blog/your-post-slug.md` with frontmatter:
   ```markdown
   ---
   title: "Post Title"
   date: 2025-06-11
   tags: [CVE, Web Security]
   ---
   Your content here...
   ```
2. Open `script.js`, find `const BLOG_POSTS = [` and add:
   ```js
   { file:'blog/your-post-slug.md', slug:'your-post-slug' },
   ```
3. `git add . && git commit -m "new post: your title" && git push`
4. GitHub Actions auto-deploys. Blog + portfolio ticker auto-update.

## Supported Tags (for color coding)
Active Directory, Red Team, Web Security, SQL Injection, OSCP, CVE, Exploit Dev, HTB, Privilege Escalation, SIEM, Wazuh, AWS, Blue Team, Kerberoasting

## Local Testing
```bash
# Any static server works
python3 -m http.server 8080
# or
npx serve .
```

## Sharing Links
Each blog post URL (`blog.html#post-slug`) auto-generates OG/Twitter card meta
for rich link previews when shared on LinkedIn, Twitter, Slack, etc.
