const adminDataUrl = 'php/obtener_datos_admin.php';

const sectionColumns = {
  eventos: [
    { label: 'Evento', keys: ['nombre', 'nombre_e', 'titulo'] },
    { label: 'Categoría', keys: ['categoria', 'cat', 'categoria_e'] },
    { label: 'Fecha', keys: ['fecha', 'fecha_e'] },
    { label: 'Ubicación', keys: ['lugar', 'ubicacion', 'ubicacion_e'] },
    { label: 'Cupos', fn: row => formatCupos(row) },
    { label: 'Estado', fn: row => renderStatus(row) },
    { label: 'Acciones', fn: () => actionButtons() },
  ],
  usuarios: [
    { label: 'Usuario', fn: row => renderUserCell(row) },
    { label: 'Teléfono', keys: ['telefono', 'telefono_u', 'phone'] },
    { label: 'RH', keys: ['rh', 'tipo_sangre', 'rh_u'] },
    { label: 'Fecha nac.', keys: ['fecha_nac', 'fechaNacimiento', 'fecha'] },
    { label: 'Estado', fn: row => renderStatus(row) },
    { label: 'Inscripciones', keys: ['inscripciones', 'inscripcion_count', 'inscripciones_count'] },
    { label: 'Acciones', fn: () => actionButtons() },
  ],
  inscripciones: [
    { label: '#', fn: row => getField(row, ['id_i', 'id', 'inscripcion_id', 'id_inscripcion']) },
    { label: 'Participante', fn: row => renderUserCell(row, ['nombre', 'nombre_u', 'usuario', 'participante']) },
    { label: 'Evento', keys: ['evento', 'nombre', 'nombre_e', 'titulo'] },
    { label: 'Fecha inscripción', keys: ['fecha_i', 'fecha', 'fecha_inscripcion'] },
    { label: 'Precio pagado', fn: row => formatCurrency(getField(row, ['precio_pagado_i', 'precio', 'monto', 'monto_p'])) },
    { label: 'Método pago', keys: ['metodo_pago_i', 'metodo_pago', 'metodo'] },
    { label: 'Estado', fn: row => renderStatus(row) },
    { label: 'QR', fn: row => rowHasQr(row) },
    { label: 'Acciones', fn: () => actionButtons() },
  ],
  pagos: [
    { label: 'ID Pago', fn: row => getField(row, ['id_p', 'id', 'pago_id']) },
    { label: 'Inscripción', fn: row => renderRelatedInscripcion(row) },
    { label: 'Método', keys: ['metodo_pago_p', 'metodo_pago', 'metodo'] },
    { label: 'Referencia', keys: ['referencia_p', 'referencia'] },
    { label: 'Monto', fn: row => formatCurrency(getField(row, ['monto_p', 'monto', 'precio'])) },
    { label: 'Fecha', keys: ['fecha_p', 'fecha', 'fecha_pago'] },
    { label: 'Estado', fn: row => renderStatus(row) },
    { label: 'Comprobante', fn: row => renderButton('📄 Ver') },
    { label: 'Acciones', fn: () => actionButtons() },
  ],
  kits: [
    { label: 'Nombre', keys: ['nombre', 'nombre_kit', 'kit'] },
    { label: 'Stock', keys: ['stock', 'cantidad'] },
    { label: 'Talla', keys: ['talla', 'tallas'] },
    { label: 'Dorsal', keys: ['dorsal', 'rango_dorsal'] },
    { label: 'Entrega', keys: ['entrega', 'fecha_entrega'] },
    { label: '', fn: () => renderButton('✏️') },
  ],
  entregas: [
    { label: 'Participante', keys: ['participante', 'nombre', 'usuario'] },
    { label: 'Evento', keys: ['evento', 'nombre_e', 'titulo'] },
    { label: 'Kit', keys: ['kit', 'nombre_kit'] },
    { label: 'Entregado por', keys: ['entregado_por', 'responsable'] },
    { label: 'Fecha real', keys: ['fecha_real', 'fecha_entrega', 'fecha'] },
    { label: 'Estado', fn: row => renderStatus(row) },
    { label: 'Observaciones', keys: ['observaciones', 'nota', 'comentario'] },
  ],
  categorias: [
    { label: 'Nombre', keys: ['nombre', 'categoria'] },
    { label: 'Evento', keys: ['evento', 'nombre_e', 'titulo'] },
    { label: 'Edad mín.', keys: ['edad_min', 'edad_minima', 'edad_minima'] },
    { label: 'Edad máx.', keys: ['edad_max', 'edad_maxima', 'edad_maxima'] },
    { label: 'Género', keys: ['genero', 'sexo'] },
    { label: 'Distancia', keys: ['distancia', 'km'] },
    { label: 'Descripción', keys: ['descripcion', 'descripcion_categoria'] },
    { label: '', fn: () => renderButton('✏️') },
  ],
  patrocinadores: [
    { label: 'Patrocinador', fn: row => renderSponsorCell(row) },
    { label: 'Tipo', keys: ['tipo', 'nivel'] },
    { label: 'Teléfono', keys: ['telefono', 'contacto'] },
    { label: 'Correo', keys: ['correo', 'email'] },
    { label: 'Web', keys: ['web', 'sitio'] },
    { label: 'Aporte', fn: row => formatCurrency(getField(row, ['aporte', 'monto'])) },
    { label: 'Eventos', keys: ['eventos', 'eventos_count'] },
    { label: '', fn: () => renderButton('✏️') },
  ],
  resultados: [
    { label: 'Pos. General', keys: ['pos_general', 'pos_general', 'posicion_general'] },
    { label: 'Pos. Categoría', keys: ['pos_categoria', 'posición_categoria', 'posicion_categoria'] },
    { label: 'Atleta', keys: ['atleta', 'nombre', 'usuario'] },
    { label: 'Categoría', keys: ['categoria', 'categoria_res'] },
    { label: 'Tiempo final', keys: ['tiempo_final', 'tiempo'] },
    { label: 'Vel. promedio', keys: ['velocidad', 'velocidad_promedio', 'vel_promedio'] },
    { label: '', fn: () => renderButton('✏️') },
  ],
  rutas: [
    { label: 'Nombre', keys: ['nombre', 'ruta'] },
    { label: 'Evento', keys: ['evento', 'nombre_e', 'titulo'] },
    { label: 'Distancia', keys: ['distancia', 'km'] },
    { label: 'Desnivel', keys: ['desnivel'] },
    { label: 'Precio', fn: row => formatCurrency(getField(row, ['precio'])) },
    { label: 'GPX', fn: () => renderButton('📁 GPX') },
    { label: 'Mapa', fn: () => renderButton('🗺️ Ver') },
    { label: '', fn: () => renderButton('✏️') },
  ],
  hidratacion: [
    { label: 'Nombre', keys: ['nombre', 'punto', 'titulo'] },
    { label: 'Tipo', keys: ['tipo'] },
    { label: 'Kilómetro', keys: ['kilometro', 'km'] },
    { label: 'Latitud', keys: ['latitud'] },
    { label: 'Longitud', keys: ['longitud'] },
    { label: 'Descripción', keys: ['descripcion', 'detalle'] },
    { label: '', fn: () => renderButton('✏️') },
  ],
  notificaciones: [
    { label: 'Título', keys: ['titulo', 'asunto'] },
    { label: 'Mensaje', keys: ['mensaje', 'texto'] },
    { label: 'Tipo', keys: ['tipo'] },
    { label: 'Destinatario', keys: ['destinatario', 'usuario', 'email'] },
    { label: 'Fecha', keys: ['fecha', 'fecha_envio'] },
    { label: 'Leída', fn: row => getField(row, ['leida', 'visto']) ? '✅ Leída' : 'No leída' },
    { label: '', fn: () => renderButton('🗑️') },
  ],
};

function getField(row, keys) {
  for (const key of keys) {
    if (key in row && row[key] !== null && row[key] !== undefined && row[key] !== '') {
      return row[key];
    }
  }
  return '';
}

function formatCurrency(value) {
  const num = Number(String(value).replace(/[^0-9.-]/g, ''));
  if (Number.isNaN(num)) return value || '—';
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(num);
}

function formatCupos(row) {
  const disponibles = Number(getField(row, ['cupos_disponibles', 'cupos_disponibles_e']));
  const total = Number(getField(row, ['cupos_totales', 'cupos_totales_e']));
  if (Number.isFinite(disponibles) && Number.isFinite(total) && total > 0) {
    return `${total - disponibles} / ${total}`;
  }
  return getField(row, ['cupos_disponibles', 'cupos_totales', 'cupos']);
}

function badgeClass(value) {
  const status = String(value || '').toLowerCase();
  if (status.includes('activo') || status.includes('aprobado') || status.includes('entregado') || status.includes('leída') || status.includes('si')) return 'badge-success';
  if (status.includes('pendiente') || status.includes('warning') || status.includes('no leída')) return 'badge-warning';
  if (status.includes('rechazado') || status.includes('bloqueado') || status.includes('danger') || status.includes('lleno')) return 'badge-danger';
  return 'badge-neutral';
}

function renderStatus(row) {
  const value = getField(row, ['estado', 'estado_i', 'estado_p', 'estado_e', 'estado_entrega', 'tipo']);
  if (!value) return '—';
  return `<span class="badge ${badgeClass(value)}">${value}</span>`;
}

function renderButton(label) {
  return `<button class="btn btn-outline btn-sm">${label}</button>`;
}

function renderRelatedInscripcion(row) {
  const inscripcion = getField(row, ['id_i', 'inscripcion', 'inscripcion_id']);
  const nombre = getField(row, ['nombre', 'usuario', 'participante']);
  if (inscripcion && nombre) return `#${inscripcion} – ${nombre}`;
  if (inscripcion) return `#${inscripcion}`;
  return nombre || '—';
}

function renderUserCell(row, keys = ['nombre', 'usuario', 'participante']) {
  const name = getField(row, keys) || getField(row, ['email', 'correo']) || 'Usuario';
  const email = getField(row, ['email', 'correo', 'usuario']);
  const initials = name.split(' ').slice(0, 2).map(part => part[0]).join('').toUpperCase();
  return `
    <div class="user-cell">
      <div class="user-avatar-sm">${initials}</div>
      <div>
        <div class="user-name">${name}</div>
        <div class="user-email">${email || '—'}</div>
      </div>
    </div>
  `;
}

function renderSponsorCell(row) {
  const name = getField(row, ['nombre', 'patrocinador', 'empresa']) || 'Patrocinador';
  const site = getField(row, ['web', 'sitio']);
  return `
    <div class="user-cell">
      <div class="user-avatar-sm">${name.slice(0, 2).toUpperCase()}</div>
      <div>
        <div class="user-name">${name}</div>
        <div class="user-email">${site || '—'}</div>
      </div>
    </div>
  `;
}

function actionButtons() {
  return `<div style="display:flex;gap:.4rem"><button class="btn btn-outline btn-sm">✏️</button><button class="btn btn-danger btn-sm">🗑️</button></div>`;
}

function renderTable(tbodyId, rows, columns) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  if (!Array.isArray(rows) || rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${columns.length}" class="loading-row" style="color:var(--muted)">Sin datos disponibles</td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(row => {
    const cells = columns.map(col => {
      let content = '';
      if (typeof col.fn === 'function') {
        content = col.fn(row);
      } else {
        content = getField(row, col.keys || []);
      }
      return `<td>${content !== null && content !== undefined ? content : '—'}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');
}

function renderEventCards(events) {
  const grid = document.getElementById('eventosGrid');
  if (!grid) return;
  if (!Array.isArray(events) || events.length === 0) {
    grid.innerHTML = `<div class="loading-row" style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--muted)">No hay eventos registrados</div>`;
    return;
  }

  const cards = events.slice(0, 6).map(event => {
    const name = getField(event, ['nombre', 'nombre_e', 'titulo']) || 'Evento';
    const category = getField(event, ['categoria', 'cat', 'categoria_e']) || 'General';
    const date = getField(event, ['fecha', 'fecha_e']) || 'Fecha no disponible';
    const location = getField(event, ['lugar', 'ubicacion', 'ubicacion_e']) || 'Ubicación';
    const total = Number(getField(event, ['cupos_totales', 'cupos_totales_e', 'cupos'])) || 0;
    const available = Number(getField(event, ['cupos_disponibles', 'cupos_disponibles_e'])) || 0;
    const filled = total > 0 ? total - available : 0;
    const percent = total > 0 ? Math.min(100, Math.round((filled / total) * 100)) : 0;
    const status = getField(event, ['estado', 'estado_e']) || 'Activo';
    const badge = status.includes('Lleno') ? 'badge-danger' : status.includes('Inactivo') ? 'badge-warning' : 'badge-success';

    return `
      <div class="evento-card">
        <div class="evento-card-img" style="background:linear-gradient(135deg,#0b1f3a,#2c9caf)">
          🚴
          <span class="cat-badge">${category}</span>
        </div>
        <div class="evento-card-body">
          <div class="evento-card-title">${name}</div>
          <div class="evento-card-meta">
            <span>📅 ${date}</span>
            <span>📍 ${location}</span>
            <span>👥 ${filled} / ${total || '—'} cupos</span>
          </div>
          <div class="cupos-bar"><div class="cupos-fill ${percent >= 100 ? 'full' : percent > 60 ? 'high' : ''}" style="width:${percent}%"></div></div>
        </div>
        <div class="evento-card-footer">
          <span class="badge ${badge}">${status}</span>
          <div style="display:flex;gap:.4rem">
            <button class="btn btn-outline btn-sm" onclick="openModal('modal-evento')">✏️</button>
            <button class="btn btn-danger btn-sm">🗑️</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const createCard = `
    <div class="evento-card" style="border-style:dashed;cursor:pointer;background:transparent;box-shadow:none" onclick="openModal('modal-evento')">
      <div style="height:100%;min-height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;color:var(--muted);gap:.5rem">
        <span style="font-size:2.5rem">➕</span>
        <span style="font-weight:700;font-size:.9rem">Crear nuevo evento</span>
      </div>
    </div>
  `;

  grid.innerHTML = cards + createCard;
}


function renderDashboardUpcoming(events) {
  const tbody = document.getElementById('dashboardUpcomingEvents');
  if (!tbody) return;
  if (!Array.isArray(events) || events.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="loading-row">No hay eventos próximos</td></tr>';
    return;
  }

  tbody.innerHTML = events.slice(0, 3).map(event => {
    const name = getField(event, ['nombre', 'nombre_e', 'titulo']) || 'Evento';
    const category = getField(event, ['categoria', 'cat', 'categoria_e']) || 'General';
    const date = getField(event, ['fecha', 'fecha_e']) || 'Fecha';
    const location = getField(event, ['lugar', 'ubicacion', 'ubicacion_e']) || 'Lugar';
    const total = Number(getField(event, ['cupos_totales', 'cupos_totales_e', 'cupos'])) || 0;
    const available = Number(getField(event, ['cupos_disponibles', 'cupos_disponibles_e'])) || 0;
    const filled = total > 0 ? total - available : 0;
    const percent = total > 0 ? Math.min(100, Math.round((filled / total) * 100)) : 0;
    const status = getField(event, ['estado', 'estado_e']) || 'Activo';
    const statusClass = badgeClass(status);

    return `
      <tr>
        <td><strong>${name}</strong></td>
        <td><span class="badge ${statusClass}">${category}</span></td>
        <td>${date}</td>
        <td>${location}</td>
        <td>
          <span>${filled} / ${total || '—'}</span>
          <div class="cupos-bar"><div class="cupos-fill ${percent >= 100 ? 'full' : percent > 60 ? 'high' : ''}" style="width:${percent}%"></div></div>
        </td>
        <td><span class="badge ${badgeClass(status)}">${status}</span></td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="openModal('modal-evento')">✏️</button>
          <button class="btn btn-danger btn-sm">🗑️</button>
        </td>
      </tr>
    `;
  }).join('');
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (!element) return;
  element.textContent = value;
}

function loadAdminData() {
  fetch(adminDataUrl)
    .then(response => response.json())
    .then(json => {
      if (!json.ok) {
        showToast('No se pudo cargar datos de la base de datos', 'danger');
        return;
      }

      const data = json.data || {};
      const finance = json.finance || {};
      const summary = json.summary || {};

      setText('kpiEventos', summary.eventos ?? '—');
      setText('kpiUsuarios', summary.usuarios ?? '—');
      setText('kpiInscripciones', summary.inscripciones ?? '—');
      setText('kpiIngresos', finance.ingresos ? formatCurrency(finance.ingresos) : '$0');
      setText('kpiPendientes', finance.pagos?.pendiente ?? 0);
      setText('kpiKits', summary.kits ?? 0);
      setText('pagosAprobadosCount', summary.pagosAprobados ?? finance.pagos?.aprobado ?? 0);
      setText('pagosPendientesCount', summary.pagosPendientes ?? finance.pagos?.pendiente ?? 0);
      setText('pagosRechazadosCount', summary.pagosRechazados ?? finance.pagos?.rechazado ?? 0);
      setText('usuariosCountLabel', summary.usuarios ? `${summary.usuarios} usuarios` : '— usuarios');

      renderDashboardUpcoming(data.eventos || []);
      renderEventCards(data.eventos || []);

      renderTable('usuariosBody', data.usuarios || [], sectionColumns.usuarios);
      renderTable('inscripcionesBody', data.inscripciones || [], sectionColumns.inscripciones);
      renderTable('pagosBody', data.pagos || [], sectionColumns.pagos);
      renderTable('kitsBody', data.kits || [], sectionColumns.kits);
      renderTable('entregasBody', data.entregas || [], sectionColumns.entregas);
      renderTable('categoriasBody', data.categorias || [], sectionColumns.categorias);
      renderTable('patrocinadoresBody', data.patrocinadores || [], sectionColumns.patrocinadores);
      renderTable('resultadosBody', data.resultados || [], sectionColumns.resultados);
      renderTable('rutasBody', data.rutas || [], sectionColumns.rutas);
      renderTable('hidratacionBody', data.hidratacion || [], sectionColumns.hidratacion);
      renderTable('notificacionesBody', data.notificaciones || [], sectionColumns.notificaciones);

      updateSidebarBadges(json.summary || {}, json.finance || {});
      updateKitsStats(json.data?.entregas || []);
    })
    
}

function rowHasQr(row) {
  const hasQr = getField(row, ['qr', 'codigo_qr', 'tiene_qr']);
  return hasQr ? renderButton('📱 Ver QR') : '<span class="badge badge-neutral">Sin QR</span>';
}

document.addEventListener('DOMContentLoaded', loadAdminData);

// ===== EXTENSIÓN: actualizar badges sidebar y stats de kits =====

function updateSidebarBadges(summary, finance) {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('sidebarEventosBadge', summary.eventos ?? '—');
  set('sidebarUsuariosBadge', summary.usuarios ?? '—');
  set('sidebarInscripcionesBadge', summary.inscripciones ?? '—');
  set('sidebarPagosBadge', finance?.pagos?.pendiente ?? '—');
}

function updateKitsStats(entregas) {
  if (!Array.isArray(entregas)) return;
  const total = entregas.length;
  const entregados = entregas.filter(e => {
    const estado = String(e.estado || e.estado_entrega || '').toLowerCase();
    return estado.includes('entreg');
  }).length;
  const pendientes = total - entregados;
  const pct = total > 0 ? Math.round((entregados / total) * 100) : 0;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('kitsStatTotal', total);
  set('kitsStatEntregados', entregados);
  set('kitsStatPendientes', pendientes);
  set('kitsProgressLabel', pct + '% entregado');
  const bar = document.getElementById('kitsProgressBar');
  if (bar) bar.style.width = pct + '%';
}

const _originalLoad = loadAdminData;