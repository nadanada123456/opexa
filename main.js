/* ============================================================
   OPEXA CONSULTING — main.js
   Features: Navbar scroll, mobile menu, counter animation,
             scroll reveal, contact form with Formspree,
             back to top, smooth UX
   ============================================================ */

'use strict';

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initCounters();
  initScrollReveal();
  initContactForm();
  initBackToTop();
  initYear();
  initSmoothScroll();
});

// ===================================================
// 1. NAVBAR — shrinks on scroll
// ===================================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

// ===================================================
// 2. MOBILE MENU
// ===================================================
function initMobileMenu() {
  const burger    = document.getElementById('burger');
  const navLinks  = document.getElementById('navLinks');
  if (!burger || !navLinks) return;

  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen.toString());
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ===================================================
// 3. COUNTER ANIMATION
// ===================================================
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start    = performance.now();

    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased    = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Trigger when hero is visible (IntersectionObserver)
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(el => animateCounter(el));
        obs.disconnect();
      }
    });
  }, { threshold: 0.4 });

  obs.observe(hero);
}

// ===================================================
// 4. SCROLL REVEAL
// ===================================================
function initScrollReveal() {
  // Add reveal class to target elements
  const selectors = [
    '.service-card',
    '.testi-card',
    '.ap-pillar',
    '.cd-item',
    '.section-header',
    '.apropos-content',
    '.apropos-visual',
    '.contact-info',
    '.contact-form-wrap',
    '.ref-logo-item',
  ];

  selectors.forEach((sel, i) => {
    document.querySelectorAll(sel).forEach((el, j) => {
      el.classList.add('reveal');
      // Stagger cards in a grid
      if (['SERVICE-CARD','TESTI-CARD'].includes(el.tagName?.toUpperCase()) || 
          el.classList.contains('service-card') ||
          el.classList.contains('testi-card') ||
          el.classList.contains('ref-logo-item')) {
        el.style.transitionDelay = `${(j % 3) * 0.12}s`;
      }
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ===================================================
// 5. CONTACT FORM — Formspree integration
//    → Replace ACTION_URL with your Formspree endpoint
// ===================================================
function initContactForm() {
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');
  const errorMsg   = document.getElementById('formError');

  if (!form) return;

  // ── Inline validation helpers ──
  const fields = {
    nom:     { el: form.querySelector('#nom'),     msg: 'Veuillez saisir votre nom complet.' },
    email:   { el: form.querySelector('#email'),   msg: 'Adresse email invalide.' },
    service: { el: form.querySelector('#service'), msg: 'Veuillez choisir un service.' },
    message: { el: form.querySelector('#message'), msg: 'Votre message est trop court.' },
  };

  const showError = (field, msg) => {
    field.el.classList.add('invalid');
    const errEl = field.el.closest('.form-group').querySelector('.form-error');
    if (errEl) errEl.textContent = msg;
  };

  const clearError = (field) => {
    field.el.classList.remove('invalid');
    const errEl = field.el.closest('.form-group').querySelector('.form-error');
    if (errEl) errEl.textContent = '';
  };

  // Live validation on blur
  Object.values(fields).forEach(field => {
    if (!field.el) return;
    field.el.addEventListener('blur', () => validateField(field));
    field.el.addEventListener('input', () => clearError(field));
  });

  const validateField = (field) => {
    if (!field.el) return true;
    const val = field.el.value.trim();

    if (field.el.id === 'email') {
      const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRx.test(val)) { showError(field, field.msg); return false; }
    } else if (field.el.id === 'message') {
      if (val.length < 15) { showError(field, 'Veuillez écrire au moins 15 caractères.'); return false; }
    } else {
      if (!val) { showError(field, field.msg); return false; }
    }
    clearError(field);
    return true;
  };

  const validateAll = () => {
    return Object.values(fields).map(f => validateField(f)).every(Boolean);
  };

  // ── Form submission ──
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Hide previous status
    successMsg.hidden = true;
    errorMsg.hidden   = true;

    if (!validateAll()) return;

    // Loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const formData = {
      nom:      form.nom.value.trim(),
      societe:  form.societe?.value.trim() || '',
      email:    form.email.value.trim(),
      telephone:form.telephone?.value.trim() || '',
      service:  form.service.value,
      message:  form.message.value.trim(),
    };

    try {
      /*
       * ─────────────────────────────────────────────────────────
       * OPTION A — Formspree (recommandé pour débutants)
       * 1. Créez un compte sur https://formspree.io
       * 2. Créez un formulaire et copiez votre endpoint
       * 3. Remplacez 'YOUR_FORMSPREE_ID' ci-dessous
       * ─────────────────────────────────────────────────────────
       */
      const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xwvzrdzk';

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        form.reset();
        successMsg.hidden = false;
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        const data = await res.json();
        throw new Error(data?.error || 'Server error');
      }

    } catch (err) {
      console.error('Form error:', err);
      errorMsg.hidden = false;
      errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

// ===================================================
// 6. BACK TO TOP
// ===================================================
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===================================================
// 7. FOOTER YEAR
// ===================================================
function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

// ===================================================
// 8. SMOOTH SCROLL (polyfill for older browsers)
// ===================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('navbar')?.offsetHeight || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}
