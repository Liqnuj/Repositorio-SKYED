/* ================================================
   SKYED Universe — script.js
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Menú móvil ---- */
  const menuBtn    = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const isOpen = mobileMenu.classList.contains('open');
      menuBtn.setAttribute('aria-expanded', isOpen);
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', false);
      });
    });
  }

  /* ---- Hover glow en las mitades ---- */
  const socialHalf = document.querySelector('.choose-social');
  const sportHalf  = document.querySelector('.choose-sport');

  if (socialHalf) {
    socialHalf.addEventListener('mouseenter', () => {
      socialHalf.style.boxShadow = 'inset 0 0 90px rgba(83, 74, 183, 0.1)';
    });
    socialHalf.addEventListener('mouseleave', () => {
      socialHalf.style.boxShadow = 'none';
    });
  }

  if (sportHalf) {
    sportHalf.addEventListener('mouseenter', () => {
      sportHalf.style.boxShadow = 'inset 0 0 90px rgba(15, 110, 86, 0.1)';
    });
    sportHalf.addEventListener('mouseleave', () => {
      sportHalf.style.boxShadow = 'none';
    });
  }

  /* ---- Animación de entrada suave en scroll ---- */
  const fadeEls = document.querySelectorAll('.find-card, .mv-card');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
      observer.observe(el);
    });
  }

});
