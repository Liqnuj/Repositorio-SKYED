document.addEventListener('DOMContentLoaded', function () {

  /* ── Nombre: sin números, auto-capitalizar, sin doble espacio ── */
  const kitNombre = document.getElementById('kit-nombre');
  if (kitNombre) {
    kitNombre.addEventListener('keypress', function (e) {
      if (/[0-9]/.test(e.key)) {
        e.preventDefault();
        mostrarErrorKit('kit-nombre', 'No se pueden ingresar números en este campo');
      }
    });
    kitNombre.addEventListener('input', function () {
      if (/[0-9]/.test(this.value)) {
        this.value = this.value.replace(/[0-9]/g, '');
        mostrarErrorKit('kit-nombre', 'No se pueden ingresar números en este campo');
      } else if (/  /.test(this.value)) {
        this.value = this.value.replace(/  +/g, ' ');
        mostrarErrorKit('kit-nombre', 'No se permiten espacios dobles');
      } else {
        limpiarErrorCampo('kit-nombre');
      }
      if (this.value.length === 1) this.value = this.value.toUpperCase();
    });
    kitNombre.addEventListener('blur', function () {
      if (!this.value.trim()) {
        mostrarErrorKit('kit-nombre', 'El nombre del kit es obligatorio');
      }
    });
  }

  /* ── Stock: mínimo 1, solo enteros ── */
  const kitStock = document.getElementById('kit-stock');
  if (kitStock) {
    kitStock.addEventListener('keypress', function (e) {
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
        mostrarErrorKit('kit-stock', 'Solo se permiten números enteros');
      }
    });
    kitStock.addEventListener('input', function () {
      this.value = this.value.replace(/[^0-9]/g, '');
      if (this.value === '0') this.value = '';
      limpiarErrorCampo('kit-stock');
    });
    kitStock.addEventListener('blur', function () {
      const val = parseInt(this.value);
      if (!this.value.trim()) {
        mostrarErrorKit('kit-stock', 'El stock es obligatorio');
      } else if (isNaN(val) || val < 1) {
        this.value = '';
        mostrarErrorKit('kit-stock', 'El stock mínimo es 1');
      }
    });
  }

  /* ── Fecha: ningún día anterior a hoy ── */
  const kitFecha = document.getElementById('kit-fecha');
  if (kitFecha) {
    const hoy  = new Date();
    const yyyy = hoy.getFullYear();
    const mm   = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd   = String(hoy.getDate()).padStart(2, '0');
    kitFecha.min = `${yyyy}-${mm}-${dd}`;

    kitFecha.addEventListener('change', function () {
      limpiarErrorCampo('kit-fecha');
      const sel    = new Date(this.value + 'T00:00:00');
      const hoyMin = new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
      if (sel < hoyMin) {
        this.value = '';
        mostrarErrorKit('kit-fecha', 'La fecha no puede ser anterior a hoy');
      }
    });
    kitFecha.addEventListener('blur', function () {
      if (!this.value) {
        mostrarErrorKit('kit-fecha', 'La fecha de entrega es obligatoria');
      }
    });
  }

  /* ── Dorsal: solo números, obligatorio ── */
  const kitDorsal = document.getElementById('kit-dorsal');
  if (kitDorsal) {
    kitDorsal.addEventListener('keypress', function (e) {
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
        mostrarErrorKit('kit-dorsal', 'El dorsal solo puede contener números');
      }
    });
    kitDorsal.addEventListener('input', function () {
      if (/[^0-9]/.test(this.value)) {
        this.value = this.value.replace(/[^0-9]/g, '');
        mostrarErrorKit('kit-dorsal', 'El dorsal solo puede contener números');
      } else {
        limpiarErrorCampo('kit-dorsal');
      }
    });
    kitDorsal.addEventListener('blur', function () {
      if (!this.value.trim()) {
        mostrarErrorKit('kit-dorsal', 'El número dorsal es obligatorio');
      }
    });
  }

  /* ── Lugar: sin números ── */
  const kitLugar = document.getElementById('kit-lugar');
  if (kitLugar) {
    kitLugar.addEventListener('keypress', function (e) {
      if (/[0-9]/.test(e.key)) {
        e.preventDefault();
        mostrarErrorKit('kit-lugar', 'No se pueden ingresar números en este campo');
      }
    });
    kitLugar.addEventListener('input', function () {
      if (/[0-9]/.test(this.value)) {
        this.value = this.value.replace(/[0-9]/g, '');
        mostrarErrorKit('kit-lugar', 'No se pueden ingresar números en este campo');
      } else if (/  /.test(this.value)) {
        this.value = this.value.replace(/  +/g, ' ');
        mostrarErrorKit('kit-lugar', 'No se permiten espacios dobles');
      } else {
        limpiarErrorCampo('kit-lugar');
      }
      if (this.value.length === 1) this.value = this.value.toUpperCase();
    });
    kitLugar.addEventListener('blur', function () {
      if (!this.value.trim()) {
        mostrarErrorKit('kit-lugar', 'El lugar de entrega es obligatorio');
      }
    });
  }

  /* ── Talla: selección obligatoria ── */
  const kitTalla = document.getElementById('kit-talla');
  if (kitTalla) {
    kitTalla.addEventListener('change', function () {
      if (this.value) {
        limpiarErrorCampo('kit-talla');
      }
    });
    kitTalla.addEventListener('blur', function () {
      if (!this.value) {
        mostrarErrorKit('kit-talla', 'La talla de camiseta es obligatoria');
      }
    });
  }

  /* ── Contenido: auto-capitalizar, sin doble espacio, obligatorio ── */
  const kitContenido = document.getElementById('kit-contenido');
  if (kitContenido) {
    kitContenido.addEventListener('input', function () {
      if (this.value.length === 1) this.value = this.value.toUpperCase();
      if (/  /.test(this.value)) {
        this.value = this.value.replace(/  +/g, ' ');
        mostrarErrorKit('kit-contenido', 'No se permiten espacios dobles');
      } else {
        limpiarErrorCampo('kit-contenido');
      }
    });
    kitContenido.addEventListener('blur', function () {
      if (!this.value.trim()) {
        mostrarErrorKit('kit-contenido', 'El contenido del kit es obligatorio');
      }
    });
  }

});


/* ── Helpers ── */
function mostrarErrorKit(campoId, mensaje) {
  const campo = document.getElementById(campoId);
  if (!campo) return;

  campo.classList.add('kit-input-error');

  const grupo = campo.closest('.kit-form-group');
  if (!grupo) return;

  let err = grupo.querySelector('.kit-error-msg');
  if (!err) {
    err = document.createElement('span');
    err.className = 'kit-error-msg';
    grupo.appendChild(err);
  }
  err.textContent = mensaje;
}

function limpiarErrorCampo(campoId) {
  const campo = document.getElementById(campoId);
  if (!campo) return;
  campo.classList.remove('kit-input-error');
  const grupo = campo.closest('.kit-form-group');
  if (grupo) {
    const err = grupo.querySelector('.kit-error-msg');
    if (err) err.remove();
  }
}

function limpiarErroresKit() {
  document.querySelectorAll('#modal-kit .kit-input-error')
    .forEach(el => el.classList.remove('kit-input-error'));
  document.querySelectorAll('#modal-kit .kit-error-msg')
    .forEach(el => el.remove());
}