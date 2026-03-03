/* ============================================================
   NAMYA SHAH PORTFOLIO — script.js
   Preloader | Particles | Typing | Scroll Animations
   Skill Rings | Counters | Tilt | Form | Matrix Rain
============================================================ */

'use strict';

/* ============================================================
   UTILITY HELPERS
============================================================ */
const qs  = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => [...el.querySelectorAll(s)];

/* Matrix rain character set */
const MATRIX_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*(){}[]<>/\\|+-=';

/* ============================================================
   MATRIX RAIN (preloader background)
============================================================ */
function initMatrixRain() {
  const canvas = qs('#matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const chars = MATRIX_CHARS;
  const fontSize = 14;
  let columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff88';
    ctx.font = `${fontSize}px Fira Code, monospace`;
    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }
  return setInterval(draw, 45);
}

/* ============================================================
   PRELOADER
============================================================ */
function initPreloader() {
  const preloader  = qs('#preloader');
  const bar        = qs('#preloader-bar');
  const cmdEls     = [qs('#cmd1'), qs('#cmd2'), qs('#cmd3'), qs('#cmd4')];
  const outputLine = qs('#output-line');

  const commands = [
    'git clone namya-shah/portfolio.git',
    'cd portfolio && npm install',
    'npm run build:production',
    'node deploy.js --env=production',
  ];
  const outputText = '✓  Portfolio loaded successfully! Welcome.';

  let matrixInterval = initMatrixRain();
  let progress = 0;

  /* Animate progress bar */
  const barTick = setInterval(() => {
    progress = Math.min(progress + Math.random() * 3 + 0.5, 100);
    if (bar) bar.style.width = progress + '%';
    if (progress >= 100) clearInterval(barTick);
  }, 50);

  /* Type each command line */
  function typeLine(el, text, delay, onDone) {
    if (!el) { onDone && onDone(); return; }
    let i = 0;
    setTimeout(() => {
      const iv = setInterval(() => {
        el.textContent = text.slice(0, ++i);
        if (i >= text.length) {
          clearInterval(iv);
          onDone && onDone();
        }
      }, 28);
    }, delay);
  }

  typeLine(cmdEls[0], commands[0], 400, () =>
    typeLine(cmdEls[1], commands[1], 200, () =>
      typeLine(cmdEls[2], commands[2], 200, () =>
        typeLine(cmdEls[3], commands[3], 200, () => {
          setTimeout(() => {
            if (outputLine) outputLine.textContent = outputText;
          }, 300);
        })
      )
    )
  );

  /* Hide preloader after ~3.8s */
  setTimeout(() => {
    clearInterval(matrixInterval);
    if (preloader) preloader.classList.add('fade-out');
    document.body.classList.remove('no-scroll');
    setTimeout(() => {
      if (preloader) preloader.style.display = 'none';
    }, 700);
  }, 3800);

  document.body.classList.add('no-scroll');
}

/* ============================================================
   PARTICLE CANVAS (hero background)
============================================================ */
function initParticles() {
  const canvas = qs('#particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  const COLORS = ['#00ff88', '#3b82f6', '#8b5cf6', '#06b6d4'];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.6 + 0.2,
    };
  }

  function init() {
    resize();
    const count = Math.floor((W * H) / 8000);
    particles = Array.from({ length: count }, makeParticle);
  }

  let mouse = { x: null, y: null };
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; });

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,255,136,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      /* Mouse interaction */
      if (mouse.x !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,255,136,${0.2 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    requestAnimationFrame(animate);
  }

  init();
  animate();
  window.addEventListener('resize', () => { init(); });
}

/* ============================================================
   TYPEWRITER EFFECT (hero)
============================================================ */
function initTypewriter() {
  const el = qs('#typed-text');
  if (!el) return;

  const roles = ['Developer', 'AI Enthusiast', 'Problem Solver', 'Diploma Engineer', 'Tech Innovator'];
  let roleIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const current = roles[roleIdx];
    if (deleting) {
      el.textContent = current.slice(0, --charIdx);
    } else {
      el.textContent = current.slice(0, ++charIdx);
    }

    let delay = deleting ? 60 : 100;
    if (!deleting && charIdx === current.length) {
      delay = 1800;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400;
    }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 1200);
}

/* ============================================================
   NAVBAR: scroll behaviour + active link
============================================================ */
function initNavbar() {
  const navbar  = qs('#navbar');
  const links   = qsa('.nav-link');
  const sections = qsa('section[id]');
  const ham     = qs('#hamburger');
  const navList = qs('#nav-links');

  /* Sticky */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  /* Active section highlight */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = qs(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(s => observer.observe(s));

  /* Smooth scroll on link click */
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = qs(link.getAttribute('href'));
      if (target) {
        navList.classList.remove('open');
        ham.classList.remove('open');
        document.body.classList.remove('no-scroll');
        const top = target.getBoundingClientRect().top + window.scrollY - 68;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* Hamburger */
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    navList.classList.toggle('open');
  });

  /* Close on outside click */
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target) && navList.classList.contains('open')) {
      navList.classList.remove('open');
      ham.classList.remove('open');
    }
  });
}

/* ============================================================
   BACK TO TOP BUTTON
============================================================ */
function initBackToTop() {
  const btn = qs('#back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   SCROLL REVEAL ANIMATIONS
============================================================ */
function initReveal() {
  const reveals = qsa('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    observer.observe(el);
  });
}

/* ============================================================
   SKILL RINGS
============================================================ */
function initSkillRings() {
  const rings = qsa('.ring-fill');
  if (!rings.length) return;
  const circumference = 2 * Math.PI * 50; // r=50

  /* Inject SVG gradient */
  const svg = qs('.ring-svg');
  if (svg) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stop-color="#00ff88"/>
        <stop offset="50%"  stop-color="#3b82f6"/>
        <stop offset="100%" stop-color="#8b5cf6"/>
      </linearGradient>`;
    svg.prepend(defs);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const ring  = entry.target;
        const pct   = parseFloat(ring.dataset.percent || 0);
        const offset = circumference - (pct / 100) * circumference;
        ring.style.strokeDasharray  = circumference;
        ring.style.strokeDashoffset = offset;
        ring.style.stroke = 'url(#ringGradient)';
        observer.unobserve(ring);
      }
    });
  }, { threshold: 0.4 });

  rings.forEach(r => {
    r.style.strokeDasharray  = circumference;
    r.style.strokeDashoffset = circumference;
    observer.observe(r);
  });
}

/* ============================================================
   SKILL BARS
============================================================ */
function initSkillBars() {
  const bars = qsa('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const w   = bar.dataset.width || 0;
        bar.style.width = w + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(b => observer.observe(b));
}

/* ============================================================
   ANIMATED COUNTERS
============================================================ */
function initCounters() {
  const counters = qsa('.counter-num');
  if (!counters.length) return;

  function animateCounter(el, target, duration = 1600) {
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target || '0', 10);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ============================================================
   3D TILT EFFECT (project cards)
============================================================ */
function initTilt() {
  const cards = qsa('.tilt-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotateX = -dy * 6;
      const rotateY =  dx * 6;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ============================================================
   CONTACT FORM
============================================================ */
function initContactForm() {
  const form      = qs('#contact-form');
  const submitBtn = qs('#submit-btn');
  const thankYou  = qs('#thank-you');
  const resetBtn  = qs('#reset-form');

  if (!form) return;

  function showError(fieldId, msg) {
    const el = qs('#' + fieldId + '-error');
    if (el) el.textContent = msg;
    const input = qs('#' + fieldId);
    if (input) {
      input.style.borderColor = '#ef4444';
      input.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.1)';
    }
  }
  function clearError(fieldId) {
    const el = qs('#' + fieldId + '-error');
    if (el) el.textContent = '';
    const input = qs('#' + fieldId);
    if (input) {
      input.style.borderColor = '';
      input.style.boxShadow   = '';
    }
  }

  /* Live validation */
  qs('#fname').addEventListener('input', () => clearError('fname'));
  qs('#femail').addEventListener('input', () => clearError('femail'));
  qs('#fmessage').addEventListener('input', () => clearError('fmessage'));

  function validateForm() {
    let valid = true;
    const name    = qs('#fname').value.trim();
    const email   = qs('#femail').value.trim();
    const message = qs('#fmessage').value.trim();

    if (!name) {
      showError('fname', 'Please enter your name.'); valid = false;
    } else if (name.length < 2) {
      showError('fname', 'Name must be at least 2 characters.'); valid = false;
    } else clearError('fname');

    const emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
    if (!email) {
      showError('femail', 'Please enter your email.'); valid = false;
    } else if (!emailReg.test(email)) {
      showError('femail', 'Please enter a valid email address.'); valid = false;
    } else clearError('femail');

    if (!message) {
      showError('fmessage', 'Please enter a message.'); valid = false;
    } else if (message.length < 10) {
      showError('fmessage', 'Message must be at least 10 characters.'); valid = false;
    } else clearError('fmessage');

    return valid;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm()) return;

    /* NOTE: Form submission is simulated (demo-only).
       To enable real submission, replace the setTimeout below with
       a fetch() call to your backend endpoint or a service like Formspree. */
    const btnText    = qs('.btn-text', submitBtn);
    const btnLoading = qs('.btn-loading', submitBtn);
    if (btnText)    btnText.style.display    = 'none';
    if (btnLoading) btnLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display       = 'none';
      if (thankYou) thankYou.style.display = 'block';
    }, 1600);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display       = 'block';
      if (thankYou) thankYou.style.display = 'none';
      if (submitBtn) {
        submitBtn.disabled = false;
        const btnText    = qs('.btn-text', submitBtn);
        const btnLoading = qs('.btn-loading', submitBtn);
        if (btnText)    btnText.style.display    = 'inline-flex';
        if (btnLoading) btnLoading.style.display = 'none';
      }
    });
  }
}

/* ============================================================
   FOOTER YEAR
============================================================ */
function setYear() {
  const el = qs('#year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   SMOOTH SCROLL for anchor links outside nav
============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const target = qs(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 68;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ============================================================
   SECTION ENTRANCE GLOW
============================================================ */
function initSectionGlow() {
  const sections = qsa('.section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.setProperty('--section-visible', '1');
      }
    });
  }, { threshold: 0.1 });
  sections.forEach(s => observer.observe(s));
}

/* ============================================================
   FLOATING NAV LOGO CLICK
============================================================ */
function initLogoClick() {
  const logo = qs('.nav-logo');
  if (logo) {
    logo.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ============================================================
   ADD GRADIENT SVG DEFS FOR RINGS (global)
============================================================ */
function injectSVGDefs() {
  const svgs = qsa('.ring-svg');
  if (!svgs.length) return;
  const defHTML = `
    <defs>
      <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stop-color="#00ff88"/>
        <stop offset="50%"  stop-color="#3b82f6"/>
        <stop offset="100%" stop-color="#8b5cf6"/>
      </linearGradient>
    </defs>`;
  svgs.forEach(svg => {
    if (!svg.querySelector('defs')) {
      svg.insertAdjacentHTML('afterbegin', defHTML);
    }
  });
}

/* ============================================================
   HERO SECTION PARALLAX (subtle)
============================================================ */
function initParallax() {
  const hero = qs('.hero-content');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      hero.style.transform = `translateY(${y * 0.15}px)`;
      hero.style.opacity   = `${1 - y / (window.innerHeight * 0.8)}`;
    }
  }, { passive: true });
}

/* ============================================================
   CURSOR GLOW (desktop)
============================================================ */
function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed; pointer-events:none; z-index:9998;
    width:300px; height:300px; border-radius:50%;
    background:radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 70%);
    transform:translate(-50%,-50%);
    transition:transform 0.1s linear;
    top:0; left:0;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

/* ============================================================
   INITIALIZE ALL
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initParticles();
  initTypewriter();
  initNavbar();
  initBackToTop();
  initReveal();
  injectSVGDefs();
  initSkillRings();
  initSkillBars();
  initCounters();
  initTilt();
  initContactForm();
  initSmoothScroll();
  initSectionGlow();
  initLogoClick();
  initParallax();
  initCursorGlow();
  setYear();
});

/* ============================================================
   WINDOW LOAD (ensure everything is rendered)
============================================================ */
window.addEventListener('load', () => {
  /* Re-trigger any reveals that may have been missed */
  qsa('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      el.classList.add('visible');
    }
  });
});
