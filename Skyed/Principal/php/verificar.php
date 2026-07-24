<?php
session_start();
require __DIR__ . '/../../conexion.php';


$email_sesion = $_SESSION['email'] ?? '';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['codigo'])) {
    $codigo = implode('', $_POST['codigo']);

    $stmt = $pdo->prepare("SELECT * FROM usuario WHERE TRIM(correo_u) = TRIM(?) AND TRIM(codigo) = TRIM(?)");
    
    $stmt->execute([$email_sesion, $codigo]);
    
    $usuario = $stmt->fetch();

    if ($usuario) {
        $_SESSION['usuario'] = $email_sesion;
        $_SESSION['email'] = $email_sesion;
        $_SESSION['verificado'] = true;
        header("Location: cambiar_contraseña.php");
        exit();
    } else {
        $error = "El código ingresado es incorrecto.";
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
  <link rel="stylesheet" href="../css/auth.css" />
  <link rel="stylesheet" href="../css/accesibilidad.css" />
  <link rel="stylesheet" href="../css/cambiar_contrasena.css" />
</head>
<body>
  <header class="auth-topbar">
    <a href="principal.html" class="auth-logo">
      <img src="../img/logoP.png" alt="SKYED" class="auth-logo-icon">
      <span class="auth-logo-text">SKY<span class="accent">ED</span></span>
    </a>
  </header>
    <!-- <main id="main" class="auth-wrapper">
    <aside class="auth-side" aria-hidden="true">
      <h2>Recupera tu <em>acceso</em></h2>
      <p>Te enviaremos un código de 6 dígitos a tu correo para restablecer tu contraseña de forma segura.</p>
      <ul>
        <li>Verificación por código</li>
        <li>Cambio de contraseña inmediato</li>
        <li>Tu cuenta siempre protegida</li>
      </ul>
    </aside> -->
    <div class="auth-grid" id="main">

    <!-- ================= ASIDE ================= -->
    <aside class="auth-aside">
      <div class="aside-blob aside-blob--blue"></div>
      <div class="aside-blob aside-blob--purple"></div>
      <div class="aside-blob aside-blob--gold"></div>

      <div class="aside-content">
        <span class="aside-eyebrow"><i class="ti ti-calendar-event"></i>&nbsp; Eventos</span>
        <h1 class="aside-title">Ingresa tu <span class="hl">CODIGO</span></h1>
        <p class="aside-subtitle">
          Digita el codigo que te llego al correo para continuar.
        </p>

        <ul class="aside-features">
          <li><span class="feat-ico"><i class="ti ti-calendar"></i></span>No compartas este codigo con nadie.</li>
          <li><span class="feat-ico"><i class="ti ti-ticket"></i></span>Este codigo es único y solo puede ser usado una vez.</li>
          <li><span class="feat-ico"><i class="ti ti-users"></i></span> Este código es válido por 24 horas.</li>  
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
    <form class="auth-form" id="reset-form" method="POST">
        <div id="step2">
            <h1>Verifica el código</h1>
            <p class="lead">Enviamos un código a <br><strong><?php echo $email_sesion; ?></strong></p>

            <div class="form-group">
                <label>Ingresa el código de 6 dígitos <span class="req">*</span></label>
                <?php if(isset($error)): ?>
                    <p style="color: #e74c3c; font-weight: bold;"><?php echo $error; ?></p>
                <?php endif; ?>
                <div class="otp-inputs" role="group" aria-label="Código de 6 dígitos">
                    <input type="text" name="codigo[]" inputmode="numeric" maxlength="1" aria-label="Dígito 1" />
                    <input type="text" name="codigo[]" inputmode="numeric" maxlength="1" aria-label="Dígito 2" />
                    <input type="text" name="codigo[]" inputmode="numeric" maxlength="1" aria-label="Dígito 3" />
                    <input type="text" name="codigo[]" inputmode="numeric" maxlength="1" aria-label="Dígito 4" />
                    <input type="text" name="codigo[]" inputmode="numeric" maxlength="1" aria-label="Dígito 5" />
                    <input type="text" name="codigo[]" inputmode="numeric" maxlength="1" aria-label="Dígito 6" />
                </div>
            </div>
        </div>
          <button type="submit" class="form-submit" id="loginSubmit">
            Enviar código
          </button>
        <div class="auth-footer">
            <a href="../login.html">← Volver a iniciar sesión</a>
        </div>
        </section>
    </main>
    </form>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">


  <button class="acc-toggle" id="accToggle" aria-label="Opciones de accesibilidad">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0 6c1.1 0 2 .9 2 2v5h-1v5h-2v-5H9v-5c0-1.1.9-2 2-2z"/>
  </svg>
</button>

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
  <script src="../js/accesibilidad.js"></script>
  <script src="../js/verificar.js"></script>

</body>
</html>