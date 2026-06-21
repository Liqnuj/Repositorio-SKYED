/* mi-entrada.js —  */
(function(){
  const u = SKY.usuario();
  const root = document.getElementById('root');
  if(!u){ root.innerHTML='<div class="alert alert-warn">Inicia sesión para ver tu entrada.</div>'; return; }

  const idEv = new URLSearchParams(location.search).get('evento');
  const inscripciones = SKY.get(SKY.K.Inscripcion).filter(i=>i.doc_u==u.doc_u && i.estado_i==='confirmada');
  let ins = idEv ? inscripciones.find(i=>i.id_e==idEv) : inscripciones[inscripciones.length-1];
  if(!ins){ root.innerHTML='<div class="alert alert-info">No tienes entradas confirmadas todavía. <a href="eventos.html">Explora eventos</a>.</div>'; return; }

  const ev  = SKY.evento(ins.id_e);
  const qr  = SKY.get(SKY.K.QR).find(q=>q.id_i===ins.id_i);
  if(!qr){ root.innerHTML='<div class="alert alert-err">No hay QR generado.</div>'; return; }

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
        <div><small style="color:var(--muted)">Fecha inscripción</small><br><strong>${SKY.fmtFecha(ins.fecha_i)}</strong></div>
        <div><small style="color:var(--muted)">Estado</small><br><span class="pill pill-ok">${ins.estado_i}</span></div>
      </div>
    </div>

    ${inscripciones.length>1?`<div class="card">
      <h2>🎫 Otras entradas</h2>
      ${inscripciones.filter(i=>i.id_i!==ins.id_i).map(i=>{
        const e=SKY.evento(i.id_e); return `<div class="cat-comp" style="display:flex;justify-content:space-between;align-items:center">
          <div><strong>${e.nombre_e}</strong><br><small style="color:var(--muted)">${SKY.fmtFecha(e.fecha_e)}</small></div>
          <a href="mi-entrada.html?evento=${e.id_e}" class="btn btn-ghost">Ver QR</a>
        </div>`; }).join('')}
    </div>`:''}
  `;
})();
