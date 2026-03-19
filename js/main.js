/* ============================================================
   BANKS AUTOMOTIVE — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------------------------
     Navigation: scroll effect & active page
  ---------------------------------------------------------- */
  const nav         = document.querySelector('.nav');
  const hamburger   = document.querySelector('.nav-hamburger');
  const mobileMenu  = document.querySelector('.nav-mobile');

  // Shrink nav on scroll
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    toggleScrollTop();
  }, { passive: true });

  // Highlight the active nav link based on current filename
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-page]').forEach(link => {
    if (link.dataset.page === page) link.classList.add('active');
  });

  /* ----------------------------------------------------------
     Mobile Hamburger Menu
  ---------------------------------------------------------- */
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });

    // Close when a link is clicked
    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  function closeMobileMenu() {
    hamburger && hamburger.classList.remove('active');
    mobileMenu && mobileMenu.classList.remove('open');
    hamburger && hamburger.setAttribute('aria-expanded', 'false');
  }

  /* ----------------------------------------------------------
     Scroll-to-Top Button
  ---------------------------------------------------------- */
  const scrollTopBtn = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (!scrollTopBtn) return;
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  }

  scrollTopBtn && scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ----------------------------------------------------------
     Intersection Observer — Scroll Reveal
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ----------------------------------------------------------
     Animated Counters (stats sections)
  ---------------------------------------------------------- */
  const counters = document.querySelectorAll('.counter');

  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(el => counterObserver.observe(el));
  }

  function runCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const step     = target / (duration / 16);
    let current    = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + suffix;
      }
    }, 16);
  }

  /* ----------------------------------------------------------
     Contact Form — Validation & Submission
  ---------------------------------------------------------- */
  const contactForm  = document.getElementById('contactForm');
  const formSuccess  = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateForm(contactForm)) return;

      const submitBtn = contactForm.querySelector('.form-submit');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

      // Simulate network request (replace with real endpoint)
      setTimeout(() => {
        contactForm.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
      }, 1600);
    });

    // Real-time inline validation
    contactForm.querySelectorAll('[required]').forEach(input => {
      input.addEventListener('blur',  () => checkField(input));
      input.addEventListener('input', () => {
        if (input.value.trim()) input.style.borderColor = '';
      });
    });
  }

  function validateForm(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(input => {
      if (!checkField(input)) valid = false;
    });
    return valid;
  }

  function checkField(input) {
    if (!input.value.trim()) {
      input.style.borderColor = 'var(--red)';
      return false;
    }
    if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      input.style.borderColor = 'var(--red)';
      return false;
    }
    input.style.borderColor = '';
    return true;
  }

  /* ----------------------------------------------------------
     Smooth Scroll — Anchor Links
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const href   = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = nav ? nav.offsetHeight + 20 : 90;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});
