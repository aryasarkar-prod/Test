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

/* ── Floating chips tilt on hover (hero) ─────────────────── */
document.querySelectorAll('.floating-chip').forEach(chip => {
  chip.addEventListener('mouseenter', () => {
    chip.style.transform = 'scale(1.08)';
    chip.style.zIndex = '10';
  });
  chip.addEventListener('mouseleave', () => {
    chip.style.transform = '';
    chip.style.zIndex = '';
  });
});

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

console.log('%c👋 Hey there! Thanks for checking out my portfolio source code.', 'color:#6366f1;font-size:14px;font-weight:bold');
console.log('%c🚀 Built with vanilla HTML, CSS & JS — no frameworks needed.', 'color:#8b5cf6;font-size:13px');
