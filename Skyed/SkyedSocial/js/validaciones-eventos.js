(function () {
  const LETTERS_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
  const NUMBER_REGEX = /^[0-9]+$/;

  function init() {
    const form = document.getElementById('eventForm');
    if (!form) return;

    const clienteNombre = document.getElementById('clienteNombre');
    const clienteApellido = document.getElementById('clienteApellido');
    const clienteTelefono = document.getElementById('clienteTelefono');
    const clienteEmail = document.getElementById('clienteEmail');
    const clienteInvitados = document.getElementById('clienteInvitados');
    const eventPresupuesto = document.getElementById('eventPresupuesto');
    const eventTitle = document.getElementById('eventTitle');
    const newCategoryName = document.getElementById('newCategoryName');
    const eventUbicacion = document.getElementById('eventUbicacion');
    const peticionesCliente = document.getElementById('peticionesCliente');
    const notasLogistica = document.getElementById('notasLogistica');

    function sanitizeOnlyLetters(input) {
      const limpio = input.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, '');
      if (limpio !== input.value) input.value = limpio;
    }

    function sanitizeOnlyNumbers(input) {
      const limpio = input.value.replace(/[^0-9]/g, '');
      if (limpio !== input.value) input.value = limpio;
    }

    function validarTextoSoloLetras(input, mensaje) {
      const v = input.value.trim();
      if (!v) {
        input.setCustomValidity(mensaje);
      } else if (!LETTERS_REGEX.test(v)) {
        input.setCustomValidity('Solo se permiten letras y espacios');
      } else {
        input.setCustomValidity('');
      }
    }

    function validarNumero(input, mensaje) {
      const v = input.value.trim();
      if (!v) {
        input.setCustomValidity(mensaje);
      } else if (!NUMBER_REGEX.test(v)) {
        input.setCustomValidity('Solo se permiten números');
      } else if (Number(v) < 0) {
        input.setCustomValidity('No se permiten valores negativos');
      } else {
        input.setCustomValidity('');
      }
    }

    function validarEmail() {
      const v = clienteEmail.value.trim();
      if (!v) {
        clienteEmail.setCustomValidity('El correo es obligatorio');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        clienteEmail.setCustomValidity('Ingresa un correo electrónico válido');
      } else {
        clienteEmail.setCustomValidity('');
      }
    }

    function validarTodo() {
      validarTextoSoloLetras(clienteNombre, 'El nombre del cliente es obligatorio');
      validarTextoSoloLetras(clienteApellido, 'El apellido del cliente es obligatorio');
      validarNumero(clienteTelefono, 'El teléfono es obligatorio');
      validarEmail();
      validarNumero(clienteInvitados, 'El número de invitados es obligatorio');
      validarNumero(eventPresupuesto, 'El presupuesto estimado es obligatorio');
      validarTextoSoloLetras(eventTitle, 'El nombre del evento es obligatorio');
      validarTextoSoloLetras(newCategoryName, 'La clasificación es obligatoria si se crea una nueva');
      validarTextoSoloLetras(eventUbicacion, 'La ubicación es obligatoria');
    }

    [clienteNombre, clienteApellido, clienteTelefono, clienteEmail, clienteInvitados, eventPresupuesto, eventTitle, newCategoryName, eventUbicacion].forEach(function (el) {
      if (el) el.required = true;
    });

    clienteNombre.addEventListener('input', function () {
      sanitizeOnlyLetters(clienteNombre);
      validarTextoSoloLetras(clienteNombre, 'El nombre del cliente es obligatorio');
    });
    clienteApellido.addEventListener('input', function () {
      sanitizeOnlyLetters(clienteApellido);
      validarTextoSoloLetras(clienteApellido, 'El apellido del cliente es obligatorio');
    });

    clienteTelefono.addEventListener('input', function () {
      sanitizeOnlyNumbers(clienteTelefono);
      validarNumero(clienteTelefono, 'El teléfono es obligatorio');
    });

    clienteInvitados.addEventListener('input', function () {
      sanitizeOnlyNumbers(clienteInvitados);
      validarNumero(clienteInvitados, 'El número de invitados es obligatorio');
    });

    eventPresupuesto.addEventListener('input', function () {
      sanitizeOnlyNumbers(eventPresupuesto);
      validarNumero(eventPresupuesto, 'El presupuesto estimado es obligatorio');
    });

    eventTitle.addEventListener('input', function () {
      sanitizeOnlyLetters(eventTitle);
      validarTextoSoloLetras(eventTitle, 'El nombre del evento es obligatorio');
    });

    newCategoryName.addEventListener('input', function () {
      sanitizeOnlyLetters(newCategoryName);
      validarTextoSoloLetras(newCategoryName, 'La clasificación es obligatoria si se crea una nueva');
    });

    eventUbicacion.addEventListener('input', function () {
      sanitizeOnlyLetters(eventUbicacion);
      validarTextoSoloLetras(eventUbicacion, 'La ubicación es obligatoria');
    });

    peticionesCliente.addEventListener('input', function () {
      const limpio = peticionesCliente.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s,.-]/g, '');
      if (limpio !== peticionesCliente.value) peticionesCliente.value = limpio;
    });

    notasLogistica.addEventListener('input', function () {
      const limpio = notasLogistica.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s,.-]/g, '');
      if (limpio !== notasLogistica.value) notasLogistica.value = limpio;
    });

    clienteEmail.addEventListener('input', validarEmail);
    clienteEmail.addEventListener('blur', validarEmail);

    form.addEventListener('submit', function (e) {
      validarTodo();
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopImmediatePropagation();
        form.reportValidity();
        if (typeof showToast === 'function') {
          showToast('Revisa los campos del evento: hay datos vacíos o inválidos', '⚠️');
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
