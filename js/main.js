/* ═══════════════════════════════════════════════════════════════
   CYBER//PORTFOLIO v2 — main.js
   ═══════════════════════════════════════════════════════════════ */

/* ── Matrix Rain ─────────────────────────────────────────────── */
(function () {
  const c = document.getElementById('matrix-canvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  const resize = () => { c.width = innerWidth; c.height = innerHeight; };
  resize(); window.addEventListener('resize', resize);
  const chars = 'アイウエオカキクケコサシスセソタチツテトABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>[]{}|/\\';
  const fs = 13;
  let cols = Math.floor(c.width / fs), drops = Array(cols).fill(1);
  setInterval(() => {
    ctx.fillStyle = 'rgba(1,10,5,0.06)';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#00ff6e';
    ctx.font = `${fs}px "Share Tech Mono", monospace`;
    drops.forEach((y, i) => {
      ctx.fillText(chars[Math.random() * chars.length | 0], i * fs, y * fs);
      if (y * fs > c.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }, 50);
  window.addEventListener('resize', () => { cols = Math.floor(c.width / fs); drops = Array(cols).fill(1); });
})();

/* ── Custom Cursor ───────────────────────────────────────────── */
(function () {
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
  document.querySelectorAll('a,button,.blog-card,.cert-card,.bounty-card,.platform-card,.timeline-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform = 'translate(-50%,-50%) scale(.35)';
      ring.style.width = '56px'; ring.style.height = '56px'; ring.style.opacity = '.25';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.width = '34px'; ring.style.height = '34px'; ring.style.opacity = '.55';
    });
  });
})();

/* ── Scroll Progress ─────────────────────────────────────────── */
(function () {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    bar.style.width = Math.min(scrollY / (document.body.scrollHeight - innerHeight) * 100, 100) + '%';
  }, { passive: true });
})();

/* ── Navbar ──────────────────────────────────────────────────── */
(function () {
  const nav = document.querySelector('nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 60), { passive: true });
  if (toggle) toggle.addEventListener('click', () => links.classList.toggle('open'));
  links && links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  // Active highlight
  const sections = [...document.querySelectorAll('section[id]')];
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if (scrollY >= s.offsetTop - 140) cur = s.id; });
    document.querySelectorAll('.nav-links a').forEach(a => {
      const isActive = a.getAttribute('href') === `#${cur}`;
      a.classList.toggle('active', isActive);
    });
  }, { passive: true });
})();

/* ── Typing Animation ────────────────────────────────────────── */
(function () {
  const el = document.getElementById('typed-text');
  if (!el || !window.CONFIG) return;
  const strings = CONFIG.taglines || [];
  let si = 0, ci = 0, del = false;
  function tick() {
    const s = strings[si % strings.length];
    el.textContent = s.slice(0, del ? ci-- : ci++);
    if (!del && ci > s.length)  { del = true;  return setTimeout(tick, 1800); }
    if (del && ci < 0)           { del = false; si++; ci = 0; }
    setTimeout(tick, del ? 38 : 78);
  }
  tick();
})();

/* ── Intersection Observer Helper ────────────────────────────── */
function makeIO(cb, opts = {}) {
  return new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { cb(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px', ...opts });
}

/* ── Scroll Reveal ───────────────────────────────────────────── */
function initReveal() {
  const io = makeIO(el => { el.classList.add('vis'); io.unobserve(el); });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ── CONFIG → DOM Rendering ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (!window.CONFIG) return;
  const C = CONFIG;

  /* handle / name */
  document.querySelectorAll('[data-cfg="handle"]').forEach(el => el.textContent = C.handle);
  document.querySelectorAll('[data-cfg="fullName"]').forEach(el => el.textContent = C.fullName);
  document.querySelectorAll('[data-cfg="location"]').forEach(el => el.textContent = C.location);
  document.querySelectorAll('[data-cfg="title"]').forEach(el => el.textContent = C.title);
  document.title = `${C.handle} — ${C.title}`;

  /* Hero glitch data-text */
  const glitchEl = document.querySelector('.hero-name.glitch');
  if (glitchEl) { glitchEl.textContent = C.handle; glitchEl.dataset.text = C.handle; }

  /* Stats */
  const statsEl = document.getElementById('hero-stats');
  if (statsEl) statsEl.innerHTML = C.stats.map(s => `
    <div class="stat">
      <div class="stat-num">${s.num}</div>
      <div class="stat-label">${s.label}</div>
    </div>`).join('');

  /* About */
  const aboutEl = document.getElementById('about-text');
  if (aboutEl) aboutEl.innerHTML = C.about.map(p => `<p>${p}</p>`).join('');

  /* Skills */
  const skillsEl = document.getElementById('skills-list');
  if (skillsEl) {
    skillsEl.innerHTML = C.skills.map((s, i) => `
      <div class="skill-row" style="transition-delay:${i * 60}ms">
        <div class="skill-head">
          <span class="skill-name-label">${s.name}</span>
          <span class="skill-pct">${s.level}%</span>
        </div>
        <div class="skill-track">
          <div class="skill-bar" data-lvl="${s.level / 100}"></div>
        </div>
      </div>`).join('');

    const io = makeIO(row => {
      row.classList.add('vis');
      row.querySelector('.skill-bar').style.transform = `scaleX(${row.querySelector('.skill-bar').dataset.lvl})`;
      io.unobserve(row);
    }, { threshold: 0.2 });
    skillsEl.querySelectorAll('.skill-row').forEach(r => io.observe(r));
  }

  /* Platforms */
  const platEl = document.getElementById('platforms-grid');
  if (platEl && C.platforms) platEl.innerHTML = C.platforms.map(p => `
    <a href="${p.url}" class="platform-card reveal" target="_blank" rel="noopener">
      <span class="platform-icon">${p.icon}</span>
      <div>
        <div class="platform-name">${p.name}</div>
        <div class="platform-rank">${p.rank}</div>
        <div class="platform-score">${p.score}</div>
      </div>
    </a>`).join('');

  /* Experience */
  const expEl = document.getElementById('timeline');
  if (expEl && C.experience) {
    expEl.innerHTML = C.experience.map(e => {
      const typeClass = {
        'Full-time': 'type-fulltime',
        'Contract':  'type-contract',
        'Internship':'type-internship',
        'Private':   'type-private',
      }[e.type] || 'type-fulltime';

      return `
      <div class="timeline-item reveal">
        <div class="timeline-dot"></div>
        <div class="tl-header">
          <div>
            <div class="tl-role">${e.logo} ${e.role}</div>
            <div class="tl-company">${e.company} · ${e.location}</div>
          </div>
          <div class="tl-meta">
            <span class="tl-period">${e.period}</span>
            <span class="tl-type ${typeClass}">${e.type.toUpperCase()}</span>
          </div>
        </div>
        <p class="tl-summary">${e.summary}</p>
        <ul class="tl-bullets">
          ${e.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
        <div class="tl-tags">${e.tags.map(t => `<span class="tl-tag">#${t}</span>`).join('')}</div>
        ${e.redacted ? `<div class="tl-redacted-badge">🔒 Details redacted — NDA / Responsible Disclosure</div>` : ''}
      </div>`;
    }).join('');
  }

  /* Certs */
  const certsEl = document.getElementById('certs-grid');
  if (certsEl && C.certs) certsEl.innerHTML = C.certs.map(c => `
    <div class="cert-card reveal">
      <div class="cert-icon">${c.icon}</div>
      <div class="cert-name">${c.name}</div>
      <div class="cert-issuer">${c.issuer} · ${c.year}</div>
      <span class="cert-badge ${c.status === 'active' ? 'badge-active' : 'badge-progress'}">
        ${c.status === 'active' ? '✓ CERTIFIED' : '⧗ IN PROGRESS'}
      </span>
    </div>`).join('');

  /* Bug Bounties */
  const bountiesEl = document.getElementById('bounties-grid');
  if (bountiesEl && C.bugBounties) {
    // Stats bar
    const statsBar = document.getElementById('bounty-stats');
    if (statsBar) {
      const crit = C.bugBounties.filter(b => b.severity === 'Critical').length;
      const high = C.bugBounties.filter(b => b.severity === 'High').length;
      const cash = C.bugBounties.filter(b => b.reward.startsWith('$') || b.reward.startsWith('₹')).length;
      statsBar.innerHTML = [
        { num: C.bugBounties.length, label: 'Total Findings'    },
        { num: crit,                  label: 'Critical Severity' },
        { num: high,                  label: 'High Severity'     },
        { num: cash,                  label: 'Cash Rewards'      },
      ].map(s => `
        <div class="b-stat reveal">
          <div class="b-stat-num">${s.num}</div>
          <div class="b-stat-label">${s.label}</div>
        </div>`).join('');
    }

    bountiesEl.innerHTML = C.bugBounties.map(b => {
      const sevCls = `sev-${b.severity.toLowerCase()}`;
      const typCls = { 'VDP': 'btype-vdp', 'Bug Bounty': 'btype-bounty', 'Private': 'btype-private' }[b.type] || 'btype-vdp';
      return `
      <div class="bounty-card ${sevCls} reveal">
        <div class="bounty-top">
          <span style="font-size:1.8rem">${b.icon}</span>
          <span class="bounty-sev-badge">${b.severity.toUpperCase()}</span>
        </div>
        <div class="bounty-org">${b.org}</div>
        <span class="bounty-sector-tag">${b.sector}</span>
        <p class="bounty-desc">${b.description}</p>
        <div class="bounty-footer">
          <span class="bounty-reward">${b.reward} · ${b.year}</span>
          <span class="bounty-type-badge ${typCls}">${b.type}</span>
        </div>
        ${b.cve ? `<div class="bounty-cve">🔗 ${b.cve}</div>` : ''}
        ${!b.disclosed ? `<div class="bounty-redact">🔒 Details redacted — responsible disclosure</div>` : ''}
      </div>`;
    }).join('');
  }

  /* Socials */
  const socialEl = document.getElementById('social-list');
  if (socialEl && C.socials) socialEl.innerHTML = C.socials.map(s => `
    <a href="${s.url}" class="social-item" target="_blank" rel="noopener">
      <span class="si-icon">${s.icon}</span>
      <span>${s.name}</span>
      <span class="si-handle">${s.handle}</span>
    </a>`).join('');

  /* Footer */
  document.querySelectorAll('[data-cfg="year"]').forEach(el => el.textContent = new Date().getFullYear());

  /* Nav logo text */
  const logo = document.querySelector('.nav-logo');
  if (logo) logo.textContent = C.handle;

  /* Terminal arg */
  document.querySelectorAll('[data-cfg="handle"]').forEach(el => el.textContent = C.handle);

  // Trigger all reveals after DOM built
  setTimeout(initReveal, 60);
});

/* ── Blog Engine ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (!window.POSTS || !window.ALL_TAGS) return;
  const grid = document.getElementById('blog-grid');
  const searchIn = document.getElementById('blog-search');
  const tagStrip = document.getElementById('tag-strip');
  const noRes = document.getElementById('no-results');

  let activeTag = 'all', query = '';

  // Tag buttons
  const addBtn = (val, label, active = false) => {
    const b = document.createElement('button');
    b.className = 'tag-btn' + (active ? ' active' : '');
    b.textContent = label; b.dataset.tag = val;
    b.addEventListener('click', () => {
      activeTag = val;
      tagStrip.querySelectorAll('.tag-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      render();
    });
    tagStrip.appendChild(b);
  };
  addBtn('all', 'ALL', true);
  ALL_TAGS.forEach(t => addBtn(t, `#${t}`));

  // Cards
  POSTS.forEach(post => {
    const card = document.createElement('article');
    card.className = 'blog-card reveal'; card.dataset.id = post.id;
    card.innerHTML = `
      <div class="card-meta">
        <span class="card-date">${fmtDate(post.date)}</span>
        <span class="card-platform">${post.platform}</span>
        <span class="card-diff diff-${post.difficulty}">${post.difficulty.toUpperCase()}</span>
      </div>
      <h3 class="card-title">${post.title}</h3>
      <p class="card-excerpt">${post.excerpt}</p>
      <div class="card-tags">${post.tags.slice(0, 5).map(t => `<span class="card-tag">#${t}</span>`).join('')}</div>
      <span class="card-cta">Read Writeup →</span>`;
    card.addEventListener('click', () => openModal(post));
    grid.insertBefore(card, noRes);
  });

  searchIn.addEventListener('input', () => { query = searchIn.value.toLowerCase().trim(); render(); });

  function render() {
    let vis = 0;
    document.querySelectorAll('.blog-card').forEach(card => {
      const p = POSTS.find(x => x.id === card.dataset.id);
      if (!p) return;
      const ok = (activeTag === 'all' || p.tags.includes(activeTag)) &&
                 (!query || [p.title, p.excerpt, p.platform, ...p.tags].join(' ').toLowerCase().includes(query));
      card.classList.toggle('hidden', !ok);
      if (ok) vis++;
    });
    noRes.style.display = vis ? 'none' : 'block';
  }

  // Reveal cards
  setTimeout(() => {
    const io = makeIO(el => { el.classList.add('vis'); io.unobserve(el); });
    document.querySelectorAll('.blog-card.reveal').forEach(el => io.observe(el));
  }, 120);
});

/* ── Modal ───────────────────────────────────────────────────── */
function openModal(post) {
  document.getElementById('modal-title').textContent = post.title;
  document.getElementById('modal-meta').innerHTML = `
    <span class="card-date">${fmtDateLong(post.date)}</span>
    <span class="card-diff diff-${post.difficulty}">${post.difficulty.toUpperCase()}</span>
    <span class="card-platform">${post.platform}</span>`;
  document.getElementById('modal-tags').innerHTML = post.tags.map(t => `<span class="card-tag">#${t}</span>`).join('');
  document.getElementById('modal-body').innerHTML = post.content +
    (post.flags ? Object.entries(post.flags).map(([k, v]) =>
      `<div class="flag-box">🚩 ${k}: <code>${v}</code></div>`).join('') : '');
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('DOMContentLoaded', () => {
  const ov = document.getElementById('modal-overlay');
  ov.addEventListener('click', e => { if (e.target === ov) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
});

/* ── Contact Form ────────────────────────────────────────────── */
function handleContact(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'TRANSMITTING...'; btn.disabled = true;
  setTimeout(() => {
    document.getElementById('form-success').style.display = 'block';
    e.target.reset();
    btn.textContent = 'SEND MESSAGE'; btn.disabled = false;
  }, 1400);
}

/* ── Helpers ─────────────────────────────────────────────────── */
function fmtDate(str) {
  return new Date(str).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
function fmtDateLong(str) {
  return new Date(str).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
function makeIO(cb, opts = {}) {
  return new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) cb(e.target); });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px', ...opts });
}
function initReveal() {
  const io = makeIO(el => { el.classList.add('vis'); io.unobserve(el); });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}
