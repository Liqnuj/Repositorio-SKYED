(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  // Esta página vive en /php/, pero las rutas de imagen guardadas (ej. "img/event1.jpg")
  // son relativas a la raíz del sitio. Sin este ajuste, el navegador buscaría
  // la imagen en /php/img/... y nunca la encontraría.
  const imgPath = p => {
    if (!p) return '';
    if (/^https?:\/\//i.test(p) || p.startsWith('../') || p.startsWith('/')) return p;
    return '../' + p;
  };

  const toast = (msg, type = 'ok') => {
    if (window.showToast) return window.showToast(msg, type);
    const t = document.createElement('div');
    t.className = `toast ${type === 'error' ? 'error' : type === 'info' ? '' : 'success'}`;
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
  };

  const fmtFechaCorta = iso => {
    if (!iso) return '—';
    try { return new Date(iso).toLocaleDateString('es-CO', { year: 'numeric', month: 'short' }); }
    catch { return '—'; }
  };
  const fmtFechaLarga = iso => {
    if (!iso) return '—';
    try { return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }); }
    catch { return '—'; }
  };
  const fmtMoney = n => '$' + (Number(n) || 0).toLocaleString('es-CO');
  const daysUntil = iso => {
    if (!iso) return null;
    const d = new Date(iso);
    if (isNaN(d)) return null;
    return Math.ceil((d - new Date()) / 86400000);
  };
  const escape = s => String(s || '').replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
  const set = (id, val) => { const el = $(id); if (el) el.textContent = val; };

  /* ---------- year footer ---------- */
  const yEl = document.getElementById('year');
  if (yEl) yEl.textContent = new Date().getFullYear();




  /* ---------- ventas / inscripciones ---------- */
  // Se cargarán desde la BD; mientras tanto usamos lo que haya en localStorage como caché
  let ventas   = (JSON.parse(localStorage.getItem('cicloVentas') || '[]')).filter(v => v.email === user.email || v.usuario === user.email);
  const today    = new Date(); today.setHours(0, 0, 0, 0);
  let past     = ventas.filter(v => v.eventoFecha && new Date(v.eventoFecha) < today);
  let upcoming = ventas.filter(v => v.eventoFecha && new Date(v.eventoFecha) >= today);
  let podios   = past.filter(v => Number(v.posicion) >= 1 && Number(v.posicion) <= 3).length;
  let totalKm  = past.reduce((s, v) => s + (Number(v.eventoKm) || 0), 0);
  let totalGastado = ventas.reduce((s, v) => s + (Number(v.precio) || 0), 0);

  // Función para re-renderizar todo con los datos actualizados
  function renderAll() {
    podios       = past.filter(v => Number(v.posicion) >= 1 && Number(v.posicion) <= 3).length;
    totalKm      = past.reduce((s, v) => s + (Number(v.eventoKm) || 0), 0);
    totalGastado = ventas.reduce((s, v) => s + (Number(v.precio) || 0), 0);

    renderSidebar();
    set('#s-eventos',  past.length);
    set('#s-km',       totalKm.toLocaleString('es-CO'));
    set('#s-podios',   podios);
    set('#s-proximos', upcoming.length);
    set('#h-eventos',  past.length);
    set('#h-km',       totalKm.toLocaleString('es-CO'));
    set('#h-podios',   podios);
    renderListas();
    set('#c-plan',  user.plan || 'Pro');
    set('#c-total', fmtMoney(totalGastado));
  }

  function renderListas() {
    const ultimas = deduplicarPorEvento(past).slice().sort((a, b) => new Date(b.eventoFecha) - new Date(a.eventoFecha)).slice(0, 3);
    const ultimasEl = $('#ultimas-list');
    if (ultimasEl) {
      ultimasEl.innerHTML = ultimas.length
        ? ultimas.map(v => renderEventRow(v)).join('')
        : '<div class="empty-row">No tienes participaciones todavía.</div>';
    }

    const historialEl = $('#historial-list');
    if (historialEl) {
      const pastDedup = deduplicarPorEvento(past).slice().sort((a, b) => new Date(b.eventoFecha) - new Date(a.eventoFecha));
      historialEl.innerHTML = pastDedup.length
        ? pastDedup.map(v => renderEventRow(v)).join('')
        : '<div class="empty-row">Sin historial todavía.</div>';
    }

    // Deduplicar por evento antes de mostrar (evita duplicados si el usuario se inscribió varias veces)
    const upSorted = deduplicarPorEvento(upcoming).sort((a, b) => new Date(a.eventoFecha) - new Date(b.eventoFecha));

    const proximasEl = $('#proximas-list');
    if (proximasEl) {
      if (upSorted.length) {
        proximasEl.innerHTML = upSorted.slice(0, 4).map(v => {
          const days = daysUntil(v.eventoFecha);
          const cat  = v.eventoCategoria || v.categoriaNombre || 'Evento';
          const badgeColor = /mtb/i.test(cat) ? '#16a34a' : /gravel/i.test(cat) ? '#a16207' : 'var(--accent)';
          const bg   = v.eventoImg ? `background-image:url('${escape(imgPath(v.eventoImg))}')` : '';
          const idRef = v.ref_id || v.id || '';
          return `
            <div class="upcoming-card">
              <div class="upcoming-img" style="${bg}">
                <span class="badge" style="background:${badgeColor}">${escape(cat)}</span>
              </div>
              <div class="upcoming-body">
                <h4>${escape(v.eventoNombre || 'Evento')}</h4>
                <div class="meta">📅 ${fmtFechaLarga(v.eventoFecha)}${v.eventoLugar ? ' · 📍 ' + escape(v.eventoLugar) : ''}${v.eventoKm ? ' · ' + v.eventoKm + ' km' : ''}</div>
                <div class="upcoming-countdown">
                  <span class="countdown-num">${days > 0 ? `En ${days} días` : days === 0 ? 'Hoy' : 'En curso'}</span>
                  <a href="eventos.html" class="btn btn-outline" style="padding:.4rem .9rem;font-size:.82rem">Ver detalles</a>
                </div>
                ${idRef ? `<button type="button" class="btn btn-outline btn-eliminar-inscripcion" data-ref="${escape(idRef)}" style="margin-top:.5rem;padding:.35rem .8rem;font-size:.78rem;color:var(--danger,#dc2626);border-color:var(--danger,#dc2626)">🗑 Eliminar inscripción</button>` : ''}
              </div>
            </div>`;
        }).join('');
      } else {
        proximasEl.innerHTML = '<div class="empty-row" style="grid-column:1/-1">Sin eventos próximos. <a href="eventos.html">Explora eventos →</a></div>';
      }
    }

    const inscripcionesEl = $('#inscripciones-list');
    if (inscripcionesEl) {
      inscripcionesEl.innerHTML = upSorted.length
        ? upSorted.map(v => renderEventRow(v, { statusPill: true, allowDelete: true })).join('')
        : '<div class="empty-row">No tienes inscripciones activas.</div>';
    }
  }

  // Cargar inscripciones desde la BD
  fetch('../php/get_inscripciones.php')
    .then(r => r.json())
    .then(data => {
      if (data.ok && Array.isArray(data.inscripciones) && data.inscripciones.length > 0) {
        // Mezclar datos de BD con posibles datos de localStorage (BD tiene prioridad)
        const bdRefs = new Set(data.inscripciones.map(i => i.ref_id));
        const localExtra = ventas.filter(v => v.id && !bdRefs.has(v.id));
        ventas   = [...data.inscripciones, ...localExtra];
        past     = ventas.filter(v => v.eventoFecha && new Date(v.eventoFecha) < today);
        upcoming = ventas.filter(v => v.eventoFecha && new Date(v.eventoFecha) >= today);
        renderAll();
      }
    })
    .catch(() => { /* Silencioso: ya se renderizó con localStorage */ });

  const avatarEl = $('#avatar');

  function renderAvatar() {
    if (!avatarEl) return;
    if (user.foto) {
      avatarEl.style.backgroundImage  = `url(${user.foto})`;
      avatarEl.style.backgroundSize   = 'cover';
      avatarEl.style.backgroundPosition = 'center';
      avatarEl.textContent = '';
    } else {
      avatarEl.style.backgroundImage = '';
      avatarEl.textContent = ((user.nombre?.[0] || 'S') + (user.apellido?.[0] || 'K')).toUpperCase();
    }
  }
  renderAvatar();

  /* Input file oculto para la foto */
  const fileInput = document.createElement('input');
  fileInput.type   = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  const btnAvatar = $('#btn-avatar');
  if (btnAvatar) {
    btnAvatar.addEventListener('click', () => fileInput.click());
  }

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      toast('La imagen no puede pesar más de 3 MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      user.foto = e.target.result;
      saveUser();
      renderAvatar();
      // También actualizar preview en ajustes si existe
      const preview = $('#avatar-preview');
      if (preview) {
        preview.style.backgroundImage = `url(${user.foto})`;
        preview.textContent = '';
      }
      toast('Foto de perfil actualizada', 'ok');
    };
    reader.readAsDataURL(file);
    fileInput.value = '';
  });

  /* ---------- HERO ---------- */
  function renderHero() {
    renderAvatar();
    set('#p-nombre', `${user.nombre} ${user.apellido}`.trim() || 'Ciclista');
    set('#p-handle', '@' + (user.email || '').split('@')[0]);
    set('#p-ciudad', user.ciudad || 'Colombia');
    set('#p-plan',   user.plan   || 'Pro');
  }
  renderHero();

  /* ---------- SIDEBAR ---------- */
  function renderSidebar() {
    set('#i-creado',    fmtFechaCorta(user.creado));
    set('#i-categoria', user.categoria || '—');
    set('#i-usuario',   '@' + (user.email || '').split('@')[0]);
    set('#i-telefono',  user.telefono  || '—');
    set('#i-fechaNac',  user.fechaNac  ? fmtFechaLarga(user.fechaNac) : '—');

    const dMap = {
      ruta:   { cls: 'tag-ruta',   txt: '🚴 Ruta' },
      mtb:    { cls: 'tag-mtb',    txt: '⛰ MTB' },
      gravel: { cls: 'tag-gravel', txt: '🪨 Gravel' },
      pista:  { cls: 'tag-pista',  txt: '🏁 Pista' },
    };
    const tagsEl = $('#i-disciplinas');
    if (tagsEl) {
      tagsEl.innerHTML = (user.disciplinas || ['ruta'])
        .map(d => dMap[d] ? `<span class="tag ${dMap[d].cls}">${dMap[d].txt}</span>` : '')
        .join('') || '<span class="tag tag-ruta">🚴 Ruta</span>';
    }

    const logrosEl = $('#i-logros');
    const logros   = past
      .filter(v => Number(v.posicion) >= 1 && Number(v.posicion) <= 3)
      .sort((a, b) => Number(a.posicion) - Number(b.posicion))
      .slice(0, 3);
    if (logrosEl && logros.length) {
      logrosEl.innerHTML = logros.map(v => {
        const cls = v.posicion == 1 ? 'ach-gold' : v.posicion == 2 ? 'ach-silver' : 'ach-blue';
        const ico = v.posicion == 1 ? '🥇' : v.posicion == 2 ? '🥈' : '🥉';
        return `
          <div class="achievement">
            <div class="ach-icon ${cls}">${ico}</div>
            <div class="ach-info">
              <strong>${v.posicion}.° ${escape(v.eventoNombre)}</strong>
              <span>${escape(v.eventoCategoria || '—')} · ${fmtFechaLarga(v.eventoFecha)}</span>
            </div>
          </div>`;
      }).join('');
    }
  }
  renderSidebar();

  /* ---------- DEDUPLICAR por evento (queda solo la inscripción más reciente) ---------- */
  const deduplicarPorEvento = arr => {
    const seen = new Map();
    const sorted = arr.slice().sort((a, b) => new Date(b.fecha_i || b.fecha || 0) - new Date(a.fecha_i || a.fecha || 0));
    sorted.forEach(v => {
      const key = String(v.id_e || v.eventoNombre || v.eventoId || '');
      if (key && !seen.has(key)) seen.set(key, v);
    });
    return Array.from(seen.values());
  };

  /* ---------- RENDERIZAR FILA DE EVENTO ---------- */
  const renderEventRow = (v, opts = {}) => {
    const pos    = Number(v.posicion);
    const posCls = pos === 1 ? 'gold' : pos === 2 ? 'silver' : 'accent';
    const posTxt = pos ? `${pos}.°` : '—';
    const hasImg = !!v.eventoImg;
    // Usamos background-image + overrides para que no lo tape el gradiente del CSS
    const imgStyle = hasImg
      ? `style="background-image:url('${escape(imgPath(v.eventoImg))}');background-size:cover;background-position:center;background-color:transparent"`
      : '';
    const initial = (v.eventoNombre || '?')[0].toUpperCase();
    let result;
    if (opts.statusPill) {
      const est = v.estado || v.estado_i || '';
      const cls = (est === 'pendiente_pago' || est === 'pendiente') ? 'pending'
                : est === 'cancelado' ? 'warn' : 'ok';
      const txt = (est === 'pendiente_pago' || est === 'pendiente') ? 'Pago pendiente'
                : est === 'pendiente_validacion' ? 'En validación'
                : est === 'cancelado' ? 'Cancelado' : 'Confirmado';
      result = `<span class="status-pill ${cls}">${txt}</span>`;
    } else {
      result = `
        <div class="result-pos ${posCls}">${posTxt}</div>
        ${v.tiempo ? `<div class="result-time">${escape(v.tiempo)}</div>` : ''}`;
    }
    // Botón "Eliminar inscripción" — solo se muestra si la inscripción tiene
    // un identificador real de base de datos (ref_id o id numérico devuelto por el backend).
    const idRef = v.ref_id || v.id || '';
    const deleteBtn = (opts.allowDelete && idRef)
      ? `<button type="button" class="btn btn-outline btn-eliminar-inscripcion" data-ref="${escape(idRef)}" style="padding:.35rem .8rem;font-size:.78rem;color:var(--danger,#dc2626);border-color:var(--danger,#dc2626);margin-top:.4rem">🗑 Eliminar inscripción</button>`
      : '';
    return `
      <div class="event-row">
        <div class="event-row-img" ${imgStyle}>${hasImg ? '' : initial}</div>
        <div class="event-row-info">
          <h4>${escape(v.eventoNombre || 'Evento')}</h4>
          <div class="meta">
            <span>📅 ${fmtFechaLarga(v.eventoFecha)}</span>
            ${v.eventoLugar     ? `<span>📍 ${escape(v.eventoLugar)}</span>` : ''}
            ${v.eventoCategoria ? `<span>${escape(v.eventoCategoria)}${v.eventoKm ? ' · ' + v.eventoKm + ' km' : ''}</span>` : ''}
          </div>
          ${deleteBtn}
        </div>
        <div class="event-row-result">${result}</div>
      </div>`;
  };

  /* ---------- ELIMINAR INSCRIPCIÓN ---------- */
  async function eliminarInscripcion(ref) {
    if (!confirm('¿Seguro que deseas eliminar esta inscripción? Esta acción no se puede deshacer.')) return;
    try {
      const body = /^\d+$/.test(String(ref)) && !String(ref).startsWith('INS-')
        ? { id: ref }
        : { ref_id: ref };
      const resp = await fetch('../php/eliminar_inscripcion.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await resp.json();
      if (!data || !data.ok) {
        toast((data && data.error) || 'No se pudo eliminar la inscripción', 'error');
        return;
      }
      // Quitar de las listas en memoria y re-renderizar
      ventas   = ventas.filter(v => String(v.ref_id || v.id) !== String(ref));
      past     = past.filter(v => String(v.ref_id || v.id) !== String(ref));
      upcoming = upcoming.filter(v => String(v.ref_id || v.id) !== String(ref));
      // Sincronizar caché local también
      const local = JSON.parse(localStorage.getItem('cicloVentas') || '[]')
        .filter(v => String(v.ref_id || v.id) !== String(ref));
      localStorage.setItem('cicloVentas', JSON.stringify(local));
      renderAll();
      toast('Inscripción eliminada correctamente', 'ok');
    } catch (err) {
      toast('Error de conexión al eliminar la inscripción', 'error');
    }
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn-eliminar-inscripcion');
    if (!btn) return;
    eliminarInscripcion(btn.dataset.ref);
  });

  /* Primer render con datos de localStorage (inmediato) */
  renderAll();

  /* ---------- TABS ---------- */
  const switchTab = id => {
    $$('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === id));
    $$('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-tab]');
    if (!t) return;
    e.preventDefault();
    switchTab(t.dataset.tab);
  });

  const ajustesCard = document.createElement('div');
  ajustesCard.className = 'settings-card';
  ajustesCard.innerHTML = `
    <div class="card-head"><h3>Foto de perfil</h3></div>
    <div class="card-body" style="display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap">
      <div id="avatar-preview" style="
        width:90px;height:90px;border-radius:50%;
        background:linear-gradient(135deg,var(--accent),var(--accent-2,#4ec3d4));
        display:grid;place-items:center;
        font-size:2rem;font-weight:900;color:#fff;
        background-size:cover;background-position:center;
        border:3px solid var(--border);flex-shrink:0;
      "></div>
      <div style="flex:1;min-width:200px">
        <p style="color:var(--muted);font-size:.88rem;margin-bottom:.75rem">
          JPG, PNG o WebP · máximo 3 MB.<br>Se guarda en tu navegador.
        </p>
        <div style="display:flex;gap:.6rem;flex-wrap:wrap">
          <button type="button" id="btn-foto-cambiar" class="btn btn-primary" style="font-size:.88rem">📷 Cambiar foto</button>
          <button type="button" id="btn-foto-borrar"  class="btn btn-outline" style="font-size:.88rem">🗑 Eliminar foto</button>
        </div>
      </div>
    </div>`;

  /* Insertar como primer card en settings-grid */
  const settingsGrid = $('.settings-grid');
  if (settingsGrid) settingsGrid.insertBefore(ajustesCard, settingsGrid.firstChild);

  /* Renderizar preview inicial */
  const preview = $('#avatar-preview');
  if (preview) {
    if (user.foto) {
      preview.style.backgroundImage = `url(${user.foto})`;
      preview.textContent = '';
    } else {
      preview.textContent = ((user.nombre?.[0] || 'S') + (user.apellido?.[0] || 'K')).toUpperCase();
    }
  }

  /* Botones de la card de foto */
  document.addEventListener('click', e => {
    if (e.target.closest('#btn-foto-cambiar')) { fileInput.click(); return; }
    if (e.target.closest('#btn-foto-borrar')) {
      if (!confirm('¿Eliminar la foto de perfil?')) return;
      user.foto = null;
      saveUser();
      renderAvatar();
      if (preview) {
        preview.style.backgroundImage = '';
        preview.textContent = ((user.nombre?.[0] || 'S') + (user.apellido?.[0] || 'K')).toUpperCase();
      }
      toast('Foto eliminada', 'ok');
    }
  });

  const formDatos = $('#form-datos');
  if (formDatos) {
    /* Rellenar con datos actuales */
    formDatos.nombre.value    = user.nombre    || '';
    formDatos.apellido.value  = user.apellido  || '';
    formDatos.email.value     = user.email     || '';
    formDatos.telefono.value  = user.telefono  || '';
    formDatos.ciudad.value    = user.ciudad    || '';
    formDatos.categoria.value = user.categoria || '';

    formDatos.addEventListener('submit', e => {
      e.preventDefault();
      const nombre = formDatos.nombre.value.trim();
      const ap     = formDatos.apellido.value.trim();
      const email  = formDatos.email.value.trim();

      if (!nombre) return toast('El nombre es obligatorio', 'error');
      if (!/^\S+@\S+\.\S+$/.test(email)) return toast('Correo no válido', 'error');

      /* Guardar en objeto y localStorage */
      user.nombre    = nombre;
      user.apellido  = ap;
      user.email     = email;
      user.telefono  = formDatos.telefono.value.trim();
      user.ciudad    = formDatos.ciudad.value.trim();
      user.categoria = formDatos.categoria.value;
      saveUser();

      /* Refrescar toda la UI */
      renderHero();
      renderSidebar();

      /* Actualizar preview de foto (iniciales pueden cambiar) */
      if (preview && !user.foto) {
        preview.textContent = ((nombre[0] || 'S') + (ap[0] || 'K')).toUpperCase();
      }

      toast('Cambios guardados correctamente ✓', 'ok');
    });
  }

  const formPass = $('#form-pass');
  if (formPass) {
    formPass.addEventListener('submit', e => {
      e.preventDefault();
      const nueva     = $('#p-nueva').value;
      const confirmar = $('#p-confirm').value;
      if (nueva.length < 8)    return toast('Mínimo 8 caracteres', 'error');
      if (nueva !== confirmar) return toast('Las contraseñas no coinciden', 'error');
      formPass.reset();
      toast('Contraseña actualizada ✓', 'ok');
    });
  }

  /* ---------- AJUSTES: cuenta ---------- */
  set('#c-plan',  user.plan || 'Pro');
  set('#c-total', fmtMoney(totalGastado));
  const cRenov = $('#c-renov');
  if (cRenov && user.creado) {
    const renov = new Date(user.creado);
    renov.setFullYear(renov.getFullYear() + 1);
    cRenov.textContent = fmtFechaLarga(renov.toISOString());
  }

  const btnLogout = $('#btn-logout');
  if (btnLogout) btnLogout.addEventListener('click', () => {
    if (!confirm('¿Cerrar sesión?')) return;
    location.href = 'login.html';
  });

  const btnDelete = $('#btn-delete');
  if (btnDelete) btnDelete.addEventListener('click', () => {
    if (!confirm('Esta acción eliminará tu cuenta permanentemente. ¿Continuar?')) return;
    if (!confirm('¿Estás completamente seguro? No se puede deshacer.')) return;
    localStorage.removeItem(USER_KEY);
    toast('Cuenta eliminada', 'info');
    setTimeout(() => location.href = 'index.html', 600);
  });

  /* ---------- NOTIFICACIONES ---------- */
  const NOTIF_KEY = 'cicloNotif:' + user.email;
  const defaults  = { eventos: true, recordatorios: true, resultados: true, boletin: false };
  const prefs     = Object.assign({}, defaults, JSON.parse(localStorage.getItem(NOTIF_KEY) || '{}'));
  const notifDefs = [
    { key: 'eventos',       title: 'Nuevos eventos',              desc: 'Alertas cuando se publique un evento en tu disciplina' },
    { key: 'recordatorios', title: 'Recordatorios de inscripción', desc: '7 y 1 día antes del cierre de inscripciones' },
    { key: 'resultados',    title: 'Resultados publicados',       desc: 'Cuando estén disponibles tus tiempos oficiales' },
    { key: 'boletin',       title: 'Boletín semanal',             desc: 'Resumen de eventos y novedades de la comunidad' },
  ];
  const notifEl = $('#notif-list');
  if (notifEl) {
    notifEl.innerHTML = notifDefs.map(n => `
      <div class="toggle-row">
        <div class="toggle-label">${n.title}<small>${n.desc}</small></div>
        <div class="toggle ${prefs[n.key] ? 'on' : ''}" data-pref="${n.key}" role="switch" aria-checked="${prefs[n.key]}"></div>
      </div>
    `).join('');
    notifEl.addEventListener('click', e => {
      const t = e.target.closest('.toggle');
      if (!t) return;
      const k = t.dataset.pref;
      prefs[k] = !prefs[k];
      t.classList.toggle('on', prefs[k]);
      t.setAttribute('aria-checked', prefs[k]);
      localStorage.setItem(NOTIF_KEY, JSON.stringify(prefs));
      toast('Preferencia actualizada', 'ok');
    });
  }

})();