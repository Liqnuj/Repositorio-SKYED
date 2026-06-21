(function () {

  /* ---------- Configuración ---------- */
  const THRESHOLD = 0.15;
  const BASE_DELAY = 100;

  const targets = [
    /* ── INDEX ── */
    { selector: '.skyed-features__grid', stagger: true  },
    { selector: '.skyed-steps__grid',    stagger: true  },
    { selector: '.events-grid',          stagger: true  },
    { selector: '.stats-grid',           stagger: true  },
    { selector: '.cta-inner',            stagger: false },
    { selector: '.skyed-features__title',stagger: false },
    { selector: '.skyed-steps__title',   stagger: false },

    /* ── NOSOTROS ── */
    /* Títulos y subtítulos de sección */
    { selector: '.section-title',        stagger: false },
    { selector: '.section-sub',          stagger: false },
    { selector: '.page-header',          stagger: false },

    /* Historia: texto + imagen */
    { selector: '.about-text',           stagger: false },
    { selector: '.about-img',            stagger: false },

    /* Misión / Visión */
    { selector: '.mv-grid',              stagger: true  },

    /* Línea del tiempo — cada ítem entra en cascada */
    { selector: '.tl-items',             stagger: true  },

    /* ¿Por qué SKYED? — flip cards */
    { selector: '.features-grid',        stagger: true  },

    /* Eventos destacados */
    { selector: '.cards-grid',           stagger: true  },

    /* Mapa y su barra de info */
    { selector: '.skyed-map-wrap',       stagger: false },
    { selector: '.info-row',             stagger: true  },
  ];

  /* ---------- Observador ---------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const isStagger = el.dataset.srStagger === 'true';

      if (isStagger) {
        Array.from(el.children).forEach((child, i) => {
          child.style.transitionDelay = `${i * BASE_DELAY}ms`;
          child.classList.add('sr-visible');
        });
      } else {
        el.classList.add('sr-visible');
      }

      observer.unobserve(el);
    });
  }, { threshold: THRESHOLD });

  /* ---------- Registrar elementos ---------- */
  function init() {
    targets.forEach(({ selector, stagger }) => {
      document.querySelectorAll(selector).forEach(el => {

        if (stagger) {
          Array.from(el.children).forEach(child => {
            child.classList.add('sr-item');
          });
          el.dataset.srStagger = 'true';
          el.classList.add('sr-container');
        } else {
          el.classList.add('sr-item');
        }

        observer.observe(el);
      });
    });
  }

  /* Soporte para elementos generados dinámicamente (eventos.html) */
  const listEl = document.getElementById('events-list');
  if (listEl) {
    new MutationObserver(() => {
      Array.from(listEl.children).forEach((card, i) => {
        if (!card.classList.contains('sr-item')) {
          card.classList.add('sr-item');
          card.style.transitionDelay = `${i * BASE_DELAY}ms`;
        }
        card.classList.add('sr-visible');
      });
    }).observe(listEl, { childList: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();