/* notificaciones.js —  */
(function(){
  const u=SKY.usuario(), lista=document.getElementById('lista');
  if(!u){ lista.innerHTML='<div class="alert alert-warn">Inicia sesión.</div>'; return; }

  function render(){
    const notif=SKY.get(SKY.K.Notificacion).filter(n=>n.doc_u==u.doc_u).sort((a,b)=>new Date(b.fecha_n)-new Date(a.fecha_n));
    if(!notif.length){ lista.innerHTML='<div class="card empty">No tienes notificaciones.</div>'; return; }
    const colorTipo={evento:'pill-info',pago:'pill-ok',resultado:'pill-warn',kit:'pill-warn',general:'pill-info'};
    lista.innerHTML=notif.map(n=>`
      <div class="card" style="display:flex;gap:1rem;align-items:flex-start;${n.leida_n?'opacity:.7':''}">
        <div style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--accent));color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0">🔔</div>
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap">
            <strong style="color:var(--primary)">${n.titulo_n}</strong>
            <span class="pill ${colorTipo[n.tipo_n]||'pill-info'}">${n.tipo_n}</span>
          </div>
          <p style="margin:.4rem 0;color:var(--muted);font-size:.94rem">${n.mensaje_n}</p>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:.78rem;color:var(--muted)">
            <span>${SKY.fmtFecha(n.fecha_n)} · ${new Date(n.fecha_n).toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'})}</span>
            <div>
              ${!n.leida_n?`<button class="icon-btn" data-leer="${n.id_n}">Marcar leída</button>`:''}
              <button class="icon-btn del" data-del="${n.id_n}">Eliminar</button>
            </div>
          </div>
        </div>
      </div>`).join('');
    lista.querySelectorAll('[data-leer]').forEach(b=>b.onclick=()=>toggle(+b.dataset.leer,true));
    lista.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>del(+b.dataset.del));
  }
  function toggle(id,leida){
    const arr=SKY.get(SKY.K.Notificacion); const x=arr.find(n=>n.id_n===id); if(x){x.leida_n=leida; SKY.set(SKY.K.Notificacion,arr); render();}
  }
  function del(id){ if(!confirm('¿Eliminar notificación?')) return;
    SKY.set(SKY.K.Notificacion, SKY.get(SKY.K.Notificacion).filter(n=>n.id_n!==id)); render();
  }
  document.getElementById('leerTodas').onclick=()=>{
    const arr=SKY.get(SKY.K.Notificacion); arr.forEach(n=>{ if(n.doc_u==u.doc_u) n.leida_n=true; }); SKY.set(SKY.K.Notificacion,arr); render();
  };
  // seed bienvenida si vacío
  if(SKY.get(SKY.K.Notificacion).filter(n=>n.doc_u==u.doc_u).length===0){
    SKY.notificar(u.doc_u,'Bienvenido a SKYED','Tu cuenta está activa. Explora los próximos eventos.','general');
  }
  render();
})();
