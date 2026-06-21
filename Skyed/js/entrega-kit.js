/* entrega-kit.js —  */
(function(){
  const insSel=document.getElementById('insSel');
  SKY.get(SKY.K.Inscripcion).forEach(i=>{
    const ev=SKY.evento(i.id_e); const us=SKY.get(SKY.K.Usuario).find(u=>u.doc_u==i.doc_u);
    insSel.insertAdjacentHTML('beforeend',`<option value="${i.id_i}">#${i.id_i} · ${us?us.nombre_u:'?'} · ${ev?ev.nombre_e:'?'}</option>`);
  });

  function trigger(estado, id_k){
    const ks=SKY.get(SKY.K.Kit); const idx=ks.findIndex(k=>k.id_k==id_k);
    if(idx<0) return;
    if(estado==='entregado') ks[idx].stock_k--;
    else if(estado==='devolucion') ks[idx].stock_k++;
    SKY.set(SKY.K.Kit,ks);
  }

  function render(){
    const eks=SKY.get(SKY.K.EntregaKit);
    const us=SKY.get(SKY.K.Usuario), ks=SKY.get(SKY.K.Kit);
    document.getElementById('tabla').innerHTML=`<div class="table-wrap"><table class="data">
      <thead><tr><th>ID</th><th>Fecha</th><th>Kit (stock)</th><th>Participante</th><th>Entrega por</th><th>Estado</th><th>Obs.</th></tr></thead>
      <tbody>${eks.length? eks.map(e=>{
        const u=us.find(x=>x.doc_u==e.doc_u), k=ks.find(x=>x.id_k==e.id_k);
        const pill=e.estado_ek==='entregado'?'pill-ok':e.estado_ek==='devolucion'?'pill-warn':'pill-info';
        return `<tr><td>${e.id_ek}</td><td>${SKY.fmtFecha(e.fecha_entrega_real_ek)}</td>
          <td>${k?k.nombre_k+' ('+k.stock_k+')':'?'}</td>
          <td>${u?u.nombre_u+' '+(u.apellido_u||''):'?'}</td>
          <td>${e.persona_entrega_ek}</td>
          <td><span class="pill ${pill}">${e.estado_ek}</span></td>
          <td>${e.observaciones_ek||'—'}</td></tr>`;
      }).join(''):'<tr><td colspan="7" class="empty">Sin entregas registradas.</td></tr>'}</tbody></table></div>`;
  }

  document.getElementById('guardar').onclick=()=>{
    const id_i=+insSel.value; if(!id_i){ alert('Selecciona una inscripción'); return; }
    const ins=SKY.get(SKY.K.Inscripcion).find(x=>x.id_i===id_i);
    const ev=SKY.evento(ins.id_e);
    const estado=document.getElementById('estado').value;
    const arr=SKY.get(SKY.K.EntregaKit);
    arr.push({id_ek:SKY.seq('EK'),fecha_entrega_real_ek:new Date().toISOString(),persona_entrega_ek:document.getElementById('persona').value||'Staff',estado_ek:estado,observaciones_ek:document.getElementById('obs').value,id_k:ev.id_k,doc_u:ins.doc_u,id_e:ins.id_e});
    SKY.set(SKY.K.EntregaKit,arr);
    trigger(estado, ev.id_k);
    SKY.notificar(ins.doc_u,'Kit actualizado',`Estado del kit: ${estado}`,'kit');
    document.getElementById('persona').value=''; document.getElementById('obs').value='';
    render();
  };

  render();
})();
