/* ============================================================
   nullspec7or Portfolio — script.js  v3.1 (Fully Cleaned & Fixed)
   Vanilla JS only — GitHub Pages ready
   ============================================================ */
'use strict';

const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
const escapeHtml = esc;

// ============================================================
// UNIVERSAL MARKDOWN PARSER FOR DATA FILES
// ============================================================
function parseFrontmatter(fmText) {
    const meta = {};
    fmText.split(/\r?\n/).forEach(line => {
        const sep = line.indexOf(':'); if (sep < 0) return;
        const key = line.slice(0, sep).trim(); let val = line.slice(sep + 1).trim();
        if (val.startsWith('[') && val.endsWith(']')) {
            val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
        }
        meta[key] = val;
    });
    return meta;
}

// ============================================================
// UNIVERSAL MARKDOWN PARSER FOR DATA FILES (FIXED)
// ============================================================
function parseBlocks(raw) {
  if (!raw || typeof raw !== 'string') return [];
  const normalized = raw.replace(/\r\n/g, '\n').trim();
  if (!normalized.startsWith('---')) {
    return [{ meta: {}, content: normalized }];
  }
  
  const withoutFirst = normalized.replace(/^---\r?\n/, '');
  const parts = withoutFirst.split(/\n---\n/);
  const blocks = [];
  
  for (let i = 0; i < parts.length; i += 2) {
    const fmText = parts[i].trim();
    const content = parts[i + 1] ? parts[i + 1].trim() : '';
    const meta = {};
    
    fmText.split(/\r?\n/).forEach(line => {
      const sep = line.indexOf(':');
      if (sep < 0) return;
      const key = line.slice(0, sep).trim();
      let val = line.slice(sep + 1).trim();
      if (val.startsWith('[') && val.endsWith(']')) {
        val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
      }
      meta[key] = val;
    });
    blocks.push({ meta, content });
  }
  return blocks;
}

const renderMD = (text) => typeof marked !== 'undefined' ? marked.parse(text) : esc(text).replace(/\n/g, '<br>');

// ============================================================
// GLOBAL BACKGROUND CANVAS
// ============================================================
(function initGlobalCanvas() {
  const canvas = document.createElement('canvas');
  canvas.id = 'globalBg';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  let mouse = { x: -999, y: -999 };
  const NUM = 120; const CONNECT = 160;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W; this.y = init ? Math.random() * H : (Math.random() > 0.5 ? -10 : H + 10);
      this.vx = (Math.random() - 0.5) * 0.32; this.vy = (Math.random() - 0.5) * 0.32;
      this.r = Math.random() * 1.6 + 0.5; this.alpha = Math.random() * 0.4 + 0.15;
      this.color = Math.random() < 0.13 ? [255, 107, 53] : [0, 255, 136];
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      const dx = this.x - mouse.x, dy = this.y - mouse.y; const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 110 && d > 0) { const f = (110 - d) / 110; this.x += dx / d * f * 2.2; this.y += dy / d * f * 2.2; }
      if (this.x < -15 || this.x > W + 15 || this.y < -15 || this.y > H + 15) this.reset(false);
    }
    draw() {
      const [r, g, b] = this.color;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${this.alpha})`; ctx.fill();
    }
  }
  function drawGrid() {
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= W; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.strokeStyle = 'rgba(0,255,136,0.022)'; ctx.stroke(); }
    for (let y = 0; y <= H; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.strokeStyle = 'rgba(0,255,136,0.022)'; ctx.stroke(); }
  }
  function loop() {
    ctx.clearRect(0, 0, W, H); drawGrid();
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y; const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT) {
          const [r, g, b] = particles[i].color;
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - dist / CONNECT) * 0.18})`; ctx.lineWidth = 0.7; ctx.stroke();
        }
      }
    }
    particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(loop);
  }
  resize(); particles = Array.from({ length: NUM }, () => new Particle()); loop();
  window.addEventListener('resize', () => { resize(); particles.forEach(p => p.reset(true)); });
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  document.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });
})();

// ============================================================
// WORLD MAP
// ============================================================
(function initWorldMap() {
  const hero = document.getElementById('hero'); if (!hero) return;
  if (getComputedStyle(hero).position === 'static') hero.style.position = 'relative';
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none;`;
  hero.appendChild(canvas); const ctx = canvas.getContext('2d');
  let W = 0, H = 0, t = 0;
  function resize() {
    const rect = hero.getBoundingClientRect(); const dpr = window.devicePixelRatio || 1;
    W = rect.width; H = rect.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const ll = (lon, lat) => [(lon + 180) / 360 * W, (90 - lat) / 180 * H];
  const CONTINENTS = [
    [[-10,36],[0,36],[10,36],[20,35],[28,32],[34,30],[37,12],[40,5],[40,-5],[30,-18],[20,-35],[18,-34],[15,-22],[10,-5],[5,5],[0,5],[-5,5],[-15,15],[-17,20],[-10,36]],
    [[-60,50],[-75,43],[-82,30],[-90,28],[-95,25],[-88,16],[-78,9],[-83,12],[-90,18],[-100,20],[-108,24],[-117,33],[-120,47],[-130,54],[-138,58],[-140,62],[-152,62],[-155,59],[-163,55],[-168,63],[-170,64],[-140,70],[-80,72],[-65,68],[-60,50]],
    [[-35,-5],[-40,-10],[-50,-14],[-55,-25],[-65,-38],[-68,-52],[-70,-55],[-75,-50],[-80,-35],[-78,-5],[-75,5],[-60,5],[-50,2],[-40,-2],[-35,-5]],
    [[26,36],[35,38],[45,38],[55,35],[60,22],[68,22],[75,22],[80,28],[85,26],[90,22],[100,12],[105,10],[110,5],[120,20],[125,22],[130,30],[138,34],[140,38],[142,42],[140,55],[130,55],[120,52],[110,50],[100,48],[90,42],[80,38],[70,36],[60,37],[48,40],[40,40],[35,36],[28,36],[26,36]],
    [[115,-32],[120,-28],[130,-18],[136,-12],[140,-14],[148,-18],[154,-24],[155,-28],[152,-34],[148,-38],[144,-38],[138,-36],[130,-32],[125,-34],[115,-34],[115,-32]],
    [[68,23],[70,20],[72,22],[72,19],[74,17],[76,14],[78,9],[80,9],[80,8],[78,8],[80,12],[80,18],[78,20],[76,22],[74,24],[72,24],[70,24],[68,24],[67,22],[68,23]],
  ];
  const CITIES = { hyderabad: [78.47, 17.38], london: [-0.12, 51.51], newyork: [-74.0, 40.71], tokyo: [139.7, 35.68] };
  const DESTS = Object.entries(CITIES).filter(([k]) => k !== 'hyderabad');
  const arcs = DESTS.map(([name, pos], i) => ({ to: pos, from: CITIES.hyderabad, prog: 0, speed: 0.003 }));
  function bezier(ax, ay, bx, by, t) {
    const mx = (ax + bx) / 2, my = (ay + by) / 2; const dx = bx - ax, dy = by - ay;
    const len = Math.hypot(dx, dy) || 1; const lift = len * 0.3;
    const cx = mx - (dy / len) * lift, cy = my + (dx / len) * lift;
    return { x: (1-t)*(1-t)*ax + 2*(1-t)*t*cx + t*t*bx, y: (1-t)*(1-t)*ay + 2*(1-t)*t*cy + t*t*by };
  }
  function drawMap() {
    ctx.lineWidth = 1;
    CONTINENTS.forEach(pts => {
      ctx.beginPath();
      pts.forEach((p, i) => { const [x, y] = ll(p[0], p[1]); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
      ctx.strokeStyle = 'rgba(0,255,136,0.08)'; ctx.stroke();
    });
  }
  function drawArcs() {
    const [hx, hy] = ll(...CITIES.hyderabad);
    arcs.forEach(arc => {
      arc.prog += arc.speed; if (arc.prog > 1) arc.prog = 0;
      const [ax, ay] = ll(...arc.from), [bx, by] = ll(...arc.to);
      const p = bezier(ax, ay, bx, by, arc.prog);
      ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fillStyle = '#00ff88'; ctx.fill();
    });
    ctx.beginPath(); ctx.arc(hx, hy, 4, 0, Math.PI * 2); ctx.fillStyle = '#FF9933'; ctx.fill();
  }
  function frame() { ctx.clearRect(0, 0, W, H); drawMap(); drawArcs(); requestAnimationFrame(frame); }
  window.addEventListener('resize', resize); resize(); frame();
})();

// ============================================================
// UI INITIALIZATIONS
// ============================================================
(function initScrollProgress() {
  const bar = $('#scrollProgress'); if (!bar) return;
  window.addEventListener('scroll', () => { bar.style.width = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100, 100) + '%'; }, { passive: true });
})();

(function initCursor() {
  const dot = $('#cursorDot'), ring = $('#cursorRing'); if (!dot || !ring) return;
  let mx = -100, my = -100, rx = -100, ry = -100;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px'; });
  (function animRing() { rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(animRing); })();
  document.addEventListener('mouseover', e => { if (e.target.closest('a,button,.project-card,.ticker-card,.blog-post-item')) ring.classList.add('hovered'); });
  document.addEventListener('mouseout', e => { if (e.target.closest('a,button,.project-card,.ticker-card,.blog-post-item')) ring.classList.remove('hovered'); });
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
})();

(function initNav() {
  const nav = $('#mainNav'), toggle = $('#navToggle'), links = $('#navLinks'); if (!nav) return;
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20), { passive: true });
  if (toggle && links) {
    on(toggle, 'click', () => {
      links.classList.toggle('open');
      const spans = $$('span', toggle), open = links.classList.contains('open');
      spans[0] && (spans[0].style.transform = open ? 'rotate(45deg) translate(4px,4px)' : '');
      spans[1] && (spans[1].style.opacity = open ? '0' : '1');
      spans[2] && (spans[2].style.transform = open ? 'rotate(-45deg) translate(4px,-4px)' : '');
    });
    $$('a', links).forEach(a => on(a, 'click', () => { links.classList.remove('open'); $$('span', toggle).forEach(s => { s.style.transform = ''; s.style.opacity = ''; }); }));
  }
  const secs = $$('section[id]');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY + 100;
    secs.forEach(s => { const lnk = $(`a[href="#${s.id}"]`, nav); if (lnk) lnk.classList.toggle('active', sy >= s.offsetTop && sy < s.offsetTop + s.offsetHeight); });
  }, { passive: true });
})();

(function initBootLoader() {
  const loader = $('#bootLoader'), terminal = $('#bootTerminal'), bar = $('#bootBar'); if (!loader || !terminal || !bar) return;
  const lines = ['[ OK ] Initializing offensive security suite...','[ OK ] Loading kernel modules...','[ OK ] Mounting /proc/nullspec7or...','[ OK ] Routing via Hyderabad → World nodes...','[ OK ] Establishing encrypted channel...','[ OK ] Bypassing perimeter defenses...','[ OK ] All systems nominal. Welcome.'];
  let i = 0;
  const next = () => {
    if (i >= lines.length) { setTimeout(() => loader.classList.add('hidden'), 400); return; }
    const p = document.createElement('p'); p.textContent = lines[i]; p.style.color = '#00ff88'; terminal.appendChild(p);
    bar.style.width = ((i + 1) / lines.length * 100) + '%'; i++; setTimeout(next, 210 + Math.random() * 140);
  };
  setTimeout(next, 350); setTimeout(() => loader.classList.add('hidden'), 5500);
})();

(function initHeroText() {
  const nameEl = $('#heroName');
  if (nameEl) {
    const name = 'Rupesh Kumar'; const CHARS = '!@#$%^&*[]{}|<>0123456789ABCDEF';
    nameEl.textContent = name;
    setTimeout(() => {
      let it = 0;
      const iv = setInterval(() => {
        nameEl.textContent = name.split('').map((c, i) => i < Math.floor(it / 3) ? c : CHARS[Math.floor(Math.random() * CHARS.length)]).join('');
        it++; if (it > name.length * 4 + 8) { clearInterval(iv); nameEl.textContent = name; }
      }, 52);
    }, 2700);
  }
  const tw = $('#heroTypewriter');
  if (tw) {
    const phrases = ['NGINX Recognized Vulnerability Researcher','Cybersecurity Engineer','OWASP Appsec Global EU 2026 Speaker','Red Team Operator','Exploit Developer','OSCP Candidate','AD Attacker','CTF Player'];
    let pi = 0, ci = 0, del = false;
    const type = () => {
      const cur = phrases[pi];
      if (!del) { tw.textContent = cur.slice(0, ci + 1); ci++; if (ci === cur.length) { del = true; setTimeout(type, 2200); return; } }
      else { tw.textContent = cur.slice(0, ci - 1); ci--; if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; } }
      setTimeout(type, del ? 52 : 92);
    };
    setTimeout(type, 2900);
  }
})();

(function initStats() {
  const nums = $$('[data-target]'); if (!nums.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target, target = +el.dataset.target;
      let cur = 0; const step = target / 60;
      const iv = setInterval(() => { cur = Math.min(cur + step, target); el.textContent = Math.round(cur) + (target >= 50 ? '+' : ''); if (cur >= target) clearInterval(iv); }, 25);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(el => obs.observe(el));
})();

window.initScrollReveal = function() {
  const els = $$('.reveal-up,.reveal-left,.reveal-right,.reveal-card,.reveal-timeline'); if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
  const fills = $$('.skill-fill');
  const sObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.style.width = e.target.dataset.w + '%'; sObs.unobserve(e.target); } });
  }, { threshold: 0.2 });
  fills.forEach(el => sObs.observe(el));
};
window.initScrollReveal();

(function initBlogTicker() {
  const ticker = $('#blogTicker'); if (!ticker) return;
  const kids = [...ticker.children];
  kids.forEach(c => ticker.appendChild(c.cloneNode(true)));
  kids.forEach(c => ticker.appendChild(c.cloneNode(true)));
})();

(function initEasterEgg() {
  const trigger = $('#eeTrigger'), ee = $('#easterEgg'), closeBtn = $('#eeClose'), input = $('#eeInput'), hist = $('#eeHistory');
  if (!trigger || !ee) return;
  on(trigger, 'click', () => { ee.classList.toggle('open'); if (ee.classList.contains('open') && input) setTimeout(() => input.focus(), 100); });
  on(closeBtn, 'click', () => ee.classList.remove('open'));
  const CMDS = {
    help: () => 'whoami · skills · contact · blog · htb · flag · pwd · ls · uname · date · clear · exit',
    whoami: () => 'nullspec7or — Offensive Security | Hyderabad, India 🇮🇳',
    skills: () => 'AD Attacks · Web Pentesting · Exploit Dev · SIEM · AWS · Python · Bash',
    contact: () => 'Email: nullspec7or@gmail.com\nGitHub: github.com/nullspec7or',
    blog: () => { setTimeout(() => { window.location.href = 'blog.html'; }, 700); return 'Redirecting...'; },
    clear: () => { if (hist) hist.innerHTML = ''; return null; },
    htb: () => 'Rank: Pro Hacker | Machines: 50+ | Labs: Offshore, RastaLabs',
    flag: () => 'HTB{n3v3r_5t0p_h4ck1ng_1nd14}',
    pwd: () => '/home/nullspec7or',
    ls: () => 'about.txt  projects/  blog/  achievements/  contact.sh',
    date: () => new Date().toUTCString(),
    uname: () => 'Linux kali 6.6.9-amd64 #1 SMP x86_64 GNU/Linux',
    exit: () => { setTimeout(() => ee.classList.remove('open'), 300); return 'Session closed.'; },
  };
  if (input) {
    on(input, 'keydown', e => {
      if (e.key !== 'Enter') return;
      const cmd = input.value.trim().toLowerCase(); if (!cmd) return;
      const cl = document.createElement('p');
      cl.innerHTML = `<span style="color:#00ff88">nullspec7or@kali</span>:<span style="color:#4d9eff">~</span>$ ${esc(cmd)}`;
      hist.appendChild(cl);
      const fn = CMDS[cmd], out = fn ? fn() : `bash: ${esc(cmd)}: command not found`;
      if (out != null) { const o = document.createElement('p'); o.innerHTML = String(out).replace(/\n/g, '<br>'); o.style.cssText = 'color:#9ec;padding-left:12px'; hist.appendChild(o); }
      input.value = ''; hist.scrollTop = hist.scrollHeight;
    });
  }
})();

(function() {
  $$('a[href^="#"]').forEach(a => on(a, 'click', e => {
    const t = $(a.getAttribute('href')); if (!t) return; e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' });
  }));
})();

(function() {
  $$('.section-title, .hero-name').forEach(el => on(el, 'mouseenter', () => { el.classList.add('glitch-active'); setTimeout(() => el.classList.remove('glitch-active'), 500); }));
})();

// ============================================================
// BLOG SYSTEM (With Cover Image Injection)
// ============================================================
(function initBlog() {
  if (!document.body.classList.contains('blog-page')) return;
  let allPosts = [], activePost = null, activeTags = new Set();
  const blogList = $('#blogList'), blogArticle = $('#blogArticle'), emptyState = $('#blogEmptyState');
  const artHeader = $('#articleHeader'), artBody = $('#articleBody');
  const searchInput = $('#blogSearch'), tagsFilter = $('#blogTagsFilter');
  const postCountEl = $('#postCount');

  if (typeof marked !== 'undefined') {
    marked.setOptions({ gfm: true, breaks: true });
    if (typeof hljs !== 'undefined') {
      marked.setOptions({ highlight: (code, lang) => lang && hljs.getLanguage(lang) ? hljs.highlight(code, { language: lang }).value : hljs.highlightAuto(code).value });
    }
  }

function parseFM(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return { meta: {}, content: raw };
  const meta = {};
  m[1].split(/\r?\n/).forEach(line => {
    const sep = line.indexOf(':'); if (sep < 0) return;
    const key = line.slice(0, sep).trim(); let val = line.slice(sep + 1).trim();
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    }
    meta[key] = val;
  });
  return { meta, content: m[2] };
}

  function calcReadTime(text) {
    const words = text.trim().split(/\s+/).length;
    const mins = Math.max(1, Math.round(words / 200));
    return mins + ' min read';
  }

  function fmtDate(d) {
    if (!d) return '';
    const dt = new Date(d);
    if (isNaN(dt)) return String(d);
    return dt.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  async function loadPosts() {
    if (blogList) blogList.innerHTML = '<div class="blog-list-skeleton"><div class="skeleton-item"></div><div class="skeleton-item"></div><div class="skeleton-item"></div></div>';
    let paths = [];
    try {
      const r = await fetch('data/posts.json');
      if (r.ok) paths = await r.json();
    } catch (e) { console.warn('Could not load data/posts.json', e); }

    const res = await Promise.allSettled(
      paths.map(p => fetch(p).then(r => { if (!r.ok) throw 0; return r.text(); }).then(text => ({ p, text })))
    );

    allPosts = res.filter(r => r.status === 'fulfilled').map(r => {
      const { p, text } = r.value, { meta, content } = parseFM(text);
      const tags = Array.isArray(meta.tags) ? meta.tags : (meta.tags ? [meta.tags] : []);
      return {
        path: p, slug: p.replace('blog/', '').replace('.md', ''),
        title: meta.title ? meta.title.replace(/^["']|["']$/g, '') : 'Untitled',
        date: meta.date || '', tags, thumbnail: meta.thumbnail || null,
        content, readTime: calcReadTime(content)
      };
    });

    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (postCountEl) postCountEl.textContent = allPosts.length + ' post' + (allPosts.length !== 1 ? 's' : '');

    if (!allPosts.length) {
      if (blogList) blogList.innerHTML = '<p style="padding:24px;color:var(--muted);font-family:var(--font-mono);font-size:12px;text-align:center">No posts found.</p>';
      return;
    }
    buildTags(); applyFilters();
    if (allPosts.length) showPost(allPosts[0]);
  }

  function buildTags() {
    if (!tagsFilter) return;
    const tags = new Set();
    allPosts.forEach(p => p.tags.forEach(t => tags.add(t)));
    tagsFilter.innerHTML = '<button class="tag-filter active" data-tag="all">All</button>';
    tags.forEach(tag => {
      const b = document.createElement('button'); b.className = 'tag-filter'; b.dataset.tag = tag; b.textContent = tag;
      on(b, 'click', () => toggleTag(tag)); tagsFilter.appendChild(b);
    });
    on($('[data-tag="all"]', tagsFilter), 'click', () => {
      activeTags.clear();
      $$('.tag-filter', tagsFilter).forEach(b => b.classList.remove('active'));
      $('[data-tag="all"]', tagsFilter).classList.add('active'); applyFilters();
    });
  }

  function toggleTag(tag) {
    if (activeTags.has(tag)) activeTags.delete(tag); else activeTags.add(tag);
    $$('.tag-filter', tagsFilter).forEach(b => {
      if (b.dataset.tag === 'all') b.classList.toggle('active', activeTags.size === 0);
      else b.classList.toggle('active', activeTags.has(b.dataset.tag));
    });
    applyFilters();
  }

  function applyFilters() {
    const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
    let posts = allPosts;
    if (activeTags.size > 0) posts = posts.filter(p => [...activeTags].every(t => p.tags.includes(t)));
    if (q) posts = posts.filter(p => p.title.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)) || p.content.toLowerCase().includes(q));
    renderList(posts);
  }

  function renderList(posts) {
    if (!blogList) return; blogList.innerHTML = '';
    if (!posts.length) { blogList.innerHTML = '<p style="padding:24px;color:var(--muted);font-size:12px;font-family:var(--font-mono);text-align:center">No matches</p>'; return; }
    posts.forEach(post => {
      const item = document.createElement('div');
      item.className = 'blog-post-item' + (activePost && activePost.slug === post.slug ? ' active' : '');
      item.innerHTML = `
        <div class="post-thumb" style="background:linear-gradient(135deg,#0d1117,#1a2535)">
          ${post.thumbnail ? `<img src="${esc(post.thumbnail)}" alt="${esc(post.title)}" loading="lazy"/>` : `<svg width="22" height="22" fill="none" stroke="#00ff88" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`}
        </div>
        <div class="post-info">
          <div class="post-title">${esc(post.title)}</div>
          <div class="post-meta">
            ${post.tags.slice(0, 3).map(t => `<span class="post-tag">${esc(t)}</span>`).join('')}
            <span class="post-readtime">${post.readTime}</span>
          </div>
        </div>`;
      on(item, 'click', () => showPost(post)); blogList.appendChild(item);
    });
  }

  function showPost(post) {
    activePost = post;
    $$('.blog-post-item').forEach(item => { const t = item.querySelector('.post-title'); item.classList.toggle('active', t && t.textContent === post.title); });
    if (emptyState) emptyState.style.display = 'none';
    if (!blogArticle) return;
    blogArticle.style.display = 'block'; blogArticle.style.animation = 'none';
    
    // Update Open Graph meta tags for social sharing
    if (post.thumbnail) {
      let ogImage = document.querySelector('meta[property="og:image"]');
      let twitterImage = document.querySelector('meta[name="twitter:image"]');
      if (!ogImage) { ogImage = document.createElement('meta'); ogImage.setAttribute('property', 'og:image'); document.head.appendChild(ogImage); }
      if (!twitterImage) { twitterImage = document.createElement('meta'); twitterImage.setAttribute('name', 'twitter:image'); document.head.appendChild(twitterImage); }
      const imgUrl = post.thumbnail.startsWith('http') ? post.thumbnail : window.location.origin + '/' + post.thumbnail.replace(/^\//, '');
      ogImage.setAttribute('content', imgUrl); twitterImage.setAttribute('content', imgUrl);
    }
    
    if (artHeader) {
      let coverHtml = post.thumbnail ? `<img src="${esc(post.thumbnail)}" alt="${esc(post.title)}" class="blog-cover-image" />` : '';
      artHeader.innerHTML = `
        ${coverHtml}
        <span class="article-date">${fmtDate(post.date)}</span>
        <h1>${esc(post.title)}</h1>
        <div class="article-tags">${post.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
        <span class="article-readtime">⏱ ${post.readTime}</span>`;
    }
    if (artBody) {
      artBody.innerHTML = typeof marked !== 'undefined' ? marked.parse(post.content) : `<pre>${esc(post.content)}</pre>`;
      if (typeof hljs !== 'undefined') $$('pre code', artBody).forEach(b => hljs.highlightElement(b));
    }
    requestAnimationFrame(() => { blogArticle.style.animation = 'fadeInUp 0.45s ease'; });
    if (blogArticle.parentElement) blogArticle.parentElement.scrollTop = 0;
  }

  if (searchInput) on(searchInput, 'input', applyFilters);
  loadPosts();
})();

// ============================================================
// ACHIEVEMENTS
// ============================================================
(function initAchievements() {
  const carousel = $('#achievementsCarousel'); if (!carousel) return;
  const ICONS = {
    orange_star: `<svg width="40" height="40" fill="none" stroke="#ff6b35" stroke-width="1.5" viewBox="0 0 24 24"><path d="M8 21h8M12 17v4M17 12h.01M12 7h.01M7 12h.01"/><rect x="3" y="3" width="18" height="14" rx="2"/></svg>`,
    green_star: `<svg width="40" height="40" fill="none" stroke="#00ff88" stroke-width="1.5" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    orange_shield: `<svg width="40" height="40" fill="none" stroke="#ff6b35" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    green_globe: `<svg width="40" height="40" fill="none" stroke="#00ff88" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>`,
    orange_check: `<svg width="40" height="40" fill="none" stroke="#ff6b35" stroke-width="1.5" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  };
  function pickIcon(icon, index) {
    const palette = ['orange', 'green']; const color = icon || palette[index % 2];
    const shapes = ['star', 'shield', 'globe', 'check', 'star']; const shape = shapes[index % shapes.length];
    const key = color + '_' + shape; return ICONS[key] || ICONS['orange_star'];
  }
  function parseAchievementsMD(raw) {
    const normalized = raw.replace(/\r\n/g, '\n');
    const stripped = normalized.replace(/^---\n[\s\S]*?\n---\n?/, '').trim();
    const blocks = stripped.split(/\n---\n/).map(b => b.trim()).filter(Boolean);
    return blocks.map((block, i) => {
      const lines = block.split('\n');
      const titleLine = lines.find(l => l.startsWith('## '));
      const title = titleLine ? titleLine.replace(/^## /, '').trim() : 'Achievement';
      let year = '', badge = '', icon = '', description = '';
      lines.forEach(line => {
        const sep = line.indexOf(':'); if (sep < 0) return;
        const k = line.slice(0, sep).trim(); const v = line.slice(sep + 1).trim();
        if (k === 'year') year = v; else if (k === 'badge') badge = v;
        else if (k === 'icon') icon = v; else if (k === 'description') description = v;
      });
      return { title, year, badge, icon, description, index: i };
    });
  }
  function renderAchievements(achievements) {
    carousel.innerHTML = '';
    achievements.forEach((ach, i) => {
      const slide = document.createElement('div'); slide.className = 'achievement-slide';
      slide.innerHTML = `
        <div class="ach-icon">${pickIcon(ach.icon, i)}</div>
        <div class="ach-content">
          <span class="ach-year">${esc(ach.year)}</span>
          <h3>${esc(ach.title)}</h3>
          <p>${esc(ach.description)}</p>
          <span class="ach-badge">${esc(ach.badge)}</span>
        </div>`;
      carousel.appendChild(slide);
    });
    reinitCarousel();
  }
  function reinitCarousel() {
    const prev = $('#achPrev'), next = $('#achNext'), dots = $('#achDots');
    if (!carousel || !dots) return;
    const slides = $$('.achievement-slide', carousel); if (!slides.length) return;
    dots.innerHTML = ''; let cur = 0, auto;
    slides.forEach((_, i) => {
      const d = document.createElement('div'); d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      on(d, 'click', () => go(i)); dots.appendChild(d);
    });
    function go(idx) {
      cur = (idx + slides.length) % slides.length;
      carousel.style.transform = `translateX(-${cur * 100}%)`;
      $$('.carousel-dot', dots).forEach((d, i) => d.classList.toggle('active', i === cur)); reset();
    }
    function reset() { clearInterval(auto); auto = setInterval(() => go(cur + 1), 5500); }
    on(prev, 'click', () => go(cur - 1)); on(next, 'click', () => go(cur + 1));
    let ts = 0;
    on(carousel, 'touchstart', e => { ts = e.touches[0].clientX; }, { passive: true });
    on(carousel, 'touchend', e => { if (Math.abs(ts - e.changedTouches[0].clientX) > 50) go(cur + (ts > e.changedTouches[0].clientX ? 1 : -1)); });
    reset();
  }
  fetch('data/achievements.md')
    .then(r => { if (!r.ok) throw 0; return r.text(); })
    .then(text => { const achievements = parseAchievementsMD(text); if (achievements.length) renderAchievements(achievements); })
    .catch(() => { reinitCarousel(); });
})();

// ============================================================
// DYNAMIC SECTIONS: EXPERIENCE, PROJECTS, CONTACT
// ============================================================
    if (expContainerIndex || expContainerFull) {
        fetch('data/experience.md').then(r => r.text()).then(raw => {
            let blocks = parseBlocks(raw);
            
            // Sort blocks by date, newest first
            blocks.sort((a, b) => {
                const dateA = new Date(a.meta.date || 0);
                const dateB = new Date(b.meta.date || 0);
                return dateB - dateA; 
            });
            
            const isArchive = document.body.classList.contains('archive-page');
            
            if (expContainerIndex) {
                expContainerIndex.innerHTML = '';
                const limit = 3;
                const items = blocks.slice(0, limit);
                items.forEach(block => {
                    const m = block.meta;
                    const tools = m.tools ? m.tools.split(',').map(t => t.trim()) : (m.tags ? (Array.isArray(m.tags) ? m.tags : m.tags.split(',')) : []);
                    const safeId = (m.id || m.company || 'exp').replace(/[^a-z0-9]/gi, '-').toLowerCase();
                    const card = document.createElement('div');
                    card.className = 'exp-compact-card reveal-up';
                    card.innerHTML = `
                        <div class="exp-compact-header">
                            <h3>${esc(m.company || '')}</h3>
                            <span class="exp-compact-date">${esc(m.date || '')} ${m.badge ? `<span class="tcard-badge">${esc(m.badge)}</span>` : ''}</span>
                        </div>
                        <div class="exp-compact-role">${esc(m.title || '')}</div>
                        <div class="exp-compact-desc">${esc(m.description || '')}</div>
                        <div class="exp-compact-tools">
                            ${tools.slice(0, 4).map(t => `<span class="tag">${esc(t)}</span>`).join('')}
                        </div>
                        <a href="experience.html#${safeId}" class="exp-compact-link">Read full experience →</a>
                    `;
                    expContainerIndex.appendChild(card);
                });
                if (viewAllExp) viewAllExp.style.display = blocks.length > limit ? 'block' : 'none';
                window.initScrollReveal();
            }

            if (expContainerFull) {
                // 1. Populate Timeline Sidebar
                const sidebar = document.getElementById('expTimelineSidebar');
                if (sidebar) {
                    sidebar.innerHTML = blocks.map(b => {
                        const m = b.meta;
                        const safeId = (m.id || m.company || 'exp').replace(/[^a-z0-9]/gi, '-').toLowerCase();
                        const dateObj = new Date(m.date || 0);
                        const year = !isNaN(dateObj) ? dateObj.getFullYear() : '';
                        const month = !isNaN(dateObj) ? dateObj.toLocaleString('default', { month: 'short' }) : '';
                        return `
                            <div class="timeline-item" data-target="${safeId}">
                                <span class="timeline-year">${month} ${year}</span>
                                <span class="timeline-company">${esc(m.company || 'Experience')}</span>
                            </div>
                        `;
                    }).join('');

                    sidebar.querySelectorAll('.timeline-item').forEach(item => {
                        item.addEventListener('click', () => {
                            const target = document.getElementById(item.dataset.target);
                            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        });
                    });
                }

                // 2. Populate Trapezium Nav
                const navContainer = document.getElementById('expStickyNav');
                if (navContainer) {
                    navContainer.innerHTML = blocks.map(b => {
                        const m = b.meta;
                        const safeId = (m.id || m.company || 'exp').replace(/[^a-z0-9]/gi, '-').toLowerCase();
                        const shortName = m.company ? m.company.split('·')[0].trim() : 'Experience';
                        return `<a href="#${safeId}" class="exp-nav-item" data-target="${safeId}">${esc(shortName)}</a>`;
                    }).join('');
                }

                // 3. Render Main Cards
                expContainerFull.innerHTML = '';
                blocks.forEach(block => {
                    const m = block.meta;
                    const safeId = (m.id || m.company || 'exp').replace(/[^a-z0-9]/gi, '-').toLowerCase();
                    const tools = m.tools ? m.tools.split(',').map(t => t.trim()) : (m.tags ? (Array.isArray(m.tags) ? m.tags : m.tags.split(',')) : []);
                    const card = document.createElement('div');
                    card.className = 'exp-full-card reveal-up';
                    card.id = safeId;
                    card.innerHTML = `
                        <div class="exp-full-header">
                            <span class="exp-full-date">${esc(m.date || '')}</span>
                            ${m.badge ? `<span class="tcard-badge">${esc(m.badge)}</span>` : ''}
                        </div>
                        <h3 class="exp-full-title">${esc(m.title || '')}</h3>
                        <div class="exp-full-company">${esc(m.company || '')}</div>
                        <p class="exp-full-desc">${renderMD(m.description || '')}</p>
                        <div class="exp-full-tools">
                            <span class="tools-label">Tools & Skills:</span>
                            ${tools.map(t => `<span class="tag">${esc(t)}</span>`).join('')}
                        </div>
                    `;
                    expContainerFull.appendChild(card);
                });
                
                // 4. Live Tracker for BOTH Sidebar and Nav
                setTimeout(() => {
                    const navItems = document.querySelectorAll('.exp-nav-item');
                    const timelineItems = document.querySelectorAll('.timeline-item');
                    const sections = document.querySelectorAll('.exp-full-card');
                    
                    if (sections.length) {
                        const observer = new IntersectionObserver((entries) => {
                            entries.forEach(entry => {
                                if (entry.isIntersecting) {
                                    const id = entry.target.id;
                                    navItems.forEach(item => item.classList.toggle('active', item.dataset.target === id));
                                    timelineItems.forEach(item => item.classList.toggle('active', item.dataset.target === id));
                                }
                            });
                        }, { rootMargin: '-100px 0px -60% 0px', threshold: 0 });
                        sections.forEach(section => observer.observe(section));
                    }
                }, 100);
            }
        }).catch(err => console.error("Failed to load experience:", err));
    }