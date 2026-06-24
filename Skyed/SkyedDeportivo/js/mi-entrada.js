/* mi-entrada.js —  */
(async function(){
  const root = document.getElementById('root');
  const idEv = new URLSearchParams(location.search).get('evento');
  const u = SKY.usuario();

  async function renderError(message) {
    root.innerHTML = `<div class="alert alert-err">${message}</div>`;
  }

  if (!u) {
    renderError('Inicia sesión para ver tu entrada.');
    return;
  }

  let data;
  try {
    const resp = await fetch('php/get_inscripciones.php', { credentials: 'include' });
    data = await resp.json();
    if (!resp.ok || !data.ok || !Array.isArray(data.inscripciones)) {
      renderError('No se pudo recuperar tus inscripciones. Asegúrate de iniciar sesión.');
      return;
    }
  } catch (err) {
    console.error('Error fetching inscriptions:', err);
    renderError('No se pudo comunicar con el servidor. Intenta de nuevo más tarde.');
    return;
  }

  const inscripciones = data.inscripciones.filter(i => i.estado_i === 'confirmada');
  const ins = idEv ? inscripciones.find(i => String(i.evento_id) === String(idEv)) : inscripciones[inscripciones.length - 1];
  if (!ins) {
    root.innerHTML = '<div class="alert alert-info">No tienes entradas confirmadas todavía. <a href="eventos.html">Explora eventos</a>.</div>';
    return;
  }

  const ev = SKY.evento(ins.evento_id);
  const qr = {
    codigo_qr: ins.qr_code,
    estado_qr: ins.estado_qr || 'activo',
    fecha_generacion_qr: ins.fecha_generacion_qr || null,
    qr_imagen_qr: ins.qr_imagen_qr || null,
  };
  if (!qr.codigo_qr) {
    renderError('No hay QR generado para esta inscripción.');
    return;
  }

  const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(qr.codigo_qr)}`;
  const estPill = qr.estado_qr==='activo'?'pill-ok':qr.estado_qr==='usado'?'pill-info':'pill-err';

  root.innerHTML = `
    <div class="card qr-card">
      <img src="${qrImg}" alt="QR ${qr.codigo_qr}" width="260" height="260">
      <h2 style="color:var(--primary);margin-bottom:.4rem">${ev.nombre_e}</h2>
      <p style="color:var(--muted);margin-bottom:.8rem">${SKY.fmtFecha(ev.fecha_e)} · ${ev.ubicacion_e}</p>
      <div class="qr-code">${qr.codigo_qr}</div>
      <div style="margin-top:1rem"><span class="pill ${estPill}">${qr.estado_qr}</span></div>
    </div>

    <div class="card">
      <h2>📋 Información de inscripción</h2>
      <div class="grid-2">
        <div><small style="color:var(--muted)">Participante</small><br><strong>${u.nombre_u} ${u.apellido_u||''}</strong></div>
        <div><small style="color:var(--muted)">Documento</small><br><strong>${u.doc_u}</strong></div>
        <div><small style="color:var(--muted)">Método de pago</small><br><strong>${ins.metodo_pago_i}</strong></div>
        <div><small style="color:var(--muted)">Pagado</small><br><strong>${SKY.fmtCOP(ins.precio_pagado_i)}</strong></div>
        <div><small style="color:var(--muted)">Fecha inscripción</small><br><strong>${SKY.fmtFecha(ins.fecha_inscripcion)}</strong></div>
        <div><small style="color:var(--muted)">Estado</small><br><span class="pill pill-ok">${ins.estado_i}</span></div>
      </div>
    </div>

    ${inscripciones.length>1?`<div class="card">
      <h2>🎫 Otras entradas</h2>
      ${inscripciones.filter(i=>i.id!==ins.id).map(i=>{
        const e=SKY.evento(i.evento_id); return `<div class="cat-comp" style="display:flex;justify-content:space-between;align-items:center">
          <div><strong>${e.nombre_e}</strong><br><small style="color:var(--muted)">${SKY.fmtFecha(e.fecha_e)}</small></div>
          <a href="mi-entrada.html?evento=${e.id_e}" class="btn btn-ghost">Ver QR</a>
        </div>`; }).join('')}
    </div>`:''}
  `;
})();
