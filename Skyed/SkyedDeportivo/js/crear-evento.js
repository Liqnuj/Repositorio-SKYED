(function () {

  document.addEventListener('DOMContentLoaded', function () {
    bindCampos();

    /* Interceptar el botón Siguiente/Guardar */
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('#mev-btn-next');
      if (!btn) return;

      e.stopImmediatePropagation();
      e.preventDefault();

      const esSiguiente = btn.innerHTML.includes('Siguiente');
      const esGuardar   = btn.innerHTML.includes('Guardar');

      if (esSiguiente) {
        if (validarPasoActual()) mevGoStep(1);
      } else if (esGuardar) {
        if (validarPasoActual()) {
          closeModal('modal-evento');
          showToast('Evento guardado ✅', 'success');
        }
      }
    }, true);
  });

  /* ══════════════════════════════════════════
     VALIDAR PASO ACTUAL
  ══════════════════════════════════════════ */
  function validarPasoActual() {
    const pasoActual = typeof step !== 'undefined' ? step : 0;

    switch (pasoActual) {
      case 0: return validarPaso1();
      case 1: return validarPaso2();
      case 2: return validarPaso3();
      case 3: return validarPaso4();
      default: return true;
    }
  }

  /* ── Paso 1: Nombre, categoría, cupos ── */
  function validarPaso1() {
    let ok = true;

    const nombre = document.getElementById('ev-nombre');
    if (nombre) {
      clearError(nombre);
      if (!nombre.value.trim()) {
        showError(nombre, 'El nombre del evento es obligatorio.');
        ok = false;
      }
    }

    const cupos = document.getElementById('ev-cupos');
    if (cupos) {
      clearError(cupos);
      const v = parseInt(cupos.value);
      if (isNaN(v) || v < 1) {
        showError(cupos, 'Ingresa un número de cupos válido (mínimo 1).');
        ok = false;
      }
    }

    const catSel = document.querySelector('.mev-cat-card.sel');
    if (!catSel) {
      showToast('Selecciona una categoría deportiva.', 'danger');
      ok = false;
    }

    return ok;
  }

  /* ── Paso 2: Ubicación + fecha ── */
  function validarPaso2() {
    let ok = true;

    const ubicacion = document.getElementById('ev-ubicacion');
    if (ubicacion) {
      clearError(ubicacion);
      if (!ubicacion.value.trim()) {
        showError(ubicacion, 'La ubicación es obligatoria.');
        ok = false;
      }
    }

    const dateVal = document.getElementById('mev-date-val');
    if (dateVal && !dateVal.classList.contains('set')) {
      showToast('Debes seleccionar una fecha para el evento.', 'danger');
      ok = false;
    }

    return ok;
  }

  /* ── Paso 3: Descripción (opcional) ── */
  function validarPaso3() {
    const desc = document.getElementById('ev-desc');
    if (desc && desc.value.trim().length > 0) {
      const v = desc.value.trim();
      if (v[0] !== v[0].toUpperCase()) {
        desc.value = v.charAt(0).toUpperCase() + v.slice(1);
      }
    }
    return true;
  }

  /* ── Paso 4: Guardar (imagen opcional) ── */
  function validarPaso4() {
    return true;
  }

  /* ══════════════════════════════════════════
     BIND — restricciones en tiempo real
  ══════════════════════════════════════════ */
  function bindCampos() {
    /* Nombre — permite letras Y números */
    const nombre = document.getElementById('ev-nombre');
    if (nombre) {
      inyectarError(nombre);
      bindTextoConNumeros(nombre);
      nombre.addEventListener('input', () => clearError(nombre));
    }

    /* Ubicación, descripción y requisitos — SOLO letras, sin números */
    ['ev-ubicacion', 'ev-desc', 'ev-req'].forEach(id => {
      const input = document.getElementById(id);
      if (!input) return;
      inyectarError(input);
      bindTextoLibre(input);           // ← usa la versión SIN números
      input.addEventListener('input', () => clearError(input));
    });

    /* Cupos — solo números */
    const cupos = document.getElementById('ev-cupos');
    if (cupos) {
      inyectarError(cupos);
      cupos.addEventListener('keypress', e => {
        if (!/[0-9]/.test(e.key)) {
          e.preventDefault();
          flashError(cupos, 'Solo se permiten números positivos.');
        }
      });
      cupos.addEventListener('input', () => {
        const v = parseInt(cupos.value);
        if (!isNaN(v) && v < 1) {
          cupos.value = '';
          flashError(cupos, 'Los cupos deben ser mayores a 0.');
        }
      });
    }

    /* Imagen */
    const img = document.getElementById('ev-img');
    if (img) {
      img.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) { window.skyedImagenBase64 = null; return; }
        const permitidos = ['image/jpeg','image/png','image/webp','image/gif','image/svg+xml'];
        if (!permitidos.includes(file.type)) {
          alert('Formato no válido. Usa JPG, PNG o WEBP.');
          this.value = ''; return;
        }
        if (file.size > 2 * 1024 * 1024) {
          alert('La imagen supera los 2 MB permitidos.');
          this.value = ''; return;
        }
        const reader = new FileReader();
        reader.onload = e => { window.skyedImagenBase64 = e.target.result; };
        reader.readAsDataURL(file);
      });
    }
  }

  /* ══════════════════════════════════════════
     TEXTO LIBRE — SIN números (ubicación, desc, req)
  ══════════════════════════════════════════ */
  function bindTextoLibre(input) {
    // ↓ Se eliminó 0-9 del charset permitido
    const permitido = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s\-,.:;()#°+%/']$/;

    input.addEventListener('keypress', e => {
      if (!permitido.test(e.key)) {
        e.preventDefault();
        flashError(input, 'Carácter no permitido (números no permitidos aquí).');
        return;
      }
      if (e.key === ' ') {
        if (input.value.length === 0 || input.value.endsWith(' ')) {
          e.preventDefault();
          flashError(input, 'No se permiten espacios dobles ni al inicio.');
        }
      }
    });

    input.addEventListener('input', () => {
      const pos = input.selectionStart;
      let val = input.value;
      // Eliminar cualquier número que se haya colado (p.ej. por autocompletar)
      val = val.replace(/[0-9]/g, '');
      if (/\s{2,}/.test(val)) {
        val = val.replace(/\s{2,}/g, ' ');
      }
      if (val.length >= 1 && val[0] !== val[0].toUpperCase()) {
        val = val.charAt(0).toUpperCase() + val.slice(1);
      }
      input.value = val;
      input.selectionStart = input.selectionEnd = Math.min(pos, val.length);
    });

    input.addEventListener('paste', e => {
      e.preventDefault();
      const texto = (e.clipboardData || window.clipboardData).getData('text');
      // ↓ Se eliminó 0-9 del filtro de pegado
      let limpio = texto.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s\-,.:;()#°+%/']/g, '');
      limpio = limpio.replace(/\s{2,}/g, ' ').trimStart();
      if (limpio.length > 0) limpio = limpio.charAt(0).toUpperCase() + limpio.slice(1);
      const start = input.selectionStart;
      const end   = input.selectionEnd;
      input.value = input.value.slice(0, start) + limpio + input.value.slice(end);
      input.selectionStart = input.selectionEnd = start + limpio.length;
    });
  }

  /* ══════════════════════════════════════════
     TEXTO CON NÚMEROS — solo para el nombre
  ══════════════════════════════════════════ */
  function bindTextoConNumeros(input) {
    const permitido = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\s\-,.:;()#°+%/']$/;

    input.addEventListener('keypress', e => {
      if (!permitido.test(e.key)) {
        e.preventDefault();
        flashError(input, 'Carácter no permitido.');
        return;
      }
      if (e.key === ' ') {
        if (input.value.length === 0 || input.value.endsWith(' ')) {
          e.preventDefault();
          flashError(input, 'No se permiten espacios dobles ni al inicio.');
        }
      }
    });

    input.addEventListener('input', () => {
      const pos = input.selectionStart;
      let val = input.value;
      if (/\s{2,}/.test(val)) {
        val = val.replace(/\s{2,}/g, ' ');
        input.value = val;
        input.selectionStart = input.selectionEnd = Math.min(pos, val.length);
      }
      if (val.length >= 1 && val[0] !== val[0].toUpperCase()) {
        input.value = val.charAt(0).toUpperCase() + val.slice(1);
        input.selectionStart = input.selectionEnd = Math.min(pos, input.value.length);
      }
    });

    input.addEventListener('paste', e => {
      e.preventDefault();
      const texto = (e.clipboardData || window.clipboardData).getData('text');
      let limpio = texto.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\s\-,.:;()#°+%/']/g, '');
      limpio = limpio.replace(/\s{2,}/g, ' ').trimStart();
      if (limpio.length > 0) limpio = limpio.charAt(0).toUpperCase() + limpio.slice(1);
      const start = input.selectionStart, end = input.selectionEnd;
      input.value = input.value.slice(0, start) + limpio + input.value.slice(end);
      input.selectionStart = input.selectionEnd = start + limpio.length;
    });
  }

  /* ══════════════════════════════════════════
     HELPERS UI
  ══════════════════════════════════════════ */
  function inyectarError(input) {
    if (!input.parentElement.querySelector('.skyed-error')) {
      const msg = document.createElement('span');
      msg.className = 'skyed-error';
      msg.setAttribute('aria-live', 'polite');
      input.insertAdjacentElement('afterend', msg);
    }
  }

  function showError(input, mensaje) {
    let msg = input.parentElement.querySelector('.skyed-error');
    if (!msg) {
      msg = document.createElement('span');
      msg.className = 'skyed-error';
      input.insertAdjacentElement('afterend', msg);
    }
    msg.textContent = mensaje;
    msg.classList.add('visible');
    input.classList.add('skyed-input-error');
  }

  function clearError(input) {
    const msg = input.parentElement.querySelector('.skyed-error');
    if (msg) { msg.textContent = ''; msg.classList.remove('visible'); }
    input.classList.remove('skyed-input-error');
  }

  function flashError(input, mensaje) {
    showError(input, mensaje);
    setTimeout(() => clearError(input), 2200);
  }

})();