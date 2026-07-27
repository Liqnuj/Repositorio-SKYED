

(function () {

  //  para el nombre
  const NOMBRE_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

  // para el precio
  const NUMERO_POSITIVO_REGEX = /^[0-9]+$/;

  function init() {
    const form = document.getElementById('servicioForm');
    if (!form) return; 

    const categoria = document.getElementById('servicioCategoria');
    const nombre = document.getElementById('servicioNombre');
    const precio = document.getElementById('servicioPrecio');
    const estado = document.getElementById('servicioEstado');

    [categoria, nombre, precio, estado].forEach(function (el) {
      if (el) el.required = true;
    });

    function sanitizeNombre() {
      const limpio = nombre.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, '');
      if (limpio !== nombre.value) nombre.value = limpio;
    }

    function sanitizeEnteroPositivo(campo) {
      // Elimina cualquier cosa que no sea dígito (letras, signos, ".", "-", etc.)
      const limpio = campo.value.replace(/[^0-9]/g, '');
      if (limpio !== campo.value) campo.value = limpio;
    }

    /* ---------------------- Validaciones con mensaje personalizado ---------------------- */

    function validarCategoria() {
      if (!categoria.value) {
        categoria.setCustomValidity('Selecciona una categoría');
      } else {
        categoria.setCustomValidity('');
      }
    }

    function validarNombre() {
      const v = nombre.value.trim();
      if (!v) {
        nombre.setCustomValidity('El nombre del servicio es obligatorio');
      } else if (!NOMBRE_REGEX.test(v)) {
        nombre.setCustomValidity('El nombre no puede contener caracteres especiales');
      } else {
        nombre.setCustomValidity('');
      }
    }

    function validarPrecio() {
      const v = precio.value.trim();
      if (!v) {
        precio.setCustomValidity('El precio de referencia es obligatorio');
      } else if (!NUMERO_POSITIVO_REGEX.test(v)) {
        precio.setCustomValidity('El precio solo admite números, sin letras, símbolos ni valores negativos');
      } else if (Number(v) < 1000 || Number(v) > 10000000) {
        precio.setCustomValidity('El precio debe estar entre 1000 y 10000000');
      } else {
        precio.setCustomValidity('');
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
      validarCategoria();
      validarNombre();
      validarPrecio();
      validarEstado();
    }

    /* ---------------------- Listeners ---------------------- */

    categoria.addEventListener('change', validarCategoria);

    nombre.addEventListener('input', function () { sanitizeNombre(); validarNombre(); });
    nombre.addEventListener('blur', validarNombre);

    precio.addEventListener('input', function () { sanitizeEnteroPositivo(precio); validarPrecio(); });
    precio.addEventListener('blur', validarPrecio);

    estado.addEventListener('change', validarEstado);

    // Verificación final justo antes de guardar (además de la validación nativa del navegador)
    form.addEventListener('submit', function (e) {
      validarTodo();
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopImmediatePropagation();
        form.reportValidity();
        if (typeof showToast === 'function') {
          showToast('Revisa los campos del servicio: hay datos vacíos o inválidos', '⚠️');
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
