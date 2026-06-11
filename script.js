/* ================================================================
   NullSpec7or Portfolio v2.0 — script.js
   Self-contained: no CDN deps, everything packed in.
   ================================================================ */

/* ---- MINI MARKDOWN PARSER (no external lib) ---- */
const MD = (() => {
  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function inlineParse(s) {
    return s
      .replace(/`([^`]+)`/g,'<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g,'<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<img src="$2" alt="$1" loading="lazy">');
  }
  function parse(md) {
    const lines = md.split('\n');
    let html = '';
    let inCode = false, codeLang = '', codeLines = [];
    let inTable = false, tableRows = [];
    let inList = false, listLines = [];
    let inBlockquote = false, bqLines = [];

    function flushList() {
      if (!inList) return;
      html += '<ul>' + listLines.map(l=>`<li>${inlineParse(l)}</li>`).join('') + '</ul>';
      listLines = []; inList = false;
    }
    function flushTable() {
      if (!inTable) return;
      let t = '<table>';
      tableRows.forEach((r,i) => {
        if (i===1) return; // separator
        const cells = r.split('|').filter((c,j,a)=>j>0&&j<a.length-1);
        const tag = i===0 ? 'th' : 'td';
        t += '<tr>' + cells.map(c=>`<${tag}>${inlineParse(c.trim())}</${tag}>`).join('') + '</tr>';
      });
      t += '</table>';
      html += t; tableRows = []; inTable = false;
    }
    function flushBq() {
      if (!inBlockquote) return;
      html += '<blockquote>' + bqLines.join(' ') + '</blockquote>';
      bqLines = []; inBlockquote = false;
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // code block
      if (line.startsWith('```')) {
        if (!inCode) {
          flushList(); flushTable(); flushBq();
          codeLang = line.slice(3).trim() || 'bash';
          inCode = true; codeLines = [];
        } else {
          const code = codeLines.map(escHtml).join('\n');
          html += `<pre><div class="pre-header"><span class="lang-label">${codeLang.toUpperCase()}</span><button class="copy-btn" onclick="copyCode(this)">COPY</button></div><code>${code}</code></pre>`;
          inCode = false; codeLines = [];
        }
        continue;
      }
      if (inCode) { codeLines.push(line); continue; }

      // table
      if (line.includes('|')) {
        flushList(); flushBq();
        inTable = true; tableRows.push(line); continue;
      } else { flushTable(); }

      // blockquote
      if (line.startsWith('> ')) {
        flushList();
        inBlockquote = true; bqLines.push(inlineParse(line.slice(2))); continue;
      } else { flushBq(); }

      // list
      if (/^[-*] /.test(line)) {
        flushTable();
        inList = true; listLines.push(line.slice(2)); continue;
      } else if (/^\d+\. /.test(line)) {
        flushList();
        html += `<li>${inlineParse(line.replace(/^\d+\. /,''))}</li>`;
        continue;
      } else { flushList(); }

      // headings
      if (/^#{1,6} /.test(line)) {
        const m = line.match(/^(#{1,6}) (.+)/);
        const lvl = m[1].length;
        html += `<h${lvl}>${inlineParse(m[2])}</h${lvl}>`;
        continue;
      }
      // hr
      if (/^---+$/.test(line.trim())) { html += '<hr>'; continue; }
      // empty
      if (!line.trim()) continue;
      // paragraph
      html += `<p>${inlineParse(line)}</p>`;
    }
    flushList(); flushTable(); flushBq();
    if (inCode) html += `<pre><code>${codeLines.map(escHtml).join('\n')}</code></pre>`;
    return html;
  }
  return { parse };
})();

window.copyCode = function(btn) {
  const code = btn.closest('pre').querySelector('code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = 'COPIED!';
    setTimeout(() => btn.textContent = 'COPY', 1800);
  });
};

/* ---- FRONTMATTER PARSER ---- */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { meta: {}, content: raw };
  const block = match[1];
  const meta = {};
  block.split('\n').forEach(line => {
    const [k, ...v] = line.split(':');
    if (k && v.length) {
      let val = v.join(':').trim();
      if (val.startsWith('[') && val.endsWith(']')) {
        val = val.slice(1,-1).split(',').map(t=>t.trim().replace(/['"]/g,''));
      } else {
        val = val.replace(/^["']|["']$/g,'');
      }
      meta[k.trim()] = val;
    }
  });
  const content = raw.slice(match[0].length).trim();
  return { meta, content };
}

/* ---- BLOG POSTS REGISTRY ----
   Adding a new post = add one entry here + create the .md file.
   Everything else is automatic.
*/
const BLOG_POSTS = [
  { file:'blog/Template.md', slug:'Template-of-blog' },
  
];

/* ---- MINI SVG COVER GENERATOR ---- */
// Generates unique deterministic canvas art for each post as cover image
function generateCoverCanvas(canvas, seed, tags=[]) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  // Seeded random
  let s = seed;
  const rand = () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };

  const colors = {
    'Active Directory': ['#00ff88','#004422'],
    'Web Security': ['#4d9eff','#001133'],
    'CVE': ['#ff3355','#330011'],
    'HTB': ['#a855f7','#1a0033'],
    'SIEM': ['#00d4ff','#001122'],
    'Red Team': ['#ff6b35','#221100'],
    'Exploit Dev': ['#ff3355','#220011'],
    'default': ['#00ff88','#060a0c'],
  };
  const primaryTag = tags.find(t => colors[t]) || 'default';
  const [accent, dark] = colors[primaryTag] || colors.default;

  // Background
  const grd = ctx.createLinearGradient(0,0,W,H);
  grd.addColorStop(0, '#060a0c');
  grd.addColorStop(0.5, dark);
  grd.addColorStop(1, '#060a0c');
  ctx.fillStyle = grd;
  ctx.fillRect(0,0,W,H);

  // Grid
  ctx.strokeStyle = accent + '18';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  for (let y = 0; y < H; y += 32) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

  // Particles / nodes
  for (let i = 0; i < 20; i++) {
    const x = rand()*W, y = rand()*H, r = rand()*3+1;
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fillStyle = accent + Math.floor(rand()*128+64).toString(16).padStart(2,'0');
    ctx.fill();
  }
  // Connections
  const nodes = Array.from({length:8},()=>({x:rand()*W,y:rand()*H}));
  nodes.forEach((a,i) => {
    nodes.forEach((b,j) => {
      if (j<=i) return;
      const dist = Math.hypot(a.x-b.x,a.y-b.y);
      if (dist < 180) {
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
        ctx.strokeStyle = accent + '30'; ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    });
  });
  // Glow circle
  const cx = rand()*W*0.4+W*0.3, cy = rand()*H*0.4+H*0.3;
  const radGrd = ctx.createRadialGradient(cx,cy,0,cx,cy,Math.min(W,H)*0.4);
  radGrd.addColorStop(0, accent+'28');
  radGrd.addColorStop(1,'transparent');
  ctx.fillStyle = radGrd; ctx.fillRect(0,0,W,H);

  // Scanlines
  for (let y=0;y<H;y+=4) {
    ctx.fillStyle='rgba(0,0,0,0.12)';
    ctx.fillRect(0,y,W,2);
  }
}

/* ---- READ TIME CALCULATOR ---- */
function calcReadTime(md) {
  const words = md.replace(/```[\s\S]*?```/g,'').replace(/[#*`>_]/g,'').split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/* ---- GLOBAL CANVAS BACKGROUND ---- */
function initGlobalBg() {
  const canvas = document.getElementById('globalBg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], connections = [];

  const resize = () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  // Particle system
  const N = Math.min(60, Math.floor(W*H/20000));
  for (let i=0;i<N;i++) {
    particles.push({
      x: Math.random()*W, y: Math.random()*H,
      vx:(Math.random()-0.5)*0.3, vy:(Math.random()-0.5)*0.3,
      r: Math.random()*2+0.5,
      pulse: Math.random()*Math.PI*2,
      type: Math.random()<0.1?'big':'dot'
    });
  }

  let mouseX=W/2, mouseY=H/2;
  document.addEventListener('mousemove',e=>{mouseX=e.clientX;mouseY=e.clientY});

  let frame=0;
  const loop = () => {
    ctx.clearRect(0,0,W,H);
    frame++;

    // Draw hex grid faintly
    ctx.strokeStyle='rgba(0,255,136,0.025)';
    ctx.lineWidth=0.5;
    const hSize=60;
    for(let col=-1;col<Math.ceil(W/(hSize*1.73))+1;col++){
      for(let row=-1;row<Math.ceil(H/hSize)+1;row++){
        const x=col*hSize*1.73+(row%2)*hSize*0.865;
        const y=row*hSize*1.5;
        ctx.beginPath();
        for(let k=0;k<6;k++){
          const angle=k*Math.PI/3-Math.PI/6;
          const px=x+hSize*Math.cos(angle);
          const py=y+hSize*Math.sin(angle);
          k===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
        }
        ctx.closePath();ctx.stroke();
      }
    }

    // Particles
    particles.forEach(p => {
      p.x+=p.vx; p.y+=p.vy; p.pulse+=0.02;
      if(p.x<0)p.x=W; if(p.x>W)p.x=0;
      if(p.y<0)p.y=H; if(p.y>H)p.y=0;
      // Mouse influence
      const dx=mouseX-p.x, dy=mouseY-p.y, dist=Math.hypot(dx,dy);
      if(dist<200){p.vx+=dx*0.00005;p.vy+=dy*0.00005;}
      p.vx*=0.999; p.vy*=0.999;
      const alpha=0.3+0.2*Math.sin(p.pulse);
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,255,136,${alpha})`;
      ctx.fill();
      if(p.type==='big'){
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r*3,0,Math.PI*2);
        ctx.strokeStyle=`rgba(0,255,136,${alpha*0.3})`;
        ctx.lineWidth=0.5; ctx.stroke();
      }
    });

    // Connections
    particles.forEach((a,i)=>{
      particles.forEach((b,j)=>{
        if(j<=i) return;
        const dist=Math.hypot(a.x-b.x,a.y-b.y);
        if(dist<120){
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
          ctx.strokeStyle=`rgba(0,255,136,${(1-dist/120)*0.15})`;
          ctx.lineWidth=0.5; ctx.stroke();
        }
      });
    });

    // Flowing binary rain (subtle)
    if(frame%3===0){
      ctx.fillStyle='rgba(0,255,136,0.06)';
      ctx.font='10px Share Tech Mono, monospace';
      const col=Math.floor(Math.random()*Math.floor(W/14));
      const y=Math.floor(Math.random()*H);
      ctx.fillText(Math.random()<0.5?'0':'1',col*14,y);
    }

    requestAnimationFrame(loop);
  };
  loop();
}

/* ---- BOOT LOADER ---- */
function initBoot() {
  const loader = document.getElementById('bootLoader');
  if (!loader) return;
  const term = document.getElementById('bootTerminal');
  const bar = document.getElementById('bootBar');
  if (!term || !bar) { loader.classList.add('hidden'); return; }

  const lines = [
    '> Initializing NullSpec7or OS...',
    '> Loading exploit modules... [OK]',
    '> Mounting /dev/red_team... [OK]',
    '> Checking BloodHound paths... [OK]',
    '> Scanning attack surface... [OK]',
    '> OSCP prep: 73% complete',
    '> Spawning shell... root@nullspec7or:~#',
  ];
  let i=0, w=0;
  const addLine = () => {
    if(i>=lines.length){ setTimeout(()=>loader.classList.add('hidden'),600); return; }
    const p=document.createElement('p');
    p.textContent=lines[i++];
    term.appendChild(p);
    term.scrollTop=term.scrollHeight;
    w=Math.min(100,(i/lines.length)*100);
    bar.style.width=w+'%';
    setTimeout(addLine, 200+Math.random()*200);
  };
  setTimeout(addLine,300);
}

/* ---- CURSOR ---- */
function initCursor() {
  const dot=document.getElementById('cursorDot');
  const ring=document.getElementById('cursorRing');
  if(!dot||!ring) return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
  document.addEventListener('mousedown',()=>ring.classList.add('clicking'));
  document.addEventListener('mouseup',()=>ring.classList.remove('clicking'));
  const links=()=>document.querySelectorAll('a,button,.blog-list-item,.ticker-card,.project-card,.contact-item,.carousel-btn,.tag-filter');
  document.addEventListener('mouseover',e=>{
    if([...links()].some(el=>el===e.target||el.contains(e.target))) ring.classList.add('hovered');
  });
  document.addEventListener('mouseout',e=>{
    if([...links()].some(el=>el===e.target||el.contains(e.target))) ring.classList.remove('hovered');
  });
  const move=()=>{
    dot.style.left=mx+'px'; dot.style.top=my+'px';
    rx+=(mx-rx)*0.12; ry+=(my-ry)*0.12;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(move);
  };
  move();
}

/* ---- SCROLL PROGRESS ---- */
function initScrollProgress() {
  const bar=document.getElementById('scrollProgress');
  if(!bar) return;
  const update=()=>{
    const scrolled=document.documentElement.scrollTop;
    const total=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.width=(total>0?scrolled/total*100:0)+'%';
  };
  window.addEventListener('scroll',update,{passive:true});
}

/* ---- NAV ---- */
function initNav() {
  const nav=document.getElementById('mainNav');
  const toggle=document.getElementById('navToggle');
  const links=document.getElementById('navLinks');
  if(!nav) return;
  window.addEventListener('scroll',()=>{
    nav.classList.toggle('scrolled',window.scrollY>40);
  },{passive:true});
  toggle?.addEventListener('click',()=>links?.classList.toggle('open'));
  links?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
}

/* ---- TYPEWRITER ---- */
function initTypewriter() {
  const el=document.getElementById('heroTypewriter');
  const name=document.getElementById('heroName');
  if(!el) return;
  const roles=['exploit developer','red teamer','AD attacker','vuln researcher','CTF player','OSCP candidate'];
  let ri=0,ci=0,del=false;
  const type=()=>{
    const s=roles[ri];
    el.textContent=del?s.slice(0,ci):s.slice(0,ci);
    if(!del){if(ci<s.length){ci++;setTimeout(type,80);}else{del=true;setTimeout(type,1800);}}
    else{if(ci>0){ci--;setTimeout(type,40);}else{del=false;ri=(ri+1)%roles.length;setTimeout(type,300);}}
  };
  setTimeout(type,2000);
  if(name){
    setInterval(()=>{
      if(Math.random()<0.02){name.classList.add('glitch-active');setTimeout(()=>name.classList.remove('glitch-active'),500);}
    },3000);
  }
}

/* ---- COUNTER ANIMATION ---- */
function initCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el=>{
    const target=+el.dataset.target, dur=1800;
    const obs=new IntersectionObserver(entries=>{
      if(!entries[0].isIntersecting) return;
      obs.disconnect();
      let start=null;
      const step=ts=>{
        if(!start) start=ts;
        const pct=Math.min((ts-start)/dur,1);
        const ease=1-Math.pow(1-pct,3);
        el.textContent=Math.floor(ease*target)+(pct<1?'':'+');
        if(pct<1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    obs.observe(el);
  });
}

/* ---- REVEAL ON SCROLL ---- */
function initReveals() {
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting) e.target.classList.add('visible')});
  },{threshold:0.12});
  document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right,.reveal-card,.reveal-timeline').forEach(el=>obs.observe(el));
}

/* ---- SKILL BARS ---- */
function initSkillBars() {
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      e.target.querySelectorAll('.skill-fill[data-w]').forEach(bar=>{
        setTimeout(()=>{bar.style.width=bar.dataset.w+'%';},200);
      });
      obs.unobserve(e.target);
    });
  },{threshold:0.2});
  document.querySelectorAll('.about-skills').forEach(el=>obs.observe(el));
}

/* ---- CAROUSEL ---- */
function initCarousel() {
  const carousel=document.getElementById('achievementsCarousel');
  const dotsWrap=document.getElementById('achDots');
  const prev=document.getElementById('achPrev');
  const next=document.getElementById('achNext');
  if(!carousel||!dotsWrap) return;
  const slides=carousel.querySelectorAll('.achievement-slide');
  let cur=0;
  const perView=()=>window.innerWidth<700?1:2;
  const total=()=>Math.ceil(slides.length/perView());
  const dots=[];
  for(let i=0;i<total();i++){
    const d=document.createElement('div');
    d.className='carousel-dot'+(i===0?' active':'');
    d.addEventListener('click',()=>go(i));
    dotsWrap.appendChild(d); dots.push(d);
  }
  const go=idx=>{
    cur=Math.max(0,Math.min(idx,total()-1));
    carousel.style.transform=`translateX(calc(-${cur}*(50% + 12px)))`;
    dots.forEach((d,i)=>d.classList.toggle('active',i===cur));
  };
  prev?.addEventListener('click',()=>go(cur-1));
  next?.addEventListener('click',()=>go(cur+1));
  let autoInt=setInterval(()=>go((cur+1)%total()),5000);
  carousel.addEventListener('mouseenter',()=>clearInterval(autoInt));
  carousel.addEventListener('mouseleave',()=>{autoInt=setInterval(()=>go((cur+1)%total()),5000);});
}

/* ---- TERMINAL EASTER EGG ---- */
function initEasterEgg() {
  const trig=document.getElementById('eeTrigger');
  const egg=document.getElementById('easterEgg');
  const close=document.getElementById('eeClose');
  const input=document.getElementById('eeInput');
  const hist=document.getElementById('eeHistory');
  if(!trig||!egg) return;

  const toggle=()=>egg.classList.toggle('open');
  trig.addEventListener('click',toggle);
  close?.addEventListener('click',()=>egg.classList.remove('open'));

  const cmds={
    help:()=>'Available: whoami · skills · blog · contact · clear · flag · nmap · ps · ifconfig · uname · date · sudo su',
    whoami:()=>'nullspec7or',
    skills:()=>'> Active Directory · Web Pentesting · Exploit Dev · Wazuh SIEM · Cloud Security (AWS)',
    blog:()=>'> 5 posts available. Categories: AD, Web Security, CVE, HTB, SIEM. Type "ls blog/" to list.',
    'ls blog/':()=>BLOG_POSTS.map(p=>p.file).join('\n'),
    contact:()=>'> Email: nullspec7or@gmail.com\n> GitHub: github.com/nullspec7or\n> LinkedIn: linkedin.com/in/nullspec7or',
    clear:()=>{ hist.innerHTML=''; return null; },
    flag:()=>'HTB{n0t_th15_34sy_n00b}',
    nmap:()=>'Starting Nmap 7.94 ...\nNmap scan report for portfolio.nullspec7or.io\nPORT   STATE SERVICE\n80/tcp open  http\n443/tcp open  https\nOS: Arch Linux (offensive edition)',
    ps:()=>'  PID TTY  TIME CMD\n 1337 pts/0 00:00:01 bash\n 3141 pts/0 00:00:00 exploit.py\n 9999 pts/0 00:00:03 bloodhound\n31337 pts/0 00:00:00 ps',
    ifconfig:()=>'tun0: flags=4305 mtu 1500\n  inet 10.10.14.X  netmask 255.255.254.0\n  unspec 00-00-00-00-00-00-00-00\neth0: flags=4163 mtu 1500\n  inet 192.168.1.X',
    uname:()=>'Linux kali 6.3.0-kali1-amd64 #1 SMP PREEMPT x86_64 GNU/Linux',
    date:()=>new Date().toString(),
    'sudo su':()=>'[sudo] password for nullspec7or: ****\nroot@nullspec7or:~#  Welcome back, boss.',
  };

  const prompt=()=>`<span style="color:#00ff88">nullspec7or@kali</span><span style="color:#fff">:</span><span style="color:#4d9eff">~</span><span style="color:#fff">$ </span>`;

  input?.addEventListener('keydown',e=>{
    if(e.key!=='Enter') return;
    const cmd=input.value.trim(); input.value='';
    if(!cmd) return;
    const p=document.createElement('p');
    p.innerHTML=prompt()+`<span style="color:#fff">${cmd}</span>`;
    hist.appendChild(p);
    const fn=cmds[cmd]||(()=>`bash: ${cmd}: command not found`);
    const out=fn();
    if(out!==null){
      out.split('\n').forEach(line=>{
        const op=document.createElement('p');
        op.style.color='#9fc'; op.style.paddingLeft='8px'; op.textContent=line;
        hist.appendChild(op);
      });
    }
    hist.scrollTop=hist.scrollHeight;
  });

  // Keyboard shortcut: Ctrl+`
  document.addEventListener('keydown',e=>{
    if(e.ctrlKey&&e.key==='`'){e.preventDefault();toggle();input?.focus();}
  });
}

/* ---- BLOG TICKER on index page ---- */
async function initBlogTicker() {
  const ticker=document.getElementById('blogTicker');
  if(!ticker) return;
  ticker.innerHTML='';

  const tagColors = {
    'Active Directory':'#00ff88','Red Team':'#00ff88',
    'Web Security':'#4d9eff','SQL Injection':'#4d9eff','OSCP':'#4d9eff',
    'CVE':'#ff3355','Exploit Dev':'#ff3355',
    'HTB':'#a855f7','Privilege Escalation':'#a855f7',
    'SIEM':'#00d4ff','Wazuh':'#00d4ff','AWS':'#00d4ff','Blue Team':'#00d4ff',
  };

  const posts = await loadAllPosts();
  posts.forEach(post => {
    const card=document.createElement('a');
    card.className='ticker-card';
    card.href=`blog.html#${post.slug}`;

    // Canvas cover
    const canvasId='tc-'+post.slug;
    const seed=post.slug.split('').reduce((a,c)=>a+c.charCodeAt(0),0);
    const firstTag=Array.isArray(post.tags)?post.tags[0]:post.tags;
    const tagColor=tagColors[firstTag]||'#00ff88';

    card.innerHTML=`
      <div class="ticker-thumb" style="background:#060a0c">
        <canvas id="${canvasId}" width="300" height="140"></canvas>
      </div>
      <div class="ticker-info">
        <span class="ticker-tag">${firstTag||'INTEL'}</span>
        <h4>${post.title}</h4>
        <div class="ticker-meta">${post.readTime} min read · ${formatDate(post.date)}</div>
        <div class="ticker-tags">${(Array.isArray(post.tags)?post.tags:[post.tags]).slice(0,3).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      </div>`;
    ticker.appendChild(card);
    // Render cover canvas after DOM is attached
    requestAnimationFrame(()=>{
      const cv=document.getElementById(canvasId);
      if(cv) generateCoverCanvas(cv,seed,Array.isArray(post.tags)?post.tags:[post.tags]);
    });
  });

  // Auto-scroll animation
  let scrollX=0;
  const autoScroll=()=>{
    if(!ticker.matches(':hover')){
      scrollX+=0.5;
      if(scrollX>ticker.scrollWidth-ticker.clientWidth) scrollX=0;
      ticker.scrollLeft=scrollX;
    }
    requestAnimationFrame(autoScroll);
  };
  requestAnimationFrame(autoScroll);
}

/* ---- LOAD ALL POSTS ---- */
async function loadAllPosts() {
  const fetched = await Promise.all(
    BLOG_POSTS.map(async ({file,slug})=>{
      try{
        const r=await fetch(file);
        if(!r.ok) throw new Error(r.status);
        const raw=await r.text();
        const {meta,content}=parseFrontmatter(raw);
        return {
          slug,
          title: meta.title||slug.replace(/-/g,' '),
          date: meta.date||'',
          tags: Array.isArray(meta.tags)?meta.tags:(typeof meta.tags==='string'?meta.tags.split(',').map(t=>t.trim()):[]),
          readTime: calcReadTime(content),
          content,
          raw,
        };
      }catch(e){
        console.warn('Could not load',file,e);
        return null;
      }
    })
  );
  return fetched.filter(Boolean).sort((a,b)=>new Date(b.date)-new Date(a.date));
}

function formatDate(d){
  if(!d) return '';
  try{ return new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}); }
  catch(e){ return d; }
}

/* ---- BLOG PAGE ENGINE ---- */
async function initBlogPage() {
  if(!document.body.classList.contains('blog-page')) return;

  const listEl=document.getElementById('blogList');
  const tagsEl=document.getElementById('blogTagsFilter');
  const searchEl=document.getElementById('blogSearch');
  const article=document.getElementById('blogArticle');
  const header=document.getElementById('articleHeader');
  const body=document.getElementById('articleBody');
  const empty=document.getElementById('blogEmptyState');
  const postCountEl=document.getElementById('postCount');

  if(!listEl) return;
  listEl.innerHTML='<div class="blog-list-skeleton"><div class="skeleton-item"></div><div class="skeleton-item"></div><div class="skeleton-item"></div></div>';

  const posts=await loadAllPosts();
  if(postCountEl) postCountEl.textContent=`${posts.length} post${posts.length!==1?'s':''}`;

  // Collect all unique tags
  const allTags=new Set();
  posts.forEach(p=>(Array.isArray(p.tags)?p.tags:[p.tags]).forEach(t=>t&&allTags.add(t)));

  // Render tag filters
  allTags.forEach(tag=>{
    const btn=document.createElement('button');
    btn.className='tag-filter'; btn.dataset.tag=tag; btn.textContent=tag;
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.tag-filter').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderList(filterPosts());
    });
    tagsEl.appendChild(btn);
  });

  const filterPosts=()=>{
    const q=(searchEl?.value||'').toLowerCase();
    const activeTag=document.querySelector('.tag-filter.active')?.dataset.tag||'all';
    return posts.filter(p=>{
      const tags=Array.isArray(p.tags)?p.tags:[p.tags];
      const matchTag=activeTag==='all'||tags.includes(activeTag);
      const matchQ=!q||p.title.toLowerCase().includes(q)||tags.some(t=>t.toLowerCase().includes(q));
      return matchTag&&matchQ;
    });
  };

  let activeSlug=null;

  const renderList=(filtered)=>{
    listEl.innerHTML='';
    if(!filtered.length){
      listEl.innerHTML='<p style="padding:20px;font-family:var(--font-mono);font-size:12px;color:var(--muted)">No posts match.</p>';
      return;
    }
    filtered.forEach(p=>{
      const item=document.createElement('div');
      item.className='blog-list-item'+(p.slug===activeSlug?' active':'');
      item.dataset.slug=p.slug;
      const tags=Array.isArray(p.tags)?p.tags:[p.tags];
      item.innerHTML=`
        <span class="bli-tag">${tags[0]||''}</span>
        <div class="bli-title">${p.title}</div>
        <div class="bli-meta">
          <span class="bli-read-time">${p.readTime} min</span>
          <span>${formatDate(p.date)}</span>
        </div>`;
      item.addEventListener('click',()=>openPost(p.slug));
      listEl.appendChild(item);
    });
  };

  const openPost=(slug)=>{
    activeSlug=slug;
    const post=posts.find(p=>p.slug===slug);
    if(!post) return;
    document.querySelectorAll('.blog-list-item').forEach(el=>el.classList.toggle('active',el.dataset.slug===slug));
    empty.style.display='none';
    article.style.display='block';

    const tags=Array.isArray(post.tags)?post.tags:[post.tags];
    const seed=slug.split('').reduce((a,c)=>a+c.charCodeAt(0),0);
    const coverCanvasId='cover-'+slug;

    header.innerHTML=`
      <div class="art-meta-row">
        ${tags.map(t=>`<span class="art-tag">${t}</span>`).join('')}
        <span class="art-date">${formatDate(post.date)}</span>
        <span class="art-readtime">⏱ ${post.readTime} min read</span>
      </div>
      <h1 class="article-title">${post.title}</h1>
      <div class="art-cover"><canvas id="${coverCanvasId}" width="900" height="300"></canvas></div>`;

    body.innerHTML=MD.parse(post.content);
    // Render cover
    requestAnimationFrame(()=>{
      const cv=document.getElementById(coverCanvasId);
      if(cv) generateCoverCanvas(cv,seed,tags);
    });

    // Syntax highlight - very basic
    body.querySelectorAll('pre code').forEach(block=>{
      const text=block.textContent;
      block.innerHTML=syntaxHighlight(text,block.closest('pre').querySelector('.lang-label')?.textContent?.toLowerCase()||'');
    });

    // Scroll to top of content area
    const area=document.getElementById('blogContentArea');
    if(area) area.scrollTop=0;

    // Update URL hash
    history.pushState(null,'','#'+slug);
  };

  // Open post from hash
  const hashSlug=location.hash.slice(1);
  renderList(posts);
  if(hashSlug&&posts.find(p=>p.slug===hashSlug)) openPost(hashSlug);

  searchEl?.addEventListener('input',()=>renderList(filterPosts()));
  document.querySelector('.tag-filter[data-tag="all"]')?.addEventListener('click',()=>{
    document.querySelectorAll('.tag-filter').forEach(b=>b.classList.remove('active'));
    document.querySelector('.tag-filter[data-tag="all"]').classList.add('active');
    renderList(filterPosts());
  });

  // OG/Twitter meta for sharing
  if(hashSlug){
    const p=posts.find(x=>x.slug===hashSlug);
    if(p){
      setOgMeta(p.title,Array.isArray(p.tags)?p.tags.join(', '):p.tags,p.slug);
    }
  }
}

function setOgMeta(title,desc,slug){
  const setMeta=(prop,content,isOg=true)=>{
    const attr=isOg?'property':'name';
    let el=document.querySelector(`meta[${attr}="${prop}"]`);
    if(!el){el=document.createElement('meta');el.setAttribute(attr,prop);document.head.appendChild(el);}
    el.setAttribute('content',content);
  };
  setMeta('og:title',title); setMeta('twitter:title',title,false);
  setMeta('og:description',desc); setMeta('twitter:description',desc,false);
  // Use generated SVG data-URL as og:image
  const svgImg=generateOgSvg(title,desc);
  setMeta('og:image',svgImg); setMeta('twitter:image',svgImg,false);
  setMeta('twitter:card','summary_large_image',false);
  document.title=title+' | nullspec7or';
}

function generateOgSvg(title,tags){
  // Returns a data: URI of an SVG that looks like a nice OG thumbnail
  const escaped=title.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const tagStr=(tags||'').substring(0,40);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#060a0c"/>
      <stop offset="100%" stop-color="#0a1a12"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <!-- Grid lines -->
  <g stroke="#00ff88" stroke-width="0.5" opacity="0.08">
    ${Array.from({length:20},(_,i)=>`<line x1="${i*60}" y1="0" x2="${i*60}" y2="630"/>`).join('')}
    ${Array.from({length:11},(_,i)=>`<line x1="0" y1="${i*63}" x2="1200" y2="${i*63}"/>`).join('')}
  </g>
  <!-- Border -->
  <rect x="20" y="20" width="1160" height="590" fill="none" stroke="#00ff88" stroke-width="1" opacity="0.2" rx="8"/>
  <!-- Logo hex -->
  <polygon points="100,80 140,58 180,80 180,124 140,146 100,124" fill="none" stroke="#00ff88" stroke-width="2" opacity="0.8"/>
  <text x="140" y="120" text-anchor="middle" fill="#00ff88" font-family="monospace" font-size="28" font-weight="bold">RK</text>
  <!-- Handle -->
  <text x="210" y="105" fill="#00ff88" font-family="monospace" font-size="20" opacity="0.7">nullspec7or</text>
  <!-- Title -->
  <text x="80" y="300" fill="#f0f6ff" font-family="Arial Black, sans-serif" font-size="44" font-weight="900">${escaped.length>40?escaped.substring(0,40)+'...':escaped}</text>
  ${escaped.length>40?`<text x="80" y="360" fill="#f0f6ff" font-family="Arial Black, sans-serif" font-size="44" font-weight="900">${escaped.substring(40,80)}</text>`:''}
  <!-- Tags -->
  <text x="80" y="440" fill="#00ff88" font-family="monospace" font-size="22" opacity="0.8">${tagStr}</text>
  <!-- Domain -->
  <text x="80" y="570" fill="#56708a" font-family="monospace" font-size="18">nullspec7or.github.io</text>
  <!-- Glow circle -->
  <circle cx="1050" cy="315" r="200" fill="radial-gradient" opacity="0.04" fill="none" stroke="#00ff88" stroke-width="0.5"/>
</svg>`;
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}

/* ---- VERY BASIC SYNTAX HIGHLIGHTER ---- */
function syntaxHighlight(code, lang){
  const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  let s=esc(code);
  if(['bash','sh','shell'].includes(lang)){
    s=s.replace(/(#.*)$/gm,'<span style="color:#56708a">$1</span>');
    s=s.replace(/\b(sudo|apt|pip|npm|git|curl|wget|echo|cat|ls|cd|mkdir|rm|cp|mv|chmod|chown|grep|awk|sed|nmap|hashcat|impacket|python3?|bash|sh)\b/g,'<span style="color:#00d4ff">$1</span>');
    s=s.replace(/(["'])([^"']*)\1/g,'<span style="color:#ff6b35">$1$2$1</span>');
  }
  if(['python','py'].includes(lang)){
    s=s.replace(/(#.*)$/gm,'<span style="color:#56708a">$1</span>');
    s=s.replace(/\b(def|class|import|from|return|if|else|elif|for|while|in|not|and|or|True|False|None|print|with|as|try|except|raise|pass|lambda|yield)\b/g,'<span style="color:#a855f7">$1</span>');
    s=s.replace(/(["'])([^"']*)\1/g,'<span style="color:#ff6b35">$1$2$1</span>');
  }
  if(['sql'].includes(lang)){
    s=s.replace(/\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|JOIN|ON|AND|OR|NOT|NULL|UNION|ALL|ORDER BY|GROUP BY|HAVING|LIMIT|OFFSET|AS|IN|LIKE|BETWEEN)\b/gi,'<span style="color:#00ff88">$1</span>');
    s=s.replace(/(--.*$)/gm,'<span style="color:#56708a">$1</span>');
    s=s.replace(/(["'])([^"']*)\1/g,'<span style="color:#ff6b35">$1$2$1</span>');
  }
  if(['xml'].includes(lang)){
    s=s.replace(/(&lt;\/?[^&\s>]*)(&gt;)?/g,'<span style="color:#4d9eff">$1$2</span>');
    s=s.replace(/([\w-]+=)/g,'<span style="color:#ff6b35">$1</span>');
  }
  return s;
}

/* ---- OG META FOR INDEX PAGE ---- */
function initIndexOgMeta(){
  const metas=[
    ['og:title','Rupesh Kumar | Offensive Security Engineer'],
    ['og:description','Red Teamer · Exploit Developer · OSCP Candidate · CVE Researcher. Based in Hyderabad, India.'],
    ['og:type','website'],
    ['twitter:card','summary_large_image'],
    ['twitter:title','Rupesh Kumar | nullspec7or'],
    ['twitter:description','Offensive Security Engineer — Red Team, Exploit Dev, AD Attacks, CVE Research.'],
  ];
  metas.forEach(([prop,content])=>{
    const isOg=prop.startsWith('og:');
    const attr=isOg?'property':'name';
    let el=document.querySelector(`meta[${attr}="${prop}"]`);
    if(!el){el=document.createElement('meta');el.setAttribute(attr,prop);document.head.appendChild(el);}
    el.setAttribute('content',content);
  });
  // Set OG image as inline SVG thumbnail
  const svg=generateOgSvg('Rupesh Kumar | Offensive Security','Red Team · Exploit Dev · OSCP');
  let ogImg=document.querySelector('meta[property="og:image"]');
  if(!ogImg){ogImg=document.createElement('meta');ogImg.setAttribute('property','og:image');document.head.appendChild(ogImg);}
  ogImg.content=svg;
  let twImg=document.querySelector('meta[name="twitter:image"]');
  if(!twImg){twImg=document.createElement('meta');twImg.setAttribute('name','twitter:image');document.head.appendChild(twImg);}
  twImg.content=svg;
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded',()=>{
  initCursor();
  initBoot();
  initNav();
  initScrollProgress();
  initGlobalBg();
  initTypewriter();
  initCounters();
  initReveals();
  initSkillBars();
  initCarousel();
  initEasterEgg();

  if(!document.body.classList.contains('blog-page')){
    initBlogTicker();
    initIndexOgMeta();
  } else {
    initBlogPage();
  }
});
