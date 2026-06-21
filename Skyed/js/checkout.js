/* checkout.js —  */
(function(){
  const id = new URLSearchParams(location.search).get('id');
  const ev = SKY.evento(id);
  const u = SKY.usuario();
  const root = document.getElementById('root');

  if(!u){ root.innerHTML=`<div class="alert alert-warn">Debes <a href="login.html">iniciar sesión</a> para inscribirte.</div>`; return; }
  if(!ev){ root.innerHTML='<div class="alert alert-err">Evento no encontrado.</div>'; return; }
  if(ev.cupos_disponibles_e<=0){ root.innerHTML='<div class="alert alert-err">Lo sentimos, no hay cupos disponibles.</div>'; return; }

  const yaInscrito = SKY.get(SKY.K.Inscripcion).some(i=>i.doc_u==u.doc_u && i.id_e==ev.id_e && i.estado_i!=='cancelada');
  if(yaInscrito){
    root.innerHTML=`<div class="alert alert-ok">Ya estás inscrito en este evento. Revisa <a href="mi-entrada.html?evento=${ev.id_e}">tu entrada QR</a>.</div>`; return;
  }

  let metodo = 'tarjeta';
  function render(){
    root.innerHTML = `
    <div class="checkout-grid">
      <div>
        <div class="card">
          <h2>👤 Datos del participante</h2>
          <div class="grid-2">
            <div class="field"><label class="label">Documento</label><input class="input" value="${u.doc_u}" readonly></div>
            <div class="field"><label class="label">Nombre completo</label><input class="input" value="${u.nombre_u} ${u.apellido_u||''}" readonly></div>
            <div class="field"><label class="label">Correo</label><input class="input" value="${u.correo_u}" readonly></div>
            <div class="field"><label class="label">Teléfono</label><input class="input" value="${u.telefono_u||''}" readonly></div>
          </div>
          <div class="field"><label class="label">Categoría de competencia</label>
            <select id="cat" class="select">
              ${SKY.get(SKY.K.CatComp).filter(c=>c.id_e==ev.id_e).map(c=>`<option value="${c.id_cc}">${c.nombre_cc} (${c.distancia_cc})</option>`).join('') || '<option value="">Categoría única</option>'}
            </select>
          </div>
        </div>

        <div class="card">
          <h2>💳 Método de pago</h2>
          <div class="metodos">
            ${['tarjeta','PSE','nequi','efectivo'].map(m=>`<div class="metodo ${m===metodo?'sel':''}" data-m="${m}">${m.toUpperCase()}</div>`).join('')}
          </div>
          ${metodo==='tarjeta'?`
            <div class="grid-2">
              <div class="field"><label class="label">Número tarjeta</label><input id="tar_num" class="input" placeholder="4111 1111 1111 1111" maxlength="19"></div>
              <div class="field"><label class="label">Titular</label><input id="tar_tit" class="input" placeholder="${u.nombre_u}"></div>
              <div class="field"><label class="label">Vencimiento</label><input id="tar_ven" class="input" placeholder="MM/AA" maxlength="5"></div>
              <div class="field"><label class="label">CVV</label><input id="tar_cvv" class="input" placeholder="123" maxlength="4"></div>
            </div>`:''}
          ${metodo==='PSE'?`<div class="field"><label class="label">Banco</label><select class="select"><option>Bancolombia</option><option>Davivienda</option><option>Banco de Bogotá</option><option>BBVA</option></select></div>`:''}
          ${metodo==='nequi'?`<div class="field"><label class="label">Número Nequi</label><input class="input" placeholder="3001234567"></div>`:''}
          ${metodo==='efectivo'?`<div class="alert alert-info">Recibirás un código de pago para Efecty/Baloto. Tu inscripción quedará <strong>pendiente</strong> hasta confirmar el pago.</div>`:''}
        </div>

        <div class="card">
          <label style="display:flex;gap:.6rem;align-items:flex-start;cursor:pointer">
            <input type="checkbox" id="acepto" style="margin-top:.25rem">
            <span style="font-size:.9rem">Acepto los términos del evento, el reglamento de competencia y autorizo el tratamiento de mis datos.</span>
          </label>
        </div>
      </div>

      <div>
        <div class="card" style="position:sticky;top:1rem">
          <h2>🧾 Resumen</h2>
          <p style="font-weight:700;color:var(--primary);font-size:1.05rem">${ev.nombre_e}</p>
          <p style="color:var(--muted);font-size:.9rem;margin:.3rem 0 1rem">
            ${SKY.fmtFecha(ev.fecha_e)} · ${ev.ubicacion_e}
          </p>
          <div style="display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid var(--border)"><span>Inscripción</span><strong>${SKY.fmtCOP(ev.precio_e)}</strong></div>
          <div style="display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid var(--border)"><span>Servicio</span><strong>${SKY.fmtCOP(0)}</strong></div>
          <div style="display:flex;justify-content:space-between;padding:.8rem 0;font-size:1.1rem">
            <span>Total</span><strong class="resumen-precio" style="font-size:1.4rem">${SKY.fmtCOP(ev.precio_e)}</strong>
          </div>
          <button id="pagar" class="btn btn-accent" style="width:100%;justify-content:center;margin-top:.5rem">Confirmar y pagar</button>
        </div>
      </div>
    </div>`;

    root.querySelectorAll('.metodo').forEach(el=>el.onclick=()=>{ metodo=el.dataset.m; render(); });
    root.querySelector('#pagar').onclick = confirmar;
  }

  function confirmar(){
    if(!document.getElementById('acepto').checked){ alert('Debes aceptar los términos.'); return; }
    const cat = document.getElementById('cat').value || null;
    const estadoPago = metodo==='efectivo' ? 'pendiente' : 'aprobado';
    const estadoIns  = metodo==='efectivo' ? 'pendiente' : 'confirmada';

    // Inscripcion
    const id_i = SKY.seq('Inscripcion');
    const ins = {id_i,metodo_pago_i:metodo,estado_i:estadoIns,fecha_i:new Date().toISOString(),precio_pagado_i:ev.precio_e,doc_u:u.doc_u,id_e:ev.id_e};
    const arr = SKY.get(SKY.K.Inscripcion); arr.push(ins); SKY.set(SKY.K.Inscripcion,arr);

    // Pago
    const pagos=SKY.get(SKY.K.Pago);
    pagos.push({id_pago:SKY.seq('Pago'),metodo_pago_p:metodo,referencia_p:'REF-'+Date.now(),comprobante_p:'',monto_p:ev.precio_e,fecha_p:new Date().toISOString(),estado_p:estadoPago,id_i});
    SKY.set(SKY.K.Pago,pagos);

    // QR
    if(estadoIns==='confirmada'){
      const qrs=SKY.get(SKY.K.QR);
      const code='SKY-'+ev.id_e+'-'+u.doc_u+'-'+id_i;
      qrs.push({id_qr:SKY.seq('QR'),codigo_qr:code,qr_imagen_qr:'',fecha_generacion_qr:new Date().toISOString(),fecha_uso_qr:null,estado_qr:'activo',id_i});
      SKY.set(SKY.K.QR,qrs);
    }

    // Historial
    const h=SKY.get(SKY.K.Historial);
    h.push({id_hp:SKY.seq('Hist'),fecha_hp:new Date().toISOString(),estado_hp:'inscrito',observaciones_hp:'Inscripción vía web',doc_u:u.doc_u,id_e:ev.id_e});
    SKY.set(SKY.K.Historial,h);

    // Cupos
    const evs=SKY.get(SKY.K.Evento);
    const idx=evs.findIndex(e=>e.id_e==ev.id_e); evs[idx].cupos_disponibles_e--; SKY.set(SKY.K.Evento,evs);

    // Notificación
    SKY.notificar(u.doc_u, 'Inscripción registrada', `Tu inscripción a ${ev.nombre_e} fue ${estadoIns}.`, 'evento');

    location.href = estadoIns==='confirmada'
      ? `mi-entrada.html?evento=${ev.id_e}`
      : `perfil2.html`;
  }

  render();
})();
