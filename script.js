/* ============================================================
   nullspec7or Portfolio — script.js
   Pure Vanilla JS — No frameworks
   ============================================================ */

'use strict';

// ============================================================
// UTILITIES
// ============================================================

const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

// ============================================================
// CUSTOM CURSOR
// ============================================================

(function initCursor() {
  const dot = $('#cursorDot');
  const ring = $('#cursorRing');
  if (!dot || !ring) return;

  let mx = -100, my = -100, rx = -100, ry = -100;
  let rafId;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Enlarge ring on hover
  document.addEventListener('mouseover', e => {
    if (e.target.closest('a,button,.project-card,.ticker-card,.blog-post-item,.achievement-slide')) {
      ring.classList.add('hovered');
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest('a,button,.project-card,.ticker-card,.blog-post-item,.achievement-slide')) {
      ring.classList.remove('hovered');
    }
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
})();

// ============================================================
// SCROLL PROGRESS
// ============================================================

(function initScrollProgress() {
  const bar = $('#scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
})();

// ============================================================
// NAVIGATION
// ============================================================

(function initNav() {
  const nav = $('#mainNav');
  const toggle = $('#navToggle');
  const links = $('#navLinks');
  if (!nav) return;

  // Scrolled class
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Mobile toggle
  if (toggle && links) {
    on(toggle, 'click', () => {
      links.classList.toggle('open');
      const spans = $$('span', toggle);
      const open = links.classList.contains('open');
      if (spans[0]) spans[0].style.transform = open ? 'rotate(45deg) translate(4px,4px)' : '';
      if (spans[1]) spans[1].style.opacity = open ? '0' : '1';
      if (spans[2]) spans[2].style.transform = open ? 'rotate(-45deg) translate(4px,-4px)' : '';
    });

    // Close on link click
    $$('a', links).forEach(a => {
      on(a, 'click', () => {
        links.classList.remove('open');
        $$('span', toggle).forEach(s => {
          s.style.transform = '';
          s.style.opacity = '';
        });
      });
    });
  }

  // Active section highlight
  const sections = $$('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const link = $(`a[href="#${id}"]`, nav);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  }, { passive: true });
})();

// ============================================================
// BOOT LOADER
// ============================================================

(function initBootLoader() {
  const loader = $('#bootLoader');
  const terminal = $('#bootTerminal');
  const bar = $('#bootBar');
  if (!loader || !terminal || !bar) return;

  const lines = [
    '[ OK ] Initializing offensive security suite...',
    '[ OK ] Loading kernel modules...',
    '[ OK ] Mounting /proc/nullspec7or...',
    '[ OK ] Establishing encrypted channel with operator...',
    '[ OK ] Bypassing IDS/IPS signatures...',
    '[ OK ] Spawning TTY shell... done',
    '[ OK ] Profiling the visitor... done',
    '[ OK ] All systems operational. Welcome.',
  ];

  let i = 0;
  const typeLines = () => {
    if (i >= lines.length) {
      setTimeout(() => loader.classList.add('hidden'), 300);
      return;
    }
    const p = document.createElement('p');
    p.textContent = lines[i];
    p.style.color = lines[i].includes('[ OK ]') ? '#00ff88' : '#ccc';
    terminal.appendChild(p);
    bar.style.width = ((i + 1) / lines.length * 100) + '%';
    i++;
    setTimeout(typeLines, 200 + Math.random() * 150);
  };

  setTimeout(typeLines, 400);
  // Safety fallback
  setTimeout(() => loader.classList.add('hidden'), 4000);
})();

// ============================================================
// HERO CANVAS — Cyber Particle Network
// ============================================================

(function initHeroCanvas() {
  const canvas = $('#heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: -999, y: -999 };
  const NUM = 80;
  const CONNECT_DIST = 150;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.5 + 0.3;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      // Repel from mouse
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        this.x += dx / dist * 1.5;
        this.y += dy / dist * 1.5;
      }
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
      this.x = Math.max(0, Math.min(W, this.x));
      this.y = Math.max(0, Math.min(H, this.y));
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,136,${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: NUM }, () => new Particle());
  }

  function drawGrid() {
    const size = 60;
    ctx.strokeStyle = 'rgba(0,255,136,0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += size) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += size) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,255,136,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  init();
  loop();

  window.addEventListener('resize', () => { resize(); particles.forEach(p => p.reset()); });

  document.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
})();

// ============================================================
// INDIA MAP CANVAS
// ============================================================

(function initIndiaMap() {
  const canvas = $('#indiaMapCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = 420;
  canvas.height = 520;

  // Simplified India outline as normalized points [x,y] 0-1 range
  // Covering Kashmir (top), NE states (right), and southern tip
  const indiaPoints = [
    [0.30,0.00],[0.35,0.01],[0.40,0.04],[0.45,0.05],[0.50,0.06],
    [0.55,0.04],[0.60,0.06],[0.63,0.04],[0.65,0.07],[0.62,0.10],
    [0.58,0.11],[0.60,0.14],[0.65,0.15],[0.68,0.18],[0.72,0.16],
    [0.75,0.19],[0.74,0.22],[0.72,0.24],[0.70,0.22],[0.68,0.24],
    [0.70,0.27],[0.73,0.29],[0.76,0.28],[0.78,0.31],[0.80,0.30],
    [0.82,0.33],[0.84,0.32],[0.85,0.36],[0.83,0.38],[0.80,0.37],
    [0.82,0.41],[0.80,0.44],[0.82,0.47],[0.80,0.50],[0.78,0.48],
    [0.76,0.51],[0.78,0.54],[0.76,0.57],[0.74,0.56],[0.72,0.59],
    [0.74,0.62],[0.72,0.65],[0.70,0.64],[0.68,0.67],[0.70,0.70],
    [0.68,0.73],[0.65,0.72],[0.63,0.75],[0.65,0.78],[0.62,0.82],
    [0.58,0.80],[0.55,0.83],[0.52,0.86],[0.50,0.90],[0.48,0.88],
    [0.45,0.92],[0.43,0.96],[0.41,0.98],[0.40,1.00],[0.38,0.98],
    [0.36,0.94],[0.34,0.90],[0.32,0.88],[0.30,0.85],[0.28,0.82],
    [0.26,0.79],[0.24,0.76],[0.22,0.73],[0.20,0.70],[0.18,0.67],
    [0.16,0.64],[0.15,0.60],[0.13,0.57],[0.12,0.54],[0.10,0.51],
    [0.08,0.48],[0.10,0.45],[0.08,0.42],[0.10,0.39],[0.12,0.36],
    [0.10,0.33],[0.12,0.30],[0.15,0.28],[0.14,0.25],[0.16,0.22],
    [0.18,0.20],[0.20,0.17],[0.22,0.15],[0.24,0.12],[0.26,0.10],
    [0.28,0.07],[0.30,0.04],[0.30,0.00]
  ];

  let t = 0;
  const pts = indiaPoints.map(([x, y]) => ({
    x: x * 380 + 20,
    y: y * 480 + 20,
    origX: x * 380 + 20,
    origY: y * 480 + 20,
  }));

  function draw() {
    ctx.clearRect(0, 0, 420, 520);
    t += 0.01;

    // Draw glowing outline
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.closePath();

    // Tricolour gradient glow
    const grad = ctx.createLinearGradient(0, 0, 0, 520);
    grad.addColorStop(0, 'rgba(255,153,51,0.6)');   // Saffron
    grad.addColorStop(0.5, 'rgba(240,246,255,0.4)'); // White
    grad.addColorStop(1, 'rgba(19,136,8,0.6)');      // Green

    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Subtle fill
    ctx.fillStyle = 'rgba(0,255,136,0.03)';
    ctx.fill();

    // Animated dots along path
    const dotCount = 8;
    for (let i = 0; i < dotCount; i++) {
      const idx = Math.floor(((t * 0.3 + i / dotCount) % 1) * pts.length);
      const p = pts[idx];
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 6);
      glow.addColorStop(0, 'rgba(0,255,136,0.9)');
      glow.addColorStop(1, 'rgba(0,255,136,0)');
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    }

    // Hyderabad dot
    const hyd = { x: 0.43 * 380 + 20, y: 0.62 * 480 + 20 };
    const pulse = Math.sin(t * 3) * 0.5 + 0.5;
    ctx.beginPath();
    ctx.arc(hyd.x, hyd.y, 4 + pulse * 4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,153,51,${0.3 - pulse * 0.2})`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(hyd.x, hyd.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,153,51,0.9)';
    ctx.fill();

    requestAnimationFrame(draw);
  }
  draw();
})();

// ============================================================
// HERO TEXT ANIMATIONS
// ============================================================

(function initHeroText() {
  // Name reveal with glitch
  const nameEl = $('#heroName');
  if (nameEl) {
    const name = 'RK';
    let revealed = '';
    const chars = '!@#$%^&*0123456789ABCDEF';
    let iterations = 0;
    const glitchInterval = setInterval(() => {
      nameEl.textContent = name.split('').map((c, i) => {
        if (i < Math.floor(iterations / 3)) return c;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      iterations++;
      if (iterations > name.length * 3 + 5) {
        clearInterval(glitchInterval);
        nameEl.textContent = name;
      }
    }, 60);
    // Delayed start
    nameEl.textContent = '';
    setTimeout(() => {}, 1500);
  }

  // Typewriter
  const tw = $('#heroTypewriter');
  if (tw) {
    const phrases = [
      'Cybersecurity Engineer',
      'Red Team Operator',
      'Exploit Developer',
      'OSCP Candidate',
      'AD Attacker',
    ];
    let pi = 0, ci = 0, deleting = false;
    const type = () => {
      const current = phrases[pi];
      if (!deleting) {
        tw.textContent = current.slice(0, ci + 1);
        ci++;
        if (ci === current.length) { deleting = true; setTimeout(type, 2000); return; }
      } else {
        tw.textContent = current.slice(0, ci - 1);
        ci--;
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
      }
      setTimeout(type, deleting ? 60 : 90);
    };
    setTimeout(type, 1500);
  }
})();

// ============================================================
// STATS COUNTER
// ============================================================

(function initStats() {
  const statNums = $$('[data-target]');
  if (!statNums.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      let current = 0;
      const step = target / 50;
      const interval = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.round(current) + (target >= 50 ? '+' : '');
        if (current >= target) clearInterval(interval);
      }, 30);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
})();

// ============================================================
// SCROLL REVEAL
// ============================================================

(function initScrollReveal() {
  const elements = $$('.reveal-up,.reveal-left,.reveal-right,.reveal-card,.reveal-timeline');
  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));

  // Skill bars
  const skillFills = $$('.skill-fill');
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.width = el.dataset.w + '%';
        skillObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(el => skillObserver.observe(el));
})();

// ============================================================
// ACHIEVEMENTS CAROUSEL
// ============================================================

(function initCarousel() {
  const carousel = $('#achievementsCarousel');
  const prevBtn = $('#achPrev');
  const nextBtn = $('#achNext');
  const dotsContainer = $('#achDots');
  if (!carousel) return;

  const slides = $$('.achievement-slide', carousel);
  let current = 0;
  let autoPlay;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    on(dot, 'click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    carousel.style.transform = `translateX(-${current * 100}%)`;
    $$('.carousel-dot', dotsContainer).forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoPlay);
    autoPlay = setInterval(() => goTo(current + 1), 5000);
  }

  on(prevBtn, 'click', () => goTo(current - 1));
  on(nextBtn, 'click', () => goTo(current + 1));

  // Touch swipe
  let touchStart = 0;
  on(carousel, 'touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
  on(carousel, 'touchend', e => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
  });

  resetAuto();
})();

// ============================================================
// BLOG TICKER DUPLICATE (for infinite scroll)
// ============================================================

(function initBlogTicker() {
  const ticker = $('#blogTicker');
  if (!ticker) return;
  // Duplicate children for infinite loop
  const children = [...ticker.children];
  children.forEach(c => ticker.appendChild(c.cloneNode(true)));
})();

// ============================================================
// TERMINAL EASTER EGG
// ============================================================

(function initEasterEgg() {
  const trigger = $('#eeTrigger');
  const ee = $('#easterEgg');
  const closeBtn = $('#eeClose');
  const input = $('#eeInput');
  const history = $('#eeHistory');
  if (!trigger || !ee) return;

  on(trigger, 'click', () => {
    ee.classList.toggle('open');
    if (ee.classList.contains('open') && input) {
      setTimeout(() => input.focus(), 100);
    }
  });

  on(closeBtn, 'click', () => ee.classList.remove('open'));

  const COMMANDS = {
    help: () => `Available commands:\n  whoami   — display user info\n  skills   — list technical skills\n  contact  — get contact info\n  blog     — open blog\n  clear    — clear terminal\n  matrix   — go deeper\n  htb      — HTB stats\n  flag     — capture a flag`,
    whoami: () => 'nullspec7or — Offensive Security Engineer, Hyderabad India',
    skills: () => 'Active Directory · Web Pentesting · Exploit Dev · SIEM · AWS · Python · Bash',
    contact: () => 'Email: nullspec7or@gmail.com\nGitHub: github.com/nullspec7or',
    blog: () => { setTimeout(() => { window.location.href = 'blog.html'; }, 800); return 'Redirecting to blog...'; },
    clear: () => { history.innerHTML = ''; return null; },
    matrix: () => `<span style="color:#00ff88;animation:fadeIn 0.3s">
Wake up, Neo...</span>`,
    htb: () => `HTB Rank: Pro Hacker\nMachines Rooted: 50+\nActive Labs: Offshore, RastaLabs`,
    flag: () => `HTB{n3v3r_5t0p_h4ck1ng_1nd14}`,
    pwd: () => '/home/nullspec7or',
    ls: () => 'about.txt  projects/  blog/  achievements/  contact.sh',
    date: () => new Date().toString(),
    uname: () => 'Linux kali 6.6.9 #1 SMP x86_64 GNU/Linux',
  };

  if (input) {
    on(input, 'keydown', e => {
      if (e.key !== 'Enter') return;
      const cmd = input.value.trim().toLowerCase();
      if (!cmd) return;

      // Echo command
      const cmdLine = document.createElement('p');
      cmdLine.innerHTML = `<span style="color:#00ff88">nullspec7or@kali</span><span style="color:#fff">:</span><span style="color:#4d9eff">~</span><span style="color:#fff">$ </span>${escapeHtml(cmd)}`;
      history.appendChild(cmdLine);

      // Execute
      const fn = COMMANDS[cmd];
      const output = fn ? fn() : `bash: ${escapeHtml(cmd)}: command not found`;

      if (output !== null && output !== undefined) {
        const out = document.createElement('p');
        out.innerHTML = output.replace(/\n/g, '<br>');
        out.style.color = '#ccc';
        out.style.paddingLeft = '16px';
        history.appendChild(out);
      }

      input.value = '';
      history.scrollTop = history.scrollHeight;
    });
  }
})();

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ============================================================
// BLOG SYSTEM
// ============================================================

(function initBlog() {
  if (!document.body.classList.contains('blog-page')) return;

  // Blog posts manifest — add new .md files here
  const POSTS_MANIFEST = [
    'blog/kerberoasting-to-da.md',
    'blog/manual-sqli-beyond-sqlmap.md',
    'blog/wazuh-aws-archival.md',
    'blog/cve-2024-51482-zoneminder.md',
    'blog/htb-cctv-walkthrough.md',
  ];

  let allPosts = [];
  let activePost = null;

  const blogList = $('#blogList');
  const blogArticle = $('#blogArticle');
  const blogEmptyState = $('#blogEmptyState');
  const articleHeader = $('#articleHeader');
  const articleBody = $('#articleBody');
  const searchInput = $('#blogSearch');
  const tagsFilter = $('#blogTagsFilter');

  // Configure marked.js
  if (typeof marked !== 'undefined') {
    marked.setOptions({
      gfm: true,
      breaks: true,
    });

    // Highlight.js integration
    if (typeof hljs !== 'undefined') {
      marked.setOptions({
        highlight: function(code, lang) {
          if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
          }
          return hljs.highlightAuto(code).value;
        }
      });
    }
  }

  // Parse frontmatter from markdown
  function parseFrontmatter(raw) {
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { meta: {}, content: raw };

    const meta = {};
    match[1].split('\n').forEach(line => {
      const [key, ...val] = line.split(':');
      if (key && val.length) {
        let v = val.join(':').trim();
        // Arrays like tags: [a, b, c]
        if (v.startsWith('[') && v.endsWith(']')) {
          v = v.slice(1,-1).split(',').map(s => s.trim()).filter(Boolean);
        }
        meta[key.trim()] = v;
      }
    });

    return { meta, content: match[2] };
  }

  // Calculate read time
  function readTime(text) {
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200)) + ' min read';
  }

  // Load all posts
  async function loadPosts() {
    blogList.innerHTML = '<div class="blog-list-skeleton"><div class="skeleton-item"></div><div class="skeleton-item"></div><div class="skeleton-item"></div></div>';

    const results = await Promise.allSettled(
      POSTS_MANIFEST.map(path =>
        fetch(path)
          .then(r => { if (!r.ok) throw new Error('Not found'); return r.text(); })
          .then(text => ({ path, text }))
      )
    );

    allPosts = results
      .filter(r => r.status === 'fulfilled')
      .map(r => {
        const { path, text } = r.value;
        const { meta, content } = parseFrontmatter(text);
        return {
          path,
          slug: path.replace('blog/', '').replace('.md', ''),
          title: meta.title || 'Untitled',
          date: meta.date || '',
          tags: Array.isArray(meta.tags) ? meta.tags : (meta.tags ? [meta.tags] : []),
          thumbnail: meta.thumbnail || null,
          content,
          readTime: readTime(content),
        };
      });

    // Sort by date descending
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (!allPosts.length) {
      blogList.innerHTML = '<div style="padding:24px;color:var(--muted);font-family:var(--font-mono);font-size:13px;text-align:center">No posts found.<br><span style="font-size:11px;opacity:0.6">Add .md files to /blog/</span></div>';
      return;
    }

    buildTagFilters();
    renderList(allPosts);

    // Auto-select first post
    if (allPosts.length) showPost(allPosts[0]);
  }

  function buildTagFilters() {
    const allTags = new Set();
    allPosts.forEach(p => p.tags.forEach(t => allTags.add(t)));
    tagsFilter.innerHTML = '<button class="tag-filter active" data-tag="all">All</button>';
    allTags.forEach(tag => {
      const btn = document.createElement('button');
      btn.className = 'tag-filter';
      btn.dataset.tag = tag;
      btn.textContent = tag;
      on(btn, 'click', () => filterByTag(tag));
      tagsFilter.appendChild(btn);
    });

    // All button
    on($('[data-tag="all"]', tagsFilter), 'click', () => filterByTag('all'));
  }

  function filterByTag(tag) {
    $$('.tag-filter', tagsFilter).forEach(b => b.classList.toggle('active', b.dataset.tag === tag));
    const filtered = tag === 'all' ? allPosts : allPosts.filter(p => p.tags.includes(tag));
    renderList(filtered);
  }

  function renderList(posts) {
    blogList.innerHTML = '';
    if (!posts.length) {
      blogList.innerHTML = '<div style="padding:24px;color:var(--muted);font-family:var(--font-mono);font-size:13px;text-align:center">No matching posts</div>';
      return;
    }
    posts.forEach(post => {
      const item = document.createElement('div');
      item.className = 'blog-post-item' + (activePost && activePost.slug === post.slug ? ' active' : '');
      item.innerHTML = `
        <div class="post-thumb" style="background:linear-gradient(135deg,#0d1117,#131c24)">
          ${post.thumbnail
            ? `<img src="${post.thumbnail}" alt="${escapeHtml(post.title)}" loading="lazy"/>`
            : `<svg width="24" height="24" fill="none" stroke="#00ff88" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`
          }
        </div>
        <div class="post-info">
          <div class="post-title">${escapeHtml(post.title)}</div>
          <div class="post-meta">
            ${post.tags.slice(0,2).map(t => `<span class="post-tag">${escapeHtml(t)}</span>`).join('')}
            <span class="post-readtime">${post.readTime}</span>
          </div>
        </div>
      `;
      on(item, 'click', () => showPost(post));
      blogList.appendChild(item);
    });
  }

  function showPost(post) {
    activePost = post;

    // Update active state
    $$('.blog-post-item').forEach(item => {
      const title = item.querySelector('.post-title');
      item.classList.toggle('active', title && title.textContent === post.title);
    });

    // Show article
    blogEmptyState.style.display = 'none';
    blogArticle.style.display = 'block';
    blogArticle.style.animation = 'none';

    // Header
    articleHeader.innerHTML = `
      <span class="article-date">${post.date}</span>
      <h1>${escapeHtml(post.title)}</h1>
      <div class="article-tags">
        ${post.tags.map(t => `<span>${escapeHtml(t)}</span>`).join('')}
      </div>
      <span class="article-readtime">⏱ ${post.readTime}</span>
    `;

    // Body - parse markdown
    if (typeof marked !== 'undefined') {
      articleBody.innerHTML = marked.parse(post.content);
    } else {
      articleBody.innerHTML = `<pre>${escapeHtml(post.content)}</pre>`;
    }

    // Highlight code
    if (typeof hljs !== 'undefined') {
      $$('pre code', articleBody).forEach(block => hljs.highlightElement(block));
    }

    // Animate
    requestAnimationFrame(() => {
      blogArticle.style.animation = 'fadeInUp 0.4s ease';
    });

    // Scroll to top of content
    blogArticle.parentElement.scrollTop = 0;
  }

  // Search
  if (searchInput) {
    on(searchInput, 'input', () => {
      const q = searchInput.value.toLowerCase().trim();
      const filtered = q
        ? allPosts.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.tags.some(t => t.toLowerCase().includes(q))
          )
        : allPosts;
      renderList(filtered);
    });
  }

  loadPosts();
})();

// ============================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================================

(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    on(a, 'click', e => {
      const target = $(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

// ============================================================
// GLITCH EFFECT ON SECTION TITLES
// ============================================================

(function initGlitch() {
  const titles = $$('.section-title');
  titles.forEach(title => {
    on(title, 'mouseenter', () => {
      title.style.animation = 'glitch 0.4s steps(1)';
      setTimeout(() => { title.style.animation = ''; }, 400);
    });
  });
})();
