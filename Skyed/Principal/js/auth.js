/* ================================================================
   SkyedAuth — helper genérico de validación para los formularios
   de autenticación de Principal (login / registro / recuperar).
   Usa las mismas reglas que SkyedDeportivo/js/auth.js pero expuestas
   como una API reutilizable: SkyedAuth.initForm() / initDocumentField()
   ================================================================ */
(function () {
  'use strict';

  /* ─── Expresiones regulares base (mismas que en SkyedDeportivo) ─── */
  const RX = {
    nombre   : /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$/,
    email    : /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
    telefono : /^\d{7,15}$/,
    password : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  };

  const DOCUMENTO_RULES = {
    cedula_ciudadania: {
      patron: /^\d{6,10}$/, soloDigitos: true, min: 6, max: 10,
      hint: 'Solo números, entre 6 y 10 dígitos.',
      placeholder: '1234567890', inputmode: 'numeric',
    },
    tarjeta_identidad: {
      patron: /^\d{10,11}$/, soloDigitos: true, min: 10, max: 11,
      hint: 'Solo números, entre 10 y 11 dígitos.',
      placeholder: '10123456789', inputmode: 'numeric',
    },
    cedula_extranjeria: {
      patron: /^[A-Z0-9]{4,12}$/, soloDigitos: false, min: 4, max: 12,
      hint: 'Letras mayúsculas y números, entre 4 y 12 caracteres.',
      placeholder: 'E123456', inputmode: 'text',
    },
    pasaporte: {
      patron: /^[A-Z0-9]{5,20}$/, soloDigitos: false, min: 5, max: 20,
      hint: 'Letras mayúsculas y números, entre 5 y 20 caracteres.',
      placeholder: 'AB1234567', inputmode: 'text',
    },
  };

  /* ─── Utilidades de estado visual (usa css: data-state + .form-error.show) ─── */
  function getError(input) {
    const group = input.closest('.form-group');
    return group ? group.querySelector('.form-error') : null;
  }

  function markValid(input) {
    input.setAttribute('data-state', 'valid');
    const err = getError(input);
    if (err) { err.textContent = ''; err.classList.remove('show'); }
  }

  function markInvalid(input, msg) {
    input.setAttribute('data-state', 'invalid');
    const err = getError(input);
    if (err) { err.textContent = msg; err.classList.add('show'); }
  }

  function clearState(input) {
    input.removeAttribute('data-state');
    const err = getError(input);
    if (err) { err.textContent = ''; err.classList.remove('show'); }
  }

  /* ─── Filtros de escritura en tiempo real ─── */
  function attachNameFilter(input) {
    input.addEventListener('input', () => {
      let val = input.value;
      val = val.replace(/[^A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]/g, '');
      val = val.replace(/^ +/, '').replace(/ {2,}/g, ' ');
      if (val.length > 30) val = val.slice(0, 30);
      val = val.replace(/(^|\s)([a-záéíóúüña-z])/gi, (_, sep, letra) => sep + letra.toUpperCase());
      if (input.value !== val) input.value = val;
    });
  }

  function attachDigitsOnlyFilter(input) {
    input.addEventListener('input', () => {
      const val = input.value.replace(/\D/g, '');
      if (input.value !== val) input.value = val;
    });
  }

  function attachEmailFilter(input) {
    input.addEventListener('input', () => {
      const val = input.value.replace(/\s/g, '').toLowerCase();
      if (input.value !== val) input.value = val;
    });
  }

  /* ─── Toggle de mostrar/ocultar contraseña: [data-toggle-for] ─── */
  function initPasswordToggles(scope) {
    scope.querySelectorAll('[data-toggle-for]').forEach(btn => {
      const target = document.getElementById(btn.dataset.toggleFor);
      if (!target || btn.dataset.toggleBound) return;
      btn.dataset.toggleBound = '1';
      btn.addEventListener('click', () => {
        const icon = btn.querySelector('i');
        const show = target.type === 'password';
        target.type = show ? 'text' : 'password';
        if (icon) {
          icon.classList.toggle('ti-eye', !show);
          icon.classList.toggle('ti-eye-off', show);
        }
        btn.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
      });
    });
  }

  /* ─── Indicador de fuerza de contraseña ─── */
  function updateStrengthMeter(meterId, value) {
    const meter = document.getElementById(meterId);
    if (!meter) return;
    const bars = meter.querySelectorAll('.strength-bars span');
    const label = meter.querySelector('.strength-label');

    if (!value) {
      meter.classList.remove('show');
      bars.forEach(b => (b.style.background = ''));
      return;
    }
    meter.classList.add('show');

    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[a-z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    const colors = ['#f87171', '#f97316', '#f5a623', '#4ade80', '#4ade80'];
    const labels = ['Muy débil', 'Débil', 'Media', 'Fuerte', 'Muy fuerte'];
    const idx = Math.max(0, Math.min(score - 1, 4));

    bars.forEach((b, i) => { b.style.background = i <= idx ? colors[idx] : ''; });
    if (label) label.textContent = value.length ? labels[idx] : '';
  }

  /* ─── Campo dinámico de documento ─── */
  function initDocumentField(numberId, typeId) {
    const numberInput = document.getElementById(numberId);
    const typeSelect = document.getElementById(typeId);
    if (!numberInput || !typeSelect) return;

    function apply(tipo) {
      const regla = DOCUMENTO_RULES[tipo];
      if (!regla) {
        numberInput.disabled = true;
        numberInput.value = '';
        numberInput.placeholder = 'Selecciona primero el tipo';
        numberInput.maxLength = 20;
        numberInput.inputMode = 'text';
        clearState(numberInput);
        return;
      }
      numberInput.disabled = false;
      numberInput.value = '';
      numberInput.placeholder = regla.placeholder;
      numberInput.maxLength = regla.max;
      numberInput.inputMode = regla.inputmode;
      clearState(numberInput);
    }

    typeSelect.addEventListener('change', () => apply(typeSelect.value));
    numberInput.addEventListener('input', () => {
      const regla = DOCUMENTO_RULES[typeSelect.value];
      if (!regla) return;
      let val = numberInput.value;
      val = regla.soloDigitos ? val.replace(/\D/g, '') : val.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      if (val.length > regla.max) val = val.slice(0, regla.max);
      if (numberInput.value !== val) numberInput.value = val;
    });

    apply(typeSelect.value);
  }

  /* ─── Validación de un campo según su tipo de configuración ─── */
  function validateByType(input, cfg, fieldsById) {
    const v = input.value.trim();
    const label = cfg.label || 'Este campo';

    if (input.disabled) { clearState(input); return true; }

    switch (cfg.type) {
      case 'email':
        if (!v) return fail('El correo electrónico es obligatorio.');
        if (!RX.email.test(v)) return fail('Ingresa un correo electrónico válido.');
        return pass();

      case 'password': {
        if (!v) return fail('La contraseña es obligatoria.');
        if (!RX.password.test(v)) return fail('Mínimo 8 caracteres, con mayúscula, minúscula y número.');
        return pass();
      }

      case 'confirmPassword': {
        const other = document.getElementById(cfg.matches);
        if (!v) return fail('Confirma tu contraseña.');
        if (!other || v !== other.value) return fail('Las contraseñas no coinciden.');
        return pass();
      }

      case 'name':
        if (!v) return fail(`${label} es obligatorio.`);
        if (!RX.nombre.test(v)) return fail(`${label} solo puede contener letras.`);
        return pass();

      case 'phone':
        if (!v) return fail('El teléfono es obligatorio.');
        if (!RX.telefono.test(v)) return fail('Ingresa un teléfono válido (7 a 15 dígitos).');
        return pass();

      case 'birthdate': {
        if (!v) return fail('La fecha de nacimiento es obligatoria.');

        const partes = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(v);
        if (!partes) return fail('Formato inválido. Usa la fecha del calendario.');

        const anio = Number(partes[1]);
        const mes = Number(partes[2]);
        const dia = Number(partes[3]);
        const fecha = new Date(anio, mes - 1, dia);
        const esFechaValida = fecha.getFullYear() === anio && fecha.getMonth() === mes - 1 && fecha.getDate() === dia;

        if (!esFechaValida) return fail('La fecha no existe. Revisa el día y el mes.');

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (fecha > hoy) return fail('La fecha no puede ser futura.');

        let edad = hoy.getFullYear() - fecha.getFullYear();
        const m = hoy.getMonth() - fecha.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) edad--;

        if (edad < 10) return fail('Debes tener al menos 10 años para registrarte.');
        return pass();
      }

      case 'select':
        if (!v) return fail(`Selecciona ${label}.`);
        return pass();

      case 'document': {
        const typeInput = document.getElementById(cfg.docTypeId);
        const tipo = typeInput ? typeInput.value : '';
        const regla = DOCUMENTO_RULES[tipo];
        if (!tipo) return fail('Primero selecciona el tipo de documento.');
        if (!v) return fail('El número de documento es obligatorio.');
        if (regla && !regla.patron.test(v)) return fail(regla.hint);
        return pass();
      }

      case 'required':
      default:
        if (!v) return fail(`${label} es obligatorio.`);
        return pass();
    }

    function fail(msg) { markInvalid(input, msg); return false; }
    function pass() { markValid(input); return true; }
  }

  /* ─── API pública: inicializa un formulario completo ─── */
  function initForm(form, fields, onValidSubmit) {
    if (!form) return;

    const byId = {};
    fields.forEach(f => (byId[f.id] = f));

    // Filtros de escritura + toggles de contraseña + medidor de fuerza
    fields.forEach(cfg => {
      const input = document.getElementById(cfg.id);
      if (!input) return;

      if (cfg.type === 'name') attachNameFilter(input);
      if (cfg.type === 'email') attachEmailFilter(input);
      if (cfg.type === 'phone' || input.hasAttribute('data-digits-only')) attachDigitsOnlyFilter(input);

      if (cfg.type === 'password' && cfg.meterId) {
        input.addEventListener('input', () => updateStrengthMeter(cfg.meterId, input.value));
      }
      if (cfg.type === 'confirmPassword') {
        input.addEventListener('input', () => {
          const other = document.getElementById(cfg.matches);
          if (other && other.value) validateByType(input, cfg);
        });
      }

      // Validación "en vivo" al salir del campo
      input.addEventListener('blur', () => {
        if (input.value.trim() || input.tagName === 'SELECT') validateByType(input, cfg);
      });
    });

    initPasswordToggles(form);

    form.addEventListener('submit', function (e) {
      let allValid = true;
      fields.forEach(cfg => {
        const input = document.getElementById(cfg.id);
        if (!input) return;
        if (!validateByType(input, cfg)) allValid = false;
      });

      if (!allValid) {
        e.preventDefault();
        if (typeof window.showToast === 'function') {
          window.showToast('Por favor corrige los campos marcados en rojo.', 'error');
        }
        const firstInvalid = form.querySelector('[data-state="invalid"]');
        if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Si se provee un callback, controlamos el envío nosotros (fetch/JSON).
      // Si no se provee, dejamos que el formulario navegue de forma normal
      // (esto es lo que usa recuperar.html para hablar directo con el PHP
      // de SkyedDeportivo, igual que en la versión original).
      if (typeof onValidSubmit === 'function') {
        e.preventDefault();
        onValidSubmit(form);
      }
    });
  }

  window.SkyedAuth = {
    initForm,
    initDocumentField,
  };
})();
