(function () {
  let currentFont = localStorage.getItem("lumara-font") || "'DM Sans', sans-serif";
  let currentAccent = localStorage.getItem("lumara-accent-social") || "#9c02ae";
  let darkMode = localStorage.getItem("lumara-dark") === "true";

  function applyAll() {
    document.body.style.fontFamily = currentFont;
    document.documentElement.style.setProperty("--accent", currentAccent);
    document.documentElement.style.setProperty("--accent-2", currentAccent);
    if (darkMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");

    document.querySelectorAll(".font-option").forEach((o) => {
      o.classList.toggle("active", o.dataset.font === currentFont);
    });
    document.querySelectorAll(".color-swatch").forEach((s) => {
      s.classList.toggle("active", s.dataset.color === currentAccent);
    });
    document.getElementById("modeLight")?.classList.toggle("active", !darkMode);
    document.getElementById("modeDark")?.classList.toggle("active", darkMode);
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyAll();

    /* Tamaño de texto */
    let currentSize = localStorage.getItem('lumara-size') || '16px';
    document.documentElement.style.fontSize = currentSize;
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.size === currentSize);
      btn.addEventListener('click', function () {
        currentSize = this.dataset.size;
        document.documentElement.style.fontSize = currentSize;
        localStorage.setItem('lumara-size', currentSize);
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
      });
    });

    /* Toggle panel */
    document.getElementById("accToggle").addEventListener("click", () => {
      document.getElementById("accPanel").classList.toggle("open");
    });

    /* Cerrar al hacer clic fuera */
    document.addEventListener("click", (e) => {
      const panel = document.getElementById("accPanel");
      const toggle = document.getElementById("accToggle");
      if (!panel.contains(e.target) && !toggle.contains(e.target)) {
        panel.classList.remove("open");
      }
    });

    /* Dislexia */
    let dyslexia = localStorage.getItem('lumara-dyslexia') === 'true';
    if (dyslexia) document.body.classList.add('dyslexia');
    document.getElementById('dyslexiaOn')?.classList.toggle('active', dyslexia);
    document.getElementById('dyslexiaOff')?.classList.toggle('active', !dyslexia);

    document.getElementById('dyslexiaOn')?.addEventListener('click', () => {
      dyslexia = true;
      document.body.classList.add('dyslexia');
      localStorage.setItem('lumara-dyslexia', 'true');
      document.getElementById('dyslexiaOn').classList.add('active');
      document.getElementById('dyslexiaOff').classList.remove('active');
    });

    document.getElementById('dyslexiaOff')?.addEventListener('click', () => {
      dyslexia = false;
      document.body.classList.remove('dyslexia');
      localStorage.setItem('lumara-dyslexia', 'false');
      document.getElementById('dyslexiaOff').classList.add('active');
      document.getElementById('dyslexiaOn').classList.remove('active');
    });

    /* Color de acento */
    document.querySelectorAll(".color-swatch").forEach((sw) => {
      sw.addEventListener("click", function () {
        currentAccent = this.dataset.color;
        document.documentElement.style.setProperty("--accent", currentAccent);
        document.documentElement.style.setProperty("--accent-2", currentAccent);
        localStorage.setItem("lumara-accent-social", currentAccent);
        document.querySelectorAll(".color-swatch").forEach((s) => s.classList.remove("active"));
        this.classList.add("active");
      });
    });

    /* Modo claro */
    document.getElementById("modeLight").addEventListener("click", () => {
      darkMode = false;
      document.body.classList.remove("dark-mode");
      localStorage.setItem("lumara-dark", "false");
      document.getElementById("modeLight").classList.add("active");
      document.getElementById("modeDark").classList.remove("active");
    });

    /* Modo oscuro */
    document.getElementById("modeDark").addEventListener("click", () => {
      darkMode = true;
      document.body.classList.add("dark-mode");
      localStorage.setItem("lumara-dark", "true");
      document.getElementById("modeDark").classList.add("active");
      document.getElementById("modeLight").classList.remove("active");
    });

    /* Restablecer todo */
    document.getElementById("accReset").addEventListener("click", () => {
      currentFont = "'DM Sans', sans-serif";
      currentAccent = "#9c02ae";
      darkMode = false;
      localStorage.removeItem("lumara-font");
      localStorage.removeItem("lumara-accent-social");
      localStorage.removeItem("lumara-dark");
      document.body.style.fontFamily = currentFont;
      document.documentElement.style.setProperty("--accent", currentAccent);
      document.documentElement.style.setProperty("--accent-2", currentAccent);
      document.body.classList.remove("dark-mode");
      document.querySelectorAll(".font-option").forEach((o) => o.classList.remove("active"));
      document.querySelector("[data-font=\"'DM Sans', sans-serif\"]")?.classList.add("active");
      document.querySelectorAll(".color-swatch").forEach((s) => s.classList.remove("active"));
      document.querySelector('[data-color="#9c02ae"]')?.classList.add("active");
      document.getElementById("modeLight").classList.add("active");
      document.getElementById("modeDark").classList.remove("active");

      currentSize = '16px';
      localStorage.removeItem('lumara-size');
      document.documentElement.style.fontSize = currentSize;
      document.querySelectorAll('.size-btn').forEach(b => b.classList.toggle('active', b.dataset.size === '16px'));

      applyAll();

      dyslexia = false;
      localStorage.removeItem('lumara-dyslexia');
      document.body.classList.remove('dyslexia');
      document.getElementById('dyslexiaOff')?.classList.add('active');
      document.getElementById('dyslexiaOn')?.classList.remove('active');
    });
  });
})();