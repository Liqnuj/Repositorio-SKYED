/* ===== Utilidades comunes de Principal ===== */

function showToast(msg, type = '') {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 300);
  }, 3500);
}
window.showToast = showToast;

document.addEventListener('DOMContentLoaded', () => {
  const loginLinks = document.querySelectorAll('[data-auth-login]');
  const registerLink = document.querySelector('[data-auth-register]');
  const userBoxes = document.querySelectorAll('[data-auth-user]');

  if (!loginLinks.length && !registerLink && !userBoxes.length) return;

  fetch('php/confirmar_sesion.php')
    .then(r => r.json())
    .then(data => {
      if (data.loggedin && data.usuario) {
        const user = data.usuario;
        const redirectPath = 'principal.html';

        userBoxes.forEach(userBox => {
          const name = (user.nombre || user.correo || 'Usuario').toString();
          const setLabel = (text, isConfirm = false) => {
            userBox.innerHTML = `<i class="ti ti-user-circle"></i><span>${text}</span>`;
            userBox.dataset.mode = isConfirm ? 'confirm' : '';
          };

          setLabel(name);
          userBox.style.display = userBox.classList.contains('mobile-user') ? 'block' : 'inline-flex';
          userBox.addEventListener('click', () => {
            if (userBox.dataset.mode === 'confirm') {
              userBox.dataset.mode = 'processing';
              userBox.innerHTML = `<i class="ti ti-loader-2"></i><span>Cerrando...</span>`;
              fetch('php/cerrar_sesion.php')
                .then(() => {
                  showToast('Sesión cerrada', 'success');
                  setTimeout(() => {
                    location.href = redirectPath;
                  }, 400);
                })
                .catch(() => {
                  setLabel(name);
                });
              return;
            }

            setLabel('Cerrar sesión?', true);
            setTimeout(() => {
              if (userBox.dataset.mode === 'confirm') {
                setLabel(name);
              }
            }, 2200);
          });
        });

        loginLinks.forEach(link => {
          link.style.display = 'none';
        });

        if (registerLink) {
          registerLink.textContent = 'Cerrar sesión';
          registerLink.href = '#';
          registerLink.style.display = 'inline-block';
          registerLink.addEventListener('click', e => {
            e.preventDefault();
            fetch('php/cerrar_sesion.php').then(() => {
              showToast('Sesión cerrada', 'success');
              setTimeout(() => (location.href = 'principal.html'), 600);
            });
          });
        }
      } else {
        loginLinks.forEach(link => {
          link.style.display = 'inline-block';
        });
      }
    })
    .catch(err => console.warn('Error verificando sesión:', err));
});
