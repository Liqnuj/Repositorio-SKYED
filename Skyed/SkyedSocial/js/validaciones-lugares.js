

(function () {

  // Nombre
  const NOMBRE_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

  // La ubicación
  const UBICACION_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s,]+$/;

  // Solo dígitos capacidad y precio
  const NUMERO_POSITIVO_REGEX = /^[0-9]+$/;

  // Correo electrónico válido
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function init() {
    const form = document.getElementById('lugarForm');
    if (!form) return; 

    const nombre = document.getElementById('lugarNombre');
    const capacidad = document.getElementById('lugarCapacidad');
    const ubicacion = document.getElementById('lugarUbicacion');
    const precio = document.getElementById('lugarPrecio');
    const estado = document.getElementById('lugarEstado');
    const contacto = document.getElementById('lugarContacto');


    // Todos los campos son obligatorios, excepto la descripción
    [nombre, capacidad, ubicacion, precio, estado, contacto].forEach(function (el) {
      if (el) el.required = true;
    });



    function sanitizeNombre() {
      const limpio = nombre.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, '');
      if (limpio !== nombre.value) nombre.value = limpio;
    }

    function sanitizeUbicacion() {
      const limpio = ubicacion.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s,]/g, '');
      if (limpio !== ubicacion.value) ubicacion.value = limpio;
    }

    function sanitizeEnteroPositivo(campo) {
      // Elimina cualquier cosa que no sea dígito (letras, signos, ".", "-", etc.)
      const limpio = campo.value.replace(/[^0-9]/g, '');
      if (limpio !== campo.value) campo.value = limpio;
    }

    /* ---------------------- Validaciones con mensaje personalizado ---------------------- */

    function validarNombre() {
      const v = nombre.value.trim();
      if (!v) {
        nombre.setCustomValidity('El nombre del lugar es obligatorio');
      } else if (!NOMBRE_REGEX.test(v)) {
        nombre.setCustomValidity('El nombre no puede contener caracteres especiales');
      } else {
        nombre.setCustomValidity('');
      }
    }

    function validarUbicacion() {
      const v = ubicacion.value.trim();
      if (!v) {
        ubicacion.setCustomValidity('La ubicación es obligatoria');
      } else if (!UBICACION_REGEX.test(v)) {
        ubicacion.setCustomValidity('La ubicación no puede contener números ni caracteres especiales');
      } else {
        ubicacion.setCustomValidity('');
      }
    }

    function validarCapacidad() {
      const v = capacidad.value.trim();
      if (!v) {
        capacidad.setCustomValidity('La capacidad es obligatoria');
      } else if (!NUMERO_POSITIVO_REGEX.test(v)) {
        capacidad.setCustomValidity('La capacidad solo admite números, sin letras, símbolos ni valores negativos');
      } else if (Number(v) < 100 || Number(v) > 100000) {
        capacidad.setCustomValidity('La capacidad debe estar entre 100 y 100000');
      } else {
        capacidad.setCustomValidity('');
      }
    }

    function validarPrecio() {
      const v = precio.value.trim();
      if (!v) {
        precio.setCustomValidity('El precio de referencia es obligatorio');
      } else if (!NUMERO_POSITIVO_REGEX.test(v)) {
        precio.setCustomValidity('El precio solo admite números, sin letras, símbolos ni valores negativos');
      } else if (Number(v) < 1000 || Number(v) > 100000) {
        precio.setCustomValidity('El precio debe estar entre 1000 y 100000');
      } else {
        precio.setCustomValidity('');
      }
    }

    function validarContacto() {
      const v = contacto.value.trim();
      if (!v) {
        contacto.setCustomValidity('El correo de contacto es obligatorio');
      } else if (!EMAIL_REGEX.test(v)) {
        contacto.setCustomValidity('Ingresa un correo electrónico válido (ej. nombre@correo.com)');
      } else {
        contacto.setCustomValidity('');
      }
    }

    function validarEstado() {
      if (!estado.value) {
        estado.setCustomValidity('Selecciona un estado');
      } else {
        estado.setCustomValidity('');
      }
    }

    function validarTodo() {
      validarNombre();
      validarUbicacion();
      validarCapacidad();
      validarPrecio();
      validarContacto();
      validarEstado();
    }


    nombre.addEventListener('input', function () { sanitizeNombre(); validarNombre(); });
    nombre.addEventListener('blur', validarNombre);

    ubicacion.addEventListener('input', function () { sanitizeUbicacion(); validarUbicacion(); });
    ubicacion.addEventListener('blur', validarUbicacion);

    capacidad.addEventListener('input', function () { sanitizeEnteroPositivo(capacidad); validarCapacidad(); });
    capacidad.addEventListener('blur', validarCapacidad);

    precio.addEventListener('input', function () { sanitizeEnteroPositivo(precio); validarPrecio(); });
    precio.addEventListener('blur', validarPrecio);

    contacto.addEventListener('input', validarContacto);
    contacto.addEventListener('blur', validarContacto);

    estado.addEventListener('change', validarEstado);

    // Verificación final  antes de guardar 
    form.addEventListener('submit', function (e) {
      validarTodo();
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopImmediatePropagation();
        form.reportValidity();
        if (typeof showToast === 'function') {
          showToast('Revisa los campos del lugar: hay datos vacíos o inválidos', '⚠️');
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
