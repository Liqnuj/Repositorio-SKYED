/* ─── Expresiones regulares base ─────────────────────────────── */
const RX = {
  soloLetras  : /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ]+$/,
  email       : /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
  telefono    : /^\d{7,15}$/,
  password : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
};

const DOCUMENTO_RULES = {
  cedula_ciudadania: {
    patron      : /^\d{6,10}$/,
    soloDigitos : true,
    mayusculas  : false,
    min         : 6,
    max         : 10,
    label       : 'Cédula de ciudadanía',
    hint        : 'Solo números, entre 6 y 10 dígitos.',
    placeholder : '1234567890',
    inputmode   : 'numeric',
  },
  tarjeta_identidad: {
    patron      : /^\d{10,11}$/,
    soloDigitos : true,
    mayusculas  : false,
    min         : 10,
    max         : 11,
    label       : 'Tarjeta de identidad',
    hint        : 'Solo números, entre 10 y 11 dígitos.',
    placeholder : '10123456789',
    inputmode   : 'numeric',
  },
  cedula_extranjeria: {
    patron      : /^[A-Z0-9]{4,12}$/,
    soloDigitos : false,
    mayusculas  : true,
    min         : 4,
    max         : 12,
    label       : 'Cédula de extranjería',
    hint        : 'Letras mayúsculas y números, entre 4 y 12 caracteres.',
    placeholder : 'E123456',
    inputmode   : 'text',
  },
  pasaporte: {
    patron      : /^[A-Z0-9]{5,20}$/,
    soloDigitos : false,
    mayusculas  : true,
    min         : 5,
    max         : 20,
    label       : 'Pasaporte',
    hint        : 'Letras mayúsculas y números, entre 5 y 20 caracteres.',
    placeholder : 'AB1234567',
    inputmode   : 'text',
  },
};

/* ─── Mensajes de ayuda generales por campo ──────────────────── */
const HINTS = {
  nombre           : 'Solo letras, primera en mayúscula, máx. 30 caracteres, sin números ni más de un espacio entre palabras.',
  apellido         : 'Solo letras, primera en mayúscula, máx. 30 caracteres, sin números ni más de un espacio entre palabras.',
  email            : 'Formato válido: tucorreo@gmail.com',
  telefono         : 'Solo números, entre 7 y 15 dígitos.',
  password         : 'Mínimo 8 caracteres con al menos 1 mayúscula, 1 minúscula y 1 número.',
  'password-confirm': 'Debe coincidir exactamente con la contraseña anterior.',
  'fecha-nacimiento': 'Debes tener al menos 10 años.',
};

/* ================================================================
   UTILIDAD: MARCAR CAMPO VÁLIDO / INVÁLIDO
   ================================================================ */
function setField(input, ok, msg) {
  input.classList.toggle('valid',   ok);
  input.classList.toggle('invalid', !ok);

  let errEl = null;

  if (input.dataset.validate === 'checkbox') {
    /* El .error del checkbox está como hermano siguiente de .checkbox-row */
    const row = input.closest('.checkbox-row');
    errEl = row?.nextElementSibling?.classList.contains('error')
      ? row.nextElementSibling
      : null;
    /* Fallback: crearlo si no existe */
    if (!errEl && row) {
      errEl = document.createElement('span');
      errEl.className = 'error error-terms';
      row.parentNode.insertBefore(errEl, row.nextSibling);
    }
  } else {
    /* Campos normales: el .error está dentro de .form-group */
    const group = input.closest('.form-group');
    if (!group) return;
    errEl = group.querySelector('.error');
    if (!errEl) {
      errEl = document.createElement('span');
      errEl.className = 'error';
      group.appendChild(errEl);
    }
  }

  if (!errEl) return;

  if (ok) {
    errEl.textContent = '';
    errEl.classList.remove('show');
  } else {
    const hint = HINTS[input.dataset.validate] || '';
    errEl.innerHTML = `<strong>⚠ ${msg}</strong>${hint ? `<br><small>${hint}</small>` : ''}`;
    errEl.classList.add('show');
  }
}

/* ================================================================
   GESTIÓN DINÁMICA DEL CAMPO DOCUMENTO
   Se llama cada vez que cambia el select de tipo de documento
   ================================================================ */
function actualizarCampoDocumento(tipo) {
  const docInput = document.getElementById('documento');
  if (!docInput) return;

  /* Sin selección: resetear a estado neutral */
  if (!tipo || !DOCUMENTO_RULES[tipo]) {
    docInput.placeholder  = 'Selecciona primero el tipo';
    docInput.maxLength    = 20;
    docInput.inputMode    = 'text';
    docInput.disabled     = true;
    docInput.value        = '';
    docInput.classList.remove('valid', 'invalid');
    const errEl = docInput.closest('.form-group')?.querySelector('.error');
    if (errEl) { errEl.textContent = ''; errEl.classList.remove('show'); }
    return;
  }

  const regla = DOCUMENTO_RULES[tipo];
  docInput.disabled     = false;
  docInput.placeholder  = regla.placeholder;
  docInput.maxLength    = regla.max;
  docInput.inputMode    = regla.inputmode;
  docInput.value        = '';               // limpiar al cambiar tipo
  docInput.classList.remove('valid', 'invalid');

  /* Actualizar hint visual debajo del campo */
  const group = docInput.closest('.form-group');
  let helpEl  = group?.querySelector('.help-doc');
  if (!helpEl && group) {
    helpEl = document.createElement('span');
    helpEl.className = 'help help-doc';
    group.insertBefore(helpEl, group.querySelector('.error'));
  }
  if (helpEl) helpEl.textContent = regla.hint;

  /* Limpiar error previo */
  const errEl = group?.querySelector('.error');
  if (errEl) { errEl.textContent = ''; errEl.classList.remove('show'); }
}

/* ================================================================
   FILTROS DE ESCRITURA EN TIEMPO REAL
   ================================================================ */

/** Nombre / Apellido: capitaliza, bloquea dígitos y doble espacio */
function filtroNombreApellido(e) {
  const input = e.target;
  let val = input.value;

  val = val.replace(/[^A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]/g, '');
  val = val.replace(/^ +/, '');
  val = val.replace(/ {2,}/g, ' ');
  if (val.length > 30) val = val.slice(0, 30);

  val = val.replace(/(^|\s)([a-záéíóúüña-z])/gi,
    (_, sep, letra) => sep + letra.toUpperCase());

  if (input.value !== val) {
    const pos = input.selectionStart - (input.value.length - val.length);
    input.value = val;
    try { input.setSelectionRange(pos, pos); } catch (_) {}
  }
}

/** Teléfono: solo dígitos */
function filtroSoloNumeros(e) {
  const input = e.target;
  const val   = input.value.replace(/\D/g, '');
  if (input.value !== val) input.value = val;
}

/** Email: sin espacios, minúsculas */
function filtroEmail(e) {
  const input = e.target;
  const val   = input.value.replace(/\s/g, '').toLowerCase();
  if (input.value !== val) input.value = val;
}

/**
 * Documento: aplica el filtro según el tipo seleccionado.
 * - Solo dígitos para CC y TI
 * - Letras mayúsculas + dígitos para CE y Pasaporte
 */
function filtroDocumento(e) {
  const input     = e.target;
  const tipoSel   = document.getElementById('tipoDocumento');
  const tipo      = tipoSel?.value || '';
  const regla     = DOCUMENTO_RULES[tipo];
  if (!regla) return;

  let val = input.value;

  if (regla.soloDigitos) {
    /* CC, TI: eliminar todo lo que no sea dígito */
    val = val.replace(/\D/g, '');
  } else {
    /* CE, Pasaporte: eliminar lo que no sea letra o dígito, forzar mayúsculas */
    val = val.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  }

  /* Respetar maxLength de la regla */
  if (val.length > regla.max) val = val.slice(0, regla.max);

  if (input.value !== val) input.value = val;
}

/** Bloquear teclas no numéricas (para campos de solo dígitos) */
function bloquearTeclasNoNumericas(e) {
  const permitidas = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'];
  if (permitidas.includes(e.key)) return;
  if (!/^\d$/.test(e.key)) e.preventDefault();
}

/** Bloquear teclas inválidas para documento (letras+dígitos o solo dígitos según tipo) */
function bloquearTeclasDocumento(e) {
  const permitidas = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'];
  if (permitidas.includes(e.key)) return;

  const tipoSel = document.getElementById('tipoDocumento');
  const tipo    = tipoSel?.value || '';
  const regla   = DOCUMENTO_RULES[tipo];
  if (!regla) { e.preventDefault(); return; }

  if (regla.soloDigitos) {
    if (!/^\d$/.test(e.key)) e.preventDefault();
  } else {
    /* CE / Pasaporte: solo letras y dígitos */
    if (!/^[A-Za-z0-9]$/.test(e.key)) e.preventDefault();
  }
}

/* ================================================================
   VALIDACIÓN DE CADA CAMPO
   ================================================================ */

function validateField(input) {
  const v = input.value.trim();
  const t = input.dataset.validate;

  /* ── Obligatorio ── */
  if (input.required && v === '') {
    setField(input, false, 'Este campo es obligatorio.');
    return false;
  }

  /* ── Nombre / Apellido ── */
  if (t === 'nombre' || t === 'apellido') {
    if (v.length < 2) { setField(input, false, 'Mínimo 2 caracteres.'); return false; }
    if (v.length > 30) { setField(input, false, 'Máximo 30 caracteres.'); return false; }
    if (/\d/.test(v)) { setField(input, false, 'No se permiten números.'); return false; }
    if (/ {2,}/.test(v)) { setField(input, false, 'No se permiten dos espacios seguidos.'); return false; }
    const palabras = v.split(' ');
    if (palabras.some(p => !RX.soloLetras.test(p))) {
      setField(input, false, 'Solo letras, sin caracteres especiales.'); return false;
    }
    const correcto = palabras.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    if (v !== correcto) {
      setField(input, false, 'La primera letra debe ir en mayúscula.'); return false;
    }
  }

  /* ── Documento (con reglas por tipo) ── */
  if (t === 'documento') {
    const tipoSel = document.getElementById('tipoDocumento');
    const tipo    = tipoSel?.value || '';
    const regla   = DOCUMENTO_RULES[tipo];

    if (!tipo) {
      setField(input, false, 'Primero selecciona el tipo de documento.');
      return false;
    }

    if (!regla) {
      setField(input, false, 'Tipo de documento no reconocido.');
      return false;
    }

    if (v.length < regla.min) {
      setField(input, false,
        `Para ${regla.label} el mínimo es ${regla.min} caracteres. — ${regla.hint}`);
      return false;
    }

    if (v.length > regla.max) {
      setField(input, false,
        `Para ${regla.label} el máximo es ${regla.max} caracteres. — ${regla.hint}`);
      return false;
    }

    if (!regla.patron.test(v)) {
      if (regla.soloDigitos) {
        setField(input, false,
          `La ${regla.label} solo admite números (${regla.min}–${regla.max} dígitos).`);
      } else {
        setField(input, false,
          `El ${regla.label} solo admite letras mayúsculas y números (${regla.min}–${regla.max} caracteres).`);
      }
      return false;
    }
  }

  /* ── Email ── */
  if (t === 'email') {
    if (!RX.email.test(v)) {
      setField(input, false, 'El correo no tiene un formato válido.'); return false;
    }
    const [usuario, dominio] = v.split('@');
    if (!usuario || dominio?.split('.').some(p => !p)) {
      setField(input, false, 'El correo no tiene un formato válido.'); return false;
    }
  }

  /* ── Teléfono ── */
  if (t === 'telefono') {
    if (!/^\d+$/.test(v)) {
      setField(input, false, 'Solo se permiten números.'); return false;
    }
    if (!RX.telefono.test(v)) {
      setField(input, false, 'El teléfono debe tener entre 7 y 15 dígitos.'); return false;
    }
  }

  /* ── Contraseña ── */
  if (t === 'password') {
    if (v.length < 8) {
      setField(input, false, 'Mínimo 8 caracteres.'); return false;
    }
    if (!RX.password.test(v)) {
      setField(input, false, 'Debe incluir mayúscula, minúscula y un número.'); return false;
    }
  }

  /* ── Confirmar contraseña ── */
  if (t === 'password-confirm') {
    const pwInput = document.querySelector('[data-validate="password"]');
    if (pwInput && v !== pwInput.value) {
      setField(input, false, 'Las contraseñas no coinciden.'); return false;
    }
  }

  /* ── Fecha de nacimiento ── */
  if (t === 'fecha-nacimiento') {
    const res = validarFechaNacimiento(v);
    if (!res.ok) { setField(input, false, res.msg); return false; }
  }

  /* ── Select genérico ── */
  if (t === 'select') {
    if (!v) { setField(input, false, 'Selecciona una opción válida.'); return false; }
  }

  /* ── Checkbox de términos ── */
  if (t === 'checkbox') {
    if (!input.checked) {
      setField(input, false, 'Debes aceptar los términos para continuar.'); return false;
    }
  }
  setField(input, true, '');
  return true;
}



function validarFechaNacimiento(valor) {
  if (!valor) return { ok: false, msg: 'La fecha de nacimiento es obligatoria.' };

  let dia, mes, anio;
  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    [anio, mes, dia] = valor.split('-').map(Number);
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
    [dia, mes, anio] = valor.split('/').map(Number);
  } else {
    return { ok: false, msg: 'Formato inválido. Usa DD/MM/AAAA.' };
  }

  const fecha = new Date(anio, mes - 1, dia);
  if (fecha.getFullYear() !== anio || fecha.getMonth() !== mes - 1 || fecha.getDate() !== dia) {
    return { ok: false, msg: 'La fecha no existe (revisa el día y el mes).' };
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (fecha >= hoy)
    return { ok: false, msg: 'La fecha de nacimiento no puede ser hoy ni futura.' };
  if (anio === hoy.getFullYear())
    return { ok: false, msg: `El año de nacimiento no puede ser ${hoy.getFullYear()}.` };

  const cumple10 = new Date(anio + 10, mes - 1, dia);
  if (hoy < cumple10)
    return { ok: false, msg: 'Debes tener al menos 10 años para registrarte.' };

  if (hoy.getFullYear() - anio > 120)
    return { ok: false, msg: 'Ingresa una fecha de nacimiento válida.' };

  return { ok: true, msg: '' };
}

/* ================================================================
   ADJUNTAR FILTROS Y VALIDACIÓN EN TIEMPO REAL
   ================================================================ */
function attachFilters(form) {
  form.querySelectorAll('[data-validate]').forEach(input => {
    const t = input.dataset.validate;

    /* ── Nombre / Apellido ── */
    if (t === 'nombre' || t === 'apellido') {
      input.addEventListener('input', filtroNombreApellido);
      input.addEventListener('keydown', e => {
        const perm = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End',' '];
        if (perm.includes(e.key)) return;
        if (/^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ]$/.test(e.key)) return;
        e.preventDefault();
      });
    }

    /* ── Teléfono ── */
    if (t === 'telefono') {
      input.addEventListener('input',   filtroSoloNumeros);
      input.addEventListener('keydown', bloquearTeclasNoNumericas);
      input.addEventListener('paste', e => {
        const txt = (e.clipboardData || window.clipboardData).getData('text');
        if (!/^\d+$/.test(txt)) e.preventDefault();
      });
    }

    /* ── Documento ── */
    if (t === 'documento') {
      input.addEventListener('input',   filtroDocumento);
      input.addEventListener('keydown', bloquearTeclasDocumento);
      input.addEventListener('paste', e => {
        /* Validar lo pegado según el tipo activo */
        setTimeout(() => filtroDocumento({ target: input }), 0);
      });
    }

    /* ── Email ── */
    if (t === 'email') {
      input.addEventListener('input', filtroEmail);
      input.addEventListener('paste', () =>
        setTimeout(() => filtroEmail({ target: input }), 0));
    }

    /* ── Checkbox: validar al marcar/desmarcar ── */
    if (t === 'checkbox') {
      input.addEventListener('change', () => validateField(input));
    }

    /* ── Select: validar al cambiar opción ── */
    if (input.tagName === 'SELECT') {
      input.addEventListener('change', () => validateField(input));
    }

    /* ── Resto: validar al perder foco y en tiempo real si ya inválido ── */
    if (t !== 'checkbox') {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) validateField(input);
      });
    }
  });
}

/* ================================================================
   BARRA DE FORTALEZA DE CONTRASEÑA
   ================================================================ */

function initPasswordStrength(form) {
  const pwInput = form.querySelector('[data-validate="password"]');
  const pwBar   = form.querySelector('.password-strength .bar');
  const pwLabel = form.querySelector('.password-strength .label');
  if (!pwInput || !pwBar) return;

  const niveles = [
    { color: '#dc2626', texto: 'Muy débil'  },
    { color: '#f97316', texto: 'Débil'      },
    { color: '#eab308', texto: 'Aceptable'  },
    { color: '#16a34a', texto: 'Fuerte'     },
    { color: '#0ea5e9', texto: 'Muy fuerte' },
  ];

  pwInput.addEventListener('input', () => {
    const v = pwInput.value;
    let score = 0;
    if (v.length >= 8)           score++;
    if (v.length >= 12)          score++;
    if (/[A-Z]/.test(v))         score++;
    if (/\d/.test(v))            score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;

    const idx = Math.min(score, niveles.length) - 1;
    pwBar.style.width      = (score * 20) + '%';
    pwBar.style.background = idx >= 0 ? niveles[idx].color : '#e5e7eb';
    if (pwLabel) pwLabel.textContent = idx >= 0 ? niveles[idx].texto : '';
  });
}

/* ================================================================
   TOGGLE MOSTRAR / OCULTAR CONTRASEÑA
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    const toggleButtons = document.querySelectorAll('.toggle-pass');

    toggleButtons.forEach(button => {
        
        button.addEventListener('click', function(e) {
            e.preventDefault(); 
            
            const input = this.previousElementSibling;
            
            if (input && input.tagName === 'INPUT') {
                if (input.type === 'password') {
                    input.type = 'text';
                    this.textContent = '🙈'; 
                } else {
                    input.type = 'password';
                    this.textContent = '👁'; 
                }
            } 
        });
    });
});
// Asegurarnos de que el HTML haya cargado
document.addEventListener('DOMContentLoaded', () => {

    // --- NUEVO: VALIDACIÓN DE CONTRASEÑAS EN TIEMPO REAL ---
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('password-confirm');

    // Función que revisa si son iguales
    function chequearCoincidencia() {
        // Solo empezamos a validar si ya escribieron algo en "Confirmar"
        if (confirmInput.value === '') {
            // Si está vacío, quitamos las alertas
            confirmInput.classList.remove('valid', 'invalid');
            const errorSpan = confirmInput.closest('.form-group').querySelector('.error');
            if(errorSpan) {
                errorSpan.textContent = '';
                errorSpan.classList.remove('show');
            }
            return;
        }
        const errorSpan = confirmInput.closest('.form-group').querySelector('.error');

        if (passwordInput.value === confirmInput.value) {
            // ✅ SÍ COINCIDEN
            confirmInput.classList.remove('invalid');
            confirmInput.classList.add('valid'); 
            
            if (errorSpan) {
                errorSpan.textContent = '¡Las contraseñas coinciden!';
                // Forzamos el color a verde para el éxito
                errorSpan.style.color = 'var(--success, #2e7d32)'; 
                errorSpan.classList.add('show');
            }
        } else {
            // ❌ NO COINCIDEN
            confirmInput.classList.remove('valid');
            confirmInput.classList.add('invalid'); 
            
            if (errorSpan) {
                errorSpan.textContent = 'Las contraseñas no coinciden.';
                // Volvemos al color rojo de error
                errorSpan.style.color = 'var(--danger, #e74c3c)'; 
                errorSpan.classList.add('show');
            }
        }
    }
    if (passwordInput && confirmInput) {
        passwordInput.addEventListener('input', chequearCoincidencia);
        confirmInput.addEventListener('input', chequearCoincidencia);
    }
});

/* ================================================================
   LÍMITES EN EL SELECTOR DE FECHA
   ================================================================ */

function initDateLimits() {
  const fechaInput = document.querySelector('[data-validate="fecha-nacimiento"]');
  if (!fechaInput) return;

  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  fechaInput.setAttribute('max', ayer.toISOString().split('T')[0]);

  const min120 = new Date();
  min120.setFullYear(min120.getFullYear() - 120);
  fechaInput.setAttribute('min', min120.toISOString().split('T')[0]);
}

/* ================================================================
   LISTENER PRINCIPAL DEL SELECT DE TIPO DE DOCUMENTO
   ================================================================ */

function initTipoDocumento() {
  const tipoSel  = document.getElementById('tipoDocumento');
  const docInput = document.getElementById('documento');
  if (!tipoSel || !docInput) return;

  /* Estado inicial: campo deshabilitado hasta que se elija tipo */
  actualizarCampoDocumento('');

  tipoSel.addEventListener('change', () => {
    actualizarCampoDocumento(tipoSel.value);
    /* Revalidar el select de tipo */
    validateField(tipoSel);
  });

  /* Si al cargar la página ya hay un valor (ej. back del navegador) */
  if (tipoSel.value) actualizarCampoDocumento(tipoSel.value);
}

/* ================================================================
   VALIDACIÓN COMPLETA DEL FORMULARIO
   ================================================================ */

function validateForm(form) {
  let ok = true;
  form.querySelectorAll('[data-validate]').forEach(input => {
    if (!validateField(input)) ok = false;
  });
  return ok;
}

/* ================================================================
   FORMULARIO DE REGISTRO
   ================================================================ */

const regForm = document.getElementById('register-form');
if (regForm) {
  initTipoDocumento();
  attachFilters(regForm);
  initPasswordStrength(regForm);
  initDateLimits();

  regForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateForm(regForm)) {
      showToast('Por favor corrige los campos marcados en rojo.', 'error');
      const primero = regForm.querySelector('.invalid');
      if (primero) primero.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const formData = {
      tipoDocumento : regForm.tipoDocumento?.value.trim()  || '',
      documento     : regForm.documento?.value.trim()      || '',
      nombre        : regForm.nombre?.value.trim()         || '',
      apellido      : regForm.apellido?.value.trim()       || '',
      email         : regForm.email?.value.trim()          || '',
      telefono      : regForm.telefono?.value.trim()       || '',
      fechaNac      : regForm.fechaNac?.value              || '',
      rh            : regForm.rh?.value                    || '',
      password      : regForm.password?.value              || '',
    };

    try {
      const response = await fetch('php/registro.php', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify(formData),
      });
      const result = await response.json();

      if (result.ok) {
        showToast('¡Registro exitoso! Bienvenido a SKYED.', 'success');
        setTimeout(() => location.href = 'login.html', 1400);
      } else {
        showToast(result.error || 'Error en el servidor. Intenta de nuevo.', 'error');
      }
    } catch {
      showToast('Error de conexión. Verifica tu internet.', 'error');
    }
  });
}

/* ===== Indicador de fortaleza de contraseña ===== */
const pwInput = document.querySelector('[data-validate="password"]');
const pwBar = document.querySelector('.password-strength .bar');
if (pwInput && pwBar) {
  pwInput.addEventListener('input', () => {
    const v = pwInput.value;
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[a-z]/.test(v)) score++;
    if (/\d/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    const colors = ['#dc2626','#f97316','#eab308','#16a34a','#16a34a'];
    pwBar.style.width = (score * 20) + '%';
    pwBar.style.background = colors[Math.max(0,score-1)] || '#dc2626';
  });
}

/* ===== Formulario login ===== */
const loginForm = document.getElementById('login-form');
if (loginForm) {
  attachFilters(loginForm); 
  
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateForm(loginForm)) { 
        showToast('Revisa los campos en rojo', 'error'); 
        return; 
    }
    
    const formData = {
        email: loginForm.email.value.trim().toLowerCase(),
        password: loginForm.password.value
    };
    
    try {
        const response = await fetch('php/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        if (result.ok) {
            showToast(`¡Bienvenido, ${result.usuario.nombre}!`, 'success');
            
            // Limpiar datos del usuario anterior antes de guardar el nuevo
            localStorage.removeItem('cicloUser');
            localStorage.removeItem('cicloVentas');
            localStorage.removeItem('cicloNotif');

            // LÓGICA DE REDIRECCIÓN POR ROL
            const ruta = (result.usuario.rol === 'adminDeportivo') ? 'admin.php' : 'php/participante.php';
            
            setTimeout(() => {
                location.href = ruta;
            }, 1000);
            
        } else {
            showToast(result.error || 'Correo o contraseña incorrectos', 'error');
        }
    } catch (error) {
        showToast('Error de conexión con el servidor', 'error');
    }
  });
}

/* ===== Formulario CAMBIAR CONTRASEÑA (PHP) ===== */
const resetPassForm = document.getElementById('reset-password-form');
if (resetPassForm) {
    // 1. Enciende las validaciones en vivo (mensajes de error, letras, números)
    attachFilters(resetPassForm);
    
    // 2. Enciende la barra de colores
    initPasswordStrength(resetPassForm);

    // 3. Valida todo antes de enviar al PHP
    resetPassForm.addEventListener('submit', function(e) {
        if (!validateForm(resetPassForm)) {
            e.preventDefault(); // Detiene el envío si hay errores
            showToast('Por favor, cumple con los requisitos de la contraseña', 'error');
        }
    });
}