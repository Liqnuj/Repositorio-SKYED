/* resultados.js —  */
(function(){
  // Seed demo resultados si no hay
  if(SKY.get(SKY.K.Resultado).length===0){
    const us=SKY.get(SKY.K.Usuario);
    if(us.length){
      const res=[];
      us.slice(0,Math.min(8,us.length)).forEach((u,i)=>{
        res.push({id_r:SKY.seq('Res'),tiempo_final_r:`0${3+Math.floor(i/3)}:${10+i*3}:${10+i}`.slice(-8),posicion_general_r:i+1,posicion_categoria_r:Math.floor(i/2)+1,velocidad_promedio_r:(35-i*1.2).toFixed(2),doc_u:u.doc_u,id_e:1,id_cc:i<3?1:i<6?2:3});
      });
      SKY.set(SKY.K.Resultado,res);
    }
  }

  const evSel=document.getElementById('evSel');
  const catSel=document.getElementById('catSel');
  const tabla=document.getElementById('tablaRes');

  SKY.get(SKY.K.Evento).forEach(e=>evSel.insertAdjacentHTML('beforeend',`<option value="${e.id_e}">${e.nombre_e}</option>`));

  function pintarCats(){
    catSel.innerHTML='<option value="">Todas</option>';
    SKY.get(SKY.K.CatComp).filter(c=>c.id_e==evSel.value).forEach(c=>catSel.insertAdjacentHTML('beforeend',`<option value="${c.id_cc}">${c.nombre_cc}</option>`));
  }

  function render(){
    let res=SKY.get(SKY.K.Resultado).filter(r=>r.id_e==evSel.value);
    if(catSel.value) res=res.filter(r=>r.id_cc==catSel.value);
    res.sort((a,b)=>a.posicion_general_r-b.posicion_general_r);
    const us=SKY.get(SKY.K.Usuario), cats=SKY.get(SKY.K.CatComp);
    tabla.innerHTML = `<div class="table-wrap"><table class="data">
      <thead><tr><th>Pos.</th><th>Participante</th><th>Categoría</th><th>Pos. cat.</th><th>Tiempo</th><th>Vel. prom.</th></tr></thead>
      <tbody>${res.length? res.map(r=>{
        const u=us.find(x=>x.doc_u==r.doc_u);
        const c=cats.find(x=>x.id_cc==r.id_cc);
        const medal=r.posicion_general_r===1?'🥇':r.posicion_general_r===2?'🥈':r.posicion_general_r===3?'🥉':r.posicion_general_r;
        return `<tr>
          <td><strong>${medal}</strong></td>
          <td>${u? (u.nombre_u+' '+(u.apellido_u||'')):'Desconocido'}</td>
          <td>${c?c.nombre_cc:'—'}</td>
          <td>${r.posicion_categoria_r||'—'}</td>
          <td><code>${r.tiempo_final_r}</code></td>
          <td>${r.velocidad_promedio_r} km/h</td>
        </tr>`;
      }).join('') : '<tr><td colspan="6" class="empty">Sin resultados para este evento.</td></tr>'}</tbody></table></div>`;
  }

  evSel.onchange=()=>{ pintarCats(); render(); };
  catSel.onchange=render;
  pintarCats(); render();
})();
