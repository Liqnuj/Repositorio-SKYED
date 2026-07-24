<?php
session_start();
require __DIR__ . '/../../conexion.php';

if (!isset($_SESSION['verificado']) || $_SESSION['verificado'] !== true) {
    header("Location: ../login.html");
    exit();
}

$email = $_SESSION['email']; 

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nueva_pass = $_POST['contraseña'];
    $confirmar_pass = $_POST['confirmar_contraseña'];

    if ($nueva_pass !== $confirmar_pass) {
        $error = "Las contraseñas no coinciden.";
    } 
    else if (strlen($nueva_pass) < 8) {
        $error = "La contraseña debe tener al menos 8 caracteres.";
    } 
    else {
        $hashedPassword = password_hash($nueva_pass, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("UPDATE usuario SET contrasena_u = ?, codigo = NULL WHERE correo_u = ?");
        if ($stmt->execute([$hashedPassword, $email])) {
            session_destroy(); 
            echo "<script>
                    alert('Contraseña actualizada con éxito. Ya puedes iniciar sesión.');
                    window.location.href='../login.html';
                  </script>";
            exit();
        } else {
            $error = "Hubo un error al actualizar la contraseña. Inténtalo de nuevo.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Recupera tu contraseña en SKYED y vuelve a acceder a tu cuenta." />
  <title>Recuperar contraseña — SKYED</title>
  <link rel="icon" href="../img/logoP.png" />
  <link rel="stylesheet" href="../css/accesibilidad.css" />
  <link rel="stylesheet" href="../css/cambiar_contrasena.css" />
  <link rel="stylesheet" href="../css/auth.css" />
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">

</head>
<body>

  <header class="auth-topbar">
    <a href="principal.html" class="auth-logo">
      <img src="../img/logoP.png" alt="SKYED" class="auth-logo-icon">
      <span class="auth-logo-text">SKY<span class="accent">ED</span></span>
    </a>
  </header>
    <div class="auth-grid" id="main">

    <!-- ================= ASIDE ================= -->
    <aside class="auth-aside">
      <div class="aside-blob aside-blob--blue"></div>
      <div class="aside-blob aside-blob--purple"></div>
      <div class="aside-blob aside-blob--gold"></div>

      <div class="aside-content">
        <span class="aside-eyebrow"><i class="ti ti-calendar-event"></i>&nbsp; Eventos</span>
        <h1 class="aside-title">Crea una nueva <span class="hl">CONTRASEÑA</span></h1>
        <p class="aside-subtitle">
          Ingresa tu nueva contraseña, facil de recordar pero difícil de adivinar.
        </p>

        <ul class="aside-features">
          <li><span class="feat-ico"><i class="ti ti-calendar"></i></span>Contraseña segura.</li>
          <li><span class="feat-ico"><i class="ti ti-ticket"></i></span>Contraseña difícil de adivinar.</li>
          <li><span class="feat-ico"><i class="ti ti-users"></i></span> Tu cuenta siempre protegida.</li>
        </ul>

        <div class="ticket-card">
          <div class="ticket-main">
            <div class="ticket-kicker">Tu próximo evento</div>
            <div class="ticket-title">Feria SKYED </div>
            <div class="ticket-meta">Acceso general · Válido con tu cuenta</div>
          </div>
          <div class="ticket-stub">
            <span>PASE</span>
            <strong>#00 SKYED</strong>
          </div>
        </div>
      </div>
    </aside>
<section class="auth-form-box">
      <form class="auth-form" id="reset-password-form" action="cambiar_contraseña.php" method="POST">
          <h1>Cambia tu contraseña</h1>
          <p class="lead">Ingresa una contraseña válida y segura para tu cuenta</p>
        <div class="form-group">
          <label for="password">Nueva contraseña <span class="req">*</span></label>
          <div class="input-wrap">
            <input id="password" name="contraseña" type="password" required maxlength="50"
                   data-validate="password" placeholder="••••••••" autocomplete="new-password" />
            <button type="button" class="toggle-pass" aria-label="Mostrar contraseña">👁</button>
          </div>
          <div class="password-strength"><div class="bar"></div></div>
          <span class="error"></span>
        </div>

        <div class="form-group">
          <label for="password-confirm">Confirmar Contraseña <span class="req">*</span></label>
          <div class="input-wrap">
            <input id="password-confirm" name="confirmar_contraseña" type="password" required maxlength="50"
                   data-validate="password-confirm" placeholder="••••••••" autocomplete="new-password" />
            <button type="button" class="toggle-pass" aria-label="Mostrar contraseña">👁</button>
          </div>
          <span class="error"></span>
        </div>
        
          <button type="submit" class="form-submit" id="loginSubmit">Guardar nueva contraseña</button>
        
      </form>
    </section>
    </main>
       

  <button class="acc-toggle" id="accToggle" aria-label="Opciones de accesibilidad">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0 6c1.1 0 2 .9 2 2v5h-1v5h-2v-5H9v-5c0-1.1.9-2 2-2z"/>
  </svg>
</button>
    <script src="../js/accesibilidad.js"></script> 
    <script src="../js/global.js"></script>
    <script src="../js/auth.js"></script>
  <!-- Panel -->
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
</body>
</html>