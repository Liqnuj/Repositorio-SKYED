(function () {

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    const modal = document.getElementById('modal-usuario');
    if (!modal) return;

    bindNombre('mu-nombre');
    bindNombre('mu-apellido');
    bindDocumento('mu-documento');
    bindFecha('mu-fecha');
    bindEmail('mu-email');
    bindTelefono('mu-tel');
    bindDireccion('mu-dir');

    /* Avatar en tiempo real */
    const nombre   = document.getElementById('mu-nombre');
    const apellido = document.getElementById('mu-apellido');
    const email    = document.getElementById('mu-email');
    if (nombre)   nombre.addEventListener('input',   muUpdate);
    if (apellido) apellido.addEventListener('input', muUpdate);
    if (email)    email.addEventListener('input',    () => muUpdateEmail(email));

    /* Botón guardar */
    const btnGuardar = modal.querySelector('.modal-footer .btn-primary');
    if (btnGuardar) {
      btnGuardar.addEventListener('click', function (e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        if (validarTodo()) {
          closeModal('modal-usuario');
          showToast('Usuario guardado ✅', 'success');
        } else {
          const primerError = modal.querySelector('.mu-error.visible');
          if (primerError) primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, true);
    }
  }

  /* ══════════════════════════════════════════
     BIND — NOMBRE / APELLIDO (solo letras)
  ══════════════════════════════════════════ */
  function bindNombre(id) {
    const input = document.getElementById(id);
    if (!input) return;
    inyectarError(input);

    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s\-']$/;

    input.addEventListener('keypress', e => {
      if (!soloLetras.test(e.key)) {
        e.preventDefault();
        flashError(input, 'Solo se permiten letras.');
        return;
      }
      if (e.key === ' ' && (input.value.length === 0 || input.value.endsWith(' '))) {
        e.preventDefault();
        flashError(input, 'No se permiten espacios dobles ni al inicio.');
      }
    });

    input.addEventListener('input', () => {
      const pos = input.selectionStart;
      let val = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s\-']/g, '');
      val = val.replace(/\s{2,}/g, ' ');
      if (val !== input.value) {
        input.value = val;
        input.selectionStart = input.selectionEnd = Math.min(pos, val.length);
      }
      if (val.length >= 1 && val[0] !== val[0].toUpperCase()) {
        input.value = val.charAt(0).toUpperCase() + val.slice(1);
      }
      clearError(input);
    });

    input.addEventListener('paste', e => {
      e.preventDefault();
      const texto = (e.clipboardData || window.clipboardData).getData('text');
      let limpio = texto.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s\-']/g, '');
      limpio = limpio.replace(/\s{2,}/g, ' ').trimStart();
      if (limpio.length > 0) limpio = limpio.charAt(0).toUpperCase() + limpio.slice(1);
      const start = input.selectionStart, end = input.selectionEnd;
      input.value = input.value.slice(0, start) + limpio + input.value.slice(end);
      input.selectionStart = input.selectionEnd = start + limpio.length;
    });
  }

  /* ══════════════════════════════════════════
     BIND — DOCUMENTO (solo números, máx 15)
  ══════════════════════════════════════════ */
  function bindDocumento(id) {
    const input = document.getElementById(id);
    if (!input) return;
    inyectarError(input);

    input.addEventListener('keypress', e => {
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
        flashError(input, 'Solo se permiten números.');
        return;
      }
      if (input.value.replace(/[^0-9]/g, '').length >= 15) {
        e.preventDefault();
        flashError(input, 'Máximo 15 dígitos.');
      }
    });

    input.addEventListener('input', () => {
      const pos = input.selectionStart;
      const limpio = input.value.replace(/[^0-9]/g, '').slice(0, 15);
      if (limpio !== input.value) {
        input.value = limpio;
        input.selectionStart = input.selectionEnd = Math.min(pos, limpio.length);
      }
      clearError(input);
    });

    input.addEventListener('paste', e => {
      e.preventDefault();
      const texto = (e.clipboardData || window.clipboardData).getData('text');
      const limpio = texto.replace(/[^0-9]/g, '').slice(0, 15);
      const start = input.selectionStart, end = input.selectionEnd;
      input.value = input.value.slice(0, start) + limpio + input.value.slice(end);
      input.selectionStart = input.selectionEnd = start + limpio.length;
    });

    input.addEventListener('blur', () => {
      const val = input.value.trim();
      if (!val) return;
      if (val.length < 5) showError(input, 'El documento debe tener al menos 5 dígitos.');
    });
  }

  /* ══════════════════════════════════════════
     BIND — FECHA (no futura, mínimo 13 años)
  ══════════════════════════════════════════ */
  function bindFecha(id) {
    const input = document.getElementById(id);
    if (!input) return;
    inyectarError(input);

    const hoy = new Date(); hoy.setHours(0,0,0,0);
    input.setAttribute('max', hoy.toISOString().split('T')[0]);

    input.addEventListener('change', () => {
      clearError(input);
      const val = input.value;
      if (!val) return;
      const sel = new Date(val + 'T00:00:00');
      if (sel > hoy) {
        input.value = '';
        showError(input, 'La fecha de nacimiento no puede ser futura.');
        return;
      }
      const limite13 = new Date(hoy);
      limite13.setFullYear(limite13.getFullYear() - 13);
      if (sel > limite13) {
        input.value = '';
        showError(input, 'El usuario debe tener al menos 13 años.');
      }
    });
  }

  /* ══════════════════════════════════════════
     BIND — EMAIL (solo @gmail.com)
  ══════════════════════════════════════════ */
  function bindEmail(id) {
    const input = document.getElementById(id);
    if (!input) return;
    inyectarError(input);

    input.addEventListener('input', () => clearError(input));

    input.addEventListener('blur', () => {
      const val = input.value.trim();
      if (!val) return;
      if (!validarEmail(val))
        showError(input, 'Solo se permiten correos Gmail (ej: nombre@gmail.com).');
    });
  }

  function validarEmail(email) {
    return /^[a-zA-Z0-9._%+\-]+@gmail\.com$/i.test(email);
  }

  /* ══════════════════════════════════════════
     BIND — TELÉFONO (7–10 dígitos)
  ══════════════════════════════════════════ */
  function bindTelefono(id) {
    const input = document.getElementById(id);
    if (!input) return;
    inyectarError(input);

    input.addEventListener('keypress', e => {
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
        flashError(input, 'Solo se permiten números.');
        return;
      }
      if (input.value.replace(/[^0-9]/g, '').length >= 10) {
        e.preventDefault();
        flashError(input, 'Máximo 10 dígitos.');
      }
    });

    input.addEventListener('input', () => {
      const pos = input.selectionStart;
      const limpio = input.value.replace(/[^0-9]/g, '').slice(0, 10);
      if (limpio !== input.value) {
        input.value = limpio;
        input.selectionStart = input.selectionEnd = Math.min(pos, limpio.length);
      }
      clearError(input);
    });

    input.addEventListener('paste', e => {
      e.preventDefault();
      const texto = (e.clipboardData || window.clipboardData).getData('text');
      const limpio = texto.replace(/[^0-9]/g, '').slice(0, 10);
      const start = input.selectionStart, end = input.selectionEnd;
      input.value = input.value.slice(0, start) + limpio + input.value.slice(end);
      input.selectionStart = input.selectionEnd = start + limpio.length;
    });

    input.addEventListener('blur', () => {
      const val = input.value.trim();
      if (!val) return;
      if (val.length < 7) showError(input, 'El teléfono debe tener entre 7 y 10 dígitos.');
    });
  }

  /* ══════════════════════════════════════════
     BIND — DIRECCIÓN
  ══════════════════════════════════════════ */
  function bindDireccion(id) {
    const input = document.getElementById(id);
    if (!input) return;
    inyectarError(input);
    input.addEventListener('input', () => clearError(input));
  }

  /* ══════════════════════════════════════════
     VALIDACIÓN COMPLETA AL GUARDAR
  ══════════════════════════════════════════ */
  function validarTodo() {
    let ok = true;

    /* Tipo documento */
    const tipoDoc = document.getElementById('mu-tipo-doc');
    if (tipoDoc && !tipoDoc.value) {
      showErrorSelect(tipoDoc, 'Selecciona el tipo de documento.');
      ok = false;
    } else if (tipoDoc) clearErrorSelect(tipoDoc);

    /* Número documento */
    const doc = document.getElementById('mu-documento');
    if (doc) {
      clearError(doc);
      if (!doc.value.trim()) {
        showError(doc, 'El número de documento es obligatorio.');
        ok = false;
      } else if (doc.value.trim().length < 5) {
        showError(doc, 'El documento debe tener al menos 5 dígitos.');
        ok = false;
      }
    }

    /* Fecha */
    const fecha = document.getElementById('mu-fecha');
    if (fecha && fecha.value) {
      clearError(fecha);
      const hoy = new Date(); hoy.setHours(0,0,0,0);
      const sel = new Date(fecha.value + 'T00:00:00');
      if (sel > hoy) {
        showError(fecha, 'La fecha no puede ser futura.');
        ok = false;
      } else {
        const limite13 = new Date(hoy);
        limite13.setFullYear(limite13.getFullYear() - 13);
        if (sel > limite13) {
          showError(fecha, 'El usuario debe tener al menos 13 años.');
          ok = false;
        }
      }
    }

    /* Email */
    const email = document.getElementById('mu-email');
    if (email && email.value.trim()) {
      clearError(email);
      if (!validarEmail(email.value.trim())) {
        showError(email, 'Solo se permiten correos Gmail (ej: nombre@gmail.com).');
        ok = false;
      }
    }

    /* Teléfono */
    const tel = document.getElementById('mu-tel');
    if (tel && tel.value.trim()) {
      clearError(tel);
      if (tel.value.trim().length < 7) {
        showError(tel, 'El teléfono debe tener entre 7 y 10 dígitos.');
        ok = false;
      }
    }

    return ok;
  }

  /* ══════════════════════════════════════════
     AVATAR (expuestas globalmente)
  ══════════════════════════════════════════ */
  window.muUpdate = function () {
    const n = (document.getElementById('mu-nombre')?.value || '').trim();
    const a = (document.getElementById('mu-apellido')?.value || '').trim();
    const ini = [(n[0] || ''), (a[0] || '')].join('').toUpperCase() || '?';
    const av = document.getElementById('mu-av');
    const nm = document.getElementById('mu-av-name');
    if (av) av.textContent = ini;
    if (nm) nm.textContent = [n, a].filter(Boolean).join(' ') || 'Nombre del usuario';
  };

  window.muUpdateEmail = function (input) {
    const el = document.getElementById('mu-av-email');
    if (el) el.textContent = (input.value || '').trim() || 'correo@ejemplo.com';
  };

  /* ══════════════════════════════════════════
     HELPERS UI
  ══════════════════════════════════════════ */
  function inyectarError(input) {
    if (!input.parentElement.querySelector('.mu-error')) {
      const msg = document.createElement('span');
      msg.className = 'mu-error';
      msg.setAttribute('aria-live', 'polite');
      input.insertAdjacentElement('afterend', msg);
    }
  }

  function showError(input, mensaje) {
    let msg = input.parentElement.querySelector('.mu-error');
    if (!msg) { msg = document.createElement('span'); msg.className = 'mu-error'; input.insertAdjacentElement('afterend', msg); }
    msg.textContent = mensaje;
    msg.classList.add('visible');
    input.style.borderColor = '#E24B4A';
  }

  function clearError(input) {
    const msg = input.parentElement.querySelector('.mu-error');
    if (msg) { msg.textContent = ''; msg.classList.remove('visible'); }
    input.style.borderColor = '';
  }

  function showErrorSelect(sel, mensaje) {
    let msg = sel.parentElement.querySelector('.mu-error');
    if (!msg) { msg = document.createElement('span'); msg.className = 'mu-error'; sel.insertAdjacentElement('afterend', msg); }
    msg.textContent = mensaje;
    msg.classList.add('visible');
    sel.style.borderColor = '#E24B4A';
  }

  function clearErrorSelect(sel) {
    const msg = sel.parentElement.querySelector('.mu-error');
    if (msg) { msg.textContent = ''; msg.classList.remove('visible'); }
    sel.style.borderColor = '';
  }

  function flashError(input, mensaje) {
    showError(input, mensaje);
    setTimeout(() => clearError(input), 2200);
  }

})();