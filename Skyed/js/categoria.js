

/* ── Abrir / cerrar ── */
function catAbrir() {
  document.getElementById('modal-categoria').classList.add('open');
}

function catCerrar() {
  document.getElementById('modal-categoria').classList.remove('open');
  catLimpiarTodo();
}

/* Cerrar al hacer clic fuera */
document.addEventListener('DOMContentLoaded', function () {
  const overlay = document.getElementById('modal-categoria');
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) catCerrar();
    });
  }

  /* ── Nombre: sin números, sin doble espacio, auto-capitalizar ── */
  const catNombre = document.getElementById('cat-nombre');
  if (catNombre) {
    catNombre.addEventListener('keypress', function (e) {
      if (/[0-9]/.test(e.key)) {
        e.preventDefault();
        catMostrarError('cat-nombre', 'No se pueden ingresar números en este campo');
      }
    });
    catNombre.addEventListener('input', function () {
      if (/[0-9]/.test(this.value)) {
        this.value = this.value.replace(/[0-9]/g, '');
        catMostrarError('cat-nombre', 'No se pueden ingresar números en este campo');
      } else if (/  /.test(this.value)) {
        this.value = this.value.replace(/  +/g, ' ');
        catMostrarError('cat-nombre', 'No se permiten espacios dobles');
      } else {
        catLimpiarError('cat-nombre');
      }
      if (this.value.length === 1) this.value = this.value.toUpperCase();
    });
    catNombre.addEventListener('blur', function () {
      if (!this.value.trim()) catMostrarError('cat-nombre', 'El nombre es obligatorio');
    });
  }

  /* ── Edad mínima: solo enteros positivos ── */
  const catEdadMin = document.getElementById('cat-edad-min');
  if (catEdadMin) {
    catEdadMin.addEventListener('keypress', function (e) {
      if (!/[0-9]/.test(e.key)) e.preventDefault();
    });
    catEdadMin.addEventListener('input', function () {
      this.value = this.value.replace(/[^0-9]/g, '');
      catLimpiarError('cat-edad-min');
    });
    catEdadMin.addEventListener('blur', function () {
      const v = parseInt(this.value);
      if (this.value && (isNaN(v) || v < 18 || v > 100)) {
        catMostrarError('cat-edad-min', 'Ingresa una edad válida (18–100)');
      }
    });
  }

  /* ── Edad máxima: solo enteros positivos ── */
  const catEdadMax = document.getElementById('cat-edad-max');
  if (catEdadMax) {
    catEdadMax.addEventListener('keypress', function (e) {
      if (!/[0-9]/.test(e.key)) e.preventDefault();
    });
    catEdadMax.addEventListener('input', function () {
      this.value = this.value.replace(/[^0-9]/g, '');
      catLimpiarError('cat-edad-max');
    });
    catEdadMax.addEventListener('blur', function () {
      const v = parseInt(this.value);
      if (this.value && (isNaN(v) || v < 18 || v > 100)) {
        catMostrarError('cat-edad-max', 'Ingresa una edad válida (18–100)');
      }
    });
  }

  /* ── Distancia: sin doble espacio, auto-capitalizar ── */
  const catDistancia = document.getElementById('cat-distancia');
  if (catDistancia) {
    catDistancia.addEventListener('input', function () {
      if (/  /.test(this.value)) {
        this.value = this.value.replace(/  +/g, ' ');
        catMostrarError('cat-distancia', 'No se permiten espacios dobles');
      } else {
        catLimpiarError('cat-distancia');
      }
    });
  }

  /* ── Descripción: sin doble espacio, auto-capitalizar ── */
  const catDesc = document.getElementById('cat-descripcion');
  if (catDesc) {
    catDesc.addEventListener('input', function () {
      if (this.value.length === 1) this.value = this.value.toUpperCase();
      if (/  /.test(this.value)) {
        this.value = this.value.replace(/  +/g, ' ');
        catMostrarError('cat-descripcion', 'No se permiten espacios dobles');
      } else {
        catLimpiarError('cat-descripcion');
      }
    });
  }

});

  catDesc.addEventListener('blur', function () {
    if (!this.value.trim()) {
      catMostrarError('cat-descripcion', 'La descripción es obligatoria');
    }
  });


/* ── Guardar con validación completa ── */
function catGuardar() {
  catLimpiarTodo();

  const nombre   = document.getElementById('cat-nombre').value.trim();
  const evento   = document.getElementById('cat-evento').value;
  const edadMin  = document.getElementById('cat-edad-min').value.trim();
  const edadMax  = document.getElementById('cat-edad-max').value.trim();
  const genero   = document.getElementById('cat-genero').value;
  const distancia= document.getElementById('cat-distancia').value.trim();
  const descripcion = document.getElementById('cat-descripcion').value.trim();

  let hayError = false;
  let primerCampo = null;

  if (!nombre) {
    catMostrarError('cat-nombre', 'El nombre es obligatorio');
    if (!primerCampo) primerCampo = 'cat-nombre';
    hayError = true;
  } else if (/[0-9]/.test(nombre)) {
    catMostrarError('cat-nombre', 'El nombre no puede contener números');
    if (!primerCampo) primerCampo = 'cat-nombre';
    hayError = true;
  }

  if (!evento) {
    catMostrarError('cat-evento', 'Selecciona un evento');
    if (!primerCampo) primerCampo = 'cat-evento';
    hayError = true;
  }

  // Edad mínima — AHORA OBLIGATORIA
  if (!edadMin) {
    catMostrarError('cat-edad-min', 'La edad mínima es obligatoria');
    if (!primerCampo) primerCampo = 'cat-edad-min';
    hayError = true;
  } else {
    const min = parseInt(edadMin);
    if (isNaN(min) || min < 18 || min > 120) {
      catMostrarError('cat-edad-min', 'Ingresa una edad válida (18–120)');
      if (!primerCampo) primerCampo = 'cat-edad-min';
      hayError = true;
    }
  }

  // Edad máxima 
  if (!edadMax) {
    catMostrarError('cat-edad-max', 'La edad máxima es obligatoria');
    if (!primerCampo) primerCampo = 'cat-edad-max';
    hayError = true;
  } else {
    const max = parseInt(edadMax);
    if (isNaN(max) || max < 0 || max > 120) {
      catMostrarError('cat-edad-max', 'Ingresa una edad válida (0–120)');
      if (!primerCampo) primerCampo = 'cat-edad-max';
      hayError = true;
    }
  }

   // Rango de edades 
  if (edadMin && edadMax) {
    const min = parseInt(edadMin);
    const max = parseInt(edadMax);
    if (!isNaN(min) && !isNaN(max) && min >= max) {
      catMostrarError('cat-edad-max', 'La edad máxima debe ser mayor a la mínima');
      if (!primerCampo) primerCampo = 'cat-edad-max';
      hayError = true;
    }
  }


  if (!genero) {
    catMostrarError('cat-genero', 'Selecciona un género');
    if (!primerCampo) primerCampo = 'cat-genero';
    hayError = true;
  }

  if (!distancia) {
    catMostrarError('cat-distancia', 'La distancia es obligatoria');
    if (!primerCampo) primerCampo = 'cat-distancia';
    hayError = true;
  }

  if (!descripcion){
    catMostrarError('cat-descripcion', 'La descripción es obligatoria');
    if (!primerCampo) primerCampo = 'cat-descripcion';
    hayError = true;
  }

  if (hayError) {
    if (primerCampo) document.getElementById(primerCampo).focus();
    return;
  }

  catCerrar();
  showToast('Categoría guardada satisfactoriamnte ', 'success');
}

/* ── Helpers ── */
function catMostrarError(campoId, mensaje) {
  const campo = document.getElementById(campoId);
  const span  = document.getElementById('err-' + campoId);
  if (campo) campo.classList.add('cat-input-error');
  if (span)  span.textContent = mensaje;
}

function catLimpiarError(campoId) {
  const campo = document.getElementById(campoId);
  const span  = document.getElementById('err-' + campoId);
  if (campo) campo.classList.remove('cat-input-error');
  if (span)  span.textContent = '';
}

function catLimpiarTodo() {
  ['cat-nombre','cat-evento','cat-edad-min','cat-edad-max',
   'cat-genero','cat-distancia','cat-descripcion'].forEach(catLimpiarError);
}