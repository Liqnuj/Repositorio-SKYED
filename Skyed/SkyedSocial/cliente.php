<?php
session_start();
require __DIR__ . '/../conexion.php';

if (!isset($_SESSION['email'])) {
    header('Location: ../login.html');
    exit;
}

$usuario = null;
$rolContexto = 'cliente';
$reservas = [];
$tiposPreferidos = [];

$totalReservas = 0;
$reservasConfirmadas = 0;
$totalInvertido = 0;
$proximaReserva = null;

$email_sesion = $_SESSION['email'];

try {
    $stmt = $pdo->prepare("SELECT * FROM usuario WHERE correo_u = ?");
    $stmt->execute([$email_sesion]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario) {
        $id_u = $usuario['id_u'];

        // Rol del usuario en el contexto social
        $stmt = $pdo->prepare("SELECT rol.nombre_rol FROM usuario_contexto_rol
                                JOIN rol ON usuario_contexto_rol.id_rol = rol.id_rol
                                WHERE usuario_contexto_rol.id_u = ? AND usuario_contexto_rol.contexto = 'social'");
        $stmt->execute([$id_u]);
        $rolRow = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($rolRow) $rolContexto = $rolRow['nombre_rol'];

        // Reservas del usuario, con el evento y el ambiente asociados
        $stmt = $pdo->prepare("SELECT reserva.*, evento_realizado.nombre_er, evento_realizado.descripcion_er,
                                       tipo_evento.nombre_tipo_eves, ambiente.nombre_a
                                FROM reserva
                                JOIN evento_realizado ON reserva.id_er = evento_realizado.id_er
                                LEFT JOIN tipo_evento ON evento_realizado.id_tipo_eves = tipo_evento.id_tipo_eves
                                LEFT JOIN ambiente ON evento_realizado.id_a = ambiente.id_a
                                WHERE reserva.id_u = ?
                                ORDER BY reserva.fecha_evento_rese DESC");
        $stmt->execute([$id_u]);
        $reservas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $hoy = date('Y-m-d');
        foreach ($reservas as $r) {
            $totalReservas++;
            if ($r['estado_rese'] === 'confirmada') $reservasConfirmadas++;
            if (in_array($r['estado_rese'], ['confirmada', 'completada'])) {
                $totalInvertido += (float)$r['total_rese'];
            }
            if ($r['fecha_evento_rese'] >= $hoy && $r['estado_rese'] !== 'cancelada' && !$proximaReserva) {
                $proximaReserva = $r;
            }
            if ($r['nombre_tipo_eves'] && !in_array($r['nombre_tipo_eves'], $tiposPreferidos)) {
                $tiposPreferidos[] = $r['nombre_tipo_eves'];
            }
        }
    }
} catch (PDOException $e) {
    die("Error de base de datos: " . $e->getMessage());
}

$historial = array_filter($reservas, fn($r) => $r['fecha_evento_rese'] < date('Y-m-d') || $r['estado_rese'] === 'completada');
$proximasReservas = array_filter($reservas, fn($r) => $r['fecha_evento_rese'] >= date('Y-m-d') && $r['estado_rese'] !== 'cancelada');

function badgeEstado($estado) {
    $map = [
        'pendiente'  => 'estado-pendiente',
        'confirmada' => 'estado-confirmada',
        'cancelada'  => 'estado-cancelada',
        'completada' => 'estado-completada',
    ];
    return $map[$estado] ?? 'estado-pendiente';
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Perfil de cliente — SkyedSocial" />
  <title>Mi perfil — SkyedSocial</title>
  <link rel="icon" href="img/logo_social.png" />
  <!-- <link rel="stylesheet" href="css/auth.css" />
  <link rel="stylesheet" href="../css/global.css" />
  <link rel="stylesheet" href="../css/participante.css" /> -->
  <link rel="stylesheet" href="css/cliente.css" />
  <link rel="stylesheet" href="css/global.css" />
  <link rel="stylesheet" href="css/accesibilidad.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
</head>
<body>

  <header class="site-header" role="banner">
    <nav class="nav" aria-label="Navegación principal">
      <a href="../index.html" class="brand"><img src="../img/logo_social.png" alt="" /><span>SKYED<em>SOCIAL</em></span></a>
      <div id="nav-cta"></div>
    </nav>
  </header>

  <main id="main">

    <div class="profile-header">
      <div class="profile-header-inner">

        <div class="avatar-wrap">
          <div class="avatar" id="avatar" aria-hidden="true">
            <?= strtoupper(substr($usuario['nombre_u'] ?? 'S', 0, 1) . substr($usuario['apellido_u'] ?? 'K', 0, 1)) ?>
          </div>
          <button class="avatar-edit" id="btn-avatar" aria-label="Cambiar foto de perfil" title="Cambiar avatar">✏</button>
        </div>

        <div class="profile-meta">
          <div class="profile-badge">🎉 Cliente verificado · <span id="p-plan"><?= htmlspecialchars(ucfirst($rolContexto)) ?></span></div>
          <h1 id="p-nombre"><?= htmlspecialchars(($usuario['nombre_u'] ?? '') . ' ' . ($usuario['apellido_u'] ?? '')) ?></h1>
          <p class="handle">
            <span id="p-handle"><?= htmlspecialchars($usuario['correo_u'] ?? '') ?></span> ·
            <span id="p-ciudad">Colombia</span>
          </p>
        </div>

        <div class="profile-actions">
          <button class="btn btn-outline btn-on-hero" type="button" data-tab="ajustes">⚙ Editar perfil</button>
          <a href="eventos.html" class="btn btn-primary">+ Nueva reserva</a>
        </div>

      </div>

      <div class="profile-tabs" role="tablist">
        <button class="tab-btn active" data-tab="resumen"  role="tab">Resumen</button>
        <button class="tab-btn"        data-tab="historial" role="tab">Historial</button>
        <button class="tab-btn"        data-tab="reservas"  role="tab">Mis reservas</button>
        <button class="tab-btn"        data-tab="ajustes"   role="tab">Ajustes</button>
      </div>
    </div>


    <div class="profile-body">
      <div class="profile-layout">

        <aside class="profile-sidebar">

          <div class="profile-card">
            <div class="card-head"><h3>Información</h3></div>
            <div class="card-body">
              <div class="stat-row"><span class="label">Usuario</span><span class="value"><?= htmlspecialchars($usuario['correo_u'] ?? '—') ?></span></div>
              <div class="stat-row"><span class="label">Teléfono</span><span class="value"><?= htmlspecialchars($usuario['telefono_u'] ?? '—') ?></span></div>
              <div class="stat-row"><span class="label">Nacimiento</span><span class="value"><?= htmlspecialchars($usuario['fecha_nacimiento_u'] ?? '—') ?></span></div>
            </div>
          </div>

          <div class="profile-card">
            <div class="card-head"><h3>Tipos de evento</h3></div>
            <div class="card-body">
              <div class="tags" id="i-tipos">
                <?php if ($tiposPreferidos): ?>
                  <?php foreach ($tiposPreferidos as $t): ?>
                    <span class="tag"><?= htmlspecialchars($t) ?></span>
                  <?php endforeach; ?>
                <?php else: ?>
                  <span class="tag tag-muted">Aún sin reservas</span>
                <?php endif; ?>
              </div>
            </div>
          </div>

          <div class="profile-card">
            <div class="card-head"><h3>Próxima reserva</h3></div>
            <div class="card-body" id="i-proxima">
              <?php if ($proximaReserva): ?>
                <div class="achievement">
                  <strong><?= htmlspecialchars($proximaReserva['nombre_er']) ?></strong><br>
                  <?= htmlspecialchars(date('d M Y', strtotime($proximaReserva['fecha_evento_rese']))) ?>
                </div>
              <?php else: ?>
                <div class="achievement empty-mini">Sin reservas próximas. ¡Agenda tu evento!</div>
              <?php endif; ?>
            </div>
          </div>

        </aside>

        <div class="profile-main-content">

          <!-- RESUMEN -->
          <div class="tab-panel active" id="panel-resumen">

            <div class="stats-strip">
              <div class="strip-stat"><span class="num"><?= $totalReservas ?></span><span class="lbl">Reservas totales</span></div>
              <div class="strip-stat accent-blue"><span class="num">$<?= number_format($totalInvertido, 0, ',', '.') ?></span><span class="lbl">Total invertido</span></div>
              <div class="strip-stat"><span class="num"><?= $reservasConfirmadas ?></span><span class="lbl">Confirmadas</span></div>
              <div class="strip-stat accent-blue"><span class="num"><?= count($proximasReservas) ?></span><span class="lbl">Próximos eventos</span></div>
            </div>

            <p class="section-label">
              Últimas reservas
              <a href="#" data-tab="historial">Ver todo →</a>
            </p>
            <div class="event-history" id="ultimas-list">
              <?php if ($historial): ?>
                <?php foreach (array_slice($historial, 0, 3) as $r): ?>
                  <div class="history-row">
                    <div>
                      <strong><?= htmlspecialchars($r['nombre_er']) ?></strong>
                      <span class="muted"><?= htmlspecialchars(date('d M Y', strtotime($r['fecha_evento_rese']))) ?><?= $r['nombre_a'] ? ' · ' . htmlspecialchars($r['nombre_a']) : '' ?></span>
                    </div>
                    <span class="badge <?= badgeEstado($r['estado_rese']) ?>"><?= ucfirst($r['estado_rese']) ?></span>
                  </div>
                <?php endforeach; ?>
              <?php else: ?>
                <div class="empty-row">No tienes reservas todavía.</div>
              <?php endif; ?>
            </div>

            <p class="section-label">
              Próximas reservas
              <a href="#" data-tab="reservas">Ver todo →</a>
            </p>
            <div class="upcoming-grid" id="proximas-list">
              <?php if ($proximasReservas): ?>
                <?php foreach ($proximasReservas as $r): ?>
                  <div class="upcoming-card">
                    <strong><?= htmlspecialchars($r['nombre_er']) ?></strong>
                    <span class="muted"><?= htmlspecialchars(date('d M Y', strtotime($r['fecha_evento_rese']))) ?></span>
                    <span class="badge <?= badgeEstado($r['estado_rese']) ?>"><?= ucfirst($r['estado_rese']) ?></span>
                  </div>
                <?php endforeach; ?>
              <?php else: ?>
                <div class="empty-row" style="grid-column:1/-1">Sin eventos próximos. <a href="../eventos.html">Explora eventos →</a></div>
              <?php endif; ?>
            </div>

          </div>

          <!-- HISTORIAL -->
          <div class="tab-panel" id="panel-historial">
            <div class="stats-strip" style="grid-template-columns:repeat(3,1fr)">
              <div class="strip-stat"><span class="num"><?= count($historial) ?></span><span class="lbl">Eventos realizados</span></div>
              <div class="strip-stat accent-blue"><span class="num">$<?= number_format($totalInvertido, 0, ',', '.') ?></span><span class="lbl">Total invertido</span></div>
              <div class="strip-stat"><span class="num"><?= $reservasConfirmadas ?></span><span class="lbl">Confirmadas</span></div>
            </div>
            <p class="section-label">Todas las reservas pasadas</p>
            <div class="event-history" id="historial-list">
              <?php if ($historial): ?>
                <?php foreach ($historial as $r): ?>
                  <div class="history-row">
                    <div>
                      <strong><?= htmlspecialchars($r['nombre_er']) ?></strong>
                      <span class="muted"><?= htmlspecialchars(date('d M Y', strtotime($r['fecha_evento_rese']))) ?></span>
                    </div>
                    <span class="badge <?= badgeEstado($r['estado_rese']) ?>"><?= ucfirst($r['estado_rese']) ?></span>
                  </div>
                <?php endforeach; ?>
              <?php else: ?>
                <div class="empty-row">Sin historial todavía.</div>
              <?php endif; ?>
            </div>
          </div>

          <!-- MIS RESERVAS -->
          <div class="tab-panel" id="panel-reservas">
            <p class="section-label">Reservas activas</p>
            <div class="event-history" id="reservas-list" style="margin-bottom:1.5rem">
              <?php if ($proximasReservas): ?>
                <?php foreach ($proximasReservas as $r): ?>
                  <div class="history-row">
                    <div>
                      <strong><?= htmlspecialchars($r['nombre_er']) ?></strong>
                      <span class="muted"><?= htmlspecialchars(date('d M Y', strtotime($r['fecha_evento_rese']))) ?> · <?= (int)$r['invitados_rese'] ?> invitados</span>
                    </div>
                    <span class="badge <?= badgeEstado($r['estado_rese']) ?>"><?= ucfirst($r['estado_rese']) ?></span>
                  </div>
                <?php endforeach; ?>
              <?php else: ?>
                <div class="empty-row">No tienes reservas activas.</div>
              <?php endif; ?>
            </div>
            <div style="text-align:center;padding:1rem 0">
              <a href="../eventos.html" class="btn btn-primary">Explorar más eventos →</a>
            </div>
          </div>

          <!-- AJUSTES -->
          <div class="tab-panel" id="panel-ajustes">
            <div class="settings-grid">

              <div class="settings-card">
                <div class="card-head"><h3>Datos personales</h3></div>
                <div class="card-body">
                  <form id="form-datos" novalidate>
                    <div class="form-group">
                      <label for="f-nombre">Nombre</label>
                      <input type="text" id="f-nombre" name="nombre" required maxlength="50" value="<?= htmlspecialchars($usuario['nombre_u'] ?? '') ?>" />
                      <span class="error" id="err-f-nombre">Solo letras, mínimo 2 caracteres</span>
                    </div>
                    <div class="form-group">
                      <label for="f-apellido">Apellido</label>
                      <input type="text" id="f-apellido" name="apellido" maxlength="50" value="<?= htmlspecialchars($usuario['apellido_u'] ?? '') ?>" />
                      <span class="error" id="err-f-apellido">Solo letras, mínimo 2 caracteres</span>
                    </div>
                    <div class="form-group">
                      <label for="f-email">Correo electrónico</label>
                      <input type="email" id="f-email" name="email" required value="<?= htmlspecialchars($usuario['correo_u'] ?? '') ?>" />
                      <span class="error" id="err-f-email">Ingresa un correo válido</span>
                    </div>
                    <div class="form-group">
                      <label for="f-telefono">Teléfono</label>
                      <input type="tel" id="f-telefono" name="telefono" maxlength="15" value="<?= htmlspecialchars($usuario['telefono_u'] ?? '') ?>" />
                      <span class="error" id="err-f-telefono">7 a 15 dígitos numéricos</span>
                    </div>
                    <div class="form-group">
                      <label for="f-rh">Tipo de sangre (RH)</label>
                      <select id="f-rh" name="rh">
                        <option value="">Seleccionar…</option>
                        <?php foreach (['O+','O-','A+','A-','B+','B-','AB+','AB-'] as $rh): ?>
                          <option <?= ($usuario['rh_u'] ?? '') === $rh ? 'selected' : '' ?>><?= $rh ?></option>
                        <?php endforeach; ?>
                      </select>
                    </div>
                    <div class="form-group">
                      <label for="f-fecha-nac">Fecha de nacimiento</label>
                      <input type="date" id="f-fecha-nac" name="fecha_nacimiento" value="<?= htmlspecialchars($usuario['fecha_nacimiento_u'] ?? '') ?>" />
                      <span class="error" id="err-f-fecha">Fecha inválida</span>
                    </div>
                    <div class="form-group">
                      <label for="f-ciudad">Ciudad</label>
                      <input type="text" id="f-ciudad" name="ciudad" placeholder="Bogotá, Colombia" />
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
                  <div class="stat-row"><span class="label">Rol</span><span class="value" style="color:var(--accent)"><?= htmlspecialchars(ucfirst($rolContexto)) ?></span></div>
                  <div class="stat-row"><span class="label">Total invertido</span><span class="value">$<?= number_format($totalInvertido, 0, ',', '.') ?></span></div>
                  <div style="margin-top:1.25rem;display:flex;flex-direction:column;gap:.6rem">
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

  <!-- FOOTER -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
  <footer class="sky-footer" id="contacto">
    <div class="sky-accent-bar"></div>
    <div class="sky-footer-top">
      <div class="sky-footer-col">
        <div class="sky-logo-row">
          <img src="../img/logo_social.png" alt="SKYED" class="sky-logo-icon">
          <div class="sky-logo-text">SKY<span>ED</span></div>
        </div>
        <p class="sky-tagline">La plataforma profesional para eventos sociales en Boyacá.</p>
        <div class="sky-social-row">
          <a class="sky-social-btn" href="https://www.facebook.com/?locale=es_LA" target="_blank" rel="noopener noreferrer" aria-label="Facebook" onclick="return confirmarSalida(event)">F</a>
          <a class="sky-social-btn" href="https://www.instagram.com/?hl=es" target="_blank" rel="noopener noreferrer" aria-label="Instagram" onclick="return confirmarSalida(event)">IG</a>
          <a class="sky-social-btn" href="https://twitter.com/?lang=es" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" onclick="return confirmarSalida(event)">X</a>
        </div>
      </div>
      <div class="sky-footer-col">
        <p class="sky-col-title">Contacto</p>
        <ul class="sky-contact-list">
          <li class="sky-contact-item">
            <div class="sky-contact-icon"><i class="ti ti-mail"></i></div>
            <div class="sky-contact-text"><strong>Email</strong>skyed@gmail.com</div>
          </li>
          <li class="sky-contact-item">
            <div class="sky-contact-icon"><i class="ti ti-phone"></i></div>
            <div class="sky-contact-text"><strong>Teléfono</strong>+57 317 703 7517</div>
          </li>
          <li class="sky-contact-item">
            <div class="sky-contact-icon"><i class="ti ti-map-pin"></i></div>
            <div class="sky-contact-text"><strong>Ubicación</strong>Sogamoso, Boyacá</div>
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
  const USER_EMAIL = <?= json_encode($usuario['correo_u'] ?? '') ?>;
  const USER_KEY   = 'skyedSocialPerfil:' + USER_EMAIL;

  const userDefaults = {
    nombre:    <?= json_encode($usuario['nombre_u'] ?? '') ?>,
    apellido:  <?= json_encode($usuario['apellido_u'] ?? '') ?>,
    email:     <?= json_encode($usuario['correo_u'] ?? '') ?>,
    telefono:  <?= json_encode($usuario['telefono_u'] ?? '') ?>,
    ciudad:    'Colombia',
    plan:      <?= json_encode($rolContexto) ?>,
    fechaNac:  <?= json_encode($usuario['fecha_nacimiento_u'] ?? '') ?>,
    foto:      null,
  };
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith('skyedSocialPerfil:') && k !== USER_KEY) localStorage.removeItem(k);
  });

  const _localData = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
  let user = Object.assign({}, userDefaults, { foto: _localData.foto || null });

  const saveUser = () => localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Navegación de tabs (misma lógica que el deportivo)
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + tab));
    });
  });
  </script>

  <!-- <script src="js/global.js"></script>
  <script src="../js/auth.js"></script> -->
  <script src="js/accesibilidad.js"></script>
</body>
</html>