/* ===== Página de eventos: data + filtros ===== */
// Mostrar toast si viene redirigido desde inscripcion con mensaje
(function() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('msg') === 'ya_inscrito') {
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => showToast('Ya estás inscrito en este evento', 'error'), 300);
      // Limpiar el param de la URL sin recargar
      history.replaceState(null, '', window.location.pathname);
    });
  }
})();
const EVENTOS = [
  { id:1, titulo:'Gran Fondo de Los Andes', cat:'ruta', categoria:'Ruta',
    img:'img/event1.jpg', fecha:'15 Jun 2026', lugar:'Bogotá, Colombia',
    desc:'Recorrido de alta montaña con vistas espectaculares para ciclistas de élite y aficionados.',
    distancia:'120 km', desnivel:'2 800 m', cupos:'500', precio:75000 },
  { id:2, titulo:'Copa Nacional MTB Downhill', cat:'mtb', categoria:'MTB',
    img:'img/event2.jpg', fecha:'22 Jul 2026', lugar:'Manizales, Colombia',
    desc:'Descenso técnico y rápido en pista cerrada. Solo aptos para riders avanzados.',
    distancia:'4 km', desnivel:'-650 m', cupos:'120', precio:90000 },
  { id:3, titulo:'Velódromo Open Pista', cat:'pista', categoria:'Pista',
    img:'img/event3.jpg', fecha:'10 Ago 2026', lugar:'Cali, Colombia',
    desc:'Competencia de pista en velódromo cubierto: scratch, persecución y keirin.',
    distancia:'250 m/vuelta', desnivel:'—', cupos:'80', precio:60000 },
  { id:4, titulo:'Gravel Adventure Boyacá', cat:'gravel', categoria:'Gravel',
    img:'img/event4.jpg', fecha:'02 Sep 2026', lugar:'Tunja, Boyacá',
    desc:'Aventura en gravilla cruzando paisajes andinos. Apta para todos los niveles.',
    distancia:'85 km', desnivel:'1 500 m', cupos:'300', precio:65000 },
  { id:5, titulo:'BMX Race Championship', cat:'bmx', categoria:'BMX',
    img:'img/event5.jpg', fecha:'20 Sep 2026', lugar:'Medellín, Colombia',
    desc:'Adrenalina pura en pista BMX con saltos y peraltes para todas las categorías.',
    distancia:'400 m', desnivel:'—', cupos:'200', precio:55000 },
  { id:6, titulo:'Ruta Solidaria Costa Caribe', cat:'ruta', categoria:'Ruta',
    img:'img/event6.jpg', fecha:'15 Oct 2026', lugar:'Cartagena, Colombia',
    desc:'Pedaleada benéfica al lado del mar. Lo recaudado apoya a fundaciones locales.',
    distancia:'60 km', desnivel:'350 m', cupos:'1000', precio:45000 },
];

const list = document.getElementById('events-list');
const filterButtons = document.querySelectorAll('.filter-btn');
let activeFilter = 'all';

function fmt(n){ return n.toLocaleString('es-CO'); }

async function isAlreadyInscrito(id) {
  try {
    const res = await fetch('php/get_inscripciones.php', { credentials: 'include' });
    const data = await res.json();
    if (!data.ok || !Array.isArray(data.inscripciones)) return false;
    return data.inscripciones.some(i =>
      Number(i.evento_id) === Number(id) &&
      i.estado !== 'cancelado' &&
      i.estado !== 'rechazado'
    );
  } catch (err) {
    console.error('Error verificando inscripción:', err);
    return false; // si falla la consulta, no bloqueamos al usuario
  }
}

function render() {
  if (!list) return;
  const filtered = activeFilter === 'all' ? EVENTOS : EVENTOS.filter(e => e.cat === activeFilter);
  if (!filtered.length) {
    list.innerHTML = '<div class="empty-state">No hay eventos en esta categoría.</div>';
    return;
  }
  list.innerHTML = filtered.map(e => `
    <article class="event-item">
      <div class="img" style="background-image:url('${e.img}')" role="img" aria-label="${e.titulo}">
        <span class="badge cat-${e.cat}">${e.categoria}</span>
      </div>
      <div class="body">
        <h2>${e.titulo}</h2>
        <div class="event-meta">
          <span aria-label="Fecha">📅 ${e.fecha}</span>
          <span aria-label="Lugar">📍 ${e.lugar}</span>
        </div>
        <p class="desc">${e.desc}</p>
        <div class="event-stats">
          <div><strong>${e.distancia}</strong><small>Distancia</small></div>
          <div><strong>${e.desnivel}</strong><small>Desnivel</small></div>
          <div><strong>${e.cupos}</strong><small>Cupos</small></div>
        </div>
        <div class="actions">
          <span class="price-tag">$${fmt(e.precio)} <small>COP</small></span>
          <button class="btn btn-primary" data-buy="${e.id}">Inscribirme</button>
        </div>
      </div>
    </article>
  `).join('');

  // Asignar handler de inscripción
  list.querySelectorAll('[data-buy]').forEach(btn => {
    btn.addEventListener('click', () => handleBuy(parseInt(btn.dataset.buy, 10)));
  });
}

async function handleBuy(id) {
  const user = JSON.parse(localStorage.getItem('cicloUser') || 'null');
  if (!user) {
    showToast('Debes iniciar sesión para inscribirte', 'error');
    setTimeout(() => location.href = 'login.html', 1200);
    return;
  }
  if (await isAlreadyInscrito(id)) {
    showToast('Ya estás inscrito en este evento', 'error');
    setTimeout(() => location.href = `index.html?evento=${id}`, 1200);
    return;
  }
  location.href = `inscripcion.html?id=${id}`;
}

filterButtons.forEach(b => {
  b.addEventListener('click', () => {
    filterButtons.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    activeFilter = b.dataset.filter;
    render();
  });
});

render();