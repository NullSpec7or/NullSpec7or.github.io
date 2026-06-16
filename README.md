# NullSpec7or Blog — Writing & Publishing Runbook

Complete reference for writing, formatting, and publishing posts on `nullspec7or.dpdns.org/blog.html`.

---

## How the Blog Works

The blog is a static SPA (Single Page Application) hosted on GitHub Pages. There is no backend, no CMS, no build step. Everything is plain files:

```
your-repo/
├── blog/                        ← your .md post files live here
│   └── my-post.md
├── assets/                      ← all images live here
│   └── my-post-folder/
│       ├── thumbnail.jpg
│       └── screenshot.png
├── data/
│   └── posts.json               ← registry of all posts (you update this)
├── blog.html                    ← the blog page (don't touch)
├── script.js                    ← the engine (don't touch)
└── styles.css                   ← styling (don't touch)
```

When someone visits the blog, `script.js` reads `posts.json`, fetches each `.md` file, parses the frontmatter, and renders the post. That's the entire pipeline.

---

## Step-by-Step: Publishing a New Post

### Step 1 — Create a folder for your post's assets

Inside `assets/`, create a folder named after your post slug:

```
assets/
└── my-post-slug/
    ├── thumbnail.jpg     ← the cover image shown in sidebar + article header
    └── screenshot.png    ← any inline images used inside the post body
```

**Image guidelines:**
- Thumbnail: landscape, ideally 800×450px or wider, JPG or PNG
- Inline images: any size, PNG or JPG
- Keep filenames lowercase with hyphens, no spaces

---

### Step 2 — Create the `.md` file

Create a new file in the `blog/` folder. The filename becomes the default URL slug if you don't set a custom one.

```
blog/my-post-slug.md
```

---

### Step 3 — Write the frontmatter

Every post **must** start with a YAML frontmatter block between `---` delimiters:

```yaml
---
title: "Your Post Title Here"
date: 2026-05-16
tags: [#tag1, #tag2, #tag3]
thumbnail : ![alt text](../assets/my-post-slug/thumbnail.jpg)
url: my-custom-url-slug
---
```

| Field | Required | Notes |
|-------|----------|-------|
| `title` | ✅ | Wrap in quotes. Shown in sidebar and article header. |
| `date` | ✅ | Format: `YYYY-MM-DD`. Used for sorting and display. |
| `tags` | ✅ | Array format `[#tag1, #tag2]`. Hash prefix is displayed as-is. |
| `thumbnail` | ✅ | Use `![alt](../assets/YOUR-FOLDER/image.jpg)` — note the `../` prefix for thumbnails specifically. |
| `url` | optional | Custom URL slug. If omitted, the filename is used as the slug. |

**Thumbnail path rule:** Thumbnails always use `../assets/` (with the `../` prefix). This is different from inline images — don't mix them up.

---

### Step 4 — Write the post body

After the closing `---` of the frontmatter, write your post in standard Markdown.

#### Headings

```markdown
# H1 — Use once, at the very top as the post title
## H2 — Main sections
### H3 — Subsections
```

#### Text formatting

```markdown
**bold text**
*italic text*
`inline code`
~~strikethrough~~
```

#### Links

```markdown
[Link text](https://example.com)
```

#### Horizontal rule (section divider)

```markdown
---
```

#### Code blocks

Fenced with triple backticks and a language identifier for syntax highlighting:

````markdown
```bash
docker run --rm -e VAR=value nginx:latest
```

```python
def exploit():
    pass
```

```awk
END { for (name in ENVIRON) { print name } }
```
````

Supported language identifiers: `bash`, `python`, `javascript`, `go`, `rust`, `sql`, `yaml`, `json`, `awk`, `c`, `cpp`, `powershell`, `dockerfile`, and [many more](https://highlightjs.org/static/demo/).

#### Blockquotes

```markdown
> This is a blockquote. Useful for callouts or quoted material.
```

#### Lists

```markdown
- Unordered item
- Another item
  - Nested item

1. Ordered item
2. Second item
3. Third item
```

#### Tables

```markdown
| Column A | Column B | Column C |
|----------|----------|----------|
| value    | value    | value    |
| value    | value    | value    |
```

---

### Step 5 — Adding images inside the post body

**Do NOT use standard markdown image syntax** (`![alt](url)`) for inline images. Use the custom `@image` tag instead:

```
@image[Your caption here](assets/my-post-slug/screenshot.png)
```

**Path rule for inline images:** Always start with `assets/` (no `../` prefix). This is the opposite of thumbnails.

**Caption:** The text inside `[...]` is shown as a caption below the image. Make it descriptive.

**Examples:**

```
@image[Terminal output showing root execution](assets/nginx-post/poc-terminal.png)

@image[Wireshark capture of the exfiltrated token](assets/ad-attack/wireshark.png)

@image[Zoneminder login panel](assets/zoneminder-cve/login-panel.png)
```

You can place `@image` tags anywhere in the body — between paragraphs, after code blocks, wherever makes sense for the narrative.

---

### Step 6 — Register the post in `posts.json`

Open `data/posts.json` and add your post's file path to the array. Posts are displayed in the order they appear in this file — put new posts at the top:

```json
[
  "blog/my-new-post.md",
  "blog/kerberoasting-to-da.md",
  "blog/manual-sqli-beyond-sqlmap.md",
  "blog/wazuh-aws-archival.md",
  "blog/cve-2024-51482-zoneminder.md",
  "blog/htb-cctv-walkthrough.md",
  "blog/enterprise-sso-trust-boundaries.md"
]
```

**Important:** The path must exactly match the filename you created in `blog/`. If you typo this, the post silently won't load.

---

### Step 7 — Push to GitHub

Commit and push the following files:

```
blog/my-new-post.md
assets/my-post-slug/thumbnail.jpg
assets/my-post-slug/screenshot.png   ← (and any other inline images)
data/posts.json
```

GitHub Pages redeploys in ~1–2 minutes. Hard refresh (`Ctrl+Shift+R`) to bypass browser cache after deploy.

---

## Complete Post Template

Copy this as your starting point for every new post:

```markdown
---
title: "Your Post Title"
date: 2026-01-01
tags: [#tag1, #tag2, #tag3]
thumbnail : ![thumbnail](../assets/your-post-slug/thumbnail.jpg)
url: your-post-slug
---

# Your Post Title

One-line summary of what this post covers.

---

## Overview

Intro paragraph. Set the scene — what were you doing, what did you find, why does it matter.

---

## Section One

Your content here.

```bash
# code example
echo "hello"
```

@image[Caption for this screenshot](assets/your-post-slug/screenshot.png)

---

## Section Two

More content.

---

## Conclusion

Wrap-up. What did this demonstrate? What's the broader takeaway?

---

**References**

- [Link text](https://example.com)
- CVE-XXXX-XXXXX
```

---

## Quick Reference Card

| Task | Syntax |
|------|--------|
| Thumbnail | `thumbnail : ![alt](../assets/FOLDER/img.jpg)` — note `../` prefix |
| Inline image | `@image[Caption](assets/FOLDER/img.png)` — no `../` prefix |
| Code block | ` ```bash ` ... ` ``` ` |
| Section divider | `---` |
| Bold | `**text**` |
| Italic | `*text*` |
| Inline code | `` `code` `` |
| Link | `[text](url)` |
| Register post | Add `"blog/filename.md"` to top of `data/posts.json` |
| Custom URL | `url: my-slug` in frontmatter |

---

## Common Mistakes

**Post not showing up in the blog**
→ You forgot to add it to `data/posts.json`, or there's a typo in the path.

**Thumbnail not showing**
→ Check the `../assets/` prefix is present. Check the file actually exists in `assets/` in your repo.

**Inline image not showing**
→ Make sure you used `@image[...]()` not `![](...)`. Check the path starts with `assets/` (no `../`). Verify the image file is committed to the repo.

**Code blocks not highlighted**
→ Make sure you specified a language after the opening triple backticks (` ```bash ` not just ` ``` `).

**Post URL not working as expected**
→ If you set `url: my-slug` in frontmatter, the shareable URL is `blog.html?post=my-slug`. If no `url` field, it's `blog.html?post=filename` (without `.md`).

**Changes not live after push**
→ Wait 1–2 minutes for GitHub Pages to redeploy, then hard refresh with `Ctrl+Shift+R`.

---

## Asset Folder Naming Convention

Keep it consistent — name your asset folder the same as your post's URL slug:

| Post file | URL slug | Asset folder |
|-----------|----------|--------------|
| `blog/nginx-docker-code-injection.md` | `nginx-docker-code-injection` | `assets/nginx-docker-code-injection/` |
| `blog/cve-2024-51482-zoneminder.md` | `cve-2024-51482-zoneminder` | `assets/cve-2024-51482-zoneminder/` |
| `blog/kerberoasting-to-da.md` | `kerberoasting-to-da` | `assets/kerberoasting-to-da/` |