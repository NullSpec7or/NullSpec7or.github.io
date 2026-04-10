/* ============================================================
   nullspec7or Portfolio — script.js  v2.0
   Vanilla JS only — GitHub Pages ready
   ============================================================ */
'use strict';

const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

// ============================================================
// GLOBAL BACKGROUND CANVAS — fixed, spans all sections
// ============================================================
(function initGlobalCanvas() {
  const canvas = document.createElement('canvas');
  canvas.id = 'globalBg';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  let mouse = { x: -999, y: -999 };
  const NUM = 120;
  const CONNECT = 160;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : (Math.random() > 0.5 ? -10 : H + 10);
      this.vx = (Math.random() - 0.5) * 0.32;
      this.vy = (Math.random() - 0.5) * 0.32;
      this.r = Math.random() * 1.6 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.15;
      this.color = Math.random() < 0.13 ? [255, 107, 53] : [0, 255, 136];
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const d = Math.sqrt(dx * dx + dy * dy);
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
    for (let x = 0; x <= W; x += 80) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H);
      ctx.strokeStyle = 'rgba(0,255,136,0.022)'; ctx.stroke();
    }
    for (let y = 0; y <= H; y += 80) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y);
      ctx.strokeStyle = 'rgba(0,255,136,0.022)'; ctx.stroke();
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT) {
          const [r, g, b] = particles[i].color;
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - dist / CONNECT) * 0.18})`; ctx.lineWidth = 0.7; ctx.stroke();
        }
      }
    }
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  resize();
  particles = Array.from({ length: NUM }, () => new Particle());
  loop();
  window.addEventListener('resize', () => { resize(); particles.forEach(p => p.reset(true)); });
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  document.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });
})();

// ============================================================
// WORLD MAP + INDIA→WORLD CONNECTION ARCS (hero overlay)
// ============================================================
// (function initWorldMap() {
//   const hero = document.getElementById('hero');
//   if (!hero) return;
//   // Remove old india map canvas if any
//   const oldWrap = document.querySelector('.india-map-container');
//   if (oldWrap) oldWrap.style.display = 'none';
//   const oldHeroCanvas = document.getElementById('heroCanvas');
//   if (oldHeroCanvas) oldHeroCanvas.style.display = 'none';

//   const canvas = document.createElement('canvas');
//   canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none;';
//   hero.appendChild(canvas);
//   const ctx = canvas.getContext('2d');
//   let W, H, t = 0;

//   // Equirectangular projection helper
//   const ll = (lon, lat, w, h) => [(lon + 180) / 360 * w, (90 - lat) / 180 * h];

//   // Simplified world continent outlines [lon,lat] null=pen-up
//   const CONTINENTS = [
//     // Europe/Africa
//     [[-10,36],[0,36],[10,36],[20,35],[28,32],[34,30],[37,12],[40,5],[40,-5],[30,-18],[20,-35],[18,-34],[15,-22],[10,-5],[5,5],[0,5],[-5,5],[-15,15],[-17,20],[-10,36]],
//     // North America
//     [[-60,50],[-75,43],[-82,30],[-90,28],[-95,25],[-88,16],[-78,9],[-83,12],[-90,18],[-100,20],[-108,24],[-117,33],[-120,47],[-130,54],[-138,58],[-140,62],[-152,62],[-155,59],[-163,55],[-168,63],[-170,64],[-140,70],[-80,72],[-65,68],[-60,50]],
//     // South America
//     [[-35,-5],[-40,-10],[-50,-14],[-55,-25],[-65,-38],[-68,-52],[-70,-55],[-75,-50],[-80,-35],[-78,-5],[-75,5],[-60,5],[-50,2],[-40,-2],[-35,-5]],
//     // Asia main (rough)
//     [[26,36],[35,38],[45,38],[55,35],[60,22],[68,22],[75,22],[80,28],[85,26],[90,22],[100,12],[105,10],[110,5],[120,20],[125,22],[130,30],[138,34],[140,38],[142,42],[140,55],[130,55],[120,52],[110,50],[100,48],[90,42],[80,38],[70,36],[60,37],[48,40],[40,40],[35,36],[28,36],[26,36]],
//     // Australia
//     [[115,-32],[120,-28],[130,-18],[136,-12],[140,-14],[148,-18],[154,-24],[155,-28],[152,-34],[148,-38],[144,-38],[138,-36],[130,-32],[125,-34],[115,-34],[115,-32]],
//     // India detailed
//     [[68,23],[70,20],[72,22],[72,19],[74,17],[76,14],[78,9],[80,9],[80,8],[78,8],[80,12],[80,18],[78,20],[76,22],[74,24],[72,24],[70,24],[68,24],[67,22],[68,23]],
//   ];

//   // Key cities [lon,lat]
//   const CITIES = {
//     hyderabad: [78.47, 17.38],
//     london:    [-0.12, 51.51],
//     newyork:   [-74.0, 40.71],
//     berlin:    [13.4,  52.52],
//     singapore: [103.8, 1.35],
//     tokyo:     [139.7, 35.68],
//     sydney:    [151.2, -33.87],
//     dubai:     [55.3,  25.2],
//     moscow:    [37.6,  55.75],
//     beijing:   [116.4, 39.9],
//     nairobi:   [36.8,  -1.28],
//   };

//   // Arc state
//   const DESTS = Object.entries(CITIES).filter(([k]) => k !== 'hyderabad');
//   const arcs = DESTS.map(([name, pos], i) => ({
//     name, to: pos, from: CITIES.hyderabad,
//     prog: 0, speed: 0.0025 + Math.random() * 0.002,
//     delay: i * 55, paused: 0,
//     col: i % 3 === 0 ? [255, 107, 53] : [0, 255, 136],
//     pulse: Math.random() * Math.PI * 2,
//   }));

//   function bezierPt(ax, ay, bx, by, t) {
//     const mx = (ax + bx) / 2, my = (ay + by) / 2;
//     const dx = bx - ax, dy = by - ay;
//     const len = Math.hypot(dx, dy) || 1;
//     const lift = len * 0.32;
//     const cx = mx - (dy / len) * lift, cy = my + (dx / len) * lift;
//     return {
//       x: (1-t)*(1-t)*ax + 2*(1-t)*t*cx + t*t*bx,
//       y: (1-t)*(1-t)*ay + 2*(1-t)*t*cy + t*t*by,
//     };
//   }

//   function drawMap() {
//     ctx.lineWidth = 0.8;
//     CONTINENTS.forEach(pts => {
//       ctx.beginPath();
//       pts.forEach((p, i) => {
//         if (!p) { ctx.stroke(); ctx.beginPath(); return; }
//         const [x, y] = ll(p[0], p[1], W, H);
//         i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
//       });
//       ctx.strokeStyle = 'rgba(0,255,136,0.07)'; ctx.stroke();
//     });

//     // India highlight
//     const india = CONTINENTS[CONTINENTS.length - 1];
//     ctx.beginPath();
//     india.forEach((p, i) => {
//       if (!p) return;
//       const [x, y] = ll(p[0], p[1], W, H);
//       i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
//     });
//     ctx.closePath();
//     ctx.strokeStyle = 'rgba(255,153,51,0.55)'; ctx.lineWidth = 1.8;
//     ctx.shadowColor = 'rgba(255,153,51,0.5)'; ctx.shadowBlur = 8; ctx.stroke();
//     ctx.fillStyle = 'rgba(255,153,51,0.05)'; ctx.fill();
//     ctx.shadowBlur = 0;
//   }

//   function drawArcs() {
//     const [hx, hy] = ll(CITIES.hyderabad[0], CITIES.hyderabad[1], W, H);

//     // Hyderabad pulse
//     const pulse = Math.sin(t * 0.05) * 0.5 + 0.5;
//     for (let r = 1; r <= 3; r++) {
//       ctx.beginPath(); ctx.arc(hx, hy, 5 + r * 9 * pulse, 0, Math.PI * 2);
//       ctx.strokeStyle = `rgba(255,153,51,${0.28 - r * 0.07})`; ctx.lineWidth = 1; ctx.stroke();
//     }
//     ctx.beginPath(); ctx.arc(hx, hy, 4, 0, Math.PI * 2);
//     ctx.fillStyle = '#FF9933'; ctx.shadowColor = '#FF9933'; ctx.shadowBlur = 14; ctx.fill();
//     ctx.shadowBlur = 0;

//     arcs.forEach(arc => {
//       if (t < arc.delay) return;
//       if (arc.paused > 0) { arc.paused--; if (arc.paused === 0) { arc.prog = 0; arc.delay = t + ~~(Math.random() * 80 + 20); } return; }

//       arc.prog = Math.min(arc.prog + arc.speed, 1);
//       if (arc.prog >= 1) { arc.paused = 100; return; }

//       const [ax, ay] = ll(arc.from[0], arc.from[1], W, H);
//       const [bx, by] = ll(arc.to[0], arc.to[1], W, H);
//       const [r, g, b] = arc.col;
//       const TRAIL = 38;

//       for (let s = 0; s < TRAIL; s++) {
//         const t0 = Math.max(0, arc.prog - (s + 1) / TRAIL * 0.38);
//         const t1 = Math.max(0, arc.prog - s / TRAIL * 0.38);
//         if (t1 <= 0) break;
//         const p0 = bezierPt(ax, ay, bx, by, t0);
//         const p1 = bezierPt(ax, ay, bx, by, t1);
//         const alpha = (1 - s / TRAIL) * 0.65;
//         ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y);
//         ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`; ctx.lineWidth = 1.8 - s * 0.04; ctx.stroke();
//       }

//       const head = bezierPt(ax, ay, bx, by, arc.prog);
//       ctx.beginPath(); ctx.arc(head.x, head.y, 3, 0, Math.PI * 2);
//       ctx.fillStyle = `rgba(${r},${g},${b},0.95)`; ctx.shadowColor = `rgb(${r},${g},${b})`; ctx.shadowBlur = 10; ctx.fill();
//       ctx.shadowBlur = 0;

//       // Destination dot
//       const cp = Math.sin(t * 0.07 + arc.pulse) * 0.5 + 0.5;
//       ctx.beginPath(); ctx.arc(bx, by, 2 + cp * 3, 0, Math.PI * 2);
//       ctx.strokeStyle = `rgba(${r},${g},${b},${0.35 * arc.prog})`; ctx.lineWidth = 1; ctx.stroke();
//       ctx.beginPath(); ctx.arc(bx, by, 2, 0, Math.PI * 2);
//       ctx.fillStyle = `rgba(${r},${g},${b},${0.75 * arc.prog})`; ctx.fill();
//     });
//   }

//   function frame() {
//     ctx.clearRect(0, 0, W, H);
//     t++;
//     drawMap();
//     drawArcs();
//     requestAnimationFrame(frame);
//   }

//   function resize() {
//     W = canvas.width = canvas.offsetWidth || window.innerWidth;
//     H = canvas.height = canvas.offsetHeight || window.innerHeight;
//   }

//   window.addEventListener('resize', resize);
//   setTimeout(() => { resize(); frame(); }, 200);
// })();
(function initWorldMap() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  // ✅ Ensure hero is a positioning context
  if (getComputedStyle(hero).position === 'static') {
    hero.style.position = 'relative';
  }

  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    z-index:1;
    pointer-events:none;
  `;
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  let W = 0, H = 0, t = 0;

  // ✅ FIX: proper DPI scaling (this was a BIG issue)
  function resize() {
    const rect = hero.getBoundingClientRect();

    const dpr = window.devicePixelRatio || 1;

    W = rect.width;
    H = rect.height;

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale drawing
  }

  // projection
  const ll = (lon, lat) => [
    (lon + 180) / 360 * W,
    (90 - lat) / 180 * H
  ];

  const CONTINENTS = [
    [[-10,36],[0,36],[10,36],[20,35],[28,32],[34,30],[37,12],[40,5],[40,-5],[30,-18],[20,-35],[18,-34],[15,-22],[10,-5],[5,5],[0,5],[-5,5],[-15,15],[-17,20],[-10,36]],
    [[-60,50],[-75,43],[-82,30],[-90,28],[-95,25],[-88,16],[-78,9],[-83,12],[-90,18],[-100,20],[-108,24],[-117,33],[-120,47],[-130,54],[-138,58],[-140,62],[-152,62],[-155,59],[-163,55],[-168,63],[-170,64],[-140,70],[-80,72],[-65,68],[-60,50]],
    [[-35,-5],[-40,-10],[-50,-14],[-55,-25],[-65,-38],[-68,-52],[-70,-55],[-75,-50],[-80,-35],[-78,-5],[-75,5],[-60,5],[-50,2],[-40,-2],[-35,-5]],
    [[26,36],[35,38],[45,38],[55,35],[60,22],[68,22],[75,22],[80,28],[85,26],[90,22],[100,12],[105,10],[110,5],[120,20],[125,22],[130,30],[138,34],[140,38],[142,42],[140,55],[130,55],[120,52],[110,50],[100,48],[90,42],[80,38],[70,36],[60,37],[48,40],[40,40],[35,36],[28,36],[26,36]],
    [[115,-32],[120,-28],[130,-18],[136,-12],[140,-14],[148,-18],[154,-24],[155,-28],[152,-34],[148,-38],[144,-38],[138,-36],[130,-32],[125,-34],[115,-34],[115,-32]],
    [[68,23],[70,20],[72,22],[72,19],[74,17],[76,14],[78,9],[80,9],[80,8],[78,8],[80,12],[80,18],[78,20],[76,22],[74,24],[72,24],[70,24],[68,24],[67,22],[68,23]],
  ];

  const CITIES = {
    hyderabad: [78.47, 17.38],
    london: [-0.12, 51.51],
    newyork: [-74.0, 40.71],
    tokyo: [139.7, 35.68],
  };

  const DESTS = Object.entries(CITIES).filter(([k]) => k !== 'hyderabad');

  const arcs = DESTS.map(([name, pos], i) => ({
    to: pos,
    from: CITIES.hyderabad,
    prog: 0,
    speed: 0.003,
  }));

  function bezier(ax, ay, bx, by, t) {
    const mx = (ax + bx) / 2;
    const my = (ay + by) / 2;

    const dx = bx - ax;
    const dy = by - ay;

    const len = Math.hypot(dx, dy) || 1;
    const lift = len * 0.3;

    const cx = mx - (dy / len) * lift;
    const cy = my + (dx / len) * lift;

    return {
      x: (1-t)*(1-t)*ax + 2*(1-t)*t*cx + t*t*bx,
      y: (1-t)*(1-t)*ay + 2*(1-t)*t*cy + t*t*by
    };
  }

  function drawMap() {
    ctx.lineWidth = 1;

    CONTINENTS.forEach(pts => {
      ctx.beginPath();
      pts.forEach((p, i) => {
        const [x, y] = ll(p[0], p[1]);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.strokeStyle = 'rgba(0,255,136,0.08)';
      ctx.stroke();
    });
  }

  function drawArcs() {
    const [hx, hy] = ll(...CITIES.hyderabad);

    arcs.forEach(arc => {
      arc.prog += arc.speed;
      if (arc.prog > 1) arc.prog = 0;

      const [ax, ay] = ll(...arc.from);
      const [bx, by] = ll(...arc.to);

      const p = bezier(ax, ay, bx, by, arc.prog);

      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#00ff88';
      ctx.fill();
    });

    // origin dot
    ctx.beginPath();
    ctx.arc(hx, hy, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#FF9933';
    ctx.fill();
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    drawMap();
    drawArcs();
    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);

  resize();
  frame();
})();
// ============================================================
// SCROLL PROGRESS
// ============================================================
(function initScrollProgress() {
  const bar = $('#scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    bar.style.width = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100, 100) + '%';
  }, { passive: true });
})();

// ============================================================
// CUSTOM CURSOR
// ============================================================
(function initCursor() {
  const dot = $('#cursorDot'), ring = $('#cursorRing');
  if (!dot || !ring) return;
  let mx = -100, my = -100, rx = -100, ry = -100;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px'; });
  (function animRing() { rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(animRing); })();
  document.addEventListener('mouseover', e => { if (e.target.closest('a,button,.project-card,.ticker-card,.blog-post-item')) ring.classList.add('hovered'); });
  document.addEventListener('mouseout', e => { if (e.target.closest('a,button,.project-card,.ticker-card,.blog-post-item')) ring.classList.remove('hovered'); });
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
})();

// ============================================================
// NAVIGATION
// ============================================================
(function initNav() {
  const nav = $('#mainNav'), toggle = $('#navToggle'), links = $('#navLinks');
  if (!nav) return;
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

// ============================================================
// BOOT LOADER
// ============================================================
(function initBootLoader() {
  const loader = $('#bootLoader'), terminal = $('#bootTerminal'), bar = $('#bootBar');
  if (!loader || !terminal || !bar) return;
  const lines = [
    '[ OK ] Initializing offensive security suite...',
    '[ OK ] Loading kernel modules...',
    '[ OK ] Mounting /proc/nullspec7or...',
    '[ OK ] Routing via Hyderabad → World nodes...',
    '[ OK ] Establishing encrypted channel...',
    '[ OK ] Bypassing perimeter defenses...',
    '[ OK ] All systems nominal. Welcome.',
  ];
  let i = 0;
  const next = () => {
    if (i >= lines.length) { setTimeout(() => loader.classList.add('hidden'), 400); return; }
    const p = document.createElement('p');
    p.textContent = lines[i]; p.style.color = '#00ff88';
    terminal.appendChild(p);
    bar.style.width = ((i + 1) / lines.length * 100) + '%';
    i++; setTimeout(next, 210 + Math.random() * 140);
  };
  setTimeout(next, 350);
  setTimeout(() => loader.classList.add('hidden'), 5500);
})();

// ============================================================
// HERO TEXT — Glitch name + Typewriter
// ============================================================
(function initHeroText() {
  const nameEl = $('#heroName');
  if (nameEl) {
    const name = 'Rupesh Kumar';
    const CHARS = '!@#$%^&*[]{}|<>0123456789ABCDEF';
    nameEl.textContent = name;
    setTimeout(() => {
      let it = 0;
      const iv = setInterval(() => {
        nameEl.textContent = name.split('').map((c, i) => i < Math.floor(it / 3) ? c : CHARS[Math.floor(Math.random() * CHARS.length)]).join('');
        it++;
        if (it > name.length * 4 + 8) { clearInterval(iv); nameEl.textContent = name; }
      }, 52);
    }, 2700);
  }

  const tw = $('#heroTypewriter');
  if (tw) {
    const phrases = ['Cybersecurity Engineer','OWASP Appsec Global EU 2026 Speaker','Red Team Operator','Exploit Developer','OSCP Candidate','AD Attacker','CTF Player'];
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

// ============================================================
// STATS COUNTER
// ============================================================
(function initStats() {
  const nums = $$('[data-target]');
  if (!nums.length) return;
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

// ============================================================
// SCROLL REVEAL
// ============================================================
(function initScrollReveal() {
  const els = $$('.reveal-up,.reveal-left,.reveal-right,.reveal-card,.reveal-timeline');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
  const fills = $$('.skill-fill');
  const sObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.style.width = e.target.dataset.w + '%'; sObs.unobserve(e.target); } });
  }, { threshold: 0.2 });
  fills.forEach(el => sObs.observe(el));
})();

// ============================================================
// ACHIEVEMENTS CAROUSEL
// ============================================================
(function initCarousel() {
  const carousel = $('#achievementsCarousel'), prev = $('#achPrev'), next = $('#achNext'), dots = $('#achDots');
  if (!carousel) return;
  const slides = $$('.achievement-slide', carousel);
  let cur = 0, auto;
  slides.forEach((_, i) => { const d = document.createElement('div'); d.className = 'carousel-dot' + (i === 0 ? ' active' : ''); on(d, 'click', () => go(i)); dots.appendChild(d); });
  function go(idx) {
    cur = (idx + slides.length) % slides.length;
    carousel.style.transform = `translateX(-${cur * 100}%)`;
    $$('.carousel-dot', dots).forEach((d, i) => d.classList.toggle('active', i === cur));
    reset();
  }
  function reset() { clearInterval(auto); auto = setInterval(() => go(cur + 1), 5500); }
  on(prev, 'click', () => go(cur - 1)); on(next, 'click', () => go(cur + 1));
  let ts = 0;
  on(carousel, 'touchstart', e => { ts = e.touches[0].clientX; }, { passive: true });
  on(carousel, 'touchend', e => { if (Math.abs(ts - e.changedTouches[0].clientX) > 50) go(cur + (ts > e.changedTouches[0].clientX ? 1 : -1)); });
  reset();
})();

// ============================================================
// BLOG TICKER
// ============================================================
(function initBlogTicker() {
  const ticker = $('#blogTicker');
  if (!ticker) return;
  const kids = [...ticker.children];
  kids.forEach(c => ticker.appendChild(c.cloneNode(true)));
  kids.forEach(c => ticker.appendChild(c.cloneNode(true)));
})();

// ============================================================
// TERMINAL EASTER EGG
// ============================================================
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

function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
const escapeHtml = esc;

// ============================================================
// SMOOTH SCROLL
// ============================================================
(function() {
  $$('a[href^="#"]').forEach(a => on(a, 'click', e => {
    const t = $(a.getAttribute('href')); if (!t) return; e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' });
  }));
})();

// ============================================================
// GLITCH HOVER ON TITLES
// ============================================================
(function() {
  $$('.section-title, .hero-name').forEach(el => on(el, 'mouseenter', () => { el.classList.add('glitch-active'); setTimeout(() => el.classList.remove('glitch-active'), 500); }));
})();

// ============================================================
// BLOG SYSTEM
// ============================================================
(function initBlog() {
  if (!document.body.classList.contains('blog-page')) return;

  const POSTS = [
    'blog/kerberoasting-to-da.md',
    'blog/manual-sqli-beyond-sqlmap.md',
    'blog/wazuh-aws-archival.md',
    'blog/cve-2024-51482-zoneminder.md',
    'blog/htb-cctv-walkthrough.md',
  ];

  let allPosts = [], activePost = null;
  const blogList = $('#blogList'), blogArticle = $('#blogArticle'), emptyState = $('#blogEmptyState');
  const artHeader = $('#articleHeader'), artBody = $('#articleBody');
  const searchInput = $('#blogSearch'), tagsFilter = $('#blogTagsFilter');

  if (typeof marked !== 'undefined') {
    marked.setOptions({ gfm: true, breaks: true });
    if (typeof hljs !== 'undefined') {
      marked.setOptions({ highlight: (code, lang) => lang && hljs.getLanguage(lang) ? hljs.highlight(code, { language: lang }).value : hljs.highlightAuto(code).value });
    }
  }

  function parseFM(raw) {
    const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!m) return { meta: {}, content: raw };
    const meta = {};
    m[1].split('\n').forEach(line => {
      const sep = line.indexOf(':'); if (sep < 0) return;
      const key = line.slice(0, sep).trim(); let val = line.slice(sep + 1).trim();
      if (val.startsWith('[') && val.endsWith(']')) val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
      meta[key] = val;
    });
    return { meta, content: m[2] };
  }

  const readTime = text => Math.max(1, Math.round(text.trim().split(/\s+/).length / 200)) + ' min read';

  async function loadPosts() {
    if (blogList) blogList.innerHTML = '<div class="blog-list-skeleton"><div class="skeleton-item"></div><div class="skeleton-item"></div><div class="skeleton-item"></div></div>';
    const res = await Promise.allSettled(POSTS.map(p => fetch(p).then(r => { if (!r.ok) throw 0; return r.text(); }).then(text => ({ p, text }))));
    allPosts = res.filter(r => r.status === 'fulfilled').map(r => {
      const { p, text } = r.value, { meta, content } = parseFM(text);
      return { path: p, slug: p.replace('blog/', '').replace('.md', ''), title: meta.title || 'Untitled', date: meta.date || '', tags: Array.isArray(meta.tags) ? meta.tags : (meta.tags ? [meta.tags] : []), thumbnail: meta.thumbnail || null, content, readTime: readTime(content) };
    });
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (!allPosts.length) { if (blogList) blogList.innerHTML = '<p style="padding:24px;color:var(--muted);font-family:var(--font-mono);font-size:12px;text-align:center">No posts found.</p>'; return; }
    buildTags(); renderList(allPosts); if (allPosts.length) showPost(allPosts[0]);
  }

  function buildTags() {
    if (!tagsFilter) return;
    const tags = new Set(); allPosts.forEach(p => p.tags.forEach(t => tags.add(t)));
    tagsFilter.innerHTML = '<button class="tag-filter active" data-tag="all">All</button>';
    tags.forEach(tag => { const b = document.createElement('button'); b.className = 'tag-filter'; b.dataset.tag = tag; b.textContent = tag; on(b, 'click', () => filterTag(tag)); tagsFilter.appendChild(b); });
    on($('[data-tag="all"]', tagsFilter), 'click', () => filterTag('all'));
  }

  function filterTag(tag) {
    $$('.tag-filter', tagsFilter).forEach(b => b.classList.toggle('active', b.dataset.tag === tag));
    renderList(tag === 'all' ? allPosts : allPosts.filter(p => p.tags.includes(tag)));
  }

  function renderList(posts) {
    if (!blogList) return;
    blogList.innerHTML = '';
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
            ${post.tags.slice(0, 2).map(t => `<span class="post-tag">${esc(t)}</span>`).join('')}
            <span class="post-readtime">${post.readTime}</span>
          </div>
        </div>`;
      on(item, 'click', () => showPost(post));
      blogList.appendChild(item);
    });
  }

  function showPost(post) {
    activePost = post;
    $$('.blog-post-item').forEach(item => { const t = item.querySelector('.post-title'); item.classList.toggle('active', t && t.textContent === post.title); });
    if (emptyState) emptyState.style.display = 'none';
    if (!blogArticle) return;
    blogArticle.style.display = 'block'; blogArticle.style.animation = 'none';
    if (artHeader) artHeader.innerHTML = `<span class="article-date">${post.date}</span><h1>${esc(post.title)}</h1><div class="article-tags">${post.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div><span class="article-readtime">⏱ ${post.readTime}</span>`;
    if (artBody) {
      artBody.innerHTML = typeof marked !== 'undefined' ? marked.parse(post.content) : `<pre>${esc(post.content)}</pre>`;
      if (typeof hljs !== 'undefined') $$('pre code', artBody).forEach(b => hljs.highlightElement(b));
    }
    requestAnimationFrame(() => { blogArticle.style.animation = 'fadeInUp 0.45s ease'; });
    if (blogArticle.parentElement) blogArticle.parentElement.scrollTop = 0;
  }

  if (searchInput) on(searchInput, 'input', () => { const q = searchInput.value.toLowerCase().trim(); renderList(q ? allPosts.filter(p => p.title.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q))) : allPosts); });

  loadPosts();
})();