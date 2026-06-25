(async function () {
    'use strict';


    const params  = new URLSearchParams(location.search);
    const idEvento = parseInt(params.get('id') || '1', 10);

    // Mock de eventos (misma estructura que la tabla Evento)
    const EVENTOS_MOCK = {
      1: {
        id_e: 1, nombre_e: 'Gran Fondo de Los Andes',
        categoria_e: 'ruta', fecha_e: '2026-06-15', hora_e: '07:00',
        ubicacion_e: 'Bogotá, Colombia',
        distancia_total_e: '120 km', desnivel_e: '2 800 m',
        cupos_disponibles_e: 320, cupos_totales_e: 500,
        precio_e: 75000, imagen_e: 'img/event1.jpg',
        estado_e: 'activo',
        // Categorias_Competencia asociadas
        categorias: [
          { id_cc:7, nombre_cc:'Elite hombre', edad_minima_cc:18, edad_maxima_cc:40, genero_cc:'masculino',distancia_cc:'' },
          { id_cc:8, nombre_cc:'Elite mujer',  edad_minima_cc:18, edad_maxima_cc:40, genero_cc:'femenino',distancia_cc:''},
          { id_cc:9, nombre_cc:'Junior',        edad_minima_cc:15, edad_maxima_cc:17, genero_cc:'mixto',    distancia_cc:'' },
        
        ]
      },
      2: {
        id_e: 2, nombre_e: 'Copa Nacional MTB Downhill',
        categoria_e: 'mtb', fecha_e: '2026-07-22', hora_e: '09:00',
        ubicacion_e: 'Manizales, Colombia',
        distancia_total_e: '4 km', desnivel_e: '-650 m',
        cupos_disponibles_e: 45, cupos_totales_e: 120,
        precio_e: 90000, imagen_e: 'img/event2.jpg',
        estado_e: 'activo',
        categorias: [
          { id_cc:7, nombre_cc:'Elite hombre', edad_minima_cc:18, edad_maxima_cc:40, genero_cc:'masculino', distancia_cc:'' },
          { id_cc:8, nombre_cc:'Elite mujer',  edad_minima_cc:18, edad_maxima_cc:40, genero_cc:'femenino',  distancia_cc:'' },
          { id_cc:9, nombre_cc:'Junior',        edad_minima_cc:15, edad_maxima_cc:17, genero_cc:'mixto',    distancia_cc:'' },
        
        ]
      },
      3: {
        id_e: 3, nombre_e: 'Velódromo Open Pista',
        categoria_e: 'pista', fecha_e: '2026-08-10', hora_e: '08:00',
        ubicacion_e: 'Cali, Colombia',
        distancia_total_e: '250 m/vuelta', desnivel_e: '—',
        cupos_disponibles_e: 80, cupos_totales_e: 80,
        precio_e: 60000, imagen_e: 'img/event3.jpg',
        estado_e: 'activo',
        categorias: [
          { id_cc:7, nombre_cc:'Elite hombre', edad_minima_cc:18, edad_maxima_cc:40, genero_cc:'masculino', distancia_cc:'' },
          { id_cc:8, nombre_cc:'Elite mujer',  edad_minima_cc:18, edad_maxima_cc:40, genero_cc:'femenino',  distancia_cc:'' },
          { id_cc:9, nombre_cc:'Junior',        edad_minima_cc:15, edad_maxima_cc:17, genero_cc:'mixto',    distancia_cc:'' },
        ]
      },
      4: {
        id_e: 4, nombre_e: 'Gravel Adventure Boyacá',
        categoria_e: 'gravel', fecha_e: '2026-09-02', hora_e: '06:30',
        ubicacion_e: 'Tunja, Boyacá',
        distancia_total_e: '85 km', desnivel_e: '1 500 m',
        cupos_disponibles_e: 300, cupos_totales_e: 300,
        precio_e: 65000, imagen_e: 'img/event4.jpg',
        estado_e: 'activo',
        categorias: [
          { id_cc:7, nombre_cc:'Elite hombre', edad_minima_cc:18, edad_maxima_cc:40, genero_cc:'masculino', distancia_cc:'' },
          { id_cc:8, nombre_cc:'Elite mujer',  edad_minima_cc:18, edad_maxima_cc:40, genero_cc:'femenino',  distancia_cc:'' },
          { id_cc:9, nombre_cc:'Junior',        edad_minima_cc:15, edad_maxima_cc:17, genero_cc:'mixto',    distancia_cc:'' },
        ]
      },
      5: {
        id_e: 5, nombre_e: 'BMX Race Championship',
        categoria_e: 'bmx', fecha_e: '2026-09-20', hora_e: '10:00',
        ubicacion_e: 'Medellín, Colombia',
        distancia_total_e: '400 m', desnivel_e: '—',
        cupos_disponibles_e: 200, cupos_totales_e: 200,
        precio_e: 55000, imagen_e: 'img/event5.jpg',
        estado_e: 'activo',
        categorias: [
          { id_cc:7, nombre_cc:'Elite hombre', edad_minima_cc:18, edad_maxima_cc:40, genero_cc:'masculino', distancia_cc:'' },
          { id_cc:8, nombre_cc:'Elite mujer',  edad_minima_cc:18, edad_maxima_cc:40, genero_cc:'femenino',  distancia_cc:'' },
          { id_cc:9, nombre_cc:'Junior',        edad_minima_cc:15, edad_maxima_cc:17, genero_cc:'mixto',    distancia_cc:'' },
        ]
      },
      6: {
        id_e: 6, nombre_e: 'Ruta Solidaria Costa Caribe',
        categoria_e: 'ruta', fecha_e: '2026-10-15', hora_e: '06:00',
        ubicacion_e: 'Cartagena, Colombia',
        distancia_total_e: '60 km', desnivel_e: '350 m',
        cupos_disponibles_e: 1000, cupos_totales_e: 1000,
        precio_e: 45000, imagen_e: 'img/event6.jpg',
        estado_e: 'activo',
        categorias: [
          { id_cc:7, nombre_cc:'Elite hombre', edad_minima_cc:18, edad_maxima_cc:40, genero_cc:'masculino', distancia_cc:'' },
          { id_cc:8, nombre_cc:'Elite mujer',  edad_minima_cc:18, edad_maxima_cc:40, genero_cc:'femenino',  distancia_cc:'' },
          { id_cc:9, nombre_cc:'Junior',        edad_minima_cc:15, edad_maxima_cc:17, genero_cc:'mixto',    distancia_cc:'' },
        ]
      }
    };

    const evento = EVENTOS_MOCK[idEvento] || EVENTOS_MOCK[1];

    /* ──────────────────────────────────────────────
       2. ESTADO DE LA INSCRIPCIÓN
       ────────────────────────────────────────────── */
    const estado = {
      paso:       1,
      user:       null,
      categoriaId:null,
      categoriaNombre: '',
      talla:      '',
      metodo:     'transferencia',
      comprobante:null,
      // campos paso 1
      doc_u: '', rh_u: '', telefono_u: '',
      contacto_nombre: '', contacto_telefono: '',
      fecha_nacimiento_u: '', dorsal: '',
      condiciones_medicas: '',
    };


    let session   = JSON.parse(localStorage.getItem('cicloUser') || 'null');
    const noSession = document.getElementById('no-session');
    const mainCont  = document.getElementById('main-content');

    // Verificar sesión en servidor antes de mostrar/permitir inscripción
    try {
      const resp = await fetch('php/check-auth.php');
      const data = await resp.json();
      if (data.loggedin && data.usuario && data.usuario.email) {
        // Asegurar que localStorage coincide con la sesión del servidor
        localStorage.setItem('cicloUser', JSON.stringify(data.usuario));
        session = JSON.parse(localStorage.getItem('cicloUser') || 'null');
      } else {
        // No hay sesión válida en servidor -> forzar login
        localStorage.removeItem('cicloUser');
        localStorage.setItem('pendingInscripcion', location.href);
        if (noSession) noSession.classList.add('show');
        return; // detener ejecución
      }
    } catch (err) {
      // Error comunicando con el servidor; tratar como no autenticado
      localStorage.removeItem('cicloUser');
      localStorage.setItem('pendingInscripcion', location.href);
      if (noSession) noSession.classList.add('show');
      return;
    }

    const safeString = value => {
      if (value === null || value === undefined) return '';
      if (typeof value === 'string') return value;
      if (typeof value === 'number' || typeof value === 'boolean') return String(value);
      return '';
    };

    // Normalizar y persistir campos importantes para otras páginas
    const normalizedSession = {
      email: safeString(session.email),
      nombre: safeString(session.nombre) || safeString(session.email).split('@')[0],
      telefono: safeString(session.telefono) || safeString(session.phone) || safeString(session.telefono_u),
      documento: safeString(session.documento) || safeString(session.doc) || safeString(session.documento_u),
      rh: safeString(session.rh) || safeString(session.rh_u) || safeString(session.tipo_sangre) || safeString(session.tipo_sangre_u),
      fechaNac: safeString(session.fechaNac) || safeString(session.fecha_nacimiento) || safeString(session.fechaNacimiento) || safeString(session.fecha)
    };
    localStorage.setItem('cicloUser', JSON.stringify(normalizedSession));

    const isAlreadyInscrito = async () => {
      try {
        const res = await fetch('php/get_inscripciones.php', { credentials: 'include' });
        const data = await res.json();
        if (!data.ok || !Array.isArray(data.inscripciones)) return false;
        return data.inscripciones.some(i =>
          (Number(i.id_e) === Number(idEvento) || Number(i.evento_id) === Number(idEvento)) &&
          i.estado_i !== 'cancelado' &&
          i.estado_i !== 'rechazado'
        );
      } catch (err) {
        console.error('Error verificando inscripción:', err);
        return false;
      }
    };

    if (await isAlreadyInscrito()) {
      // Redirigir a eventos con mensaje en URL
      location.href = 'eventos.html?msg=ya_inscrito';
      return;
    }

    mainCont.style.display = 'block';
    estado.user = normalizedSession;

    // Actualizar nav
    const authUser  = document.querySelector('[data-auth-user]');
    const authLogin = document.querySelector('[data-auth-login]');
    const authProf  = document.querySelector('[data-auth-profile]');
    if (authUser)  {
      authUser.textContent = `Hola, ${normalizedSession.nombre}`;
      authUser.style.display = 'inline';
      authUser.classList.add('btn','btn-primary');
    }
    if (authLogin) authLogin.style.display = 'none';
    if (authProf)  authProf.style.display = 'inline-flex';

    // Prefill paso 1 desde la sesión
    const docField = document.getElementById('p1-doc');
    const telField = document.getElementById('p1-tel');
    const rhField = document.getElementById('p1-rh');
    const fechaField = document.getElementById('p1-fecha-nac');
    const nombreField = document.getElementById('p1-nombre');
    const correoField = document.getElementById('p1-correo');
    const guestNameInput = document.getElementById('p1-guest-nombre');
    const guestDocInput = document.getElementById('p1-guest-doc');
    const guestTelInput = document.getElementById('p1-guest-tel');
    const guestRhInput = document.getElementById('p1-guest-rh');
    const guestFechaInput = document.getElementById('p1-guest-fecha-nac');
    let guestMode = false;

    const parseToISO = s => {
      if (!s) return '';
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
      let m = s.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/);
      if (m) return `${m[3]}-${m[2]}-${m[1]}`;
      m = s.match(/^(\d{4})[\/\-](\d{2})[\/\-](\d{2})$/);
      if (m) return `${m[1]}-${m[2]}-${m[3]}`;
      const d = new Date(s);
      if (!isNaN(d.getTime())) {
        const y = d.getFullYear();
        const mm = String(d.getMonth()+1).padStart(2,'0');
        const dd = String(d.getDate()).padStart(2,'0');
        return `${y}-${mm}-${dd}`;
      }
      return '';
    };

    if (normalizedSession.telefono && telField) telField.value = normalizedSession.telefono.replace(/[^0-9]/g,'').slice(0,10);
    if (normalizedSession.documento && docField) docField.value = normalizedSession.documento.replace(/[^0-9]/g,'').slice(0,10);
    if (normalizedSession.rh && rhField) rhField.value = normalizedSession.rh;
    if (normalizedSession.email && correoField) correoField.textContent = normalizedSession.email;
    if (normalizedSession.nombre && nombreField) nombreField.textContent = normalizedSession.nombre;
    if (normalizedSession.fechaNac && fechaField) {
      const iso = parseToISO(normalizedSession.fechaNac);
      if (iso) fechaField.value = iso;
    }

    const applyGuestData = () => {
      if (!guestMode) return;
      if (guestNameInput && guestNameInput.value.trim() && nombreField) nombreField.textContent = guestNameInput.value.trim();
      if (guestDocInput && docField) docField.value = guestDocInput.value.replace(/[^0-9]/g,'').slice(0,10);
      if (guestTelInput && telField) telField.value = guestTelInput.value.replace(/[^0-9]/g,'').slice(0,15);
      if (guestRhInput && rhField) rhField.value = guestRhInput.value;
      if (guestFechaInput && fechaField) fechaField.value = guestFechaInput.value;
    };

    // Fecha de nacimiento
    const fechaInput = fechaField;
    const possibleDates = [normalizedSession.fechaNac, session.fechaNacimiento, session.fecha_nacimiento, session.fechaNac, session.fecha, session.birthdate, session.birthday];
    for (const key of possibleDates) {
      const iso = parseToISO(key);
      if (iso) { if (fechaInput) fechaInput.value = iso; break; }
    }

    // Guest invite section toggles
    const invitadosBtn = document.getElementById('btn-invitado');
    const guestSection = document.getElementById('guest-section');
    const guestFields = guestSection ? Array.from(guestSection.querySelectorAll('input, select')) : [];
    if (guestSection) guestSection.style.display = 'none';
    if (invitadosBtn) {
      invitadosBtn.addEventListener('click', () => {
        if (guestSection) guestSection.style.display = 'block';
        invitadosBtn.style.display = 'none';
        guestMode = true;
        showToast('Complete los datos del invitado.', 'success');
      });
    }
    [guestNameInput, guestDocInput, guestTelInput, guestRhInput, guestFechaInput].forEach(inp => {
      if (!inp) return;
      inp.addEventListener('input', applyGuestData);
      inp.addEventListener('change', applyGuestData);
    });

  

    // Input filters
    const docInput = document.getElementById('p1-doc');
    const telInput = document.getElementById('p1-tel');
    const contactoTel = document.getElementById('p1-contacto-tel');
    const contactoNombre = document.getElementById('p1-contacto-nombre');
    const dorsalInput = document.getElementById('p1-dorsal');

    [docInput, telInput, contactoTel].forEach(inp => {
      if (!inp) return;
      inp.addEventListener('input', () => {
        inp.value = inp.value.replace(/[^0-9]/g,'').slice(0,10);
      });
      inp.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text') || '';
        inp.value = text.replace(/[^0-9]/g,'').slice(0,10);
      });
    });

    // Dorsal
    if (dorsalInput) {
      dorsalInput.addEventListener('input', () => {
        dorsalInput.value = dorsalInput.value.replace(/[^0-9]/g,'').slice(0,6);
      });
      dorsalInput.addEventListener('paste', e => {
        e.preventDefault();
        const t = (e.clipboardData || window.clipboardData).getData('text') || '';
        dorsalInput.value = t.replace(/[^0-9]/g,'').slice(0,6);
      });
    }

    // Nombre del contacto
    if (contactoNombre) {
      contactoNombre.addEventListener('input', () => {
        let v = contactoNombre.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g,'');
        v = v.replace(/\s+/g,' ');
        const parts = v.trim().split(' ').filter(Boolean);
        if (parts.length > 4) v = parts.slice(0,4).join(' ');
        contactoNombre.value = v;
      });
      contactoNombre.addEventListener('blur', () => {
        let v = contactoNombre.value.trim();
        if (v) {
          v = v.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
          contactoNombre.value = v;
        }
      });
    }


    const fmtFecha = iso => {
      try {
        const [y,m,d] = iso.split('-');
        const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
        return `${parseInt(d)} ${meses[parseInt(m)-1]} ${y}`;
      } catch { return iso; }
    };
    const fmtMoney = n => '$' + Number(n).toLocaleString('es-CO');

    document.getElementById('bc-evento').textContent     = evento.nombre_e;
    document.getElementById('ev-nombre').textContent     = evento.nombre_e;
    document.getElementById('ev-badge').textContent      = evento.categoria_e.toUpperCase();
    document.getElementById('ev-fecha').textContent      = fmtFecha(evento.fecha_e);
    document.getElementById('ev-hora').textContent       = evento.hora_e;
    document.getElementById('ev-lugar').textContent      = evento.ubicacion_e;
    document.getElementById('ev-dist').textContent       = evento.distancia_total_e;
    document.getElementById('ev-desnivel').textContent   = evento.desnivel_e + ' desnivel';
    document.getElementById('ev-cupos-text').textContent = evento.cupos_disponibles_e + ' cupos disponibles';
    document.getElementById('ev-precio-base').textContent = fmtMoney(evento.precio_e);
    document.getElementById('ev-precio-total').textContent = fmtMoney(evento.precio_e);
    document.getElementById('ev-img').src = evento.imagen_e;

    // Badge cupos
    const cuposBadge = document.getElementById('ev-cupos-badge');
    const pct = evento.cupos_disponibles_e / evento.cupos_totales_e;
    if (evento.cupos_disponibles_e === 0) {
      cuposBadge.className = 'cupos-badge out';
      cuposBadge.innerHTML = '<i class="ti ti-circle-x"></i> Sin cupos';
    } else if (pct < 0.2) {
      cuposBadge.className = 'cupos-badge low';
      cuposBadge.innerHTML = `<i class="ti ti-alert-triangle"></i> ¡Últimos ${evento.cupos_disponibles_e} cupos!`;
    }

    // Referencias de pago con ID del evento
    const ref = `SKYED-${String(idEvento).padStart(4,'0')}`;
    document.querySelectorAll('[id^="ref-"]').forEach(el => el.textContent = ref);

    /* ──────────────────────────────────────────────
       5. DATOS DEL USUARIO EN PASO 1
       ────────────────────────────────────────────── */
    const nombre = session.nombre || session.email.split('@')[0];
    document.getElementById('p1-avatar').textContent = nombre.charAt(0).toUpperCase();
    document.getElementById('p1-nombre').textContent = nombre;
    document.getElementById('p1-correo').textContent  = session.email;

    // Pre-rellenar campos si hay datos guardados
    const userData = JSON.parse(localStorage.getItem('cicloUsuarios') || '[]');
    const u = userData.find(x => x.email === session.email);
    if (u) {
      if (u.telefono) document.getElementById('p1-tel').value = u.telefono;
      if (u.fechaNac) document.getElementById('p1-fecha-nac').value = u.fechaNac;
    }

    /* ──────────────────────────────────────────────
       6. RENDERIZAR CATEGORÍAS DE COMPETENCIA
       ────────────────────────────────────────────── */
    const catGrid = document.getElementById('cat-grid');
    evento.categorias.forEach(cat => {
      const div = document.createElement('div');
      div.className = 'cat-option';
      div.dataset.id = cat.id_cc;
      div.dataset.nombre = cat.nombre_cc;
      div.innerHTML = `
        <input type="radio" name="categoria_cc" value="${cat.id_cc}" aria-label="${cat.nombre_cc}" />
        <div class="cat-name">${cat.nombre_cc}</div>
        <div class="cat-detail">
          ${cat.genero_cc !== 'mixto' ? cat.genero_cc.charAt(0).toUpperCase() + cat.genero_cc.slice(1) + ' · ' : ''}
          ${cat.edad_minima_cc}–${cat.edad_maxima_cc} años · ${cat.distancia_cc}
        </div>
        <div class="cat-check" aria-hidden="true"></div>
      `;
      div.addEventListener('click', () => {
        document.querySelectorAll('.cat-option').forEach(c => c.classList.remove('selected'));
        div.classList.add('selected');
        div.querySelector('input').checked = true;
        estado.categoriaId    = cat.id_cc;
        estado.categoriaNombre = cat.nombre_cc;
        document.getElementById('err-cat').classList.remove('show');
      });
      catGrid.appendChild(div);
    });

    /* ──────────────────────────────────────────────
       7. JERSEY OPT-IN + TALLA
       ────────────────────────────────────────────── */
    const PRECIO_JERSEY = 50000;
    estado.quiereJersey = null; // null = no elegido aún

    function actualizarPrecio() {
      const total = estado.quiereJersey ? evento.precio_e + PRECIO_JERSEY : evento.precio_e;
      const baseEl  = document.getElementById('ev-precio-base');
      const totalEl = document.getElementById('ev-precio-total');
      if (baseEl) baseEl.textContent = fmtMoney(evento.precio_e);
      if (totalEl) totalEl.textContent = fmtMoney(total);

      // Mostrar/ocultar fila del jersey en el precio
      let jerseyRow = document.getElementById('precio-jersey-row');
      if (estado.quiereJersey) {
        if (!jerseyRow) {
          jerseyRow = document.createElement('div');
          jerseyRow.id = 'precio-jersey-row';
          jerseyRow.className = 'precio-row';
          jerseyRow.innerHTML = `<span>Kit (jersey + pantaloneta + medias)</span><span>${fmtMoney(PRECIO_JERSEY)}</span>`;
          const precioTotal = document.querySelector('.precio-total');
          if (precioTotal) precioTotal.parentNode.insertBefore(jerseyRow, precioTotal);
        }
      } else {
        if (jerseyRow) jerseyRow.remove();
      }
    }

    // Botones Sí / No
    document.getElementById('jersey-si').addEventListener('click', () => {
      document.getElementById('jersey-si').classList.add('selected');
      document.getElementById('jersey-no').classList.remove('selected');
      document.getElementById('err-jersey').classList.remove('show');
      estado.quiereJersey = true;
      document.getElementById('talla-section').style.display = 'block';
      actualizarPrecio();
    });

    document.getElementById('jersey-no').addEventListener('click', () => {
      document.getElementById('jersey-no').classList.add('selected');
      document.getElementById('jersey-si').classList.remove('selected');
      document.getElementById('err-jersey').classList.remove('show');
      estado.quiereJersey = false;
      estado.talla = '';
      document.getElementById('talla-section').style.display = 'none';
      document.querySelectorAll('.talla-btn').forEach(b => b.classList.remove('selected'));
      actualizarPrecio();
    });

    // Botones de talla (solo dentro de #talla-section)
    document.querySelectorAll('#talla-section .talla-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#talla-section .talla-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        estado.talla = btn.dataset.talla;
        document.getElementById('err-talla').classList.remove('show');
      });
    });

    /* ──────────────────────────────────────────────
       8. TABS DE MÉTODO DE PAGO
       ────────────────────────────────────────────── */
    document.querySelectorAll('.pago-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.pago-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
        document.querySelectorAll('.pago-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        tab.setAttribute('aria-selected','true');
        estado.metodo = tab.dataset.tab;
        document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
      });
    });

    /* ──────────────────────────────────────────────
       9. SUBIR EL COMPROBANTE
       ────────────────────────────────────────────── */
    function setupUpload(inputId, previewId, nameId) {
      const input   = document.getElementById(inputId);
      const preview = document.getElementById(previewId);
      const nameEl  = document.getElementById(nameId);
      if (!input) return;
      input.addEventListener('change', () => {
        const file = input.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
          showToast('El archivo supera 5 MB', 'error'); return;
        }
        estado.comprobante = file;
        nameEl.textContent  = file.name;
        preview.classList.add('show');
      });
      // Drag & drop
      const zone = input.closest('.upload-zone');
      if (zone) {
        zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
        zone.addEventListener('drop', e => {
          e.preventDefault(); zone.classList.remove('dragover');
          if (e.dataTransfer.files[0]) { input.files = e.dataTransfer.files; input.dispatchEvent(new Event('change')); }
        });
      }
    }
    setupUpload('comprobante-file',  'upload-preview',       'upload-name');
    setupUpload('comprobante-nequi', 'upload-preview-nequi', 'upload-name-nequi');

    /* ──────────────────────────────────────────────
       10. STEPPER — navegación entre pasos
       ────────────────────────────────────────────── */
    function mostrarPaso(n) {
      // Paneles
      document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(`panel-${n}`).classList.add('active');
      // Tabs del stepper
      document.querySelectorAll('.step-item').forEach((tab, i) => {
        tab.classList.remove('active','done');
        if (i + 1 < n)  tab.classList.add('done');
        if (i + 1 === n) tab.classList.add('active');
      });
      estado.paso = n;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ── Validación paso 1 ── */
    function validarPaso1() {
      let ok = true;
      applyGuestData();
      const doc = document.getElementById('p1-doc');
      const rh = document.getElementById('p1-rh');
      const tel = document.getElementById('p1-tel');
      const contacto = document.getElementById('p1-contacto-nombre');
      const contactoTel = document.getElementById('p1-contacto-tel');
      const fecha = document.getElementById('p1-fecha-nac');

      // Documento
      if (!/^\d{5,10}$/.test(doc.value.trim())) {
        document.getElementById('err-doc').classList.add('show'); doc.classList.add('invalid'); ok = false;
      } else { document.getElementById('err-doc').classList.remove('show'); doc.classList.remove('invalid'); }

      // RH
      if (!rh.value) { document.getElementById('err-rh').classList.add('show'); rh.classList.add('invalid'); ok = false; }
      else { document.getElementById('err-rh').classList.remove('show'); rh.classList.remove('invalid'); }

      // Teléfono
      if (!/^\d{7,15}$/.test(tel.value.trim())) {
        document.getElementById('err-tel').classList.add('show'); tel.classList.add('invalid'); ok = false;
      } else { document.getElementById('err-tel').classList.remove('show'); tel.classList.remove('invalid'); }

      // Nombre contacto
      const cval = (contacto.value || '').trim();
      const spaceCount = (cval.match(/ /g) || []).length;
      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(cval) || spaceCount > 3 || cval.length < 2) {
        document.getElementById('err-contacto').classList.add('show'); contacto.classList.add('invalid'); ok = false;
      } else {
        // primera letra en mayúscula
        if (cval && contacto.value.charAt(0) !== contacto.value.charAt(0).toUpperCase()) {
          contacto.value = cval.charAt(0).toUpperCase() + cval.slice(1);
        }
        document.getElementById('err-contacto').classList.remove('show'); contacto.classList.remove('invalid');
      }

      // Teléfono contacto
      if (!/^\d{7,15}$/.test((contactoTel.value || '').trim())) {
        document.getElementById('err-contacto-tel').classList.add('show'); contactoTel.classList.add('invalid'); ok = false;
      } else { document.getElementById('err-contacto-tel').classList.remove('show'); contactoTel.classList.remove('invalid'); }

      // Fecha
      if (!fecha.value) {
        document.getElementById('err-fecha').classList.add('show'); fecha.classList.add('invalid'); ok = false;
      } else {
        const d = new Date(fecha.value);
        if (isNaN(d.getTime()) || d > new Date() || d.getFullYear() < 1900) {
          document.getElementById('err-fecha').classList.add('show'); fecha.classList.add('invalid'); ok = false;
        } else { document.getElementById('err-fecha').classList.remove('show'); fecha.classList.remove('invalid'); }
      }

      if (!estado.categoriaId) { document.getElementById('err-cat').classList.add('show'); ok = false; }

  
      if (estado.quiereJersey === null) {
        document.getElementById('err-jersey').classList.add('show'); ok = false;
      } else {
        document.getElementById('err-jersey').classList.remove('show');
      }


      if (estado.quiereJersey === true && !estado.talla) {
        document.getElementById('err-talla').classList.add('show'); ok = false;
      } else if (estado.quiereJersey !== true) {
        document.getElementById('err-talla').classList.remove('show');
      }

      return ok;
    }

    /* ── Validación paso 2 ── */
    function validarPaso2() {
      if (estado.metodo === 'transferencia') {
        const f = document.getElementById('comprobante-file').files[0];
        if (!f) { document.getElementById('err-comprobante').classList.add('show'); return false; }
        document.getElementById('err-comprobante').classList.remove('show');
      }
      if (estado.metodo === 'nequi') {
        const f = document.getElementById('comprobante-nequi').files[0];
        if (!f) { document.getElementById('err-comprobante-nequi').classList.add('show'); return false; }
        document.getElementById('err-comprobante-nequi').classList.remove('show');
      }
      if (estado.metodo === 'efectivo') {
        const p = document.getElementById('punto-pago').value;
        if (!p) { document.getElementById('err-punto').classList.add('show'); return false; }
        document.getElementById('err-punto').classList.remove('show');
      }
      return true;
    }

    /* ── Poblar resumen (paso 3) ── */
    function poblarResumen() {
      document.getElementById('rs-evento').textContent    = evento.nombre_e;
      document.getElementById('rs-fecha').textContent     = fmtFecha(evento.fecha_e) + ' · ' + evento.hora_e;
      document.getElementById('rs-lugar').textContent     = evento.ubicacion_e;
      document.getElementById('rs-categoria').textContent = estado.categoriaNombre;
      document.getElementById('rs-nombre').textContent    = nombre;
      document.getElementById('rs-doc').textContent       = document.getElementById('p1-doc').value;
      document.getElementById('rs-correo').textContent    = session.email;
      document.getElementById('rs-talla').textContent     = estado.quiereJersey ? estado.talla : 'Sin kit';
      document.getElementById('rs-dorsal').textContent    = document.getElementById('p1-dorsal').value || 'Sin preferencia';
      const metodoLabel = { transferencia:'Transferencia bancaria', nequi:'Nequi / Daviplata', efectivo:'Efectivo en punto autorizado' };
      document.getElementById('rs-metodo').textContent    = metodoLabel[estado.metodo];
      document.getElementById('rs-comprobante').textContent = estado.comprobante ? estado.comprobante.name : (estado.metodo === 'efectivo' ? 'Pago presencial' : '—');
      const precioFinal = estado.quiereJersey ? evento.precio_e + PRECIO_JERSEY : evento.precio_e;
      document.getElementById('rs-precio').textContent    = fmtMoney(precioFinal);
    }

  
    document.getElementById('btn-next-1').addEventListener('click', () => {
      // Guardar datos del paso 1
      estado.doc_u               = document.getElementById('p1-doc').value.trim();
      estado.rh_u                = document.getElementById('p1-rh').value;
      estado.telefono_u          = document.getElementById('p1-tel').value.trim();
      estado.contacto_nombre     = document.getElementById('p1-contacto-nombre').value.trim();
      estado.contacto_telefono   = document.getElementById('p1-contacto-tel').value.trim();
      estado.fecha_nacimiento_u  = document.getElementById('p1-fecha-nac').value;
      estado.dorsal              = document.getElementById('p1-dorsal').value;
      estado.condiciones_medicas = document.getElementById('p1-medico').value;
      if (validarPaso1()) mostrarPaso(2);
    });

    document.getElementById('btn-back-2').addEventListener('click', () => mostrarPaso(1));
    document.getElementById('btn-next-2').addEventListener('click', () => {
      if (validarPaso2()) { poblarResumen(); mostrarPaso(3); }
    });
    document.getElementById('btn-back-3').addEventListener('click', () => mostrarPaso(2));



    document.getElementById('btn-confirmar').addEventListener('click', async () => {
      // Validar términos
      let ok = true;
      if (!document.getElementById('chk-terminos').checked) {
        document.getElementById('err-terminos').classList.add('show'); ok = false;
      } else document.getElementById('err-terminos').classList.remove('show');
      if (!document.getElementById('chk-salud').checked) {
        document.getElementById('err-salud').classList.add('show'); ok = false;
      } else document.getElementById('err-salud').classList.remove('show');
      if (!ok) return;

      // El chequeo de duplicado lo hace el servidor; si llega aquí es porque pasó la validación inicial


      // Deshabilitar botón
      const btn = document.getElementById('btn-confirmar');
      btn.disabled = true;
      btn.innerHTML = '<i class="ti ti-loader" style="animation:spin .8s linear infinite"></i> Procesando…';

      // Payload que coincide con los campos de la tabla inscripciones
      const precioPagado = estado.quiereJersey ? evento.precio_e + PRECIO_JERSEY : evento.precio_e;
      const payload = {
        evento_id:           evento.id_e,
        doc_u:               estado.doc_u,
        rh_u:                estado.rh_u,
        telefono_u:          estado.telefono_u,
        contacto_nombre:     estado.contacto_nombre,
        contacto_telefono:   estado.contacto_telefono,
        fecha_nacimiento:    estado.fecha_nacimiento_u,
        dorsal:              estado.dorsal,
        condiciones_medicas: estado.condiciones_medicas,
        metodo_pago:         estado.metodo,
        precio:              precioPagado,
        quiere_jersey:       !!estado.quiereJersey,
        talla_camiseta:      estado.talla || '',
        id_cc:               estado.categoriaId,
        categoriaNombre:     estado.categoriaNombre,
        eventoNombre:        evento.nombre_e,
        eventoFecha:         evento.fecha_e,
        eventoLugar:         evento.ubicacion_e,
        eventoCategoria:     evento.categoria_e,
        eventoKm:            evento.distancia_total_e,
        eventoImg:           evento.imagen_e,
      };

      const paymentReference = `REF-${String(payload.metodo_pago || 'PAGO').toUpperCase().slice(0,6)}-${Date.now()}`;
      payload.referencia = paymentReference;

      // Leer comprobante como base64 si existe, si no texto plano
      const getComprobante = () => new Promise(resolve => {
        if (payload.metodo_pago === 'efectivo') {
          resolve(document.getElementById('punto-pago')?.value || 'Pago presencial');
          return;
        }
        const inputId = payload.metodo_pago === 'transferencia' ? 'comprobante-file' : 'comprobante-nequi';
        const file = document.getElementById(inputId)?.files?.[0];
        if (!file) { resolve('Pago digital'); return; }
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result); // base64 data URL
        reader.onerror = () => resolve(file.name);
        reader.readAsDataURL(file);
      });

      const paymentComprobante = await getComprobante();
      payload.comprobante = paymentComprobante;

      fetch('php/guardar_inscripcion.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(r => r.json())
        .then(data => {
          if (!data.ok) {
            btn.disabled = false;
            btn.innerHTML = 'Confirmar inscripción';
            if (data.error === 'Ya estás inscrito en este evento') {
              const yaInscrito = document.getElementById('ya-inscrito');
              document.querySelector('.stepper') && (document.querySelector('.stepper').style.display = 'none');
              document.querySelector('.insc-grid') && (document.querySelector('.insc-grid').style.display = 'none');
              if (yaInscrito) yaInscrito.classList.add('show');
            } else {
              showToast(data.error || 'Error al guardar la inscripción', 'error');
            }
            return;
          }

          // Éxito: construir objeto con la respuesta real de la BD
          const nuevaInscripcion = {
            id:               data.ref_id,
            ref_id:           data.ref_id,
            metodo_pago_i:    payload.metodo_pago,
            estado_i:         data.estado,
            fecha_i:          new Date().toISOString(),
            precio_pagado_i:  data.precio ?? precioPagado,
            doc_u:            payload.doc_u,
            id_e:             evento.id_e,
            email:            session.email,
            usuario:          session.email,
            nombre:           nombre,
            eventoNombre:     evento.nombre_e,
            eventoFecha:      evento.fecha_e,
            eventoLugar:      evento.ubicacion_e,
            eventoCategoria:  evento.categoria_e,
            eventoKm:         evento.distancia_total_e,
            eventoImg:        evento.imagen_e,
            precio:           precioPagado,
            quiere_jersey_k:  estado.quiereJersey,
            talla_camiseta_k: estado.talla,
            numero_dorsal_k:  estado.dorsal,
            id_cc:            estado.categoriaId,
            categoriaNombre:  estado.categoriaNombre,
            qr_code:          data.qr_code,
            referencia_p:     data.referencia_p || paymentReference,
            comprobante_p:    data.comprobante_p || (paymentComprobante && paymentComprobante.startsWith('data:') ? 'Comprobante enviado' : paymentComprobante),
            fecha_p:          data.fecha_p || new Date().toISOString(),
            estado_p:         data.estado_p || 'pendiente',
          };

          // Guardar en localStorage como caché para participante.js
          const ventas = JSON.parse(localStorage.getItem('cicloVentas') || '[]');
          ventas.push(nuevaInscripcion);
          localStorage.setItem('cicloVentas', JSON.stringify(ventas));

          // Notificación local
          const notifs = JSON.parse(localStorage.getItem('cicloNotif') || '[]');
          notifs.push({
            tipo_n:    'pago',
            titulo_n:  `Inscripción registrada: ${evento.nombre_e}`,
            mensaje_n: `Tu inscripción al evento "${evento.nombre_e}" fue recibida. Estado: ${data.estado}. Referencia: ${data.ref_id}.`,
            fecha_n:   new Date().toISOString(),
            leida_n:   false,
            doc_u:     payload.doc_u,
          });
          localStorage.setItem('cicloNotif', JSON.stringify(notifs));

          mostrarExito(nuevaInscripcion);
        })
        .catch(err => {
          btn.disabled = false;
          btn.innerHTML = 'Confirmar inscripción';
          showToast('No se pudo conectar al servidor. Intenta de nuevo.', 'error');
          console.error('Error al guardar inscripción:', err);
        });

    });

    /* ──────────────────────────────────────────────
       12. PANTALLA DE ÉXITO
       ────────────────────────────────────────────── */
    async function renderSvgQrWithLogo(code, containerId, logoPath, size = 260, logoSize = 64) {
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&format=svg&data=${encodeURIComponent(code)}`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('QR service error');
        let svgText = await res.text();
        // remove XML prolog if present
        svgText = svgText.replace(/<\?xml[^>]*\?>/, '');
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = svgText;
        const svg = container.querySelector('svg');
        if (!svg) return;
        svg.setAttribute('width', String(size));
        svg.setAttribute('height', String(size));
        const ns = 'http://www.w3.org/2000/svg';
        const x = Math.round((size - logoSize) / 2);
        const y = x;
        // optionally add logo overlay (only if logoPath provided)
        if (logoPath) {
          const rect = document.createElementNS(ns, 'rect');
          rect.setAttribute('x', String(x - 6));
          rect.setAttribute('y', String(y - 6));
          rect.setAttribute('width', String(logoSize + 12));
          rect.setAttribute('height', String(logoSize + 12));
          rect.setAttribute('rx', '12');
          rect.setAttribute('fill', '#fff');
          const img = document.createElementNS(ns, 'image');
          img.setAttribute('href', logoPath);
          try { img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', logoPath); } catch(e) {}
          img.setAttribute('x', String(x));
          img.setAttribute('y', String(y));
          img.setAttribute('width', String(logoSize));
          img.setAttribute('height', String(logoSize));
          img.setAttribute('preserveAspectRatio', 'xMidYMid meet');
          svg.appendChild(rect);
          svg.appendChild(img);
        }
        return; // success
      } catch (err) {
        const c = document.getElementById(containerId);
        if (c) {
          // fallback to PNG raster in case SVG fetch/render fails
          c.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(code)}" alt="QR" width="${size}" height="${size}" />`;
        }
      }
    }

    function mostrarExito(insc) {
      // Ocultar stepper + panels + sidebar
      document.querySelector('.stepper').style.display = 'none';
      document.querySelector('.insc-grid').style.gridTemplateColumns = '1fr';
      document.getElementById('sidebar-evento').style.display = 'none';
      document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));

      const panel = document.getElementById('success-panel');
      panel.classList.add('show');

      const details = document.getElementById('success-details');
      const rows = [
        ['Evento',     insc.eventoNombre    || '—'],
        ['Fecha',      fmtFecha(insc.eventoFecha || insc.fecha_i)],
        ['Categoría',  insc.categoriaNombre || insc.eventoCategoria || '—'],
        ['Referencia', insc.ref_id || insc.id || '—'],
        ['Estado',     (insc.estado_i || insc.estado) === 'pendiente_pago' ? 'Pendiente de pago' : 'Pendiente de validación'],
        ['Total',      fmtMoney(insc.precio_pagado_i ?? insc.precio ?? 0)],
        ['Método',     (insc.metodo_pago_i || insc.metodo_pago || '').replace('transferencia','Transferencia bancaria').replace('nequi','Nequi / Daviplata').replace('efectivo','Efectivo en punto autorizado') || '—'],
        ['Referencia pago', insc.referencia_p || '—'],
        ['Comprobante', insc.comprobante_p ? (insc.comprobante_p.startsWith('data:') ? 'Comprobante enviado ✓' : insc.comprobante_p) : (insc.metodo_pago_i === 'efectivo' ? 'Pago presencial' : '—')],
      ];
      details.innerHTML = rows.map(([dt,dd]) =>
        `<div class="success-detail-row"><dt>${dt}</dt><dd>${dd}</dd></div>`
      ).join('');

      const qrScreen = document.getElementById('success-qr-screen');
      const qrText = document.getElementById('success-qr-text');
      const qrToggle = document.getElementById('btn-ver-qr');
      if (qrScreen && qrText && qrToggle) {
        // render SVG QR (no logo)
        renderSvgQrWithLogo(insc.qr_code, 'success-qr-container', null);
        qrText.textContent = insc.qr_code;
        qrScreen.style.display = 'none';
        qrToggle.setAttribute('aria-expanded','false');
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const abrirQrScreen = () => {
      const successPanel = document.getElementById('success-panel');
      const qrScreen = document.getElementById('success-qr-screen');
      const qrToggle = document.getElementById('btn-ver-qr');
      if (!successPanel || !qrScreen || !qrToggle) return;
      successPanel.style.display = 'none';
      qrScreen.style.display = 'block';
      qrToggle.setAttribute('aria-expanded', 'true');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cerrarQrScreen = () => {
      const successPanel = document.getElementById('success-panel');
      const qrScreen = document.getElementById('success-qr-screen');
      const qrToggle = document.getElementById('btn-ver-qr');
      if (!successPanel || !qrScreen || !qrToggle) return;
      successPanel.style.display = 'block';
      qrScreen.style.display = 'none';
      qrToggle.setAttribute('aria-expanded', 'false');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    document.getElementById('btn-ver-qr').addEventListener('click', abrirQrScreen);
    document.getElementById('btn-cerrar-qr').addEventListener('click', cerrarQrScreen);

    /* ──────────────────────────────────────────────
       13. UTILIDADES
       ────────────────────────────────────────────── */
    // Copiar al portapapeles
    window.copiar = (id) => {
      const txt = document.getElementById(id).textContent;
      navigator.clipboard.writeText(txt).then(() => showToast('Copiado al portapapeles', 'success'));
    };

    // Animación del ícono de carga
    const style = document.createElement('style');
    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);

    // Limpiar inputs al hacer focus
    document.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('input', () => {
        el.classList.remove('invalid');
        const errEl = document.getElementById('err-' + el.id.replace('p1-',''));
        if (errEl) errEl.classList.remove('show');
      });
    });

  })();

  function confirmarSalida() {
  return confirm("Estás a punto de salir de SKYED. ¿Deseas continuar?");
}