'use strict';

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

// 1. NAVBAR
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// 2. MOBILE MENU
function initMobileMenu() {
  const burger   = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  if (!burger || !navLinks) return;

  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
}

// 3. COUNTERS
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const start  = performance.now();
    const dur    = 1800;
    const step   = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(2, -10 * p);
      el.textContent = Math.floor(e * target);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const hero = document.querySelector('.hero');
  if (!hero) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { counters.forEach(animate); obs.disconnect(); }
    });
  }, { threshold: 0.3 });
  obs.observe(hero);
}

// 4. SCROLL REVEAL
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// 5. CONTACT FORM
function initContactForm() {
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');
  const errorMsg   = document.getElementById('formError');

  if (!form || !successMsg || !errorMsg) return;

  // Cacher les deux messages au chargement initial
  successMsg.style.display = 'none';
  errorMsg.hidden   = true;

  // Validation : nom, email, service obligatoires — message optionnel
  const fields = {
    nom:     { el: document.getElementById('nom'),     msg: 'Veuillez saisir votre nom.' },
    email:   { el: document.getElementById('email'),   msg: 'Email invalide.' },
    service: { el: document.getElementById('service'), msg: 'Veuillez choisir un service.' },
  };

  const showErr = (el, msg) => {
    el.classList.add('invalid');
    const span = el.closest('.form-group')?.querySelector('.form-error');
    if (span) span.textContent = msg;
  };

  const clearErr = (el) => {
    el.classList.remove('invalid');
    const span = el.closest('.form-group')?.querySelector('.form-error');
    if (span) span.textContent = '';
  };

  Object.values(fields).forEach(({ el }) => {
    if (!el) return;
    el.addEventListener('input',  () => clearErr(el));
    el.addEventListener('change', () => clearErr(el));
  });

  const validate = () => {
    let ok = true;
    const nom = fields.nom.el;
    if (nom && !nom.value.trim()) { showErr(nom, fields.nom.msg); ok = false; }
    else if (nom) clearErr(nom);

    const email = fields.email.el;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showErr(email, fields.email.msg); ok = false;
    } else if (email) clearErr(email);

    const service = fields.service.el;
    if (service && !service.value) { showErr(service, fields.service.msg); ok = false; }
    else if (service) clearErr(service);

    return ok;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Cacher les deux messages avant chaque tentative
    successMsg.style.display = 'none';
    errorMsg.hidden   = true;

    if (!validate()) return;

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const payload = {
      nom:       document.getElementById('nom')?.value.trim()       || '',
      societe:   document.getElementById('societe')?.value.trim()   || '',
      email:     document.getElementById('email')?.value.trim()     || '',
      telephone: document.getElementById('telephone')?.value.trim() || '',
      service:   document.getElementById('service')?.value          || '',
      message:   document.getElementById('message')?.value.trim()   || '',
    };

    // ════════════════════════════════════════════════════
    // ⚠️  Remplacez YOUR_FORMSPREE_ID par votre vrai ID
    //     Ex: 'https://formspree.io/f/xpwqjkzb'
    // ════════════════════════════════════════════════════
    const ENDPOINT = 'https://formspree.io/f/xwvzrdzk';

    try {
      const res  = await fetch(ENDPOINT, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(payload),
      });

      let data = {};
      try { data = await res.json(); } catch (_) {}

      if (res.ok) {
        // ✅ Succès — afficher seulement le message vert
        form.reset();
        successMsg.style.display = 'flex';
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        // ❌ Erreur Formspree
        throw new Error(data?.error || 'Erreur ' + res.status);
      }

    } catch (err) {
      console.error('Form error:', err.message);
      // ❌ Afficher seulement le message rouge
      errorMsg.style.display = 'flex';
      errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

// 6. BACK TO TOP
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// 7. YEAR
function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

// 8. SMOOTH SCROLL
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('navbar')?.offsetHeight || 70;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    });
  });
}
