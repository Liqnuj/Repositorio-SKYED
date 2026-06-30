<?php
session_start();
require __DIR__ . '/php/conexion.php';

if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'adminDeportivo') {
    header("Location: login.html"); 
    exit();
} else {
  $nombreUsuario = $_SESSION['nombre'] ?? 'Admin';
}

$user = [];
if (isset($_GET['id']) && !empty($_GET['id'])) {
    $id_editar = $_GET['id'];
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM usuario WHERE id_u = ? LIMIT 1");
        $stmt->execute([$id_editar]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            http_response_code(404);
            die("Error: El usuario que intentas editar no existe en la base de datos.");
        }
    } catch (PDOException $e) {
        http_response_code(500);
        die("Error al buscar el usuario: " . $e->getMessage());
    }
}

$usuariosRegistrados = [];
try {
    $stmt = $pdo->query("SELECT * FROM usuario ORDER BY nombre_u ASC");
    $usuariosRegistrados = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Error al conectar con la base de datos: " . $e->getMessage());
}

$inscripcionesRecientes = [];
try {
    $stmt = $pdo->query("SELECT i.*, u.nombre_u, u.apellido_u, e.nombre_e FROM inscripcion i JOIN usuario u ON i.id_u = u.id_u JOIN eventoDeportivo e ON i.id_e = e.id_e ORDER BY i.fecha_i DESC LIMIT 5");
    $inscripcionesRecientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Error al conectar con la base de datos: " . $e->getMessage());
}


$eventosRegistrados = [];
try {
    $stmt = $pdo->query("SELECT * FROM eventoDeportivo ORDER BY fecha_e ASC");
    $eventosRegistrados = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Error al conectar con la base de datos: " . $e->getMessage());
}

$kitsRegistrados = [];
try {
  $stmt = $pdo->query("SELECT * FROM kit ORDER BY fecha_entrega_k ASC");
  $kitsRegistrados = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Error al conectar con la base de datos: " . $e->getMessage());
}

$categoriaNueva = [];
try {
  $stmt = $pdo->query("SELECT * FROM categoria_competencia ORDER BY nombre_cc ASC");
  $categoriaNueva = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Error al conectar con la base de datos: " . $e->getMessage());
}

?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Panel Admin — SKYED</title>
  <link rel="icon" href="img/logo_deportivo.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,600;0,700;0,900;1,900&family=Barlow+Condensed:wght@700;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/admin.css" />
  <link rel="stylesheet" href="css/accesibilidad.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />
</head>
<body>



<div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>

<!-- HEADER ORIGINAL SKYED -->
<header class="site-header" role="banner">
  <nav class="nav" aria-label="Navegación principal">
<div style="display:flex; align-items:center; gap:0.5rem;">
  <button class="sidebar-toggle" id="sidebarToggle" 
          onclick="toggleSidebar()" aria-label="Abrir menú">☰</button>
  <a href="index.html" class="brand" aria-label="Inicio SKYED">
    <img src="img/logo_deportivo.png" alt="" onerror="this.style.display='none'" />
    <span>SKY<em>ED</em></span>
  </a>
</div>
    <div class="nav-cta">
      <span class="admin-nav-badge">⚙ Panel <span>Admin</span></span>
      <a href="index.html" class="btn btn-outline" style="font-size:.82rem;padding:.45rem .9rem">← Volver al inicio</a>
    </div>
  </nav>
</header>

<div class="admin-body">
  <!-- SIDEBAR -->
<aside class="sidebar" id="sidebar">

  <nav class="sidebar-nav" aria-label="Navegación administrativa" style="padding-top:.75rem">
    <div class="sidebar-section">Principal</div>
    <button class="nav-item active" data-page="dashboard">
      <span class="icon">📊</span> Resumen general
    </button>
    <button class="nav-item" data-page="eventos">
      <span class="icon">🏁</span> Eventos
      <span class="badge-count"><?= count($eventosRegistrados); ?></span>
    </button>
    <button class="nav-item" data-page="usuarios">
      <span class="icon">👥</span> Usuarios
      <span class="badge-count"><?= count($usuariosRegistrados); ?></span>
    </button>
    <button class="nav-item" data-page="inscripciones">
      <span class="icon">📋</span> Inscripciones
      <span class="badge-count"><?= count($inscripcionesRecientes); ?></span>
    </button>

    <div class="sidebar-section">Gestión</div>
    <button class="nav-item" data-page="pagos">
      <span class="icon">💳</span> Pagos
      <span class="badge-count" style="background:#fee2e2;color:#dc2626"></span>
    </button>
    <button class="nav-item" data-page="kits">
      <span class="icon">🎽</span> Kits / Entregas
      <span class="badge-count"><?= count($kitsRegistrados); ?></span>
    </button>
    <button class="nav-item" data-page="categorias">
      <span class="icon">🏷️</span> Categorías
      <span class="badge-count"><?= count($categoriaNueva); ?></span>
    </button>
    <button class="nav-item" data-page="patrocinadores">
      <span class="icon">🤝</span> Patrocinadores
    </button>
    <button class="nav-item" data-page="resultados">
      <span class="icon">🏆</span> Resultados
    </button>

    <div class="sidebar-section">Logística</div>
    <button class="nav-item" data-page="rutas">
      <span class="icon">🗺️</span> Rutas
    </button>
    <button class="nav-item" data-page="hidratacion">
      <span class="icon">💧</span> Estaciones
    </button>
    <button class="nav-item" data-page="notificaciones">
      <span class="icon">🔔</span> Notificaciones
    </button>

    <div class="sidebar-section">Sistema</div>
    <button class="nav-item" data-page="respaldo">
      <span class="icon">🛡️</span> Respaldo
    </button>
    <div class="sidebar-footer">
    <div class="admin-info">
      <div class="admin-avatar"><?php echo htmlspecialchars(substr($_SESSION['nombre'] ?? 'Admin', 0, 2)); ?></div>
      <div>
        <div class="admin-name"><?php echo htmlspecialchars($_SESSION['nombre'] ?? 'Admin'); ?></div>
        <div class="admin-role">Super Admin</div>
      </div>
      <button class="btn-logout" title="Cerrar sesión" onclick="handleLogoutAdmin()">⏻</button>
    </div>
  </div>
</nav>
</aside>

<!-- MAIN -->
<main class="main-wrap">

  <!-- ===== DASHBOARD ===== -->
  <div class="page active" id="page-dashboard">
    <div class="page-title">
      <div>
        <h1>Panel de administración</h1>
        <p>Resumen general del sistema SKYED</p>
      </div>
      <div style="display:flex;gap:.5rem">
        <button class="btn btn-outline btn-sm">📤 Exportar</button>
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-icon blue">🏁</div>
        <div>
          <div class="kpi-val" id="kpiEventos"><?= count($eventosRegistrados); ?></div>
          <div class="kpi-label">Eventos </div>
          <div class="kpi-delta up"></div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon green">👥</div>
        <div>
          <div class="kpi-val" id="kpiUsuarios"><?= count($usuariosRegistrados); ?></div>
          <div class="kpi-label">Usuarios registrados</div>
          <div class="kpi-delta up"></div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon amber">📋</div>
        <div>
          <div class="kpi-val" id="kpiInscripciones"><?= count($inscripcionesRecientes); ?></div>
          <div class="kpi-label">Inscripciones</div>
          <div class="kpi-delta up"></div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon teal">💰</div>
        <div>
          <div class="kpi-val" id="kpiIngresos"></div>
          <div class="kpi-label">Ingresos (COP)</div>
          <div class="kpi-delta up"></div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon red">⏳</div>
        <div>
          <div class="kpi-val" id="kpiPendientes"></div>
          <div class="kpi-label">Pagos pendientes</div>
          <div class="kpi-delta down"></div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon purple">🎽</div>
        <div>
          <div class="kpi-val" id="kpiKits"><?= count($kitsRegistrados); ?></div>
          <div class="kpi-label">Kits entregados</div>
          <div class="kpi-delta up"></div>
        </div>
      </div>
    </div>

    <div class="dash-grid">
      <!-- Gráfica de inscripciones -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">📈 Inscripciones por mes</span>
          <select class="filters" style="margin:0;padding:.35rem .7rem;font-size:.78rem">
            <option>2026</option><option>2025</option>
          </select>
        </div>
        <div class="card-body">
          <div class="chart-placeholder">
            <div class="chart-bar" style="height:40%"></div>
            <div class="chart-bar" style="height:55%"></div>
            <div class="chart-bar" style="height:45%"></div>
            <div class="chart-bar" style="height:70%"></div>
            <div class="chart-bar" style="height:60%"></div>
            <div class="chart-bar alt" style="height:85%"></div>
            <div class="chart-bar" style="height:75%"></div>
            <div class="chart-bar" style="height:90%"></div>
            <div class="chart-bar" style="height:68%"></div>
            <div class="chart-bar" style="height:55%"></div>
            <div class="chart-bar" style="height:40%"></div>
            <div class="chart-bar" style="height:30%"></div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:.5rem;font-size:.72rem;color:var(--muted)">
            <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span>
            <span>Jun</span><span>Jul</span><span>Ago</span><span>Sep</span><span>Oct</span>
            <span>Nov</span><span>Dic</span>
          </div>
        </div>
      </div>

      <!-- Actividad reciente -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">⚡ Actividad reciente</span>
          <button class="btn btn-outline btn-sm">Ver todo</button>
        </div>
        <div class="card-body" style="padding-top:.5rem">
          <div class="activity-list">
          </div>
        </div>
      </div>

      <!-- Próximos eventos -->
      <div class="card col-full">
        <div class="card-header">
          <span class="card-title">🗓️ Próximos eventos</span>
          <button class="btn btn-primary btn-sm" onclick="openModal('modal-evento')">+ Nuevo evento</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Evento</th>
                <th>Categoría</th>
                <th>Fecha</th>
                <th>Ubicación</th>
                <th>Cupos</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody id="dashboardUpcomingEvents">
              <tr>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== EVENTOS ===== -->
  <div class="page" id="page-eventos">
    <div class="page-title">
      <div>
        <h1>Eventos</h1>
        <p>Gestiona todos los eventos de la plataforma</p>
      </div>
      <div style="display:flex;gap:.5rem">
        <button class="btn btn-outline btn-sm">📤 Exportar</button>
        <button class="btn btn-primary" onclick="openModal('modal-evento')">+ Crear evento</button>
              
      </div>
    </div>

    <div class="filters">
      <input type="search" placeholder="🔍 Buscar evento..." />
      <select>
        <option value="">Todas las categorías</option>
        <option>Running</option>
        <option>Trail</option>
        <option>Ciclismo</option>
        <option>Otro</option>
      </select>
      <select>
        <option value="">Todos los estados</option>
        <option>Activo</option>
        <option>Inactivo</option>
        <option>Lleno</option>
      </select>
      <input type= "date" id="fecha"> 
    </div>

    <div class="eventos-grid" id="eventosGrid">

      <!-- Crear nuevo -->
      <div class="evento-card" style="border-style:dashed;cursor:pointer;background:transparent;box-shadow:none" onclick="openModal('modal-evento')">
        <div style="height:100%;min-height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;color:var(--muted);gap:.5rem">
          <span style="font-size:2.5rem">➕</span>
          <span style="font-weight:700;font-size:.9rem">Crear nuevo evento</span>
        </div>
      </div>
    </div>
  </div>
  <!-- ===== USUARIOS ===== -->
  <div class="page" id="page-usuarios">
    <div class="page-title">
      <div>
        <h1>Usuarios</h1>
        <p>Gestión de cuentas de la plataforma</p>
      </div>
      <div style="display:flex;gap:.5rem">
        <button class="btn btn-outline btn-sm">📤 Exportar CSV</button>
      </div>
    </div>

    <div class="filters">
      <input type="search" placeholder="🔍 Buscar por nombre o correo..." />
      <select>
        <option value="">Todos los estados</option>
        <option>Activo</option>
        <option>Inactivo</option>
        <option>Bloqueado</option>
      </select>
      <div class="filter-spacer"></div>
      <span style="color:var(--muted);font-size:.85rem"></span>
    </div>

    <div class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tipo de documento</th>
              <th>Documento</th>
              <th>Rol</th>
              <th>Usuario</th>
              <th>Teléfono</th>
              <th>RH</th>
              <th>Fecha nac.</th>
              <th>Estado</th>
              <th>Inscripciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          
          <tbody>
            <?php if (empty($usuariosRegistrados)): ?>
                <tr>
                    <td colspan="7" style="text-align:center; padding: 2rem;">No hay usuarios registrados aún.</td>
                </tr>
            <?php else: ?>
                <?php foreach ($usuariosRegistrados as $u): ?>
                <tr>
                  <td><?= htmlspecialchars($u['tipo_documento_u']) ?></td>
                  <td><?= htmlspecialchars($u['documento_u']) ?></td>
                  <td><?= htmlspecialchars($u['rol_u']) ?></td>
                  <td>
                    <strong><?= htmlspecialchars($u['nombre_u'] . ' ' . $u['apellido_u']) ?></strong><br>
                    <small style="color:var(--muted)"><?= htmlspecialchars($u['correo_u']) ?></small>
                  </td>
                  <td><?= htmlspecialchars($u['telefono_u']) ?></td>
                  <td><?= htmlspecialchars($u['rh_u']) ?></td>
                  <td><?= htmlspecialchars($u['fecha_nacimiento_u']) ?></td>
                  
                  <td>
                  <select class="select-estado" data-id="<?= $u['id_u'] ?>" style="padding: 0.3rem; border-radius: 4px; border: 1px solid var(--border);">
                    <option value="Activo" <?= ($u['estado_u'] ?? 'Activo') === 'Activo' ? 'selected' : '' ?>>🟢 Activo</option>
                    <option value="Inactivo" <?= ($u['estado_u'] ?? '') === 'Inactivo' ? 'selected' : '' ?>>⚪ Inactivo</option>
                    <option value="Bloqueado" <?= ($u['estado_u'] ?? '') === 'Bloqueado' ? 'selected' : '' ?>>🔴 Bloqueado</option>
                  </select>
                </td>
                  <td><?= count($inscripcionesRecientes) ?></td>
                  
                  <td>
                    <div style="display:flex;gap:.4rem">
                      <button class="btn btn-outline btn-sm" onclick="abrirModalUsuario(<?= $u['id_u'] ?>)" >✏️</button>
                      <button class="btn btn-danger btn-sm">🗑️</button>
                    </div>
                  </td>
                </tr>
                <?php endforeach; ?>
            <?php endif; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ===== INSCRIPCIONES ===== -->
<div class="page" id="page-inscripciones">
    <div class="page-header">
      <div>
        <h1>Inscripciones</h1>
        <p>Control de inscripciones y participantes</p>
      </div>
      <button class="btn btn-outline btn-sm">📤 Exportar</button>
    </div>

    <div class="filters">
      <input type="search" placeholder="🔍 Buscar..." />
      <select>
        <option value="">Todos los eventos</option>
        <option>Gran Fondo Boyacá</option>
        <option>Trail del Páramo</option>
      </select>
      <select>
        <option value="">Estado de pago</option>
        <option>Pendiente</option>
        <option>Aprobado</option>
        <option>Rechazado</option>
      </select>
    </div>

    <div class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Participante</th>
              <th>Evento</th>
              <th>Fecha inscripción</th>
              <th>Precio pagado</th>
              <th>Método pago</th>
              <th>Estado</th>
              <th>QR</th>
              <th>Acciones</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  </div>

  <!-- ===== PAGOS ===== -->
  <div class="page" id="page-pagos">
    <div class="page-header">
      <div>
        <h1>Pagos</h1>
        <p>Control de transacciones y comprobantes</p>
      </div>
      <button class="btn btn-outline btn-sm">📊 Reporte financiero</button>
    </div>

    <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="kpi-card">
        <div class="kpi-icon green">✅</div>
        <div>
          <div class="kpi-val"></div>
          <div class="kpi-label">Aprobados</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon amber">⏳</div>
        <div>
          <div class="kpi-val"></div>
          <div class="kpi-label">Pendientes</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon red">❌</div>
        <div>
          <div class="kpi-val"></div>
          <div class="kpi-label">Rechazados</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">Historial de pagos</span>
        <div class="filters" style="margin:0;gap:.5rem">
          <select>
            <option>Todos</option>
            <option>Aprobado</option>
            <option>Pendiente</option>
            <option>Rechazado</option>
          </select>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID Pago</th>
              <th>Inscripción</th>
              <th>Método</th>
              <th>Referencia</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Comprobante</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="pagosBody">
            <tr>
            </tr>
            <tr>
              <td>
                <button class="btn btn-success btn-sm" onclick="showToast('Pago aprobado','success')">✅</button>
                <button class="btn btn-danger btn-sm" onclick="showToast('Pago rechazado','danger')">❌</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

 <!-- ===== KITS / ENTREGAS ===== -->
<div class="page" id="page-kits">
  <div class="page-title">
    <div>
      <h1>Kits y Entregas</h1>
      <p>Gestión de kits deportivos y control de entrega</p>
    </div>
    <button class="btn btn-primary" onclick="openModal('modal-kit')">+ Nuevo kit</button>
  </div>

  <div class="dash-grid">
    <div class="card">
      <div class="card-header"><span class="card-title">🎽 Kits </span></div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Nombre</th><th>Stock</th><th>Talla</th><th>Dorsal</th><th>Fecha de Entrega</th><th></th></tr>
          </thead>
          <tbody id="kitsBody">
            <tr>
              <?php foreach ($kitsRegistrados as $kit): ?>
                <tr>
                  <td><?= htmlspecialchars($kit['nombre_k']) ?></td>
                  <td><?= htmlspecialchars($kit['stock_k']) ?></td>
                  <td><?= htmlspecialchars($kit['talla_camiseta_k']) ?></td>
                  <td><?= htmlspecialchars($kit['numero_dorsal_k']) ?></td>
                  <td><?= htmlspecialchars($kit['fecha_entrega_k']) ?></td>
                  <td><button class="btn btn-outline btn-sm" onclick="openModal('modal-kit')">✏️</button></td>
                </tr>
              <?php endforeach; ?>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">📦 Estado de entregas</span>
        <select style="padding:.35rem .7rem;border-radius:8px;border:1.5px solid #000000;font-size:.82rem">
          <option>Gran Fondo Boyacá</option>
          <option>Trail del Páramo</option>
        </select>
      </div>
      <div class="card-body">
        <div class="stat-row">
          <span class="stat-row-label">Total kits</span>
          <span class="stat-row-val">200</span>
        </div>
        <div class="stat-row">
          <span class="stat-row-label">Entregados</span>
          <span class="stat-row-val" style="color:var(--success)">142</span>
        </div>
        <div class="stat-row">
          <span class="stat-row-label">Pendientes</span>
          <span class="stat-row-val" style="color:var(--warning)">58</span>
        </div>
        <div class="progress" style="margin-top:1rem">
          <div class="progress-fill" style="width:71%;background:var(--success)"></div>
        </div>
        <p style="text-align:right;font-size:.78rem;color:#828384;margin-top:.35rem">71% entregado</p>
      </div>
    </div>

    <div class="card col-full">
      <div class="card-header">
        <span class="card-title">Registro de entregas</span>
        <button class="btn btn-primary btn-sm" onclick="showToast('Entrega registrada ✅','success')">+ Registrar entrega</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Participante</th><th>Evento</th><th>Kit</th><th>Entregado por</th><th>Fecha real</th><th>Estado</th><th>Observaciones</th></tr>
          </thead>
          <tbody id="entregasBody">
            <tr>
              <td>Juan Pérez</td>
              <td>Gran Fondo Boyacá</td>
              <td>Kit Gran Fondo</td>
              <td>Luis Moreno</td>
              <td>14/06/2026 09:15</td>
              <td><span class="badge badge-success">Entregado</span></td>
              <td>—</td>
            </tr>
            <tr>
              <td>Ana Torres</td>
              <td>Gran Fondo Boyacá</td>
              <td>Kit Gran Fondo</td>
              <td>—</td>
              <td>—</td>
              <td><span class="badge badge-warning">Pendiente</span></td>
              <td>Confirmar talla XL</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
  
<!-- ===== CATEGORÍAS ===== -->
  <div class="page" id="page-categorias">
    <div class="page-header">
      <div>
        <h1>Categorías de competencia</h1>
        <p>Define las categorías por evento, edad y género</p>
      </div>
      <button class="btn btn-primary" onclick="openModal('modal-categoria')">+ Nueva categoría</button>
    </div>

    <div class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Nombre</th><th>Evento</th><th>Edad mín.</th><th>Edad máx.</th><th>Género</th><th>Distancia</th><th>Descripción</th><th>Acciones</th></tr>
          </thead>
          <tbody id="categoriasBody">
            <tr>
              <?php foreach ($categoriaNueva as $categoria): ?>
                <tr>
                  <td><?= htmlspecialchars($categoria['nombre_cc']) ?></td>
                  <td><?= htmlspecialchars($categoria['nombre_evento']) ?></td>
                  <td><?= htmlspecialchars($categoria['edad_minima_cc']) ?></td>
                  <td><?= htmlspecialchars($categoria['edad_maxima_cc']) ?></td>
                  <td><?= htmlspecialchars($categoria['genero_cc']) ?></td>
                  <td><?= htmlspecialchars($categoria['distancia_cc']) ?></td>
                  <td><?= htmlspecialchars($categoria['descripcion_cc']) ?></td>
                    <td>
                      <div style="display:flex;gap:.4rem">
                        <button class="btn btn-outline btn-sm" onclick="abrirModalCategoria(<?= $u['id_cc'] ?>)" >✏️</button>
                        <button class="btn btn-danger btn-sm">🗑️</button>
                      </div>
                    </td>
                </tr>
              <?php endforeach; ?>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ===== PATROCINADORES ===== -->
  <div class="page" id="page-patrocinadores">
    <div class="page-header">
      <div>
        <h1>Patrocinadores</h1>
        <p>Gestión de patrocinadores y aportes</p>
      </div>
      <button class="btn btn-primary" onclick="openModal('modal-patrocinador')">+ Nuevo patrocinador</button>
    </div>

    <div class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Patrocinador</th><th>Tipo</th><th>Teléfono</th><th>Correo</th><th>Web</th><th>Aporte</th><th>Eventos</th><th></th></tr>
          </thead>
          <tbody id="patrocinadoresBody">
            <tr>
              <td>
                <button class="btn btn-outline btn-sm" onclick="openModal('modal-patrocinador')">✏️</button>
                <button class="btn btn-danger btn-sm">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>
                <button class="btn btn-outline btn-sm" onclick="openModal('modal-patrocinador')">✏️</button>
                <button class="btn btn-danger btn-sm">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ===== RESULTADOS ===== -->
  <div class="page" id="page-resultados">
    <div class="page-header">
      <div>
        <h1>Resultados</h1>
        <p>Registro de tiempos y posiciones por evento</p>
      </div>
      <div style="display:flex;gap:.5rem">
        <button class="btn btn-outline btn-sm">📤 Exportar</button>
        <button class="btn btn-primary" onclick="openModal('modal-resultado')">+ Registrar resultado</button>
      </div>
    </div>

    <div class="filters">
      <select>
        <option>Gran Fondo Boyacá 2026</option>
        <option>Trail del Páramo</option>
      </select>
      <select>
        <option>Todas las categorías</option>
        <option>Elite Masculino</option>
        <option>Master A Femenino</option>
      </select>
    </div>

    <div class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Pos. General</th><th>Pos. Categoría</th><th>Atleta</th><th>Categoría</th><th>Tiempo final</th><th>Vel. promedio</th><th></th></tr>
          </thead>
          <tbody id="resultadosBody">
            <tr>
              <td><strong style="color:var(--warning);font-size:1.1rem">🥇 1</strong></td>
              <td><button class="btn btn-outline btn-sm" onclick="openModal('modal-resultado')">✏️</button></td>
            </tr>
            <tr>
              <td><strong style="font-size:1.1rem">🥈 2</strong></td>
              <td><button class="btn btn-outline btn-sm" onclick="openModal('modal-resultado')">✏️</button></td>
            </tr>
            <tr>
              <td><strong style="font-size:1.1rem">🥉 3</strong></td>
              
              <td><button class="btn btn-outline btn-sm" onclick="openModal('modal-resultado')">✏️</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ===== RUTAS ===== -->
  <div class="page" id="page-rutas">
    <div class="page-header">
      <div>
        <h1>Rutas de evento</h1>
        <p>Gestión de rutas, distancias y archivos GPX</p>
      </div>
      <button class="btn btn-primary" onclick="openModal('modal-ruta')">+ Nueva ruta</button>
    </div>

    <div class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Nombre</th><th>Evento</th><th>Distancia</th><th>Desnivel</th><th>Precio</th><th>GPX</th><th>Mapa</th><th></th></tr>
          </thead>
          <tbody id="rutasBody">
            <tr>
              <td><button class="btn btn-outline btn-sm">📁 GPX</button></td>
              <td><button class="btn btn-outline btn-sm">🗺️ Ver</button></td>
              <td>
                <button class="btn btn-outline btn-sm" onclick="openModal('modal-ruta')">✏️</button>
                <button class="btn btn-danger btn-sm">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ===== HIDRATACIÓN ===== -->
  <div class="page" id="page-hidratacion">
    <div class="page-header">
      <div>
        <h1>Puntos de hidratación</h1>
        <p>Control de puntos de agua, energía y médicos</p>
      </div>
      <button class="btn btn-primary" onclick="openModal('modal-hidratacion')">+ Nuevo punto</button>
    </div>

    <div class="filters">
      <select>
        <option>Gran Fondo Boyacá 2026</option>
        <option>Trail del Páramo</option>
      </select>
      <select>
        <option>Todos los tipos</option>
        <option>Agua</option>
        <option>Energía</option>
        <option>Médico</option>
      </select>
    </div>

    <div class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Nombre</th><th>Tipo</th><th>Kilómetro</th><th>Latitud</th><th>Longitud</th><th>Descripción</th><th></th></tr>
          </thead>
          <tbody id="hidratacionBody">
            <tr>
              <td>
                <button class="btn btn-outline btn-sm" onclick="openModal('modal-hidratacion')">✏️</button>
                <button class="btn btn-danger btn-sm">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ===== NOTIFICACIONES ===== -->
  <div class="page" id="page-notificaciones">
    <div class="page-header">
      <div>
        <h1>Notificaciones</h1>
        <p>Envía alertas, recordatorios e información a usuarios</p>
      </div>
      <button class="btn btn-primary" onclick="openModal('modal-notificacion')">+ Nueva notificación</button>
    </div>

    <div class="dash-grid">
      <div class="card col-full">
        <div class="tabs">
          <button class="tab-btn active" data-tab="todas">Todas</button>
          <button class="tab-btn" data-tab="informativas">Informativas</button>
          <button class="tab-btn" data-tab="alertas">Alertas</button>
          <button class="tab-btn" data-tab="recordatorios">Recordatorios</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Título</th><th>Mensaje</th><th>Tipo</th><th>Destinatario</th><th>Fecha</th><th>Leída</th><th></th></tr>
            </thead>
            <tbody id="notificacionesBody">
              <tr>
                <td><button class="btn btn-danger btn-sm">🗑️</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== RESPALDO ===== -->
  <div class="page" id="page-respaldo">
    <div class="page-header">
      <div>
        <h1>Respaldo del sistema</h1>
        <p>Copias de seguridad de la base de datos</p>
      </div>
      <button class="btn btn-primary" onclick="showToast('Backup iniciado...','success')">🛡️ Crear backup ahora</button>
    </div>

    <div class="dash-grid">
      <div class="card">
        <div class="card-header"><span class="card-title">Últimas copias de seguridad</span></div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Tabla</th><th>Fecha</th><th>Tamaño</th><th></th></tr>
            </thead>
            <tbody>
              <tr>
                <td><button class="btn btn-outline btn-sm">⬇️ Descargar</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">Tablas disponibles para backup</span></div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem">
            <label style="display:flex;align-items:center;gap:.5rem;font-size:.88rem;cursor:pointer">
              <input type="checkbox" checked /> usuario
            </label>
            <label style="display:flex;align-items:center;gap:.5rem;font-size:.88rem;cursor:pointer">
              <input type="checkbox" checked /> evento
            </label>
            <label style="display:flex;align-items:center;gap:.5rem;font-size:.88rem;cursor:pointer">
              <input type="checkbox" checked /> inscripcion
            </label>
            <label style="display:flex;align-items:center;gap:.5rem;font-size:.88rem;cursor:pointer">
              <input type="checkbox" checked /> pago
            </label>
            <label style="display:flex;align-items:center;gap:.5rem;font-size:.88rem;cursor:pointer">
              <input type="checkbox" checked /> kit
            </label>
            <label style="display:flex;align-items:center;gap:.5rem;font-size:.88rem;cursor:pointer">
              <input type="checkbox" checked /> resultado
            </label>
            <label style="display:flex;align-items:center;gap:.5rem;font-size:.88rem;cursor:pointer">
              <input type="checkbox" /> qr_entrada
            </label>
            <label style="display:flex;align-items:center;gap:.5rem;font-size:.88rem;cursor:pointer">
              <input type="checkbox" /> notificacion
            </label>
            <label style="display:flex;align-items:center;gap:.5rem;font-size:.88rem;cursor:pointer">
              <input type="checkbox" /> patrocinador
            </label>
            <label style="display:flex;align-items:center;gap:.5rem;font-size:.88rem;cursor:pointer">
              <input type="checkbox" /> ruta_evento
            </label>
          </div>
          <button class="btn btn-primary" style="width:100%;margin-top:1.2rem" onclick="showToast('Backup selectivo creado ✅','success')">
            🛡️ Crear backup selectivo
          </button>
        </div>
      </div>
    </div>
  </div>

</main>
<!-- ===== MODAL ===== -->
<div class="modal-overlay" id="modal-evento">
  <div class="mev-wrap">

    <!-- Tabs -->
    <div class="mev-tabs">
      <div class="mev-tab active" id="mev-tab-0"><span class="tn">1</span>Evento</div>
      <div class="mev-tab" id="mev-tab-1"><span class="tn">2</span>Lugar y fecha</div>
      <div class="mev-tab" id="mev-tab-2"><span class="tn">3</span>Detalles</div>
      <div class="mev-tab" id="mev-tab-3"><span class="tn">4</span>Imagen</div>
    </div>
    <!-- PASO 1: Evento -->
    <div class="mev-panel active" id="mev-panel-0">
      <div class="mev-sec-head">
        <i class="ti ti-trophy" aria-hidden="true"></i>
        <div>
          <h3>Datos del evento</h3>
          <p>Elige el nombre y la categoría deportiva</p>
        </div>
      </div>
      <div class="mev-fg">
        <label>Nombre del evento *</label>
        <input id="ev-nombre" type="text" placeholder="Gran Fondo Boyacá 2026" maxlength="50"
          oninput="mevChar('ev-nombre','mev-ch-n',50)">
        <div class="mev-char"><span id="mev-ch-n">0</span>/50</div>
      </div>
      <div class="mev-fg">
        <label>Categoría *</label>
          <div class="mev-cat-grid">
            <div class="mev-cat-card" onclick="mevSelCat(this)" data-cat="atletismo">
              <i class="ti ti-run" aria-hidden="true"></i><span>Atletismo</span>
            </div>
            <div class="mev-cat-card" onclick="mevSelCat(this)" data-cat="senderismo">
              <i class="ti ti-mountain" aria-hidden="true"></i><span>Senderismo</span>
            </div>
            <div class="mev-cat-card sel" onclick="mevSelCat(this)" data-cat="ciclismo">
              <i class="ti ti-bike" aria-hidden="true"></i><span>Ciclismo</span>
            </div>
          </div>
      </div>
      <div class="mev-row2">
        <div class="mev-fg">
          <label>Cupos totales *</label>
          <div class="mev-cupos-row">
            <button class="mev-cupos-btn" type="button" onclick="mevAdj(-10)">−</button>
            <input id="ev-cupos" type="number" value="200" min="1">
            <button class="mev-cupos-btn" type="button" onclick="mevAdj(10)">+</button>
          </div>
        </div>
        <div class="mev-fg">
          <label>Estado *</label>
          <div class="mev-status-row">
            <button class="mev-stbtn sel-act" type="button" onclick="mevSelSt(this,'sel-act')">
              <i class="ti ti-circle-check" aria-hidden="true"></i>Activo<small>visible</small>
            </button>
            <button class="mev-stbtn" type="button" onclick="mevSelSt(this,'sel-ina')">
              <i class="ti ti-circle-x" aria-hidden="true"></i>Inactivo<small>oculto</small>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- PASO 2: Lugar y fecha -->
    <div class="mev-panel" id="mev-panel-1">
      <div class="mev-sec-head">
        <i class="ti ti-map-pin" aria-hidden="true"></i>
        <div>
          <h3>Lugar y fecha</h3>
          <p>¿Cuándo y dónde se realizará el evento?</p>
        </div>
      </div>
      <div class="mev-fg">
        <label>Ubicación *</label>
        <input id="ev-ubicacion" type="text" placeholder="Tunja, Boyacá, Colombia" maxlength="50">
      </div>
      <div class="mev-fg" style="margin-bottom:0">
        <label>Fecha y hora *</label>
        <div class="mev-cal-layout">
          <!-- Calendario -->
          <div class="mev-cal-box">
            <div class="mev-yr-bar">
              <button class="mev-yr-arr" id="mev-yr-l" onclick="mevShiftYr(-1)" type="button">&#8249;</button>
              <div class="mev-yr-chips" id="mev-yr-chips"></div>
              <button class="mev-yr-arr" id="mev-yr-r" onclick="mevShiftYr(1)" type="button">&#8250;</button>
            </div>
            <div class="mev-mo-bar">
              <button class="mev-mo-arr" type="button" onclick="mevShiftMo(-1)">&#8249;</button>
              <div class="mev-mo-label" id="mev-mo-label"></div>
              <button class="mev-mo-arr" type="button" onclick="mevShiftMo(1)">&#8250;</button>
            </div>
            <div class="mev-cal-grid">
              <div class="mev-cal-dow">
                <span>Lu</span><span>Ma</span><span>Mi</span>
                <span>Ju</span><span>Vi</span><span>Sa</span><span>Do</span>
              </div>
              <div class="mev-cal-days" id="mev-cal-days"></div>
              <input type="hidden" id="ev-fecha-iso">

            </div>
          </div>
          <!-- Panel derecho -->
          <div class="mev-cal-right">
            <div class="mev-info-card">
              <div class="lbl">FECHA *</div>
              <div class="lbl-line"></div>
              <div class="val" id="mev-date-val">Elige un día</div>
            </div>
            <div class="mev-time-card">
              <div class="lbl" style="margin-bottom:.5rem">HORA *</div>
              <div class="mev-time-row">
                <span class="mev-time-lbl">Inicio</span>
                <input type="time" class="mev-time-inp" id="t-inicio" value="07:00" onchange="mevSyncPresets()">
              </div>
              <div class="mev-time-row" style="margin-bottom:0">
                <span class="mev-time-lbl">Fin</span>
                <input type="time" class="mev-time-inp" id="t-fin" value="12:00" onchange="mevSyncPresets()">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PASO 3: Detalles -->
    <div class="mev-panel" id="mev-panel-2">
      <div class="mev-sec-head">
        <i class="ti ti-list-details" aria-hidden="true"></i>
        <div>
          <h3>Descripción y requisitos</h3>
          <p>Cuéntale a los participantes de qué trata el evento</p>
        </div>
      </div>
      <div class="mev-fg">
        <label>Descripción *</label>
        <textarea id="ev-desc" placeholder="Describe la ruta, el recorrido, las distancias y qué hace especial este evento..."
          maxlength="250" oninput="mevChar('ev-desc','mev-ch-d',250)"></textarea>
        <div class="mev-char"><span id="mev-ch-d">0</span>/250</div>
      </div>
      <div class="mev-fg">
        <label>Requisitos de participación *</label>
        <input id="ev-req" type="text" placeholder="Licencia UCI, botiquín básico, casco certificado..." maxlength="255">
      </div>
    </div>

    <!-- PASO 4: Imagen -->
    <div class="mev-panel" id="mev-panel-3">
      <div class="mev-sec-head">
        <i class="ti ti-photo" aria-hidden="true"></i>
        <div>
          <h3>Imagen del evento *</h3>
          <p>Esta imagen aparecerá como portada del evento</p>
        </div>
      </div>
      <div class="mev-drop-zone" id="mev-drop-zone"
        onclick="document.getElementById('ev-img').click()">
        <i class="ti ti-cloud-upload" aria-hidden="true"></i>
        <p style="font-size:13px;margin-bottom:.3rem">
          Arrastra aquí o <strong>selecciona una imagen</strong>
        </p>
        <p style="font-size:11px;color:#bbb">JPG, PNG, WEBP — máx. 2 MB</p>
      </div>
      <input type="file" id="ev-img" accept="image/jpeg,image/png,image/webp"
        style="display:none" onchange="mevPrevImg(this)">
      <img id="mev-img-preview" class="mev-img-preview" alt="Vista previa">
    </div>

    <!-- Footer -->
    <!-- Footer -->
    <div class="mev-footer">
      <button class="mev-btn mev-btn-back" id="mev-btn-back" type="button"
        onclick="mevGoStep(-1)" disabled>
        <i class="ti ti-arrow-left" aria-hidden="true"></i> Atrás
      </button>
      <div class="mev-prog-bar">
        <div class="mev-prog-fill" id="mev-prog" style="width:25%"></div>
      </div>
      <button class="mev-btn mev-btn-next" id="mev-btn-next" type="button" onclick="mevGoStep(1)">
        Siguiente <i class="ti ti-arrow-right" aria-hidden="true"></i>
      </button>
      <button class="mev-btn mev-btn-close" type="button" onclick="closeModal('modal-evento')" title="Cerrar">
        <i class="ti ti-x" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</div>

<!-- Modal Usuario -->
<div class="modal-overlay" id="modal-usuario">
  <div class="modal" style="max-width:600px">

    <!-- Header -->
    <div class="modal-header">
      <div style="display:flex;align-items:center;gap:.6rem">
        <i class="ti ti-user-circle" style="font-size:20px;color:var(--accent,#185FA5)" aria-hidden="true"></i>
        <div>
          <span class="modal-title">Editar usuario</span>
          <p style="font-size:11px;color:#949595;margin:0">Información personal y estado de la cuenta</p>
        </div>
      </div>
      <button class="modal-close" onclick="closeModal('modal-usuario')" aria-label="Cerrar">✕</button>
    </div>

    <!-- Avatar preview -->
    <div class="mu-avatar-row">
      <div class="mu-avatar" id="mu-av">?</div>
      <div>
        <p id="mu-av-name">Nombre del usuario</p>
        <p id="mu-av-email">correo@gmail.com</p>
      </div>
    </div>

    <div class="modal-body">

      <!-- Documento -->
      <div style="margin-bottom:1rem">
        <div class="mu-section-sep">
          <i class="ti ti-id-badge" style="font-size:13px;color:var(--muted)" aria-hidden="true"></i>
          <span>Documento</span>
        </div>
        <div class="mu-grid2">
          <div class="mu-fg">
            <label>Tipo de documento</label>
            <select id="mu-tipo-doc">
              <option value="">Seleccionar...</option>
              <option value="cedula_ciudadania">Cédula de ciudadanía</option>
              <option value="cedula_extranjeria">Cédula de extranjería</option>
              <option value="pasaporte">Pasaporte</option>
              <option value="tarjeta_identidad">Tarjeta de identidad</option>
            </select>
          </div>
          <div class="mu-fg">
            <label>Número de documento</label>
            <input id="mu-documento" type="text" placeholder="1058353161" maxlength="20">
          </div>
        </div>
      </div>

      <!-- Datos personales -->
      <div style="margin-bottom:1rem">
        <div class="mu-section-sep">
          <i class="ti ti-user" style="font-size:13px;color:var(--muted)" aria-hidden="true"></i>
          <span>Usuario</span>
        </div>
        <div class="mu-grid2">
          <div class="mu-fg">
            <label>Nombre</label>
            <input id="mu-nombre" type="text" placeholder="Juan" maxlength="50"
              oninput="muUpdate()">
          </div>
          <div class="mu-fg">
            <label>Apellido</label>
            <input id="mu-apellido" type="text" placeholder="Pérez" maxlength="50"
              oninput="muUpdate()">
          </div>
          <div class="mu-fg">
            <label>Fecha de nacimiento</label>
            <input id="mu-fecha" type="date">
          </div>
          <div class="mu-fg">
            <label>RH</label>
            <select id="mu-rh">
              <option value="">Seleccionar...</option>
              <option>O+</option><option>O-</option>
              <option>A+</option><option>A-</option>
              <option>B+</option><option>B-</option>
              <option>AB+</option><option>AB-</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Contacto -->
      <div style="margin-bottom:1rem">
        <div class="mu-section-sep">
          <i class="ti ti-phone" style="font-size:13px;color:var(--muted)" aria-hidden="true"></i>
          <span>Contacto</span>
        </div>
        <div class="mu-grid2">
          <div class="mu-fg">
            <label>Correo electrónico</label>
            <input id="mu-email" type="email" placeholder="juan@gmail.com" maxlength="50"
              oninput="muUpdateEmail(this)">
          </div>
          <div class="mu-fg">
            <label>Teléfono</label>
            <input id="mu-tel" type="tel" placeholder="3132103673" maxlength="10">
          </div>
        </div>
      </div>
    </div><!-- /.modal-body -->

    <!-- Footer -->
    <div class="modal-footer">
      <button class="btn btn-primary" onclick="guardarUsuario()">
        <i class="ti ti-device-floppy" aria-hidden="true"></i> Guardar usuario
      </button>
    </div>

  </div>
</div>

<!-- Modal Kit -->
<div class="modal-overlay kit-modal-overlay" id="modal-kit">
  <div class="kit-modal">

    <!-- Header -->
    <div class="kit-modal-header">
      <div class="kit-modal-header-left">
        <i class="ti ti-package" aria-hidden="true"></i>
        <span style="font-weight:700;font-size:1rem">Nuevo kit</span>
      </div>
      <button class="kit-btn-close" type="button" onclick="closeModal('modal-kit')" aria-label="Cerrar">
        <i class="ti ti-x" style="font-size:16px;" aria-hidden="true"></i>
      </button>
    </div>

    <!-- Body -->
    <div class="kit-modal-body">
      <div class="kit-form-grid">

        <div class="kit-form-group">
          <label for="kit-nombre">Nombre del kit *</label>
          <input type="text" id="kit-nombre" name="nombre_kit" placeholder="Kit Gran Fondo 2026" />
        </div>

        <div class="kit-form-group">
          <label for="kit-stock">Stock *</label>
          <input type="number" id="kit-stock" name="stock" placeholder="200" min="0" />
        </div>

        <div class="kit-form-group">
          <label for="kit-fecha">Fecha de entrega *</label>
          <div class="kit-input-wrap">
            <input type="date" id="kit-fecha" name="fecha_entrega" />
          </div>
        </div>

        <div class="kit-form-group">
          <label for="kit-lugar">Lugar de entrega *</label>
          <input type="text" id="kit-lugar" name="lugar_entrega" placeholder="Tunja, Boyacá" />
        </div>

        <div class="kit-form-group">
          <label for="kit-talla">Talla camiseta *</label>
          <select id="kit-talla" name="talla_camiseta">
            <option value="" disabled selected>Seleccionar talla</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>

        <div class="kit-form-group">
          <label for="kit-dorsal">Número dorsal *</label>
          <input type="text" id="kit-dorsal" name="numero_dorsal" placeholder="001" />
        </div>

        <div class="kit-form-group kit-full">
          <label for="kit-contenido">Contenido del kit *</label>
          <textarea id="kit-contenido" name="contenido_kit" rows="4"
            placeholder="Camiseta técnica, botella, gel energético, número de dorsal..."></textarea>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="kit-modal-footer">
      <button type="button" class="kit-btn kit-btn-guardar" onclick="guardarKit()">
        <i class="ti ti-device-floppy" aria-hidden="true"></i> Guardar
      </button>
    </div>

  </div>
</div>

<!-- Modal Categoría — independiente, pegar en admin.php -->
<div class="cat-overlay" id="modal-categoria">
  <div class="cat-modal">
 
    <div class="cat-header">
      <div class="cat-header-left">
        <i class="ti ti-tag" aria-hidden="true"></i>
        <span class="cat-header-title">Nueva categoría</span>
      </div>
      <button class="cat-close" type="button" onclick="catCerrar()" aria-label="Cerrar">
        <i class="ti ti-x" aria-hidden="true"></i>
      </button>
    </div>
 
    <div class="cat-body">
      <div class="cat-grid">
 
        <div class="cat-group">
          <label for="cat-nombre">Nombre</label>
          <input id="cat-nombre" type="text" name="nombre_categoria" placeholder="Elite Masculino" maxlength="60" />
          <span class="cat-error" id="err-cat-nombre"></span>
        </div>
 
        <div class="cat-group">
          <label for="cat-evento">Evento</label>
            <select id="cat-evento" name="id_evento">
              <option value="" disabled selected>Seleccionar evento</option>
              <?php
              try {
                  $stmtEventos = $pdo->query("SELECT id_e, nombre_e FROM eventoDeportivo ORDER BY nombre_e ASC");
                  while ($row = $stmtEventos->fetch()) {
                      echo '<option value="' . htmlspecialchars($row['id_e']) . '">' . htmlspecialchars($row['nombre_e']) . '</option>';
                  }
              } catch (Exception $e) {
                  echo '<option value="" disabled>Error al cargar los eventos</option>';
              }
              ?>
            </select>
          <span class="cat-error" id="err-cat-evento"></span>
        </div>
 
        <div class="cat-group">
          <label for="cat-edad-min">Edad mínima</label>
          <input id="cat-edad-min" type="number" name= 'edad_min' placeholder="18" min="0" max="120" />
          <span class="cat-error" id="err-cat-edad-min"></span>
        </div>
 
        <div class="cat-group">
          <label for="cat-edad-max">Edad máxima</label>
          <input id="cat-edad-max" type="number" name= 'edad_max' placeholder="35" min="0" max="120" />
          <span class="cat-error" id="err-cat-edad-max"></span>
        </div>
 
        <div class="cat-group">
          <label for="cat-genero">Género</label>
          <select id="cat-genero" name= 'genero'>
            <option value="" disabled selected>Seleccionar género</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="mixto">Mixto</option>
          </select>
          <span class="cat-error" id="err-cat-genero"></span>
        </div>
 
        <div class="cat-group">
          <label for="cat-distancia">Distancia</label>
          <input id="cat-distancia" type="text" name= 'distancia' placeholder="160 km" maxlength="20" />
          <span class="cat-error" id="err-cat-distancia"></span>
        </div>
 
        <div class="cat-group cat-full">
          <label for="cat-descripcion">Descripción</label>
          <textarea id="cat-descripcion"  name="descripcion" rows="4"
            placeholder="Describe esta categoría..."></textarea>
        </div>

      </div>
    </div>
 
    <div class="cat-footer">
      <button type="button" class="cat-btn cat-btn-cancel" onclick="catCerrar()">Cancelar</button>
      <button type="button" class="cat-btn cat-btn-save" onclick="guardarCategoria()">
        <i class="ti ti-device-floppy" aria-hidden="true"></i> Guardar
      </button>
    </div>
 
  </div>
</div>
 

<!-- Modal Patrocinador -->
<div class="modal-overlay" id="modal-patrocinador">
  <div class="modal">
    <div class="modal-header">
      <span class="modal-title">🤝 Patrocinador</span>
      <button class="modal-close" onclick="closeModal('modal-patrocinador')">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-grid form-grid-2">
        <div class="form-group">
          <label>Nombre</label>
          <input type="text" placeholder="CicloDep Colombia" />
        </div>
        <div class="form-group">
          <label>Tipo</label>
          <input type="text" placeholder="Oro / Plata / Bronce" />
        </div>
        <div class="form-group">
          <label>Teléfono</label>
          <input type="tel" placeholder="+57 1 234 5678" />
        </div>
        <div class="form-group">
          <label>Correo</label>
          <input type="email" placeholder="sponsors@empresa.co" />
        </div>
        <div class="form-group">
          <label>Página web</label>
          <input type="url" placeholder="https://empresa.co" />
        </div>
        <div class="form-group">
          <label>Aporte ($)</label>
          <input type="number" placeholder="5000000" />
        </div>
      </div>
      <div class="form-group" style="margin-top:1rem">
        <label>Logo (URL)</label>
        <input type="text" placeholder="img/sponsors/empresa.png" />
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal('modal-patrocinador')">Cancelar</button>
      <button class="btn btn-primary" onclick="closeModal('modal-patrocinador');showToast('Patrocinador guardado ✅','success')">💾 Guardar</button>
    </div>
  </div>
</div>

<!-- Modal Resultado -->
<div class="modal-overlay" id="modal-resultado">
  <div class="modal">
    <div class="modal-header">
      <span class="modal-title">🏆 Registrar resultado</span>
      <button class="modal-close" onclick="closeModal('modal-resultado')">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-grid form-grid-2">
        <div class="form-group">
          <label>Atleta</label>
          <select>
            <option>Juan Pérez</option>
            <option>Maria Gómez</option>
            <option>Carlos Ruiz</option>
          </select>
        </div>
        <div class="form-group">
          <label>Evento</label>
          <select>
            <option>Gran Fondo Boyacá 2026</option>
            <option>Trail del Páramo</option>
          </select>
        </div>
        <div class="form-group">
          <label>Categoría</label>
          <select>
            <option>Elite Masculino</option>
            <option>Master A Femenino</option>
          </select>
        </div>
        <div class="form-group">
          <label>Tiempo final (HH:MM:SS)</label>
          <input type="time" step="1" />
        </div>
        <div class="form-group">
          <label>Posición general</label>
          <input type="number" placeholder="1" />
        </div>
        <div class="form-group">
          <label>Posición categoría</label>
          <input type="number" placeholder="1" />
        </div>
        <div class="form-group">
          <label>Velocidad promedio (km/h)</label>
          <input type="number" step="0.1" placeholder="35.2" />
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal('modal-resultado')">Cancelar</button>
      <button class="btn btn-primary" onclick="closeModal('modal-resultado');showToast('Resultado registrado ✅','success')">💾 Guardar</button>
    </div>
  </div>
</div>

<!-- Modal Ruta -->
<div class="modal-overlay" id="modal-ruta">
  <div class="modal">
    <div class="modal-header">
      <span class="modal-title">🗺️ Ruta del evento</span>
      <button class="modal-close" onclick="closeModal('modal-ruta')">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-grid form-grid-2">
        <div class="form-group">
          <label>Nombre de la ruta</label>
          <input type="text" placeholder="Ruta Larga 160K" />
        </div>
        <div class="form-group">
          <label>Evento</label>
          <select>
            <option>Gran Fondo Boyacá 2026</option>
            <option>Trail del Páramo</option>
          </select>
        </div>
        <div class="form-group">
          <label>Distancia</label>
          <input type="text" placeholder="160 km" />
        </div>
        <div class="form-group">
          <label>Desnivel</label>
          <input type="text" placeholder="+2.800 m" />
        </div>
        <div class="form-group">
          <label>Precio ($)</label>
          <input type="number" placeholder="85000" />
        </div>
        <div class="form-group">
          <label>Archivo GPX</label>
          <input type="file" accept=".gpx" />
        </div>
      </div>
      <div class="form-group" style="margin-top:1rem">
        <label>Descripción</label>
        <textarea placeholder="Descripción de la ruta..."></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal('modal-ruta')">Cancelar</button>
      <button class="btn btn-primary" onclick="closeModal('modal-ruta');showToast('Ruta guardada ✅','success')">💾 Guardar</button>
    </div>
  </div>
</div>

<!-- Modal Hidratación -->
<div class="modal-overlay" id="modal-hidratacion">
  <div class="modal">
    <div class="modal-header">
      <span class="modal-title">💧 Punto de hidratación</span>
      <button class="modal-close" onclick="closeModal('modal-hidratacion')">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-grid form-grid-2">
        <div class="form-group">
          <label>Nombre</label>
          <input type="text" placeholder="PH Km 20" />
        </div>
        <div class="form-group">
          <label>Evento</label>
          <select>
            <option>Gran Fondo Boyacá 2026</option>
            <option>Trail del Páramo</option>
          </select>
        </div>
        <div class="form-group">
          <label>Tipo</label>
          <select>
            <option>agua</option>
            <option>energia</option>
            <option>medico</option>
          </select>
        </div>
        <div class="form-group">
          <label>Kilómetro</label>
          <input type="text" placeholder="20 km" />
        </div>
        <div class="form-group">
          <label>Latitud</label>
          <input type="number" step="0.0000001" placeholder="5.5483200" />
        </div>
        <div class="form-group">
          <label>Longitud</label>
          <input type="number" step="0.0000001" placeholder="-73.3618900" />
        </div>
      </div>
      <div class="form-group" style="margin-top:1rem">
        <label>Descripción</label>
        <input type="text" placeholder="Entrada a Paipa, frente al parque..." />
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal('modal-hidratacion')">Cancelar</button>
      <button class="btn btn-primary" onclick="closeModal('modal-hidratacion');showToast('Punto guardado ✅','success')">💾 Guardar</button>
    </div>
  </div>
</div>

<!-- Modal Notificación -->
<div class="modal-overlay" id="modal-notificacion">
  <div class="modal">
    <div class="modal-header">
      <span class="modal-title">🔔 Nueva notificación</span>
      <button class="modal-close" onclick="closeModal('modal-notificacion')">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-grid">
        <div class="form-group">
          <label>Título</label>
          <input type="text" placeholder="Recordatorio de evento" />
        </div>
        <div class="form-grid form-grid-2">
          <div class="form-group">
            <label>Tipo</label>
            <select>
              <option>informativa</option>
              <option>alerta</option>
              <option>recordatorio</option>
            </select>
          </div>
          <div class="form-group">
            <label>Destinatario</label>
            <select>
              <option>Todos los usuarios</option>
              <option>Juan Pérez</option>
              <option>Maria Gómez</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Mensaje</label>
          <textarea placeholder="Escribe el mensaje aquí..."></textarea>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal('modal-notificacion')">Cancelar</button>
      <button class="btn btn-primary" onclick="closeModal('modal-notificacion');showToast('Notificación enviada 🔔','success')">📤 Enviar</button>
    </div>
  </div>
</div>

<!-- Toast -->
<div class="toast" id="toast">✅ Acción completada</div>

<!-- MODAL CONFIRMAR CIERRE DE SESIÓN -->
<div id="modal-logout" class="logout-modal">
    <div class="logout-modal-content">
        <div class="logout-icon">⏻</div>

        <h2 class="logout-title">
            ¿Cerrar sesión?
        </h2>

        <p class="logout-text">
            ¿Estás seguro de que deseas cerrar tu sesión?
        </p>

        <div class="logout-buttons">
            <button onclick="closeLogoutModalAdmin()" class="btn-cancel">
                Cancelar
            </button>

            <button onclick="confirmLogoutAdmin()" class="btn-cerrar">
                Sí, cerrar sesión
            </button>
        </div>
    </div>
</div>


  <button class="acc-toggle" id="accToggle" aria-label="Opciones de accesibilidad">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0 6c1.1 0 2 .9 2 2v5h-1v5h-2v-5H9v-5c0-1.1.9-2 2-2z"/>
  </svg>
</button>

  <!-- Panel -->
    <div class="acc-panel" id="accPanel">
      <div class="acc-panel-title">Accesibilidad</div>

      <!-- Tamaño de texto -->
    <div class="acc-section">
      <span class="acc-label">Tamaño de texto</span>
      <div class="font-size-row">
        <button class="size-btn" data-size="14px">A-</button>
        <button class="size-btn active" data-size="16px">A</button>
        <button class="size-btn" data-size="19px">A+</button>
        <button class="size-btn" data-size="22px">A++</button>
      </div>
    </div>

      <!-- Dislexia -->
      <div class="acc-section">
        <span class="acc-label">Dislexia</span>
        <div class="mode-row">
          <button class="mode-btn" id="dyslexiaOff">Normal</button>
          <button class="mode-btn" id="dyslexiaOn">Activar</button>
        </div>
      </div>

      <!-- Color de acento -->
      <div class="acc-section">
        <span class="acc-label">Color de acento</span>
        <div class="color-grid">
          <div
            class="color-swatch active"
            style="background: #c8432b"
            data-color="#c8432b"
            title="Rojo Lumara"
          ></div>
          <div
            class="color-swatch"
            style="background: #c9a84c"
            data-color="#c9a84c"
            title="Dorado"
          ></div>
          <div
            class="color-swatch"
            style="background: #2e6da4"
            data-color="#2e6da4"
            title="Azul"
          ></div>
          <div
            class="color-swatch"
            style="background: #2e7d32"
            data-color="#2e7d32"
            title="Verde"
          ></div>
          <div
            class="color-swatch"
            style="background: #6a1b9a"
            data-color="#6a1b9a"
            title="Morado"
          ></div>
          <div
            class="color-swatch"
            style="background: #37474f"
            data-color="#37474f"
            title="Gris oscuro"
          ></div>
        </div>
      </div>

      <!-- Modo claro / oscuro -->
      <div class="acc-section">
        <span class="acc-label">Modo</span>
        <div class="mode-row">
          <button class="mode-btn active" id="modeLight">☀️ Claro</button>
          <button class="mode-btn" id="modeDark">🌙 Oscuro</button>
        </div>
      </div>

      <button class="acc-reset" id="accReset">Restablecer todo</button>
    </div>
  

<script src="js/admin.js"></script>
<script>
  // Menu toggle del header del sitio
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('#nav-list');
  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => {
      const open = navList.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open);
    });
  }

  /* ===== NAVIGATION ===== */
  const pages = {
    'dashboard': 'Resumen general',
    'eventos': 'Eventos',
    'usuarios': 'Usuarios',
    'inscripciones': 'Inscripciones',
    'pagos': 'Pagos',
    'kits': 'Kits y Entregas',
    'categorias': 'Categorías',
    'patrocinadores': 'Patrocinadores',
    'resultados': 'Resultados',
    'rutas': 'Rutas',
    'hidratacion': 'Puntos de Hidratación',
    'notificaciones': 'Notificaciones',
    'respaldo': 'Respaldo del sistema',
  };

  function navigate(id) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const page = document.getElementById('page-' + id);
    if (page) page.classList.add('active');

    const nav = document.querySelector(`.nav-item[data-page="${id}"]`);
    if (nav) nav.classList.add('active');

    history.replaceState(null, '', '#' + id);

    // Close sidebar on mobile
    if (window.innerWidth <= 860) closeSidebar();
  }


  document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.page));
  });

  document.addEventListener('DOMContentLoaded', function() {
  // Restaurar página activa desde el hash de la URL
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById('page-' + hash)) {
    navigate(hash);
  }
});

  /* ===== MODALS ===== */
  function openModal(id) {
    document.getElementById(id).classList.add('open');
  }
  function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  if (id === 'modal-evento') {
    const tabs   = document.querySelectorAll('.mev-tab');
    const panels = document.querySelectorAll('.mev-panel');
    tabs.forEach((t,i)   => { t.classList.remove('active','done'); if(i===0) t.classList.add('active'); });
    panels.forEach((p,i) => { p.classList.remove('active'); if(i===0) p.classList.add('active'); });
    document.getElementById('mev-btn-back').disabled = true;
    document.getElementById('mev-btn-next').innerHTML = 'Siguiente <i class="ti ti-arrow-right"></i>';
    document.getElementById('mev-prog').style.width = '25%';
    step = 0;
  }
}
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });

async function abrirModalUsuario(idU) {
  openModal('modal-usuario');           
  limpiarModalUsuario();              

  try {
    const res  = await fetch(`php/obtener_usuario.php?id=${idU}`);
    const user = await res.json();
    if (user.error) { showToast('Error al cargar usuario ❌', 'error'); return; }

    document.getElementById('modal-usuario').dataset.idU = user.id_u;

    // Avatar
    const iniciales = `${user.nombre_u?.[0] ?? ''}${user.apellido_u?.[0] ?? ''}`.toUpperCase();
    document.getElementById('mu-av').textContent       = iniciales || '?';
    document.getElementById('mu-av-name').textContent  = `${user.nombre_u} ${user.apellido_u}`;
    document.getElementById('mu-av-email').textContent = user.correo_u;

    // Documento
    document.getElementById('mu-tipo-doc').value  = user.tipo_documento_u ?? '';
    document.getElementById('mu-documento').value = user.documento_u ?? '';

    // Datos personales
    document.getElementById('mu-nombre').value  = user.nombre_u ?? '';
    document.getElementById('mu-apellido').value = user.apellido_u ?? '';
    document.getElementById('mu-fecha').value   = user.fecha_nacimiento_u ?? '';
    document.getElementById('mu-rh').value      = user.rh_u ?? '';

    // Contacto
    document.getElementById('mu-email').value = user.correo_u ?? '';
    document.getElementById('mu-tel').value   = user.telefono_u ?? '';

  } catch (e) {
    showToast('Error de conexión ❌', 'error');
  }
}

// ── Guardar cambios ────────────────────────────────────────
async function guardarUsuario() {
  const idU = document.getElementById('modal-usuario').dataset.idU;
  if (!idU) { console.error('❌ No hay idU en el dataset'); return; }

  const payload = {
    id_u:               idU,
    tipo_documento_u:   document.getElementById('mu-tipo-doc').value,
    documento_u:        document.getElementById('mu-documento').value,
    nombre_u:           document.getElementById('mu-nombre').value,
    apellido_u:         document.getElementById('mu-apellido').value,
    fecha_nacimiento_u: document.getElementById('mu-fecha').value,
    rh_u:               document.getElementById('mu-rh').value,
    correo_u:           document.getElementById('mu-email').value,
    telefono_u:         document.getElementById('mu-tel').value,
  };

  console.log('📤 Enviando payload:', payload);

  try {
    const res  = await fetch('php/actualizar_usuario.php', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    const text = await res.text();
    console.log('📥 Respuesta cruda:', text);

    const data = JSON.parse(text);
    console.log('✅ JSON parseado:', data);

    if (data.success) {
      closeModal('modal-usuario');
      showToast('Usuario guardado ✅', 'success');
    } else {
      showToast('Error al guardar ❌', 'error');
    }
  } catch (e) {
    console.error('💥 Error:', e);
    showToast('Error de conexión ❌', 'error');
  }
}

// ── Helpers ────────────────────────────────────────────────
function limpiarModalUsuario() {
  ['mu-av','mu-av-name','mu-av-email','mu-tipo-doc','mu-documento',
   'mu-nombre','mu-apellido','mu-fecha','mu-rh','mu-email','mu-tel']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.tagName === 'SELECT' || el.tagName === 'INPUT' ? el.value = '' : el.textContent = '…';
    });
}

// Live update del avatar mientras editas
function muUpdate() {
  const n = document.getElementById('mu-nombre').value;
  const a = document.getElementById('mu-apellido').value;
  document.getElementById('mu-av').textContent      = `${n[0]??''}${a[0]??''}`.toUpperCase() || '?';
  document.getElementById('mu-av-name').textContent = `${n} ${a}`.trim() || 'Nombre del usuario';
}
function muUpdateEmail(el) {
  document.getElementById('mu-av-email').textContent = el.value || 'correo@gmail.com';
}

  /* ===== TOAST ===== */
  let toastTimer;
  function showToast(msg, type = 'success') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast ' + type;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
  }

function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const collapsed = sb.classList.toggle('collapsed');
  document.body.classList.toggle('sidebar-collapsed', collapsed);
  if (window.innerWidth <= 860) {
    document.getElementById('sidebarOverlay').classList.toggle('open', !collapsed);
  }
}

function closeSidebar() {
  document.getElementById('sidebar').classList.add('collapsed');
  document.getElementById('sidebarOverlay').classList.remove('open');
  document.body.classList.add('sidebar-collapsed');
}

function closeSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebarOverlay');
  sb.classList.remove('open');
  sb.classList.add('collapsed');
  ov.classList.remove('open');
  document.body.classList.add('sidebar-collapsed');
}

  /* ===== NOTIFICACIONES ===== */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const container = btn.closest('.card, .page');
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

// ===== FORMULARIO DE CREACIÓN DE EVENTOS =====
let step = 0;

(function () {
  const TODAY = new Date(); TODAY.setHours(0, 0, 0, 0);
  const CY = TODAY.getFullYear(), CM = TODAY.getMonth();
  let selY = CY, selM = CM, selD = null, yrOff = 0;
  const MES   = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const MES_F = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto',
                 'septiembre','octubre','noviembre','diciembre'];
  const DIAS  = ['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];

  /* ---- Helpers ---- */
  window.mevChar = function (inputId, hintId) {
    document.getElementById(hintId).textContent = document.getElementById(inputId).value.length;
  };

  window.mevSelCat = function (el) {
    document.querySelectorAll('.mev-cat-card').forEach(c => c.classList.remove('sel'));
    el.classList.add('sel');
  };

  window.mevAdj = function (d) {
    const i = document.getElementById('ev-cupos');
    i.value = Math.max(1, (parseInt(i.value) || 0) + d);
  };

  window.mevSelSt = function (el, cls) {
    document.querySelectorAll('.mev-stbtn').forEach(b => b.classList.remove('sel-act', 'sel-ina'));
    el.classList.add(cls);
  };

  /* ---- Stepper ---- */
  window.mevGoStep = function (dir) {
    if (step === 3 && dir === 1) {
      guardarEvento();
      return;
    }
    const tabs   = document.querySelectorAll('.mev-tab');
    const panels = document.querySelectorAll('.mev-panel');
    tabs[step].classList.remove('active'); tabs[step].classList.add('done');
    panels[step].classList.remove('active');
    step = Math.min(3, Math.max(0, step + dir));
    tabs[step].classList.remove('done'); tabs[step].classList.add('active');
    panels[step].classList.add('active');
    document.getElementById('mev-btn-back').disabled = step === 0;
    const nb = document.getElementById('mev-btn-next');
    nb.innerHTML = step === 3
      ? '<i class="ti ti-device-floppy" aria-hidden="true"></i> Guardar evento'
      : 'Siguiente <i class="ti ti-arrow-right" aria-hidden="true"></i>';
    document.getElementById('mev-prog').style.width = ((step + 1) / 4 * 100) + '%';
  };

  /* ---- Calendario: años ---- */
  function renderYrs() {
    const c = document.getElementById('mev-yr-chips'); c.innerHTML = '';
    for (let y = CY + yrOff; y < CY + yrOff + 5; y++) {
      const d = document.createElement('div');
      d.className = 'mev-yr-chip' + (y === selY ? ' sel' : '');
      d.textContent = y;
      d.onclick = () => { selY = y; if (selY === CY && selM < CM) selM = CM; renderYrs(); renderCal(); };
      c.appendChild(d);
    }
    document.getElementById('mev-yr-l').style.visibility = yrOff <= 0 ? 'hidden' : 'visible';
  }
  window.mevShiftYr = function (d) { yrOff += d; if (yrOff < 0) yrOff = 0; renderYrs(); };

  /* ---- Calendario: mes ---- */
  window.mevShiftMo = function (d) {
    selM += d;
    if (selM < 0)  { selM = 11; selY--; }
    if (selM > 11) { selM = 0;  selY++; }
    if (selY === CY && selM < CM) selM = CM;
    if (selY < CY) { selY = CY; selM = CM; }
    renderYrs(); renderCal();
  };

  /* ---- Calendario: días ---- */
  function renderCal() {
    document.getElementById('mev-mo-label').textContent = MES[selM] + ' ' + selY;
    const grid  = document.getElementById('mev-cal-days'); grid.innerHTML = '';
    const first = (new Date(selY, selM, 1).getDay() + 6) % 7;
    const days  = new Date(selY, selM + 1, 0).getDate();
    for (let i = 0; i < first; i++) {
      const e = document.createElement('div'); e.className = 'mev-cd empty'; grid.appendChild(e);
    }
    for (let d = 1; d <= days; d++) {
      const dt    = new Date(selY, selM, d);
      const past  = dt < TODAY;
      const today = dt.getTime() === TODAY.getTime();
      const isSel = d === selD;
      const cell  = document.createElement('div');
      cell.className = 'mev-cd' + (past ? ' past' : '') + (today && !isSel ? ' today' : '') + (isSel ? ' sel' : '');
      cell.textContent = d;
      if (!past) cell.onclick = () => { selD = d; updDate(); renderCal(); };
      grid.appendChild(cell);
    }
  }

  function updDate() {
    const v   = document.getElementById('mev-date-val');
    const iso = document.getElementById('ev-fecha-iso');
    if (!selD) {
      v.className = 'val';
      v.textContent = 'Elige un día';
      if (iso) iso.value = '';
      return;
    }
    const dt  = new Date(selY, selM, selD);
    const dow = DIAS[(dt.getDay() + 6) % 7];
    v.className = 'val set';
    v.textContent = `${dow} ${selD} de ${MES_F[selM]} de ${selY}`;
    if (iso) iso.value = `${selY}-${String(selM + 1).padStart(2, '0')}-${String(selD).padStart(2, '0')}`;
  }

  /* ---- Presets de hora ---- */
  window.mevPreset = function (el, ini, fin) {
    document.querySelectorAll('.mev-pp').forEach(p => p.classList.remove('sel'));
    el.classList.add('sel');
    document.getElementById('t-inicio').value = ini;
    document.getElementById('t-fin').value    = fin;
  };
  window.mevSyncPresets = function () {
    document.querySelectorAll('.mev-pp').forEach(p => p.classList.remove('sel'));
  };

  /* ---- Preview imagen ---- */
  window.mevPrevImg = function (input) {
    const f = input.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = e => {
      const img = document.getElementById('mev-img-preview');
      img.src = e.target.result; img.style.display = 'block';
      document.getElementById('mev-drop-zone').style.display = 'none';
    };
    r.readAsDataURL(f);
  };

  /* ---- Cerrar modal al hacer clic fuera ---- */
  document.getElementById('modal-evento').addEventListener('click', function (e) {
    if (e.target === this) this.style.display = 'none';
  });

  /* ---- Arrancar calendario ---- */
  document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('mev-yr-chips')) { renderYrs(); renderCal(); }
  });

})();

window.getFormData = function() {
  const catCard = document.querySelector('.mev-cat-card.sel');
  return {
    nombre_e:            document.getElementById('ev-nombre').value.trim(),
    categoria_e:         catCard ? catCard.dataset.cat : '',
    cupos_disponibles_e: parseInt(document.getElementById('ev-cupos').value) || 0,
    estado_e:            document.querySelector('.mev-stbtn.sel-act') ? 'activo' : 'inactivo',
    ubicacion_e:         document.getElementById('ev-ubicacion').value.trim(),
    fecha_e:             document.getElementById('ev-fecha-iso')?.value || '',
    hora_e:              document.getElementById('t-inicio').value || '07:00',
    descripcion_e:       document.getElementById('ev-desc').value.trim(),
    requisitos_e:        document.getElementById('ev-req').value.trim(),
    imagen_e:            window.skyedImagenBase64 || 'default.jpg',
  };
};

window.guardarEvento = async function() {
  const payload = getFormData();
  const idEvento = document.getElementById('modal-evento').dataset.idEvento;

  if (!window.skyedImagenBase64 && window.skyedImagenActual) {
    payload.imagen_e = window.skyedImagenActual;
  }

  if (!payload.nombre_e)    { showToast('Ingresa el nombre del evento ❌', 'error'); return; }
  if (!payload.categoria_e) { showToast('Selecciona una categoría ❌', 'error'); return; }
  if (!payload.fecha_e)     { showToast('Selecciona una fecha ❌', 'error'); return; }
  if (!payload.ubicacion_e) { showToast('Ingresa la ubicación ❌', 'error'); return; }
  if (idEvento) payload.id_e = idEvento;
  const endpoint = idEvento ? 'php/actualizar_evento.php' : 'php/guardar_evento.php';

  try {
    const res  = await fetch(endpoint, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.ok) {
      delete document.getElementById('modal-evento').dataset.idEvento;
      window.skyedImagenActual = null;
      closeModal('modal-evento');
      showToast(idEvento ? 'Evento actualizado ✅' : 'Evento guardado ✅', 'success');
      setTimeout(() => loadAdminData(), 800);
    } else {
      showToast('Error: ' + (data.error || 'No se pudo guardar') + ' ❌', 'error');
    }
  } catch (e) {
    showToast('Error de conexión ❌', 'error');
  }
};


window.abrirModalEditarEvento = async function(idEvento) {
  openModal('modal-evento');

  if (!idEvento) return; 

  try {
    const res  = await fetch(`php/obtener_datos_admin.php`);
    const json = await res.json();
    if (!json.ok) return;

    const evento = (json.data.eventos || []).find(e => String(e.id_e) === String(idEvento));
    if (!evento) return;

    document.getElementById('modal-evento').dataset.idEvento = idEvento;

    document.getElementById('ev-nombre').value = evento.nombre_e || '';
    mevChar('ev-nombre', 'mev-ch-n', 50);

    document.querySelectorAll('.mev-cat-card').forEach(c => {
      c.classList.toggle('sel', c.dataset.cat === evento.categoria_e);
    });

    document.getElementById('ev-cupos').value = evento.cupos_disponibles_e || 200;

    document.querySelectorAll('.mev-stbtn').forEach(b => b.classList.remove('sel-act', 'sel-ina'));
    const esActivo = (evento.estado_e || '').toLowerCase() === 'activo';
    const btnActivo   = document.querySelector('.mev-stbtn:first-child');
    const btnInactivo = document.querySelector('.mev-stbtn:last-child');
    if (esActivo && btnActivo)   btnActivo.classList.add('sel-act');
    if (!esActivo && btnInactivo) btnInactivo.classList.add('sel-ina');

    document.getElementById('ev-ubicacion').value = evento.ubicacion_e || '';

    if (evento.fecha_e) {
      document.getElementById('ev-fecha-iso').value = evento.fecha_e;
      const [y, m, d] = evento.fecha_e.split('-').map(Number);
      const DIAS   = ['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];
      const MES_F  = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto',
                      'septiembre','octubre','noviembre','diciembre'];
      const dt  = new Date(y, m - 1, d);
      const dow = DIAS[(dt.getDay() + 6) % 7];
      const dateVal = document.getElementById('mev-date-val');
      dateVal.className = 'val set';
      dateVal.textContent = `${dow} ${d} de ${MES_F[m - 1]} de ${y}`;
    }

    if (evento.hora_e) {
      document.getElementById('t-inicio').value = evento.hora_e.slice(0, 5);
    }

    document.getElementById('ev-desc').value = evento.descripcion_e || '';
    mevChar('ev-desc', 'mev-ch-d', 250);
    document.getElementById('ev-req').value  = evento.requisitos_e  || '';

    if (evento.imagen_e && evento.imagen_e !== 'default.jpg') {
      const preview = document.getElementById('mev-img-preview');
      preview.src = evento.imagen_e;
      preview.style.display = 'block';
      document.getElementById('mev-drop-zone').style.display = 'none';
      window.skyedImagenBase64 = null; 
      window.skyedImagenActual = evento.imagen_e; 
    }

  } catch (e) {
    console.error('Error cargando evento:', e);
  }
};

// editar usuario

window.muUpdate = function() {
  const n = (document.getElementById('mu-nombre')?.value || '').trim();
  const a = (document.getElementById('mu-apellido')?.value || '').trim();
  const ini = [(n[0]||''),(a[0]||'')].join('').toUpperCase() || '?';
  const av = document.getElementById('mu-av');
  const nm = document.getElementById('mu-av-name');
  if (av) av.textContent = ini;
  if (nm) nm.textContent = [n,a].filter(Boolean).join(' ') || 'Nombre del usuario';
};
 
window.muUpdateEmail = function(input) {
  const el = document.getElementById('mu-av-email');
  if (el) el.textContent = input.value.trim() || 'correo@ejemplo.com';
};
 
window.muSelEst = function(el, cls) {
  document.querySelectorAll('.mu-est-btn')
    .forEach(b => b.classList.remove('sel-activo','sel-inactivo','sel-bloqueado'));
  el.classList.add(cls);
};


// ===== MODAL KIT =====

// Cierra al hacer clic fuera del modal
document.getElementById('modal-kit').addEventListener('click', function(e) {
  if (e.target === this) closeModal('modal-kit');
});

function abrirModalKit(datos = null) {
  const esEdicion = datos !== null;

  document.querySelector('#modal-kit .kit-modal-header-left span').textContent =
    esEdicion ? 'Editar kit' : 'Nuevo kit';

  document.getElementById('kit-nombre').value   = datos?.nombre_kit     || '';
  document.getElementById('kit-stock').value    = datos?.stock          || '';
  document.getElementById('kit-fecha').value    = datos?.fecha_entrega  || '';
  document.getElementById('kit-lugar').value    = datos?.lugar_entrega  || '';
  document.getElementById('kit-talla').value    = datos?.talla_camiseta || '';
  document.getElementById('kit-dorsal').value   = datos?.numero_dorsal  || '';
  document.getElementById('kit-contenido').value= datos?.contenido_kit  || '';

  openModal('modal-kit');
}

// Validación y guardado
function guardarKit() {
  const nombre    = document.getElementById('kit-nombre').value.trim();
  const stock     = document.getElementById('kit-stock').value.trim();
  const fecha     = document.getElementById('kit-fecha').value;
  const lugar     = document.getElementById('kit-lugar').value.trim();
  const talla     = document.getElementById('kit-talla').value;
  const dorsal    = document.getElementById('kit-dorsal').value.trim();
  const contenido = document.getElementById('kit-contenido').value.trim();

  let hayError = false;
  let primerCampo = null;

  if (!nombre) {
    mostrarErrorKit('kit-nombre', 'El nombre del kit es obligatorio');
    if (!primerCampo) primerCampo = 'kit-nombre';
    hayError = true;
  } else if (/[0-9]/.test(nombre)) {
    mostrarErrorKit('kit-nombre', 'El nombre no puede contener números');
    if (!primerCampo) primerCampo = 'kit-nombre';
    hayError = true;
  }

  const stockNum = parseInt(stock);
  if (!stock) {
    mostrarErrorKit('kit-stock', 'El stock es obligatorio');
    if (!primerCampo) primerCampo = 'kit-stock';
    hayError = true;
  } else if (isNaN(stockNum) || stockNum < 1) {
    mostrarErrorKit('kit-stock', 'El stock mínimo es 1');
    if (!primerCampo) primerCampo = 'kit-stock';
    hayError = true;
  }

  if (!fecha) {
    mostrarErrorKit('kit-fecha', 'La fecha de entrega es obligatoria');
    if (!primerCampo) primerCampo = 'kit-fecha';
    hayError = true;
  } else {
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    if (new Date(fecha + 'T00:00:00') < hoy) {
      mostrarErrorKit('kit-fecha', 'La fecha no puede ser anterior a hoy');
      if (!primerCampo) primerCampo = 'kit-fecha';
      hayError = true;
    }
  }

  if (!lugar) {
    mostrarErrorKit('kit-lugar', 'El lugar de entrega es obligatorio');
    if (!primerCampo) primerCampo = 'kit-lugar';
    hayError = true;
  }

  if (!talla) {
    mostrarErrorKit('kit-talla', 'La talla de camiseta es obligatoria');
    if (!primerCampo) primerCampo = 'kit-talla';
    hayError = true;
  }

  if (!dorsal) {
    mostrarErrorKit('kit-dorsal', 'El número dorsal es obligatorio');
    if (!primerCampo) primerCampo = 'kit-dorsal';
    hayError = true;
  } else if (/[^0-9]/.test(dorsal)) {
    mostrarErrorKit('kit-dorsal', 'El dorsal solo puede contener números');
    if (!primerCampo) primerCampo = 'kit-dorsal';
    hayError = true;
  }

  if (!contenido) {
    mostrarErrorKit('kit-contenido', 'El contenido del kit es obligatorio');
    if (!primerCampo) primerCampo = 'kit-contenido';
    hayError = true;
  }

  if (hayError) {
    if (primerCampo) document.getElementById(primerCampo).focus();
    return;
  }
  limpiarErroresKit();

  fetch('php/guardar_kit.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre_kit:     nombre,
      stock:          parseInt(stock),
      fecha_entrega:  fecha,
      lugar_entrega:  lugar,
      contenido_kit:  contenido,
      talla_camiseta: talla,
      numero_dorsal:  parseInt(dorsal) || 0,
    })
  })
  .then(r => r.json())
  .then(data => {
    if (data.ok) {
      closeModal('modal-kit');
      showToast('Kit guardado ✅', 'success');
      loadAdminData(); 
    } else {
      showToast('Error: ' + (data.error || 'No se pudo guardar') + ' ❌', 'error');
    }
  })
  .catch(() => showToast('Error de conexión ❌', 'error'));
}


// modal categoria
function abrirModalCategoria(datos = null) {
  const esEdicion = datos !== null;

  document.querySelector('#modal-categoria .cat-header-title').textContent =
    esEdicion ? 'Editar categoría' : 'Nueva categoría';

  document.getElementById('cat-nombre').value       = datos?.nombre_cc       || '';
  document.getElementById('cat-evento').value        = datos?.id_e            || '';
  document.getElementById('cat-edad-min').value      = datos?.edad_minima_cc  || '';
  document.getElementById('cat-edad-max').value      = datos?.edad_maxima_cc  || '';
  document.getElementById('cat-genero').value        = datos?.genero_cc       || '';
  document.getElementById('cat-distancia').value     = datos?.distancia_cc    || '';
  document.getElementById('cat-descripcion').value   = datos?.descripcion_cc  || '';

  const modal = document.getElementById('modal-categoria');
  if (esEdicion && datos?.id_cc) {
    modal.dataset.idCategoria = datos.id_cc;
  } else {
    delete modal.dataset.idCategoria;
  }

  openModal('modal-categoria');
}

//validación y guardado de categoria
function guardarCategoria() {
  const nombre      = document.getElementById('cat-nombre').value.trim();
  const idEvento    = document.getElementById('cat-evento').value;
  const edadMin     = document.getElementById('cat-edad-min').value;
  const edadMax     = document.getElementById('cat-edad-max').value;
  const genero      = document.getElementById('cat-genero').value;
  const distancia   = document.getElementById('cat-distancia').value.trim();
  const descripcion = document.getElementById('cat-descripcion').value.trim();
  const idCategoria = document.getElementById('modal-categoria').dataset.idCategoria;

  if (!nombre || !idEvento || !edadMin || !edadMax || !genero || !distancia || !descripcion) {
    showToast('Por favor, completa todos los campos obligatorios ❌', 'error');
    return;
  }

  const data = {
    nombre_categoria: nombre,
    id_evento:        idEvento,
    edad_min:         edadMin,
    edad_max:         edadMax,
    genero:           genero,
    distancia:        distancia,
    descripcion:      descripcion,
  };

  if (idCategoria) data.id_cc = idCategoria;
  const endpoint = idCategoria ? 'php/actualizar_categoria.php' : 'php/guardar_categoria.php';

  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(r => r.json())
  .then(result => {
    if (result.ok) {
      showToast(idCategoria ? 'Categoría actualizada ✅' : 'Categoría guardada ✅', 'success');
      catCerrar();
      loadAdminData();
    } else {
      showToast('Error: ' + (result.error || 'No se pudo guardar') + ' ❌', 'error');
    }
  })
  .catch(() => showToast('Error de conexión ❌', 'error'));
}


/* ===== SESSION MANAGEMENT ===== */
function handleLogoutAdmin() {
  const modal = document.getElementById('modal-logout');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function closeLogoutModalAdmin() {
  const modal = document.getElementById('modal-logout');
  if (modal) {
    modal.style.display = 'none';
  }
}

function confirmLogoutAdmin() {
  fetch('php/cerrar_sesion.php', { method: 'POST' })
    .then(() => {
      window.location.href = 'login.html';
    })
    .catch(() => {
      window.location.href = 'login.html';
    });
}
</script>
<script src="js/crear-evento.js"></script>
<script src="js/accesibilidad.js"></script>
<script src="js/editar_usuario.js"></script>
<script src="js/crear_kit.js"></script>
<script src="js/categoria.js"></script>
</div> 
</body>
</html>