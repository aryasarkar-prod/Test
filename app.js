/* ══════════════════════════════════════════════════════════
   Personal Portfolio — app.js
   Smooth scroll · Typed text · Animations · Filters · Form
══════════════════════════════════════════════════════════ */

/* ── Cursor Glow ─────────────────────────────────────────── */
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top  = e.clientY + 'px';
  });
} else if (cursorGlow) {
  cursorGlow.style.display = 'none';
}

/* ── Navbar: scroll shrink + active link ─────────────────── */
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Highlight active nav link
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

/* ── Hamburger menu ──────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
  document.body.style.overflow = navLinksEl.classList.contains('open') ? 'hidden' : '';
});

navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
    document.body.style.overflow = '';
  });
});


/* ── Typed Text Effect ───────────────────────────────────── */
const phrases = [
  'beautiful web apps.',
  'scalable APIs.',
  'clean UI/UX.',
  'full-stack products.',
  'fast experiences.',
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed');

function type() {
  if (!typedEl) return;
  const current = phrases[phraseIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(type, 2000);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 50 : 90);
}
type();

/* ── Intersection Observer: reveal animations ────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Animated counters (About stats) ─────────────────────── */
function animateCounter(el, target) {
  let start = 0;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target));
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const statsEl = document.querySelector('.about-stats');
if (statsEl) counterObserver.observe(statsEl);


/* ── Skill bar animation ─────────────────────────────────── */
const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        const w = bar.dataset.w;
        setTimeout(() => { bar.style.width = w + '%'; }, 200);
      });
      skillsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skills-panel').forEach(p => skillsObserver.observe(p));

/* ── Skills Tabs ─────────────────────────────────────────── */
const skillTabs = document.querySelectorAll('.skill-tab');
skillTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    skillTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    document.querySelectorAll('.skills-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('tab-' + tab.dataset.tab);
    if (panel) {
      panel.classList.add('active');
      // Animate bars for newly visible tab
      panel.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, 100);
      });
    }
  });
});

// Animate bars for the initially active panel
const defaultPanel = document.querySelector('.skills-panel.active');
if (defaultPanel) {
  const panelObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-fill').forEach(bar => {
          setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, 200);
        });
        panelObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  panelObserver.observe(defaultPanel);
}

/* ── Project Filter ──────────────────────────────────────── */
const projFilters = document.querySelectorAll('.proj-filter');
projFilters.forEach(btn => {
  btn.addEventListener('click', () => {
    projFilters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    document.querySelectorAll('.project-card').forEach(card => {
      const cat = card.dataset.cat;
      const show = filter === 'all' || cat === filter;
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      if (show) {
        card.style.opacity = '1';
        card.style.transform = '';
        card.classList.remove('hidden-proj');
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => card.classList.add('hidden-proj'), 300);
      }
    });
  });
});


/* ── Contact Form ────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const sendBtnText = document.getElementById('sendBtnText');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendBtnText.textContent = 'Sending... ⏳';
    contactForm.querySelector('button[type=submit]').disabled = true;

    setTimeout(() => {
      contactForm.reset();
      sendBtnText.textContent = 'Send Message ✉️';
      contactForm.querySelector('button[type=submit]').disabled = false;
      formSuccess.classList.remove('hidden');
      setTimeout(() => formSuccess.classList.add('hidden'), 5000);
    }, 1400);
  });
}

/* ── Smooth scroll for anchor links ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Back-to-top ─────────────────────────────────────────── */
const btt = document.getElementById('backToTop');
if (btt) {
  window.addEventListener('scroll', () => {
    btt.style.opacity = window.scrollY > 400 ? '1' : '0.3';
  }, { passive: true });
}

/* ── Project card tilt on mouse move ─────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
  });
});

/* ══════════════════════════════════════════════════════════
   ORBITAL IDENTITY SYSTEM
   requestAnimationFrame engine · counter-rotation · carousel
══════════════════════════════════════════════════════════ */

(function initOrbitalSystem() {

  /* ── Config ─────────────────────────────────────────────
     Each ring: { el, badges[], radius, speed (deg/s), dir }
     dir: +1 = clockwise, -1 = counter-clockwise            */
  const RINGS_CONFIG = [
    { id: 'ring1', speed: 14,  dir:  1  },   /* outer  – hobbies – slow CW   */
    { id: 'ring2', speed: 22,  dir: -1  },   /* middle – tech    – med  CCW  */
    { id: 'ring3', speed: 34,  dir:  1  },   /* inner  – status  – fast CW   */
  ];

  /* ── Read live radius from CSS custom property ──────────
     Falls back to hard-coded values if CSS var not set.    */
  function getRadius(ringEl, fallback) {
    const raw = getComputedStyle(ringEl)
      .getPropertyValue('--orbit-r')
      .trim();
    return raw ? parseFloat(raw) : fallback;
  }

  const RADIUS_FALLBACK = { ring1: 220, ring2: 155, ring3: 88 };

  /* ── Collect DOM references ─────────────────────────── */
  const rings = RINGS_CONFIG.map(cfg => {
    const el = document.getElementById(cfg.id);
    if (!el) return null;
    const badges = Array.from(el.querySelectorAll('.orbit-badge'));
    /* Parse initial angles from data-angle attribute */
    const angles = badges.map(b => parseFloat(b.dataset.angle) || 0);
    return { ...cfg, el, badges, angles };
  }).filter(Boolean);

  if (!rings.length) return; /* bail if HTML not present */

  /* ── State ──────────────────────────────────────────── */
  let paused      = false;
  let lastTime    = null;
  let rafId       = null;

  /* ── Position a single badge around its ring centre ──── */
  function placeBadge(badge, angleDeg, radius, ringEl) {
    /* ring centre = half of ring el's own size */
    const size   = ringEl.offsetWidth || 460;
    const cx     = size / 2;
    const cy     = size / 2;
    const rad    = (angleDeg - 90) * (Math.PI / 180); /* -90 so 0° = top */
    const x      = cx + radius * Math.cos(rad);
    const y      = cy + radius * Math.sin(rad);

    badge.style.left = x + 'px';
    badge.style.top  = y + 'px';

    /* Counter-rotate the badge so text always reads upright.
       We apply an additional subtle tilt (+/-5°) for depth.  */
    const tilt   = Math.sin(rad) * 5; /* subtle lean on sides */
    badge.style.transform = `translate(-50%, -50%) rotate(${tilt.toFixed(2)}deg)`;
  }

  /* ── Main animation tick ────────────────────────────── */
  function tick(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = (timestamp - lastTime) / 1000; /* seconds */
    lastTime = timestamp;

    if (!paused) {
      rings.forEach(ring => {
        const radius  = getRadius(ring.el, RADIUS_FALLBACK[ring.id]);
        const deltaDeg = ring.speed * ring.dir * dt;

        ring.angles = ring.angles.map((angle, i) => {
          const next = (angle + deltaDeg + 360) % 360;
          placeBadge(ring.badges[i], next, radius, ring.el);
          return next;
        });
      });
    }

    rafId = requestAnimationFrame(tick);
  }

  /* ── Pause on hover / focus (any badge or centre) ──── */
  const system = document.getElementById('orbitalSystem');
  if (system) {
    system.addEventListener('mouseenter', () => { paused = true;  });
    system.addEventListener('mouseleave', () => { paused = false; });
    system.addEventListener('focusin',    () => { paused = true;  });
    system.addEventListener('focusout',   () => { paused = false; });
  }

  /* ── Recalculate on resize (radii change via CSS) ──── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      /* Force one immediate re-place so badges don't jump */
      rings.forEach(ring => {
        const radius = getRadius(ring.el, RADIUS_FALLBACK[ring.id]);
        ring.angles.forEach((angle, i) => {
          placeBadge(ring.badges[i], angle, radius, ring.el);
        });
      });
    }, 120);
  }, { passive: true });

  /* ── Staggered entrance: pop badges in one-by-one ──── */
  function runEntrance() {
    /* Collect ALL badges across all rings, sorted by ring then index */
    const allBadges = rings.flatMap(r => r.badges);
    allBadges.forEach((badge, i) => {
      setTimeout(() => badge.classList.add('ob-visible'), 300 + i * 90);
    });
  }

  /* ── Do initial placement before first RAF frame ──── */
  rings.forEach(ring => {
    const radius = getRadius(ring.el, RADIUS_FALLBACK[ring.id]);
    ring.angles.forEach((angle, i) => {
      placeBadge(ring.badges[i], angle, radius, ring.el);
    });
  });

  /* ── Start engine + entrance when hero is in view ──── */
  const heroSection = document.getElementById('hero');
  const startObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runEntrance();
        lastTime = null;
        rafId = requestAnimationFrame(tick);
        startObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });

  if (heroSection) {
    startObserver.observe(heroSection);
  } else {
    /* Fallback — start immediately */
    runEntrance();
    lastTime = null;
    rafId = requestAnimationFrame(tick);
  }

  /* ── Reduced-motion: freeze engine entirely ─────────── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cancelAnimationFrame(rafId);
    paused = true;
    /* Still do placement so badges appear at correct positions */
    rings.forEach(ring => {
      const radius = getRadius(ring.el, RADIUS_FALLBACK[ring.id]);
      ring.angles.forEach((angle, i) => {
        placeBadge(ring.badges[i], angle, radius, ring.el);
        ring.badges[i].classList.add('ob-visible');
      });
    });
  }

})(); /* end IIFE */


/* ══════════════════════════════════════════════════════════
   PROFILE CAROUSEL
   Auto-advances every 3 s · manual dot control
══════════════════════════════════════════════════════════ */

(function initProfileCarousel() {

  const slides   = document.querySelectorAll('.profile-slide');
  const dots     = document.querySelectorAll('.cdot');
  if (!slides.length) return;

  let current    = 0;
  let autoTimer  = null;
  const INTERVAL = 3200; /* ms between auto-advances */

  function goTo(idx, userTriggered = false) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');

    /* Reset auto-timer if user clicked a dot */
    if (userTriggered) {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), INTERVAL);
    }
  }

  /* Wire dots */
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.idx), true);
    });
  });

  /* Pause on hover over carousel */
  const carousel = document.getElementById('profileCarousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));
    carousel.addEventListener('mouseleave', () => {
      autoTimer = setInterval(() => goTo(current + 1), INTERVAL);
    });
  }

  /* Start */
  autoTimer = setInterval(() => goTo(current + 1), INTERVAL);

})(); /* end IIFE */


/* ══════════════════════════════════════════════════════════
   BADGE TOOLTIP — show full label on tiny screens
══════════════════════════════════════════════════════════ */

(function initBadgeTooltips() {
  /* Only activate on screens narrower than 480 px where
     ring-2 labels are hidden via CSS                        */
  if (window.innerWidth > 480) return;

  document.querySelectorAll('.orbit-badge').forEach(badge => {
    const label = badge.querySelector('.ob-label');
    if (!label) return;

    /* Create tooltip */
    const tip = document.createElement('span');
    tip.className = 'ob-tooltip';
    tip.textContent = label.textContent;
    tip.style.cssText = `
      position:absolute; bottom:calc(100% + 7px); left:50%;
      transform:translateX(-50%) scale(0.85);
      background:rgba(13,17,23,0.96);
      color:#e2e8f0; font-size:11px; font-weight:700;
      padding:4px 10px; border-radius:6px;
      white-space:nowrap; pointer-events:none;
      opacity:0; transition:opacity 0.2s,transform 0.2s;
      border:1px solid rgba(99,102,241,0.4);
      z-index:100;
    `;
    badge.style.position = 'absolute'; /* already set, but ensure */
    badge.appendChild(tip);

    badge.addEventListener('mouseenter', () => {
      tip.style.opacity = '1';
      tip.style.transform = 'translateX(-50%) scale(1)';
    });
    badge.addEventListener('mouseleave', () => {
      tip.style.opacity = '0';
      tip.style.transform = 'translateX(-50%) scale(0.85)';
    });
  });
})();


console.log('%c👋 Hey there! Thanks for checking out my portfolio source code.', 'color:#6366f1;font-size:14px;font-weight:bold');
console.log('%c🚀 Built with vanilla HTML, CSS & JS — no frameworks needed.', 'color:#8b5cf6;font-size:13px');
console.log('%c🪐 Orbital identity system: 3 rings · 17 badges · 60fps rAF engine', 'color:#22d3ee;font-size:13px');
