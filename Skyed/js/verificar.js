
(function () {
  const otpInputs = document.querySelectorAll('.otp-inputs input');
  
  if (!otpInputs.length) return;


  function sanitizeInput(value) {
    return value.replace(/[^\d]/g, '');
  }


  function focusNextInput(currentIndex) {
    if (currentIndex < otpInputs.length - 1) {
      otpInputs[currentIndex + 1].focus();
    }
  }


  function focusPrevInput(currentIndex) {
    if (currentIndex > 0) {
      otpInputs[currentIndex - 1].focus();
    }
  }


  otpInputs.forEach((input, index) => {
    // Input event: cuando se escribe
    input.addEventListener('input', function (e) {
      // Limpiar caracteres especiales
      this.value = sanitizeInput(this.value);


      if (this.value.length === 1) {
        focusNextInput(index);
      }
    });


    input.addEventListener('keydown', function (e) {
      const key = e.key;


      if (key === 'Backspace' && this.value === '') {
        e.preventDefault();
        focusPrevInput(index);
      }

      if (key === 'Backspace' && this.value !== '') {
        e.preventDefault();
        this.value = '';
      }


      if (key === 'Delete') {
        e.preventDefault();
        this.value = '';
      }

      if (key === 'ArrowLeft') {
        e.preventDefault();
        focusPrevInput(index);
      }


      if (key === 'ArrowRight') {
        e.preventDefault();
        focusNextInput(index);
      }
    });

    input.addEventListener('paste', function (e) {
      e.preventDefault();
      const pasteData = (e.clipboardData || window.clipboardData).getData('text');
      const sanitized = sanitizeInput(pasteData);

      // Llenar los campos con los dígitos pegados
      for (let i = 0; i < sanitized.length && index + i < otpInputs.length; i++) {
        otpInputs[index + i].value = sanitized[i];
      }


      const lastIndex = Math.min(index + sanitized.length - 1, otpInputs.length - 1);
      if (lastIndex < otpInputs.length - 1) {
        otpInputs[lastIndex + 1].focus();
      } else {
        otpInputs[lastIndex].focus();
      }
    });


    input.addEventListener('focus', function () {
      this.select();
    });


    input.addEventListener('click', function () {
      this.select();
    });
  });


  otpInputs[0]?.focus();
})();
