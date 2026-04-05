/* ═══════════════════════════════════════════════════════
   NullSpec7or — main.js
   All rendering is synchronous after DOMContentLoaded.
   No async imports, no race conditions.
   ═══════════════════════════════════════════════════════ */

/* ── Matrix Rain ─────────────────────────────────────── */
(function() {
  const c = document.getElementById('matrix-canvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  function resize() { c.width = innerWidth; c.height = innerHeight; }
  resize(); window.addEventListener('resize', resize);
  const chars = 'アウエオカキクタチNULLSPEC7OR<>[]{}01ॐ∀∃';
  const fs = 13; let drops;
  function initDrops() { drops = Array(Math.floor(c.width / fs)).fill(1); }
  initDrops();
  window.addEventListener('resize', initDrops);
  setInterval(() => {
    ctx.fillStyle = 'rgba(1,10,5,.055)';
    ctx.fillRect(0, 0, c.width, c.height);
    // Tricolour char colours cycling
    drops.forEach((y, i) => {
      const cycle = Math.floor(Date.now() / 3000 + i) % 3;
      ctx.fillStyle = cycle === 0 ? '#FF9933' : cycle === 1 ? '#00ff6e' : '#0047ab';
      ctx.font = `${fs}px "Share Tech Mono", monospace`;
      ctx.fillText(chars[Math.random() * chars.length | 0], i * fs, y * fs);
      if (y * fs > c.height && Math.random() > .975) drops[i] = 0;
      drops[i]++;
    });
  }, 50);
})();

/* ── Custom Cursor ───────────────────────────────────── */
(function() {
  const dot = document.querySelector('.cursor');
  const ring = document.querySelector('.cursor-ring');
  if (!dot) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  (function ani() {
    rx += (mx - rx) * .12; ry += (my - ry) * .12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(ani);
  })();
})();

/* ── Scroll Progress ─────────────────────────────────── */
window.addEventListener('scroll', () => {
  const bar = document.querySelector('.scroll-progress');
  if (bar) bar.style.width = Math.min(scrollY / (document.body.scrollHeight - innerHeight) * 100, 100) + '%';
}, { passive: true });

/* ── Navbar ──────────────────────────────────────────── */
(function() {
  const nav = document.querySelector('nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  window.addEventListener('scroll', () => nav && nav.classList.toggle('scrolled', scrollY > 60), { passive: true });
  toggle && toggle.addEventListener('click', () => links && links.classList.toggle('open'));
  links && links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  // Active section highlight
  window.addEventListener('scroll', () => {
    const sections = [...document.querySelectorAll('section[id]')];
    let cur = '';
    sections.forEach(s => { if (scrollY >= s.offsetTop - 140) cur = s.id; });
    document.querySelectorAll('.nav-links a').forEach(a =>
      a.classList.toggle('active', a.getAttribute('href') === `#${cur}`)
    );
  }, { passive: true });
})();

/* ── Typing Animation ────────────────────────────────── */
(function() {
  const el = document.getElementById('typed-text');
  if (!el || !window.SITE) return;
  const strings = SITE.taglines;
  let si = 0, ci = 0, del = false;
  function tick() {
    const s = strings[si % strings.length];
    el.textContent = s.slice(0, del ? ci-- : ci++);
    if (!del && ci > s.length)  { del = true; return setTimeout(tick, 1800); }
    if (del && ci < 0)           { del = false; si++; ci = 0; }
    setTimeout(tick, del ? 36 : 76);
  }
  tick();
})();

/* ── Intersection Observer ───────────────────────────── */
function io(cb, opts) {
  return new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) cb(e.target); }), { threshold: 0.08, rootMargin: '0px 0px -30px 0px', ...opts });
}

function initReveal() {
  const observer = io(el => { el.classList.add('vis'); observer.unobserve(el); });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── CAROUSEL: make seamless ─────────────────────────── */
function initCarousels() {
  document.querySelectorAll('.carousel-track').forEach(track => {
    // Duplicate children for infinite loop
    const kids = [...track.children];
    kids.forEach(k => track.appendChild(k.cloneNode(true)));
  });
}

/* ════════════════════════════════════════════════
   MAIN RENDER — runs synchronously after DOM load
   ════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  if (!window.SITE) { console.error('data.js not loaded'); return; }
  const S = window.SITE;

  /* ── Metadata / title ────────────────────────── */
  document.title = `${S.handle} — ${S.title}`;

  /* ── Nav logo ────────────────────────────────── */
  const logo = document.querySelector('.nav-logo');
  if (logo) logo.textContent = S.handle;

  /* ── Resume link ─────────────────────────────── */
  const resumeLink = document.getElementById('resume-link');
  if (resumeLink) resumeLink.href = S.resumeUrl;

  /* ── Hero ────────────────────────────────────── */
  const heroName = document.querySelector('.hero-name span');
  if (heroName) heroName.textContent = S.handle;

  const heroLoc = document.getElementById('hero-location');
  if (heroLoc) heroLoc.innerHTML = `📍 <span>${S.location}</span>`;

  const statsEl = document.getElementById('hero-stats');
  if (statsEl) statsEl.innerHTML = S.stats.map(s =>
    `<div class="stat"><div class="stat-num">${s.num}</div><div class="stat-label">${s.label}</div></div>`
  ).join('');

  /* ── About text ──────────────────────────────── */
  const aboutEl = document.getElementById('about-text');
  if (aboutEl) aboutEl.innerHTML = S.about.map(p => `<p>${p}</p>`).join('');

  /* ── Skills ──────────────────────────────────── */
  const skillsEl = document.getElementById('skills-list');
  if (skillsEl) {
    skillsEl.innerHTML = S.skills.map((s, i) => `
      <div class="skill-row reveal" style="transition-delay:${i*70}ms">
        <div class="skill-head">
          <span class="skill-lbl">${s.name}</span>
          <span class="skill-pct">${s.level}%</span>
        </div>
        <div class="skill-track">
          <div class="skill-bar" data-lvl="${s.level/100}"></div>
        </div>
      </div>`).join('');

    const sio = io(row => {
      row.classList.add('vis');
      const bar = row.querySelector('.skill-bar');
      if (bar) bar.style.transform = `scaleX(${bar.dataset.lvl})`;
      sio.unobserve(row);
    }, { threshold: 0.2 });
    skillsEl.querySelectorAll('.skill-row').forEach(r => sio.observe(r));
  }

  /* ── Platforms ───────────────────────────────── */
  const platEl = document.getElementById('platforms-grid');
  if (platEl && S.platforms) platEl.innerHTML = S.platforms.map(p => `
    <a href="${p.url}" class="platform-card" target="_blank" rel="noopener">
      <span class="platform-icon">${p.icon}</span>
      <div>
        <div class="p-name">${p.name}</div>
        <div class="p-rank">${p.rank}</div>
        <div class="p-score">${p.score}</div>
      </div>
    </a>`).join('');

  /* ── Experience carousel ─────────────────────── */
  const expTrack = document.getElementById('exp-track');
  if (expTrack && S.experience) {
    const typeClass = { 'Full-time':'et-ft', 'Contract':'et-ct', 'Internship':'et-int' };
    expTrack.innerHTML = S.experience.map(e => `
      <div class="exp-card">
        <div class="exp-logo">${e.logo}</div>
        <div class="exp-role">${e.role}</div>
        <div class="exp-company">${e.company}</div>
        <div class="exp-meta">
          <span class="exp-period">${e.period}</span>
          <span class="exp-type ${typeClass[e.type]||'et-ft'}">${e.type.toUpperCase()}</span>
        </div>
        <p class="exp-summary">${e.summary}</p>
        <div class="exp-tags">${e.tags.map(t=>`<span class="exp-tag">#${t}</span>`).join('')}</div>
        ${e.redacted ? `<div class="exp-redact">🔒 NDA — full details redacted</div>` : ''}
      </div>`).join('');
  }

  /* ── Certs carousel ──────────────────────────── */
  const certTrack = document.getElementById('cert-track');
  if (certTrack && S.certs) {
    certTrack.innerHTML = S.certs.map(c => `
      <div class="cert-card">
        <div class="cert-icon">${c.icon}</div>
        <div class="cert-name">${c.name}</div>
        <div class="cert-issuer">${c.issuer} · ${c.year}</div>
        <span class="cert-badge ${c.status==='active'?'b-active':'b-progress'}">
          ${c.status==='active'?'✓ CERTIFIED':'⧗ IN PROGRESS'}
        </span>
      </div>`).join('');
  }

  /* ── Bug Bounty stats ────────────────────────── */
  const bStatsEl = document.getElementById('b-stats');
  if (bStatsEl && S.bugBounties) {
    const crit = S.bugBounties.filter(b=>b.severity==='Critical').length;
    const high = S.bugBounties.filter(b=>b.severity==='High').length;
    const cash = S.bugBounties.filter(b=>b.reward.match(/[$₹]/)).length;
    [
      { num:S.bugBounties.length, lbl:'Total Findings' },
      { num:crit,  lbl:'Critical Severity' },
      { num:high,  lbl:'High Severity' },
      { num:cash,  lbl:'Cash Rewards' },
    ].forEach(s => {
      const d = document.createElement('div');
      d.className = 'b-stat-card reveal';
      d.innerHTML = `<div class="b-stat-num">${s.num}</div><div class="b-stat-lbl">${s.lbl}</div>`;
      bStatsEl.appendChild(d);
    });
  }

  /* ── Bug Bounty carousel ─────────────────────── */
  const bTrack = document.getElementById('bounty-track');
  if (bTrack && S.bugBounties) {
    const typeClass = { 'VDP':'btype-vdp', 'Bug Bounty':'btype-bounty', 'Private':'btype-private' };
    bTrack.innerHTML = S.bugBounties.map(b => `
      <div class="bounty-card sev-${b.severity.toLowerCase()}">
        <div class="bounty-top">
          <span class="bounty-icon">${b.icon}</span>
          <span class="sev-badge">${b.severity.toUpperCase()}</span>
        </div>
        <div class="bounty-org">${b.org}</div>
        <span class="bounty-sector">${b.sector}</span>
        <p class="bounty-desc">${b.description}</p>
        <div class="bounty-footer">
          <span class="bounty-reward">${b.reward} · ${b.year}</span>
          <span class="btype ${typeClass[b.type]||'btype-vdp'}">${b.type}</span>
        </div>
        ${b.cve ? `<div class="bounty-cve">🔗 ${b.cve}</div>` : ''}
        ${!b.disclosed ? `<div class="bounty-redact">🔒 Responsible disclosure</div>` : ''}
      </div>`).join('');
  }

  /* ── Socials ─────────────────────────────────── */
  const socialEl = document.getElementById('social-list');
  if (socialEl && S.socials) socialEl.innerHTML = S.socials.map(s => `
    <a href="${s.url}" class="social-item" target="_blank" rel="noopener">
      <span class="si-icon">${s.icon}</span>
      <span>${s.name}</span>
      <span class="si-handle">${s.handle}</span>
    </a>`).join('');

  /* ── Terminal args ───────────────────────────── */
  document.querySelectorAll('[data-cfg="handle"]').forEach(el => el.textContent = S.handle);
  document.querySelectorAll('[data-cfg="pgp"]').forEach(el => el.textContent = S.pgp);
  document.querySelectorAll('[data-cfg="year"]').forEach(el => el.textContent = new Date().getFullYear());

  /* ── Footer ──────────────────────────────────── */
  const fc = document.getElementById('footer-copy');
  if (fc) fc.innerHTML = `© <span data-cfg="year">${new Date().getFullYear()}</span> <span style="color:var(--green)">${S.handle}</span> · Built with ☕ and late nights`;

  /* ── Blog cards ──────────────────────────────── */
  buildBlog();

  /* ── Init carousels & observers ──────────────── */
  initCarousels();
  initReveal();
});

/* ── Blog Engine ─────────────────────────────────────── */
function buildBlog() {
  if (!window.POSTS || !window.ALL_TAGS) return;
  const grid   = document.getElementById('blog-grid');
  const search = document.getElementById('blog-search');
  const strip  = document.getElementById('tag-strip');
  const noRes  = document.getElementById('no-results');
  if (!grid) return;

  let activeTag = 'all', query = '';

  function addTagBtn(val, label, active) {
    const b = document.createElement('button');
    b.className = 'tag-btn' + (active ? ' active' : '');
    b.textContent = label; b.dataset.tag = val;
    b.addEventListener('click', () => {
      activeTag = val;
      strip.querySelectorAll('.tag-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      renderBlog();
    });
    strip.appendChild(b);
  }
  addTagBtn('all', 'ALL', true);
  ALL_TAGS.forEach(t => addTagBtn(t, `#${t}`));

  POSTS.forEach(post => {
    const card = document.createElement('article');
    card.className = 'blog-card reveal'; card.dataset.id = post.id;
    card.innerHTML = `
      <div class="thumb-placeholder" data-platform="${post.platform}">${post.platform.toUpperCase()}</div>
      <div class="card-body">
        <div class="card-top">
          <span class="card-date">${fmtDate(post.date)}</span>
          <span class="card-platform">${post.platform}</span>
          <span class="card-diff diff-${post.difficulty}">${post.difficulty.toUpperCase()}</span>
        </div>
        <h3 class="card-title">${post.title}</h3>
        <p class="card-excerpt">${post.excerpt}</p>
        <div class="card-tags">${post.tags.slice(0,5).map(t=>`<span class="card-tag">#${t}</span>`).join('')}</div>
        <span class="card-cta">Open Writeup →</span>
      </div>`;
    card.addEventListener('click', () => openWriteup(post));
    grid.insertBefore(card, noRes);
  });

  search && search.addEventListener('input', () => { query = search.value.toLowerCase().trim(); renderBlog(); });

  function renderBlog() {
    let vis = 0;
    document.querySelectorAll('.blog-card').forEach(card => {
      const p = POSTS.find(x => x.id === card.dataset.id);
      if (!p) return;
      const ok = (activeTag === 'all' || p.tags.includes(activeTag)) &&
        (!query || [p.title, p.excerpt, p.platform, ...p.tags].join(' ').toLowerCase().includes(query));
      card.classList.toggle('hidden', !ok);
      if (ok) vis++;
    });
    if (noRes) noRes.style.display = vis ? 'none' : 'block';
  }

  // Reveal cards
  setTimeout(() => {
    const cio = io(el => { el.classList.add('vis'); cio.unobserve(el); });
    document.querySelectorAll('.blog-card.reveal').forEach(el => cio.observe(el));
  }, 100);
}

/* ── Open Writeup in New Tab ─────────────────────────── */
function openWriteup(post) {
  const html = buildWriteupPage(post);
  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, '_blank');
  // fallback cleanup
  win && win.addEventListener('beforeunload', () => URL.revokeObjectURL(url));
}

function buildWriteupPage(post) {
  const allPosts = window.POSTS || [];
  const listItems = allPosts.map(p => `
    <div class="sidebar-post ${p.id === post.id ? 'active' : ''}" onclick="loadPost('${p.id}')">
      <div class="sp-platform">${p.platform}</div>
      <div class="sp-title">${p.title}</div>
      <div class="sp-meta">
        <span class="sp-diff diff-${p.difficulty}">${p.difficulty.toUpperCase()}</span>
        <span class="sp-date">${fmtDate(p.date)}</span>
      </div>
    </div>`).join('');

  const postsData = JSON.stringify(allPosts).replace(/<\/script>/gi, '<\\/script>');
  const siteHandle = window.SITE ? window.SITE.handle : 'NullSpec7or';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${post.title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600&display=swap" rel="stylesheet"/>
<style>
:root {
  --saffron: #FF9933; --green: #00ff6e; --ashoka: #0047ab;
  --bg0: #010a05; --bg1: #05110a; --bg2: #071609; --card: rgba(5,17,10,.97);
  --t1: #e0ffe8; --t2: #7aad8a; --t3: #3d6b4f;
  --b1: rgba(0,255,110,.12); --b2: rgba(0,255,110,.35);
  --gs: 0 0 8px rgba(0,255,110,.3); --gm: 0 0 20px rgba(0,255,110,.3);
  --mono:'Share Tech Mono',monospace; --display:'Orbitron',monospace; --body:'Rajdhani',sans-serif;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden}
body{background:var(--bg0);color:var(--t1);font-family:var(--body);display:flex;flex-direction:column}

/* Top bar */
.topbar{
  display:flex;align-items:center;justify-content:space-between;
  padding:.7rem 1.5rem;
  background:rgba(1,10,5,.92);
  border-bottom:1px solid var(--b1);
  backdrop-filter:blur(20px);
  flex-shrink:0;
  position:relative;
}
.topbar::after{
  content:'';position:absolute;bottom:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,var(--saffron) 33.3%,var(--green) 33.3% 66.6%,var(--ashoka) 66.6%);
}
.tb-logo{
  font-family:var(--display);font-size:.9rem;font-weight:900;letter-spacing:.15em;
  background:linear-gradient(90deg,var(--saffron),var(--green),var(--ashoka));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  text-decoration:none;display:flex;align-items:center;gap:.4rem;
}
.tb-logo::before{content:'>';-webkit-text-fill-color:var(--green);}
.tb-center{font-family:var(--mono);font-size:.72rem;color:var(--t3);letter-spacing:.1em;text-transform:uppercase;}
.tb-back{
  font-family:var(--mono);font-size:.72rem;color:var(--saffron);
  border:1px solid rgba(255,153,51,.4);padding:.3rem .9rem;
  text-decoration:none;letter-spacing:.1em;transition:all .3s;
}
.tb-back:hover{background:var(--saffron);color:var(--bg0);}

/* Main layout */
.layout{display:flex;flex:1;overflow:hidden}

/* Sidebar */
.sidebar{
  width:320px;flex-shrink:0;
  border-right:1px solid var(--b1);
  background:var(--bg1);
  display:flex;flex-direction:column;
  overflow:hidden;
}
.sb-header{
  padding:1rem 1.2rem;
  border-bottom:1px solid var(--b1);
  background:var(--bg2);
  flex-shrink:0;
}
.sb-title{font-family:var(--display);font-size:.72rem;color:var(--green);letter-spacing:.1em;text-transform:uppercase;margin-bottom:.5rem;}
.sb-search{
  width:100%;padding:.5rem .8rem;
  background:var(--bg0);border:1px solid var(--b1);
  color:var(--t1);font-family:var(--mono);font-size:.76rem;outline:none;
  transition:border-color .3s;
}
.sb-search:focus{border-color:var(--green);}
.sb-search::placeholder{color:var(--t3);}
.sb-list{overflow-y:auto;flex:1;padding:.6rem;}
.sb-list::-webkit-scrollbar{width:4px}
.sb-list::-webkit-scrollbar-track{background:var(--bg2)}
.sb-list::-webkit-scrollbar-thumb{background:var(--b2);border-radius:2px}

.sidebar-post{
  padding:.85rem .9rem;border:1px solid transparent;
  cursor:pointer;transition:all .25s;margin-bottom:.4rem;
  border-radius:1px;
}
.sidebar-post:hover{border-color:var(--b1);background:var(--bg2);}
.sidebar-post.active{border-color:var(--green);background:rgba(0,255,110,.06);}
.sp-platform{font-family:var(--mono);font-size:.62rem;color:var(--t3);letter-spacing:.08em;margin-bottom:.2rem;}
.sp-title{font-family:var(--display);font-size:.76rem;color:var(--t1);line-height:1.4;margin-bottom:.4rem;}
.sidebar-post.active .sp-title{color:var(--green);}
.sp-meta{display:flex;align-items:center;gap:.5rem;}
.sp-diff{font-family:var(--mono);font-size:.58rem;padding:.1rem .38rem;letter-spacing:.07em;}
.diff-easy  {color:#00ff6e;border:1px solid rgba(0,255,110,.3);background:rgba(0,255,110,.06);}
.diff-medium{color:#FF9933;border:1px solid rgba(255,153,51,.3);background:rgba(255,153,51,.06);}
.diff-hard  {color:#ff3e3e;border:1px solid rgba(255,62,62,.3);background:rgba(255,62,62,.06);}
.diff-insane{color:#b44fff;border:1px solid rgba(180,79,255,.3);background:rgba(180,79,255,.06);}
.sp-date{font-family:var(--mono);font-size:.6rem;color:var(--t3);}

/* Content area */
.content-wrap{flex:1;overflow-y:auto;display:flex;flex-direction:column;}
.content-wrap::-webkit-scrollbar{width:6px}
.content-wrap::-webkit-scrollbar-track{background:var(--bg0)}
.content-wrap::-webkit-scrollbar-thumb{background:var(--b2);border-radius:3px}

.post-hero{
  padding:2.5rem 3rem;
  background:var(--bg1);
  border-bottom:1px solid var(--b1);
  position:relative;overflow:hidden;
}
.post-hero::before{
  content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
  background:linear-gradient(180deg,var(--saffron) 33%,var(--green) 33% 66%,var(--ashoka) 66%);
}
.post-meta{display:flex;align-items:center;gap:.8rem;flex-wrap:wrap;margin-bottom:1rem;}
.post-title{font-family:var(--display);font-size:clamp(1.2rem,3vw,1.9rem);font-weight:700;color:var(--green);line-height:1.3;text-shadow:var(--gs);}
.post-tags{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.9rem;}
.post-tag{font-family:var(--mono);font-size:.63rem;color:var(--t3);border:1px solid var(--b1);padding:.1rem .4rem;}

.post-body{
  padding:2.5rem 3rem;flex:1;
  max-width:820px;
}
.post-body h3{
  font-family:var(--display);font-size:1rem;color:var(--t1);
  margin:2rem 0 .8rem;letter-spacing:.04em;
  display:flex;align-items:center;gap:.5rem;
}
.post-body h3::before{content:'##';color:var(--saffron);font-family:var(--mono);font-size:.75rem;}
.post-body p{color:var(--t2);margin-bottom:1rem;line-height:1.9;font-size:.98rem;}
.post-body code{
  font-family:var(--mono);background:var(--bg2);
  border:1px solid var(--b1);padding:.1rem .38rem;
  font-size:.82rem;color:var(--green);
}
.post-body pre{
  background:var(--bg0);border:1px solid var(--b1);
  border-left:3px solid var(--saffron);
  padding:1.3rem;overflow-x:auto;margin:1.2rem 0;position:relative;
}
.post-body pre::before{
  content:'TERMINAL';position:absolute;top:.4rem;right:.8rem;
  font-family:var(--mono);font-size:.58rem;color:var(--t3);letter-spacing:.1em;
}
.post-body pre code{
  background:none;border:none;padding:0;
  color:#a8d8b4;font-size:.82rem;display:block;line-height:1.85;
}
.flag-box{
  background:rgba(0,255,110,.05);
  border:1px solid rgba(0,255,110,.25);border-left:3px solid var(--green);
  padding:.9rem 1.3rem;margin:1.2rem 0;
  font-family:var(--mono);font-size:.82rem;color:var(--green);
  display:flex;align-items:center;gap:.7rem;
}

/* Scanlines */
body::after{
  content:'';position:fixed;inset:0;
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,110,.005) 2px,rgba(0,255,110,.005) 4px);
  pointer-events:none;z-index:1000;
}

@media(max-width:768px){
  .sidebar{width:260px;}
  .post-hero,.post-body{padding:1.5rem;}
  .tb-center{display:none;}
}
@media(max-width:540px){
  .sidebar{display:none;}
  .post-body{padding:1.2rem;}
}
</style>
</head>
<body>

<div class="topbar">
  <a class="tb-logo" href="javascript:window.close()">NullSpec7or</a>
  <span class="tb-center">// WRITEUP VIEWER</span>
  <a class="tb-back" href="javascript:history.back()">← BACK</a>
</div>

<div class="layout">
  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="sb-header">
      <div class="sb-title">All Writeups</div>
      <input class="sb-search" placeholder="Search writeups..." oninput="filterSidebar(this.value)" />
    </div>
    <div class="sb-list" id="sb-list">${listItems}</div>
  </aside>

  <!-- Content -->
  <div class="content-wrap" id="content-wrap">
    <div id="post-container"></div>
  </div>
</div>

<script>
const POSTS_DATA = ${postsData};
let currentId = '${post.id}';

function fmtDate(str){
  return new Date(str).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
}

function renderPost(post) {
  const flagsHtml = post.flags
    ? Object.entries(post.flags).map(([k,v]) => \`<div class="flag-box">🚩 \${k}: <code>\${v}</code></div>\`).join('')
    : '';

  document.getElementById('post-container').innerHTML = \`
    <div class="post-hero">
      <div class="post-meta">
        <span class="sp-date">\${fmtDate(post.date)}</span>
        <span class="sp-diff diff-\${post.difficulty}">\${post.difficulty.toUpperCase()}</span>
        <span style="font-family:var(--mono);font-size:.7rem;color:#00d4ff">\${post.platform}</span>
      </div>
      <h1 class="post-title">\${post.title}</h1>
      <div class="post-tags">\${post.tags.map(t=>\`<span class="post-tag">#\${t}</span>\`).join('')}</div>
    </div>
    <div class="post-body">\${post.content}\${flagsHtml}</div>
  \`;
  document.getElementById('content-wrap').scrollTop = 0;

  // Update sidebar active state
  document.querySelectorAll('.sidebar-post').forEach(el => {
    el.classList.toggle('active', el.dataset.id === post.id);
  });
  currentId = post.id;

  // Update page title
  document.title = post.title + ' — NullSpec7or';
}

function loadPost(id) {
  const p = POSTS_DATA.find(x => x.id === id);
  if (p) renderPost(p);
}

function filterSidebar(q) {
  const sq = q.toLowerCase();
  document.querySelectorAll('.sidebar-post').forEach(el => {
    const p = POSTS_DATA.find(x => x.id === el.dataset.id);
    const match = !sq || [p.title, p.platform, ...p.tags].join(' ').toLowerCase().includes(sq);
    el.style.display = match ? '' : 'none';
  });
}

// Attach ids to sidebar posts
document.querySelectorAll('.sidebar-post').forEach((el, i) => {
  el.dataset.id = POSTS_DATA[i] ? POSTS_DATA[i].id : '';
});

// Load initial post
renderPost(POSTS_DATA.find(x => x.id === '${post.id}') || POSTS_DATA[0]);
<\/script>
</body>
</html>`;
}

/* ── Helpers ─────────────────────────────────────────── */
function fmtDate(str) {
  return new Date(str).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
}

/* ── Contact form ────────────────────────────────────── */
function handleContact(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'TRANSMITTING...'; btn.disabled = true;
  setTimeout(() => {
    const s = document.getElementById('form-success');
    if (s) s.style.display = 'block';
    e.target.reset();
    btn.textContent = 'SEND MESSAGE'; btn.disabled = false;
  }, 1400);
}
