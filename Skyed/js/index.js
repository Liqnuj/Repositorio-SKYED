/* ===== Carrusel del hero ===== */
(function () {
  const slides = document.querySelectorAll('.slide');
  const dotsBox = document.querySelector('.carousel-dots');
  const prev = document.querySelector('.carousel-arrow.prev');
  const next = document.querySelector('.carousel-arrow.next');
  if (!slides.length) return;

  let idx = 0, timer;

  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Ir al slide ${i + 1}`);
    b.addEventListener('click', () => go(i));
    dotsBox.appendChild(b);
  });
  const dots = dotsBox.querySelectorAll('button');

  function go(i) {
    slides[idx].classList.remove('active');
    dots[idx].classList.remove('active');
    idx = (i + slides.length) % slides.length;
    slides[idx].classList.add('active');
    dots[idx].classList.add('active');
    restart();
  }
  function restart() { clearInterval(timer); timer = setInterval(() => go(idx + 1), 3000); }

  prev?.addEventListener('click', () => go(idx - 1));
  next?.addEventListener('click', () => go(idx + 1));

  go(0);
})();

/* ===== Animación de números ===== */
(function () {
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(update);
  }

  const statsSection = document.querySelector('.stats');
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-num[data-target]')
          .forEach(el => animateCounter(el));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0 }); 

  observer.observe(statsSection);
})();