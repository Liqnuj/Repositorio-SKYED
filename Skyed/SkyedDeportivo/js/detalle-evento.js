/* detalle-evento.js —  */
(function(){
  const id = new URLSearchParams(location.search).get('id') || 1;
  const ev = SKY.evento(id);
  const cont = document.getElementById('contenido');
  if(!ev){ cont.innerHTML='<div class="alert alert-err">Evento no encontrado.</div>'; return; }
  const kit = SKY.kit(ev.id_k);
  const cats = SKY.get(SKY.K.CatComp).filter(c=>c.id_e==id);
  const rutas = SKY.get(SKY.K.RutaEvento).filter(r=>r.id_e==id);
  const puntos = SKY.get(SKY.K.PuntoHidra).filter(p=>p.id_e==id);
  const patroIds = SKY.get(SKY.K.EventoPatro).filter(x=>x.id_e==id).map(x=>x.id_p);
  const patros = SKY.get(SKY.K.Patrocinador).filter(p=>patroIds.includes(p.id_p));
  const sesion = SKY.sesion();

  cont.innerHTML = `
    <div class="hero-evento" style="background-image:url('${ev.img_hero_e}')">
      <div class="info">
        <span class="badge-cat">${ev.categoria_e}</span>
        <h1>${ev.nombre_e}</h1>
        <div class="meta">
          <span>📅 ${SKY.fmtFecha(ev.fecha_e)} ${ev.hora_e||''}</span>
          <span>📍 ${ev.ubicacion_e}</span>
          <span>🎟️ ${ev.cupos_disponibles_e}/${ev.cupos_totales_e} cupos</span>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div>
        <div class="card">
          <h2>📋 Descripción</h2>
          <p style="color:var(--muted);line-height:1.7">${ev.descripcion_e}</p>
          <h3 style="margin:1rem 0 .5rem;color:var(--primary);font-size:1rem">Requisitos</h3>
          <p style="color:var(--muted)">${ev.requisitos_e||'—'}</p>
        </div>

        <div class="card">
          <h2>🏁 Especificaciones</h2>
          <ul class="spec-list">
            <li><strong>${ev.distancia_total_e||'—'}</strong><small>Distancia total</small></li>
            <li><strong>${ev.distancia_intermedia_e||'—'}</strong><small>Intermedia</small></li>
            <li><strong>${ev.distancia_avanzada_e||'—'}</strong><small>Avanzada</small></li>
            <li><strong>${ev.desnivel_e||'—'}</strong><small>Desnivel</small></li>
          </ul>
        </div>

        <div class="card">
          <h2>🛣️ Rutas</h2>
          ${rutas.length? rutas.map(r=>`
            <div class="cat-comp">
              <strong style="color:var(--primary)">${r.nombre_re}</strong>
              <div style="color:var(--muted);font-size:.9rem;margin-top:.3rem">
                ${r.distancia_re} · Desnivel ${r.desnivel_re}
              </div>
              <p style="margin-top:.4rem;font-size:.92rem">${r.descripcion_re||''}</p>
            </div>`).join('') : '<p style="color:var(--muted)">Sin rutas registradas.</p>'}
        </div>

        <div class="card">
          <h2>🚰 Puntos en ruta</h2>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Km</th><th>Tipo</th><th>Nombre</th><th>Descripción</th></tr></thead>
            <tbody>${puntos.length? puntos.map(p=>`
              <tr><td>${p.kilometro_ph}</td><td><span class="pill pill-info">${p.tipo_ph}</span></td>
              <td>${p.nombre_ph}</td><td>${p.descripcion_ph||'—'}</td></tr>`).join('')
              : '<tr><td colspan="4" class="empty">Sin puntos registrados</td></tr>'}
            </tbody></table></div>
        </div>

        <div class="card">
          <h2>🏆 Categorías de competencia</h2>
          ${cats.length? cats.map(c=>`
            <div class="cat-comp">
              <strong style="color:var(--primary)">${c.nombre_cc}</strong>
              <span class="pill pill-info" style="margin-left:.5rem">${c.genero_cc}</span>
              <div style="color:var(--muted);font-size:.9rem;margin-top:.3rem">
                Edad ${c.edad_minima_cc}–${c.edad_maxima_cc} · ${c.distancia_cc}
              </div>
              <p style="margin-top:.3rem;font-size:.9rem">${c.descripcion_cc||''}</p>
            </div>`).join('') : '<p style="color:var(--muted)">Categoría única.</p>'}
        </div>
      </div>

      <div>
        <div class="card" style="position:sticky;top:1rem">
          <h2>🎟️ Inscripción</h2>
          <div class="resumen-precio">${SKY.fmtCOP(ev.precio_e)}</div>
          <p style="color:var(--muted);font-size:.85rem;margin-bottom:1rem">Precio por participante (COP)</p>
          <div style="margin-bottom:1rem">
            <div style="display:flex;justify-content:space-between;font-size:.9rem;margin-bottom:.3rem">
              <span>Cupos disponibles</span><strong>${ev.cupos_disponibles_e}</strong>
            </div>
            <div style="height:8px;background:#e5e7eb;border-radius:99px;overflow:hidden">
              <div style="height:100%;background:linear-gradient(90deg,var(--accent),var(--primary));width:${(ev.cupos_disponibles_e/ev.cupos_totales_e*100)}%"></div>
            </div>
          </div>
          <a href="checkout.html?id=${ev.id_e}" class="btn btn-accent" style="width:100%;justify-content:center">Inscribirme ahora</a>
          ${!sesion?'<p style="margin-top:.7rem;font-size:.8rem;color:var(--muted);text-align:center">Inicia sesión para inscribirte</p>':''}
        </div>

        ${kit?`<div class="card">
          <h2>🎽 Kit del corredor</h2>
          <p><strong>${kit.nombre_k}</strong></p>
          <p style="font-size:.9rem;color:var(--muted);margin-top:.4rem">${kit.contenido_k}</p>
          <div style="margin-top:.8rem;font-size:.85rem">
            <div>📍 ${kit.lugar_entrega_k}</div>
            <div>📅 Entrega: ${SKY.fmtFecha(kit.fecha_entrega_k)}</div>
            <div>👕 Talla base: ${kit.talla_camiseta_k}</div>
          </div>
        </div>`:''}

        <div class="card">
          <h2>🤝 Patrocinadores</h2>
          ${patros.length? `<div class="patro-grid">${patros.map(p=>`
            <div class="patro-card">
              <div class="logo">${p.nombre_p.substring(0,2).toUpperCase()}</div>
              <strong style="font-size:.9rem">${p.nombre_p}</strong>
              <div style="font-size:.75rem;color:var(--muted);margin-top:.3rem">${p.tipo_p}</div>
            </div>`).join('')}</div>` : '<p style="color:var(--muted)">Sin patrocinadores.</p>'}
        </div>
      </div>
    </div>`;
  // Interceptar CTA hero (link estática en el HTML) y redirigir según sesión
  try {
    const heroBtn = document.querySelector('.hero-cta .btn-inscribir');
    if (heroBtn) {
      heroBtn.addEventListener('click', async function (evnt) {
        evnt.preventDefault();
        const user = JSON.parse(localStorage.getItem('cicloUser') || 'null');
        if (!user || !user.email) {
          localStorage.setItem('pendingInscripcion', `inscripcion.html?id=${id}`);
          showToast('Debes iniciar sesión para inscribirte', 'error');
          setTimeout(() => location.href = 'login.html', 800);
          return;
        }
        let yaInscrito = false;
        try {
          const res = await fetch('php/get_inscripciones.php', { credentials: 'include' });
          const data = await res.json();
          if (data.ok && Array.isArray(data.inscripciones)) {
            yaInscrito = data.inscripciones.some(i =>
              Number(i.evento_id) === Number(id) &&
              i.estado !== 'cancelado' &&
              i.estado !== 'rechazado'
            );
          }
        } catch (err) {
          console.error('Error verificando inscripción:', err);
        }
        if (yaInscrito) {
          showToast('Ya estás inscrito en este evento', 'error');
          setTimeout(() => location.href = `index.html?evento=${id}`, 900);
          return;
        }
        location.href = `inscripcion.html?id=${id}`;
      });
    }
  } catch (e) { console.warn('hero-cta handler error', e); }
})();