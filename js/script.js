/* ── MOBILE MENU ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
document.getElementById('mob-close').addEventListener('click', closeMenu);
hamburger.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
});
function closeMenu() {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── TABS ── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

/* ── FAQ ACCORDION ── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

/* ── EVERVAULT CARD ── */
const ecCard  = document.getElementById('ec-card');
const ecChars = document.getElementById('ec-chars');
const ecGlow  = document.getElementById('ec-glow');
const CHARS   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

function randStr(n) {
  let s = '';
  for (let i = 0; i < n; i++) s += CHARS[Math.floor(Math.random() * CHARS.length)];
  return s;
}
ecChars.textContent = randStr(1500);

ecCard.addEventListener('mousemove', e => {
  const { left, top } = ecCard.getBoundingClientRect();
  const x = e.clientX - left, y = e.clientY - top;
  ecChars.style.webkitMaskImage = `radial-gradient(220px circle at ${x}px ${y}px, white, transparent)`;
  ecChars.style.maskImage        = `radial-gradient(220px circle at ${x}px ${y}px, white, transparent)`;
  ecGlow.style.background        = `radial-gradient(500px circle at ${x}px ${y}px, rgba(14,165,233,.1), transparent 40%)`;
  ecChars.textContent = randStr(1500);
});
ecCard.addEventListener('mouseleave', () => { ecGlow.style.background = ''; });

/* ── WORLD MAP ── */
const mapDots = [
  { s: [42.3314, -83.0458],  e: [48.7758,  9.1829]  }, // Detroit → Stuttgart
  { s: [47.6062, -122.3321], e: [51.5074, -0.1278]  }, // Seattle → London
  { s: [35.6762,  139.6503], e: [ 1.3521, 103.8198] }, // Tokyo → Singapore
  { s: [-23.5505, -46.6333], e: [-26.2041, 28.0473] }, // São Paulo → Johannesburg
  { s: [51.5074, -0.1278],   e: [25.2048,  55.2708] }, // London → Dubai
  { s: [1.3521,  103.8198],  e: [-33.8688, 151.2093] } // Singapore → Sydney
];

function proj(lat, lng) {
  return { x: (lng + 180) * (800 / 360), y: (90 - lat) * (400 / 180) };
}
function curvePath(s, e) {
  const mx = (s.x + e.x) / 2, my = Math.min(s.y, e.y) - 50;
  return `M ${s.x} ${s.y} Q ${mx} ${my} ${e.x} ${e.y}`;
}

const mapSvg = document.getElementById('map-svg');
const LINE = '#0ea5e9';

// Build all paths (hidden initially)
const paths = [];
mapDots.forEach((dot, i) => {
  const s = proj(dot.s[0], dot.s[1]), e = proj(dot.e[0], dot.e[1]);
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', curvePath(s, e));
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'url(#pg)');
  path.setAttribute('stroke-width', '1.5');
  mapSvg.appendChild(path);

  const len = path.getTotalLength();
  path.style.strokeDasharray  = len;
  path.style.strokeDashoffset = len;
  paths.push({ path, len, delay: i * 0.5 });

  // Pulsing endpoint dots
  [s, e].forEach(pt => {
    const g  = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const c1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c1.setAttribute('cx', pt.x); c1.setAttribute('cy', pt.y);
    c1.setAttribute('r', '3'); c1.setAttribute('fill', LINE);
    g.appendChild(c1);

    const c2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c2.setAttribute('cx', pt.x); c2.setAttribute('cy', pt.y);
    c2.setAttribute('r', '3'); c2.setAttribute('fill', LINE); c2.setAttribute('opacity', '.5');

    const a1 = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    a1.setAttribute('attributeName', 'r');
    a1.setAttribute('from', '3'); a1.setAttribute('to', '10');
    a1.setAttribute('dur', '1.5s'); a1.setAttribute('repeatCount', 'indefinite');

    const a2 = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    a2.setAttribute('attributeName', 'opacity');
    a2.setAttribute('from', '.5'); a2.setAttribute('to', '0');
    a2.setAttribute('dur', '1.5s'); a2.setAttribute('repeatCount', 'indefinite');

    c2.appendChild(a1); c2.appendChild(a2);
    g.appendChild(c2);
    mapSvg.appendChild(g);
  });
});

let mapAnimated = false;
function animateMap() {
  if (mapAnimated) return;
  mapAnimated = true;
  paths.forEach(({ path, delay }) => {
    setTimeout(() => {
      path.style.transition = `stroke-dashoffset 1.2s ease`;
      path.style.strokeDashoffset = '0';
    }, delay * 1000);
  });
}

/* ── "DEPLOYED WORLDWIDE." LETTER ANIMATION ── */
const deployedEl = document.getElementById('deployed-text');
'Deployed Worldwide.'.split('').forEach((ch, i) => {
  const span = document.createElement('span');
  span.style.cssText = `opacity:0;display:inline-block;transform:translateX(-8px);` +
    `transition:opacity .45s ease ${i * 0.045}s,transform .45s ease ${i * 0.045}s`;
  span.textContent = ch === ' ' ? '\u00A0' : ch;
  deployedEl.appendChild(span);
});

/* ── SCROLL OBSERVER ── */
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');

    // Trigger map section animations
    if (entry.target.contains(deployedEl)) {
      deployedEl.querySelectorAll('span').forEach(s => {
        s.style.opacity = '1';
        s.style.transform = 'translateX(0)';
      });
      animateMap();
    }

    io.unobserve(entry.target);
  });
}, { threshold: 0.08 });

document.querySelectorAll('.fade-up').forEach(el => io.observe(el));
