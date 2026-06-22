<?php
session_start();
require __DIR__ . '/conexion.php';

if (!isset($_SESSION['email'])) {
    header('Location: ../login.html');
    exit;
}

$usuario = null;
if (isset($_SESSION['email'])) {
    $email_sesion = $_SESSION['email'];
    try {
        $stmt = $pdo->prepare("SELECT * FROM usuario WHERE correo_u = ?");
        $stmt->execute([$email_sesion]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        die("Error de base de datos: " . $e->getMessage());
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Perfil de ciclista — SKYED" />
  <title>Mi perfil — SKYED</title>
  <link rel="icon" href="../img/logo.png" />
  <link rel="stylesheet" href="../css/auth.css" />
  <link rel="stylesheet" href="../css/global.css" />
  <link rel="stylesheet" href="../css/participante.css" />
  <link rel="stylesheet" href="../css/accesibilidad.css" />
</head>
<body>

  <header class="site-header" role="banner">
    <nav class="nav" aria-label="Navegación principal">
      <a href="../index.html" class="brand"><img src="../img/logo.png" alt="" /><span>SKY<em>ED</em></span></a>
      <div id="nav-cta"></div>
    </nav>
  </header>

  <main id="main">

  
    <div class="profile-header">
      <div class="profile-header-inner">

        <div class="avatar-wrap">
          <div class="avatar" id="avatar" aria-hidden="true">SK</div>
          <button class="avatar-edit" id="btn-avatar" aria-label="Cambiar foto de perfil" title="Cambiar avatar">✏</button>
        </div>

        <div class="profile-meta">
          <div class="profile-badge">🏅 Ciclista verificado · <span id="p-plan">Pro</span></div>
          <h1 id="p-nombre">Ciclista</h1>
          <p class="handle">
            <span id="p-handle">@usuario</span> ·
            <span id="p-ciudad">Colombia</span>
          </p>
        </div>

        <div class="profile-actions">
          <button class="btn btn-outline btn-on-hero" type="button" data-tab="ajustes">⚙ Editar perfil</button>
          <a href="../eventos.html" class="btn btn-primary">+ Inscribirme</a>
        </div>

      </div>

 
      <div class="profile-tabs" role="tablist">
        <button class="tab-btn active" data-tab="resumen"       role="tab">Resumen</button>
        <button class="tab-btn"        data-tab="historial"     role="tab">Historial</button>
        <button class="tab-btn"        data-tab="inscripciones" role="tab">Inscripciones</button>
        <button class="tab-btn"        data-tab="ajustes"       role="tab">Ajustes</button>
      </div>
    </div>


    <div class="profile-body">
      <div class="profile-layout">

  
        <aside class="profile-sidebar">

          <div class="profile-card">
            <div class="card-head"><h3>Información</h3></div>
            <div class="card-body">
              <div class="stat-row"><span class="label">Categoría</span><span class="value" id="i-categoria">—</span></div>
              <div class="stat-row"><span class="label">Usuario</span><span class="value" id="i-usuario">—</span></div>
              <div class="stat-row"><span class="label">Teléfono</span><span class="value" id="i-telefono">—</span></div>
              <div class="stat-row"><span class="label">Nacimiento</span><span class="value" id="i-fechaNac">—</span></div>
            </div>
          </div>

          <div class="profile-card">
            <div class="card-head"><h3>Disciplinas</h3></div>
            <div class="card-body">
              <div class="tags" id="i-disciplinas">
                <span class="tag tag-ruta">🚴 Ruta</span>
              </div>
            </div>
          </div>

          <div class="profile-card">
            <div class="card-head"><h3>Logros</h3></div>
            <div class="card-body" id="i-logros">
              <div class="achievement empty-mini">Aún no tienes logros. ¡Inscríbete a tu primer evento!</div>
            </div>
          </div>

        </aside>
        <div class="profile-main-content">
          <div class="tab-panel active" id="panel-resumen">

            <div class="stats-strip">
              <div class="strip-stat"><span class="num" id="s-eventos">0</span><span class="lbl">Eventos completados</span></div>
              <div class="strip-stat accent-blue"><span class="num" id="s-km">0</span><span class="lbl">Km rodados</span></div>
              <div class="strip-stat"><span class="num" id="s-podios">0</span><span class="lbl">Podios</span></div>
              <div class="strip-stat accent-blue"><span class="num" id="s-proximos">0</span><span class="lbl">Próximos eventos</span></div>
            </div>

            <p class="section-label">
              Últimas participaciones
              <a href="#" data-tab="historial">Ver todo →</a>
            </p>
            <div class="event-history" id="ultimas-list">
              <div class="empty-row">No tienes participaciones todavía.</div>
            </div>

            <p class="section-label">
              Próximas inscripciones
              <a href="#" data-tab="inscripciones">Ver todo →</a>
            </p>
            <div class="upcoming-grid" id="proximas-list">
              <div class="empty-row" style="grid-column:1/-1">Sin eventos próximos. <a href="../eventos.html">Explora eventos →</a></div>
            </div>

          </div>
          <div class="tab-panel" id="panel-historial">
            <div class="stats-strip" style="grid-template-columns:repeat(3,1fr)">
              <div class="strip-stat"><span class="num" id="h-eventos">0</span><span class="lbl">Total eventos</span></div>
              <div class="strip-stat accent-blue"><span class="num" id="h-km">0</span><span class="lbl">Km rodados</span></div>
              <div class="strip-stat"><span class="num" id="h-podios">0</span><span class="lbl">Podios</span></div>
            </div>
            <p class="section-label">Todos los resultados</p>
            <div class="event-history" id="historial-list">
              <div class="empty-row">Sin historial todavía.</div>
            </div>
          </div>
          <div class="tab-panel" id="panel-inscripciones">
            <p class="section-label">Eventos confirmados</p>
            <div class="event-history" id="inscripciones-list" style="margin-bottom:1.5rem">
              <div class="empty-row">No tienes inscripciones activas.</div>
            </div>
            <div style="text-align:center;padding:1rem 0">
              <a href="../eventos.html" class="btn btn-primary">Explorar más eventos →</a>
            </div>
          </div>

          <!-- TAB: AJUSTES -->
          <div class="tab-panel" id="panel-ajustes">
            <div class="settings-grid">

              <div class="settings-card">
                <div class="card-head"><h3>Datos personales</h3></div>
                <div class="card-body">
                  <form id="form-datos" novalidate>
                    <div class="form-group">
                      <label for="f-nombre">Nombre</label>
                      <input type="text" id="f-nombre" name="nombre" required />
                    </div>
                    <div class="form-group">
                      <label for="f-apellido">Apellido</label>
                      <input type="text" id="f-apellido" name="apellido" />
                    </div>
                    <div class="form-group">
                      <label for="f-email">Correo electrónico</label>
                      <input type="email" id="f-email" name="email" required />
                    </div>
                    <div class="form-group">
                      <label for="f-telefono">Teléfono</label>
                      <input type="tel" id="f-telefono" name="telefono" />
                    </div>
                    <div class="form-group">
                      <label for="f-ciudad">Ciudad</label>
                      <input type="text" id="f-ciudad" name="ciudad" placeholder="Bogotá, Colombia" />
                    </div>
                    <div class="form-group">
                      <label for="f-categoria">Categoría</label>
                      <select id="f-categoria" name="categoria">
                        <option value="">Seleccionar…</option>
                        <option>Elite hombre</option>
                        <option>Elite mujer</option>
                        <option>Junior</option>
                      </select>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block" style="margin-top:.5rem">Guardar cambios</button>
                  </form>
                </div>
              </div>

              <div class="settings-card">
                <div class="card-head"><h3>Notificaciones</h3></div>
                <div class="card-body" id="notif-list"></div>
              </div>

              <div class="settings-card">
                <div class="card-head"><h3>Seguridad</h3></div>
                <div class="card-body">
                  <form id="form-pass" novalidate>
                    <div class="form-group">
                      <label for="p-actual">Contraseña actual</label>
                      <input type="password" id="p-actual" placeholder="••••••••" />
                    </div>
                    <div class="form-group">
                      <label for="p-nueva">Nueva contraseña</label>
                      <input type="password" id="p-nueva" placeholder="Mínimo 8 caracteres" required />
                    </div>
                    <div class="form-group">
                      <label for="p-confirm">Confirmar nueva contraseña</label>
                      <input type="password" id="p-confirm" placeholder="••••••••" required />
                    </div>
                    <button type="submit" class="btn btn-outline btn-block" style="margin-top:.5rem">Actualizar contraseña</button>
                  </form>
                </div>
              </div>

              <div class="settings-card">
                <div class="card-head"><h3>Cuenta</h3></div>
                <div class="card-body">
                  <div class="stat-row"><span class="label">Plan actual</span><span class="value" style="color:var(--accent)" id="c-plan">Pro</span></div>
                  <div class="stat-row"><span class="label">Renovación</span><span class="value" id="c-renov">—</span></div>
                  <div class="stat-row"><span class="label">Total invertido</span><span class="value" id="c-total">$0</span></div>
                  <div style="margin-top:1.25rem;display:flex;flex-direction:column;gap:.6rem">
                    <button type="button" onclick="handleLogout()" class="btn btn-outline btn-block">Cerrar sesión</button>
                    <button type="button" id="btn-delete" class="btn btn-ghost btn-block" style="color:var(--danger)">Eliminar cuenta</button>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>

  </main>

  <!-- MODAL CONFIRMAR CIERRE DE SESIÓN -->
  <div id="modal-logout" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);align-items:center;justify-content:center;z-index:9999;display:none">
    <div style="background:#fff;border-radius:12px;padding:2rem;max-width:400px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,0.2)">
      <div style="font-size:2.5rem;margin-bottom:1rem">⏻</div>
      <h2 style="margin:0 0 0.5rem;font-size:1.3rem;color:#1a1a1a">¿Cerrar sesión?</h2>
      <p style="margin:0 0 1.5rem;color:#666;font-size:0.95rem">¿Estás seguro de que deseas cerrar tu sesión?</p>
      <div style="display:flex;gap:0.75rem;justify-content:center">
        <button onclick="closeLogoutModal()" style="padding:0.6rem 1.5rem;border:1px solid #ddd;background:#fff;border-radius:6px;cursor:pointer;font-size:0.95rem;font-weight:500;color:#666;transition:all 0.2s">
          Cancelar
        </button>
        <button onclick="confirmLogout()" style="padding:0.6rem 1.5rem;background:#dc2626;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.95rem;font-weight:500;transition:all 0.2s">
          Sí, cerrar sesión
        </button>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
<footer class="sky-footer" id="contacto">
  <div class="sky-accent-bar"></div>
  <div class="sky-footer-top">
 
    <!-- Columna SKYED -->
    <div class="sky-footer-col">
      <div class="sky-logo-row">
        <img src="../img/logo.png" alt="SKYED" class="sky-logo-icon">
        <div class="sky-logo-text">SKY<span>ED</span></div>
      </div>
      <p class="sky-tagline">La plataforma profesional para eventos de ciclismo en Latinoamérica.</p>
      <div class="sky-social-row">
        <a class="sky-social-btn" href="https://www.facebook.com/?locale=es_LA" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="social-icon"onclick="return confirmarSalida(event)">F</a>
        <a class="sky-social-btn" href="https://www.instagram.com/?hl=es" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="social-icon" onclick="return confirmarSalida(event)">IG</a>
        <a class="sky-social-btn" href="https://twitter.com/?lang=es" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" class="social-icon" onclick="return confirmarSalida(event)">X</a>
      </div>
    </div>
 
    <!-- Columna Contacto -->
    <div class="sky-footer-col">
      <p class="sky-col-title">Contacto</p>
      <ul class="sky-contact-list">
        <li class="sky-contact-item">
          <div class="sky-contact-icon"><i class="ti ti-mail"></i></div>
          <div class="sky-contact-text">
            <strong>Email</strong>
            skyed@gmail.com
          </div>
        </li>
        <li class="sky-contact-item">
          <div class="sky-contact-icon"><i class="ti ti-phone"></i></div>
          <div class="sky-contact-text">
            <strong>Teléfono</strong>
            +57 313 201 3573
          </div>
        </li>
        <li class="sky-contact-item">
          <div class="sky-contact-icon"><i class="ti ti-map-pin"></i></div>
          <div class="sky-contact-text">
            <strong>Ubicación</strong>
            Sogamoso, Boyacá
          </div>
        </li>
      </ul>
    </div>
 
  </div>
 
  <div class="sky-footer-bottom">
    <p class="sky-copy">© 2026 <span>SKYED</span>. Todos los derechos reservados.</p>
    <div class="sky-bottom-links">
      <a href="#">Términos de uso</a>
      <a href="#">Privacidad</a>
    </div>
  </div>
</footer>

  <button class="acc-toggle" id="accToggle" aria-label="Opciones de accesibilidad">
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0 6c1.1 0 2 .9 2 2v5h-1v5h-2v-5H9v-5c0-1.1.9-2 2-2z"/>
    </svg>
  </button>

  <div class="acc-panel" id="accPanel">
    <div class="acc-panel-title">Accesibilidad</div>
    <div class="acc-section">
      <span class="acc-label">Tamaño de texto</span>
      <div class="font-size-row">
        <button class="size-btn" data-size="14px">A-</button>
        <button class="size-btn active" data-size="16px">A</button>
        <button class="size-btn" data-size="19px">A+</button>
        <button class="size-btn" data-size="22px">A++</button>
      </div>
    </div>
    <div class="acc-section">
      <span class="acc-label">Dislexia</span>
      <div class="mode-row">
        <button class="mode-btn" id="dyslexiaOff">Normal</button>
        <button class="mode-btn" id="dyslexiaOn">Activar</button>
      </div>
    </div>
    <div class="acc-section">
      <span class="acc-label">Color de acento</span>
      <div class="color-grid">
        <div class="color-swatch active" style="background:#c8432b" data-color="#c8432b" title="Rojo Lumara"></div>
        <div class="color-swatch" style="background:#c9a84c" data-color="#c9a84c" title="Dorado"></div>
        <div class="color-swatch" style="background:#2e6da4" data-color="#2e6da4" title="Azul"></div>
        <div class="color-swatch" style="background:#2e7d32" data-color="#2e7d32" title="Verde"></div>
        <div class="color-swatch" style="background:#6a1b9a" data-color="#6a1b9a" title="Morado"></div>
        <div class="color-swatch" style="background:#37474f" data-color="#37474f" title="Gris oscuro"></div>
      </div>
    </div>
    <div class="acc-section">
      <span class="acc-label">Modo</span>
      <div class="mode-row">
        <button class="mode-btn active" id="modeLight">☀️ Claro</button>
        <button class="mode-btn" id="modeDark">🌙 Oscuro</button>
      </div>
    </div>
    <button class="acc-reset" id="accReset">Restablecer todo</button>
  </div>
  <script>
  const USER_KEY = 'skyedPerfil';
  
  const userDefaults = {
    nombre:      <?= json_encode($usuario['nombre_u'] ?? '') ?>,
    apellido:    <?= json_encode($usuario['apellido_u'] ?? '') ?>,
    email:       <?= json_encode($usuario['correo_u'] ?? '') ?>,
    telefono:    <?= json_encode($usuario['telefono_u'] ?? '') ?>,
    ciudad:      <?= json_encode($usuario['ciudad_u'] ?? 'Colombia') ?>, 
    categoria:   <?= json_encode($usuario['categoria_u'] ?? 'Aficionado') ?>, 
    plan:        <?= json_encode($usuario['rol_u'] ?? 'Participante') ?>,
    disciplinas: ['ruta'], 
    creado:      '2026-01-01', 
    fechaNac:    <?= json_encode($usuario['fecha_nacimiento_u'] ?? '') ?>,
    foto:        null,   
  };
  let user = Object.assign({}, userDefaults, JSON.parse(localStorage.getItem(USER_KEY) || '{}'));

  const saveUser = () => localStorage.setItem(USER_KEY, JSON.stringify(user));

  /* ===== SESSION MANAGEMENT ===== */
  function handleLogout() {
    const modal = document.getElementById('modal-logout');
    if (modal) {
      modal.style.display = 'flex';
    }
  }

  function closeLogoutModal() {
    const modal = document.getElementById('modal-logout');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  function confirmLogout() {
    fetch('cerrar_sesion.php', { method: 'POST' })
      .then(() => {
        window.location.href = '../login.html';
      })
      .catch(() => {
        window.location.href = '../login.html';
      });
  }
  </script>
  
  <script src="../js/global.js"></script>
  <script src="../js/auth.js"></script>
  <script src="../js/participante.js"></script>
  <script src="../js/accesibilidad.js"></script>
</body>
</html>