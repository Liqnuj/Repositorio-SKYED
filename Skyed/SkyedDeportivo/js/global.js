/* ===== Header / Footer / utilidades comunes ===== */

// Toggle del menú móvil
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
  }

  // Marcar enlace activo
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  // Año en footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Verificar sesión activa del servidor
  const isSubdir = window.location.pathname.includes('/php/');
  const authCheckPath = isSubdir ? '../php/check-auth.php' : 'php/check-auth.php';

  fetch(authCheckPath)
    .then(r => r.json())
    .then(data => {
      const loginLink = document.querySelector('[data-auth-login]');
      const registerLink = document.querySelector('[data-auth-register]');
      const userBox = document.querySelector('[data-auth-user]');

      if (data.loggedin && data.usuario) {
        const user = data.usuario;
        localStorage.setItem('cicloUser', JSON.stringify(user));

        const pageFile = location.pathname.split('/').pop() || 'index.html';
        const isAdminPage = pageFile === 'admin.php';
        const isParticipantePage = pageFile === 'participante.php';

        // Mostrar nombre de usuario como botón
        const redirectPath = user.rol === 'admin'
          ? (isSubdir ? '../admin.php' : 'admin.php')
          : (isSubdir ? 'participante.php' : 'php/participante.php');

        if (userBox) {
          userBox.textContent = user.nombre;
          userBox.style.display = 'inline-flex';
          userBox.classList.add('btn', 'btn-primary');
          userBox.style.cursor = 'pointer';
          userBox.setAttribute('role', 'button');
          userBox.tabIndex = 0;
          userBox.addEventListener('click', () => window.location.href = redirectPath);
          userBox.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              window.location.href = redirectPath;
            }
          });
        }

        // Ocultar botón de login
        if (loginLink) loginLink.style.display = 'none';

        // Configurar botón de cerrar sesión
        if (registerLink) {
          registerLink.textContent = 'Cerrar sesión';
          registerLink.href = '#';
          registerLink.style.display = 'inline-block';
          registerLink.addEventListener('click', e => {
            e.preventDefault();
            const closePath = isSubdir ? '../php/cerrar_sesion.php' : 'php/cerrar_sesion.php';
            fetch(closePath).then(() => {
              localStorage.removeItem('cicloUser');
              showToast('Sesión cerrada', 'success');
              setTimeout(() => location.href = 'index.html', 600);
            });
          });
        }
      } else {
        // No hay sesión activa
        localStorage.removeItem('cicloUser');
        if (loginLink) loginLink.style.display = 'inline-block';
        if (registerLink) registerLink.style.display = 'none';
        if (userBox) userBox.style.display = 'none';
      }
    })
    .catch(err => console.warn('Error verificando sesión:', err));
});

// Sistema de toast
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


function confirmarSalida() {
  return confirm("Estás a punto de salir de SKYED. ¿Deseas continuar?");
}
// Evita espacios múltiples: solo permite un espacio entre palabras
document.querySelectorAll('input[type="text"]').forEach(input => {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/  +/g, ' ');
  });
});