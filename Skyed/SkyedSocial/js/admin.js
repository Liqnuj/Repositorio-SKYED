/* Panel de Administración - EventosPro */
(() => {
  // const API = 'api/';
  // const session = JSON.parse(sessionStorage.getItem('admin_session') || 'null');

  // if (!session || session.rol !== 'admin') {
  //   location.href = 'login.html'; return;
  // }
  // document.getElementById('adminName').textContent = session.nombre || session.usuario;

  // ============ DATOS DEMO (fallback sin PHP) ============
  const DEMO = {
    usuarios: [
      { id:1, usuario:'admindemo', nombre:'Administrador Demo', correo:'admin@eventospro.com', rol:'admin' },
      { id:2, usuario:'juanp', nombre:'Juan Pérez', correo:'juan@mail.com', rol:'usuario' },
      { id:3, usuario:'mariag', nombre:'María Gómez', correo:'maria@mail.com', rol:'usuario' }
    ],
    eventos: [
      { id:1, nombre:'Boda Clásica Premium', categoria:'Bodas', precio:8500000, cupos:120, activo:1 },
      { id:2, nombre:'XV Años Mágicos', categoria:'XV Años', precio:5200000, cupos:80, activo:1 },
      { id:3, nombre:'Cumpleaños Infantil Temático', categoria:'Cumpleaños', precio:1800000, cupos:40, activo:1 },
      { id:4, nombre:'Evento Corporativo Élite', categoria:'Corporativos', precio:6500000, cupos:200, activo:0 }
    ],
    reservas: [
      { id:101, cliente:'Juan Pérez', evento:'Boda Clásica Premium', fecha:'2026-08-15', invitados:80, total:8500000, estado:'confirmada' },
      { id:102, cliente:'María Gómez', evento:'XV Años Mágicos', fecha:'2026-07-20', invitados:60, total:5200000, estado:'pendiente' },
      { id:103, cliente:'Carlos Ruiz', evento:'Cumpleaños Infantil Temático', fecha:'2026-09-02', invitados:30, total:1800000, estado:'cancelada' }
    ],
    pqr: [
      { id:1, tipo:'peticion', asunto:'Cambio de fecha', cliente:'Juan Pérez', fecha:'2026-06-20', estado:'pendiente', mensaje:'Necesito cambiar la fecha de mi evento.' },
      { id:2, tipo:'queja', asunto:'Atención telefónica', cliente:'María Gómez', fecha:'2026-06-22', estado:'en_proceso', mensaje:'No me respondieron el teléfono.' },
      { id:3, tipo:'reclamo', asunto:'Servicio incompleto', cliente:'Carlos Ruiz', fecha:'2026-06-23', estado:'resuelto', mensaje:'Faltaron sillas.', respuesta:'Resuelto, se hizo reembolso parcial.' }
    ]
  };

  // ============ HELPERS ============
  const $ = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => [...c.querySelectorAll(s)];
  const fmtMoney = n => '$' + Number(n||0).toLocaleString('es-CO');
  const escapeHtml = s => String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  async function api(action, params = {}, method = 'GET') {
    try {
      const opts = { method, headers: { 'Content-Type': 'application/json' } };
      let url = API + action;
      if (method === 'GET' && Object.keys(params).length) {
        url += '?' + new URLSearchParams(params);
      } else if (method !== 'GET') {
        opts.body = JSON.stringify(params);
      }
      const res = await fetch(url, opts);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Error');
      return data;
    } catch (err) {
      console.warn('[API] fallback demo:', action, err.message);
      return null;
    }
  }

  function toast(msg, type='success') {
    const t = $('#toast');
    t.textContent = msg;
    t.className = 'toast ' + type;
    t.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.hidden = true, 2800);
  }

  // ============ NAVEGACIÓN ============
  const titles = { dashboard:'Dashboard', eventos:'Eventos', reservas:'Reservas', usuarios:'Usuarios', pqr:'PQR' };
  $$('.nav-link').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const sec = a.dataset.section;
      $$('.nav-link').forEach(n => n.classList.toggle('active', n === a));
      $$('.view').forEach(v => v.hidden = v.dataset.view !== sec);
      $('#sectionTitle').textContent = titles[sec];
      loaders[sec]?.();
      $('.sidebar').classList.remove('open');
    });
  });

  $('#menuToggle').addEventListener('click', () => $('.sidebar').classList.toggle('open'));
  $('#btnLogout').addEventListener('click', async () => {
    await api('logout.php', {}, 'POST');
    sessionStorage.removeItem('admin_session');
    location.href = 'login.html';
  });

  // ============ DASHBOARD ============
  async function loadDashboard() {
    const data = await api('admin_stats.php');
    let stats;
    if (data) {
      stats = data.stats;
    } else {
      stats = {
        usuarios: DEMO.usuarios.length,
        eventos: DEMO.eventos.length,
        reservas: DEMO.reservas.length,
        ingresos: DEMO.reservas.filter(r=>r.estado==='confirmada').reduce((s,r)=>s+r.total,0),
        pqr_abiertos: DEMO.pqr.filter(p=>p.estado!=='resuelto').length,
        confirmadas: DEMO.reservas.filter(r=>r.estado==='confirmada').length,
        ultimas: DEMO.reservas.slice(0,5)
      };
    }
    $('#kpiUsuarios').textContent = stats.usuarios;
    $('#kpiEventos').textContent = stats.eventos;
    $('#kpiReservas').textContent = stats.reservas;
    $('#kpiIngresos').textContent = fmtMoney(stats.ingresos);
    $('#kpiPqr').textContent = stats.pqr_abiertos;
    $('#kpiConfirmadas').textContent = stats.confirmadas;

    $('#ultimasReservas').innerHTML = (stats.ultimas||[]).map(r => `
      <tr><td>#${r.id}</td><td>${escapeHtml(r.cliente)}</td><td>${escapeHtml(r.evento)}</td>
      <td>${escapeHtml(r.fecha)}</td><td><span class="badge ${r.estado}">${r.estado}</span></td></tr>
    `).join('') || '<tr><td colspan="5" class="empty">Sin datos.</td></tr>';
  }

  // ============ EVENTOS ============
  async function loadEventos() {
    const data = await api('admin_eventos.php');
    const lista = data?.eventos || DEMO.eventos;
    $('#tablaEventos').innerHTML = lista.map(ev => `
      <tr>
        <td>#${ev.id}</td>
        <td>${escapeHtml(ev.nombre)}</td>
        <td>${escapeHtml(ev.categoria)}</td>
        <td>${fmtMoney(ev.precio)}</td>
        <td>${ev.cupos}</td>
        <td><span class="badge ${ev.activo?'activo':'inactivo'}">${ev.activo?'Activo':'Inactivo'}</span></td>
        <td>
          <button class="btn-icon" data-edit-ev="${ev.id}">✏️</button>
          <button class="btn-icon danger" data-del-ev="${ev.id}">🗑</button>
        </td>
      </tr>`).join('') || '<tr><td colspan="7" class="empty">Sin eventos.</td></tr>';

    $$('[data-edit-ev]').forEach(b => b.onclick = () => modalEvento(lista.find(e=>e.id==b.dataset.editEv)));
    $$('[data-del-ev]').forEach(b => b.onclick = () => deleteEvento(b.dataset.delEv));
  }

  $('#btnNuevoEvento').addEventListener('click', () => modalEvento());

  function modalEvento(ev = null) {
    const isNew = !ev;
    openModal(isNew ? 'Nuevo evento' : 'Editar evento', `
      <form id="formEv">
        <div class="field"><label>Nombre</label>
          <input name="nombre" required maxlength="100" value="${escapeHtml(ev?.nombre||'')}" pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,'-]{3,100}">
          <span class="error-msg"></span>
        </div>
        <div class="field"><label>Categoría</label>
          <select name="categoria" required>
            ${['Bodas','XV Años','Cumpleaños','Corporativos','Baby Shower'].map(c =>
              `<option ${ev?.categoria===c?'selected':''}>${c}</option>`).join('')}
          </select>
        </div>
        <div class="field"><label>Precio (COP)</label>
          <input name="precio" type="number" required min="0" step="1000" value="${ev?.precio||''}">
        </div>
        <div class="field"><label>Cupos</label>
          <input name="cupos" type="number" required min="1" max="9999" value="${ev?.cupos||''}">
        </div>
        <div class="field"><label>Estado</label>
          <select name="activo">
            <option value="1" ${ev?.activo!=0?'selected':''}>Activo</option>
            <option value="0" ${ev?.activo==0?'selected':''}>Inactivo</option>
          </select>
        </div>
        <div class="actions">
          <button type="button" class="btn-secondary" id="cancelEv">Cancelar</button>
          <button type="submit" class="btn-primary">${isNew?'Crear':'Guardar'}</button>
        </div>
      </form>
    `);
    $('#cancelEv').onclick = closeModal;
    $('#formEv').onsubmit = async e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const payload = Object.fromEntries(fd);
      if (!isNew) payload.id = ev.id;
      payload.precio = +payload.precio; payload.cupos = +payload.cupos; payload.activo = +payload.activo;

      const r = await api('admin_eventos.php', payload, isNew?'POST':'PUT');
      if (!r) {
        // Demo
        if (isNew) { payload.id = Date.now(); DEMO.eventos.push(payload); }
        else Object.assign(ev, payload);
      }
      toast(isNew?'Evento creado':'Evento actualizado');
      closeModal(); loadEventos();
    };
  }

  async function deleteEvento(id) {
    if (!confirm('¿Eliminar este evento?')) return;
    const r = await api('admin_eventos.php', { id }, 'DELETE');
    if (!r) { const i = DEMO.eventos.findIndex(e=>e.id==id); if (i>-1) DEMO.eventos.splice(i,1); }
    toast('Evento eliminado'); loadEventos();
  }

  // ============ RESERVAS ============
  async function loadReservas() {
    const filtro = $('#filtroReservas').value;
    const data = await api('admin_reservas.php', filtro?{estado:filtro}:{});
    let lista = data?.reservas || DEMO.reservas;
    if (filtro) lista = lista.filter(r => r.estado === filtro);

    $('#tablaReservas').innerHTML = lista.map(r => `
      <tr>
        <td>#${r.id}</td><td>${escapeHtml(r.cliente)}</td><td>${escapeHtml(r.evento)}</td>
        <td>${escapeHtml(r.fecha)}</td><td>${r.invitados}</td><td>${fmtMoney(r.total)}</td>
        <td><span class="badge ${r.estado}">${r.estado}</span></td>
        <td>
          ${r.estado!=='confirmada'?`<button class="btn-icon success" data-confirm="${r.id}">✓</button>`:''}
          ${r.estado!=='cancelada'?`<button class="btn-icon danger" data-cancel="${r.id}">✗</button>`:''}
        </td>
      </tr>`).join('') || '<tr><td colspan="8" class="empty">Sin reservas.</td></tr>';

    $$('[data-confirm]').forEach(b => b.onclick = () => updateReserva(b.dataset.confirm, 'confirmada'));
    $$('[data-cancel]').forEach(b => b.onclick = () => updateReserva(b.dataset.cancel, 'cancelada'));
  }
  $('#filtroReservas').addEventListener('change', loadReservas);

  async function updateReserva(id, estado) {
    const r = await api('admin_reservas.php', { id, estado }, 'PUT');
    if (!r) { const x = DEMO.reservas.find(r=>r.id==id); if (x) x.estado = estado; }
    toast('Reserva actualizada'); loadReservas();
  }

  // ============ USUARIOS ============
  async function loadUsuarios() {
    const data = await api('admin_usuarios.php');
    const lista = data?.usuarios || DEMO.usuarios;
    $('#tablaUsuarios').innerHTML = lista.map(u => `
      <tr>
        <td>#${u.id}</td><td>${escapeHtml(u.usuario)}</td><td>${escapeHtml(u.nombre)}</td>
        <td>${escapeHtml(u.correo)}</td>
        <td><span class="badge ${u.rol}">${u.rol}</span></td>
        <td>
          <button class="btn-icon" data-role="${u.id}">Cambiar rol</button>
          ${u.rol!=='admin'?`<button class="btn-icon danger" data-del-u="${u.id}">🗑</button>`:''}
        </td>
      </tr>`).join('') || '<tr><td colspan="6" class="empty">Sin usuarios.</td></tr>';

    $$('[data-role]').forEach(b => b.onclick = () => toggleRol(b.dataset.role));
    $$('[data-del-u]').forEach(b => b.onclick = () => deleteUsuario(b.dataset.delU));
  }

  async function toggleRol(id) {
    const u = DEMO.usuarios.find(u=>u.id==id);
    const nuevo = u && u.rol==='admin' ? 'usuario' : 'admin';
    if (!confirm(`¿Cambiar rol a "${nuevo}"?`)) return;
    const r = await api('admin_usuarios.php', { id, rol: nuevo }, 'PUT');
    if (!r && u) u.rol = nuevo;
    toast('Rol actualizado'); loadUsuarios();
  }

  async function deleteUsuario(id) {
    if (!confirm('¿Eliminar este usuario?')) return;
    const r = await api('admin_usuarios.php', { id }, 'DELETE');
    if (!r) { const i = DEMO.usuarios.findIndex(u=>u.id==id); if (i>-1) DEMO.usuarios.splice(i,1); }
    toast('Usuario eliminado'); loadUsuarios();
  }

  // ============ PQR ============
  async function loadPqr() {
    const filtro = $('#filtroPqr').value;
    const data = await api('admin_pqr.php', filtro?{estado:filtro}:{});
    let lista = data?.pqr || DEMO.pqr;
    if (filtro) lista = lista.filter(p => p.estado === filtro);

    $('#tablaPqr').innerHTML = lista.map(p => `
      <tr>
        <td>#${p.id}</td><td>${escapeHtml(p.tipo)}</td><td>${escapeHtml(p.asunto)}</td>
        <td>${escapeHtml(p.cliente)}</td><td>${escapeHtml(p.fecha)}</td>
        <td><span class="badge ${p.estado}">${p.estado.replace('_',' ')}</span></td>
        <td><button class="btn-icon" data-view-pqr="${p.id}">Ver / Responder</button></td>
      </tr>`).join('') || '<tr><td colspan="7" class="empty">Sin PQR.</td></tr>';

    $$('[data-view-pqr]').forEach(b => b.onclick = () => modalPqr(lista.find(p=>p.id==b.dataset.viewPqr)));
  }
  $('#filtroPqr').addEventListener('change', loadPqr);

  function modalPqr(p) {
    openModal(`PQR #${p.id} - ${p.tipo}`, `
      <div class="field"><label>Cliente</label><p>${escapeHtml(p.cliente)}</p></div>
      <div class="field"><label>Asunto</label><p>${escapeHtml(p.asunto)}</p></div>
      <div class="field"><label>Mensaje</label>
        <p style="background:#f8f5fb;padding:.8rem;border-radius:6px">${escapeHtml(p.mensaje||'')}</p>
      </div>
      <form id="formPqr">
        <div class="field"><label>Estado</label>
          <select name="estado" required>
            ${['pendiente','en_proceso','resuelto'].map(s =>
              `<option value="${s}" ${p.estado===s?'selected':''}>${s.replace('_',' ')}</option>`).join('')}
          </select>
        </div>
        <div class="field"><label>Respuesta</label>
          <textarea name="respuesta" maxlength="1000">${escapeHtml(p.respuesta||'')}</textarea>
        </div>
        <div class="actions">
          <button type="button" class="btn-secondary" id="cancelPqr">Cerrar</button>
          <button type="submit" class="btn-primary">Guardar</button>
        </div>
      </form>
    `);
    $('#cancelPqr').onclick = closeModal;
    $('#formPqr').onsubmit = async e => {
      e.preventDefault();
      const fd = Object.fromEntries(new FormData(e.target));
      fd.id = p.id;
      const r = await api('admin_pqr.php', fd, 'PUT');
      if (!r) Object.assign(p, fd);
      toast('PQR actualizado'); closeModal(); loadPqr();
    };
  }

  // ============ MODAL ============
  function openModal(title, html) {
    $('#modalTitle').textContent = title;
    $('#modalBody').innerHTML = html;
    $('#modal').hidden = false;
  }
  function closeModal() { $('#modal').hidden = true; }
  $('#modalClose').addEventListener('click', closeModal);
  $('#modal').addEventListener('click', e => { if (e.target.id==='modal') closeModal(); });
  document.addEventListener('keydown', e => { if (e.key==='Escape') closeModal(); });

  // ============ BÚSQUEDA GLOBAL ============
  $('#globalSearch').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const activeView = $$('.view').find(v => !v.hidden);
    if (!activeView) return;
    $$('tbody tr', activeView).forEach(tr => {
      tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });

  // ============ INIT ============
  const loaders = { dashboard:loadDashboard, eventos:loadEventos, reservas:loadReservas, usuarios:loadUsuarios, pqr:loadPqr };
  loadDashboard();
})();
