<?php
session_start();
include("conexion.php");

if (!isset($_SESSION['verificado']) || $_SESSION['verificado'] !== true) {
    header("Location: ../login.html");
    exit();
}

$email = $_SESSION['email']; 

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nueva_pass = $_POST['contraseña'];
    $confirmar_pass = $_POST['confirmar_contraseña'];

    // 1. Validar que las contraseñas coincidan
    if ($nueva_pass !== $confirmar_pass) {
        $error = "Las contraseñas no coinciden.";
    } 
    // 2. Validar longitud mínima
    else if (strlen($nueva_pass) < 8) {
        $error = "La contraseña debe tener al menos 8 caracteres.";
    } 
    else {
        // 3. Encriptar la contraseña (Muy importante por seguridad)
        $hashedPassword = password_hash($nueva_pass, PASSWORD_BCRYPT);

        // 4. Actualizar en la base de datos (VERSIÓN PDO)
        // Usamos $pdo, ajustamos los nombres de las columnas a tu BD y preparamos la consulta
        $stmt = $pdo->prepare("UPDATE usuario SET contrasena_u = ?, codigo = NULL WHERE correo_u = ?");
        
        // Eliminamos el bind_param y pasamos las variables directamente dentro de execute() en un arreglo
        if ($stmt->execute([$hashedPassword, $email])) {
            // Éxito: Limpiamos la sesión y avisamos al usuario
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
  <link rel="icon" href="../img/logo.png" />
  <link rel="stylesheet" href="../css/global.css" />
  <link rel="stylesheet" href="../css/accesibilidad.css" />
  <link rel="stylesheet" href="../css/cambiar_contrasena.css" />
</head>
<body>

  <header class="site-header" role="banner">
    <nav class="nav" aria-label="Navegación principal">
      <a href="../index.html" class="brand"><img src="../img/logo.png" alt="" /><span>SKY<em>ED</em></span></a>
      <button class="menu-toggle" aria-expanded="false" aria-controls="nav-list" aria-label="Abrir menú">☰</button>
    </nav>
  </header>
    <main id="main" class="auth-wrapper">
    <aside class="auth-side" aria-hidden="true">
      <h2>Recupera tu <em>acceso</em></h2>
      <p>Te enviaremos un código de 6 dígitos a tu correo para restablecer tu contraseña de forma segura.</p>
      <ul>
        <li>Verificación por código</li>
        <li>Cambio de contraseña inmediato</li>
        <li>Tu cuenta siempre protegida</li>
      </ul>
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
          <span class="help">Mínimo 8, una mayúscula, una minúscula y un número</span>
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
        
        <button type="submit" class="btn btn-primary btn-block">Guardar nueva contraseña</button>
        
      </form>
    </section>
    </main>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
<footer class="sky-footer">
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
        <a class="sky-social-btn" href="#" aria-label="Facebook">F</a>
        <a class="sky-social-btn" href="#" aria-label="Instagram">IG</a>
        <a class="sky-social-btn" href="#" aria-label="X / Twitter">X</a>
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
    <script src="../js/accesibilidad.js"></script> 
    <script src="../js/global.js"></script>
    <script src="../js/index.js"></script>
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