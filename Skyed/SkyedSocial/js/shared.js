// ── DATOS ──────────────────────────────────────────────
const events = [
  {id:1,cat:'bodas',title:'Boda en jardín',emoji:'💐',image:'img/boda_jardin.png',bg:'img-p-wedding',guests:120,hours:8,price:'$18.500.000',tag:'BODA',desc:'Ceremonia al aire libre con arco floral, banquete de 5 tiempos y pista de baile iluminada.',includes:['Arco floral natural','Banquete 5 tiempos','DJ toda la noche','Fotografía profesional','Decoración mesas','Iluminación ambiental','Coordinador en sitio','Pastel nupcial']},
  {id:2,cat:'bodas',title:'Boda de salón',emoji:'🕊️',image:'img/boda_salon.png',bg:'img-p-wedding',guests:200,hours:10,price:'$22.000.000',tag:'BODA',desc:'Salón premium con chandeliers de cristal, decoración floral elaborada y catering de autor.',includes:['Salón premium','Chandeliers de cristal','Catering de autor','Orquesta en vivo','Video 4K','Fotos y álbum','Fuegos de pista','Open bar premium']},
  {id:3,cat:'quinceaneras',title:'XV años de gala',emoji:'👑',image:'img/xv_gala.png',bg:'img-p-quince',guests:150,hours:8,price:'$14.500.000',tag:'QUINCEAÑERA',desc:'Vals coreografiado, decoración temática de ensueño, fotografía y video profesional.',includes:['Vals coreografiado','Decoración temática','Foto y video','DJ profesional','Mesa de dulces','Corona y cetro','Trono decorado','Show de luces']},
  {id:4,cat:'quinceaneras',title:'XV Princesa encantada',emoji:'🌟',image:'img/xv_princesa.png',bg:'img-p-quince',guests:100,hours:6,price:'$11.200.000',tag:'QUINCEAÑERA',desc:'Tema de cuento de hadas con carruaje, decoración etérea y experiencia mágica de principio a fin.',includes:['Carruaje decorativo','Decoración etérea','DJ y música','Mesa de fotos','Animación personalizada','Recordatorios','Torta temática','Orquestación completa']},
  {id:5,cat:'cumpleanios',title:'Cumpleaños temático',emoji:'🎂',image:'img/cumpleaños.png',bg:'img-p-birthday',guests:80,hours:5,price:'$6.800.000',tag:'CUMPLEAÑOS',desc:'Decoración a medida, animación temática, catering y mesa de postres de ensueño.',includes:['Decoración temática','Mesa de postres','Catering completo','Animador profesional','Juegos y actividades','DJ o playlist','Torta personalizada','Recordatorios']},
  {id:6,cat:'corporativos',title:'Evento corporativo',emoji:'🏢',image:'img/evento_corporativo.png',bg:'img-p-corporate',guests:200,hours:6,price:'$16.000.000',tag:'CORPORATIVO',desc:'Lanzamientos de producto, convenciones y cenas de gala con producción audiovisual completa.',includes:['Producción audiovisual','Pantallas y sonido','Catering ejecutivo','Ambientación corporativa','Fotografía del evento','Streaming en vivo','Coordinación total','Soporte técnico']},
  {id:7,cat:'baby',title:'Baby shower de lujo',emoji:'🍼',image:'img/baby_shower.png',bg:'img-p-baby',guests:60,hours:4,price:'$5.200.000',tag:'BABY SHOWER',desc:'Celebración íntima con decoración pastel, actividades especiales y mesa de dulces elaborada.',includes:['Decoración pastel','Mesa de dulces','Juegos temáticos','Catering ligero','Souvenirs para invitadas','Torta de revelación','Sesión fotográfica','Música ambiental']},
  {id:8,cat:'bodas',title:'Boda de destino',emoji:'🌺',image:'img/boda_destino.png',bg:'img-p-wedding',guests:80,hours:12,price:'$32.000.000',tag:'BODA',desc:'Tu boda ideal en haciendas, playas o montañas de Colombia. Logística completa de principio a fin.',includes:['Venue exclusivo','Alojamiento coordinado','Ceremonia y recepción','Catering gourmet','Fotografía y video','Transporte invitados','Experiencias locales','Coordinación total']},
  {id:9,cat:'cumpleanios',title:'Fiesta de grado',emoji:'🎓',image:'img/prom.png',bg:'img-p-birthday',guests:120,hours:6,price:'$9.400.000',tag:'CUMPLEAÑOS',desc:'Celebración de logros académicos con ambiente de gala, música en vivo y producción de primer nivel.',includes:['Decoración universitaria','DJ profesional','Catering completo','Barra de bebidas','Zona de fotos','Animación','Torta personalizada','Video del evento']},
];

const testimonials = [
  {name:'María R.',initials:'MR',role:'Boda · Bogotá',event:'Boda en jardín',text:'Hicieron de mi boda el día más mágico de mi vida. Cada detalle estuvo cuidado al máximo — desde las flores hasta el último segundo de la noche. No podría haber elegido mejor equipo.',stars:5,featured:true},
  {name:'Valentina S.',initials:'VS',role:'Quinceañera · Medellín',event:'XV años de gala',text:'Mis XV fueron un sueño. La coreografía, las luces, la comida... todo perfecto. Mis amigas siguen hablando de esa noche. SkyedSocial superó todo lo que imaginé.',stars:5,featured:false},
  {name:'Jorge L.',initials:'JL',role:'Cumpleaños · Cali',event:'Cumpleaños 50',text:'Organizaron el cumpleaños 50 de mi esposa y nos sorprendieron con cada detalle. El salón quedó espectacular y los invitados quedaron impresionados con la producción.',stars:5,featured:false},
  {name:'Carolina M.',initials:'CM',role:'Corporativo · Bogotá',event:'Lanzamiento de producto',text:'El evento de lanzamiento fue impecable. Producción audiovisual de primer nivel, catering delicioso y coordinación perfecta. Definitivamente los contrataré para el próximo año.',stars:5,featured:false},
  {name:'Andrés P.',initials:'AP',role:'Boda · Cartagena',event:'Boda de destino',text:'Nuestra boda en Cartagena fue exactamente lo que soñamos. Logística sin contratiempos, decoración increíble y un equipo que hizo que todo fluyera. Eternamente agradecidos.',stars:5,featured:true},
  {name:'Isabella T.',initials:'IT',role:'Baby shower · Bogotá',event:'Baby shower',text:'Mi baby shower estuvo hermoso. La decoración fue delicada y elegante, los juegos divirtieron a todas las invitadas y la mesa de dulces era simplemente preciosa.',stars:5,featured:false},
];

const venues = [
  {name:'Hacienda El Paraíso',location:'Via Choachí, Cundinamarca',capacity:'hasta 300',emoji:'🏡',image:'img/hacienda_paraiso.png',bg:'img-p-wedding',tags:['Jardines','Piscina','Cabaña'],price:'$4.500.000',per:'arriendo / noche'},
  {name:'Salón Cenit',location:'Chapinero Alto, Bogotá',capacity:'hasta 250',emoji:'✨',image:'img/salon_cenit.png',bg:'img-p-corporate',tags:['Vista 360°','Terraza','AV incluido'],price:'$3.200.000',per:'arriendo / evento'},
  {name:'Club de Jardines Rosaleda',location:'La Calera, Cundinamarca',capacity:'hasta 180',emoji:'🌿',image:'img/jardines.png',bg:'img-p-baby',tags:['Jardines','Íntimo','Exclusivo'],price:'$2.800.000',per:'arriendo / evento'},
  {name:'Gran Salón Imperial',location:'Usaquén, Bogotá',capacity:'hasta 400',emoji:'🏛️',image:'img/salon_imperial.png',bg:'img-p-quince',tags:['Chandeliers','Catering propio','Parking'],price:'$5.800.000',per:'arriendo / evento'},
  {name:'Finca La Esperanza',location:'Sopó, Cundinamarca',capacity:'hasta 150',emoji:'🌄',image:'img/finca_esperanza.png',bg:'img-p-birthday',tags:['Montaña','Aire libre','Alojamiento'],price:'$2.200.000',per:'arriendo / evento'},
  {name:'Terraza Sky Garden',location:'Zona Rosa, Bogotá',capacity:'hasta 120',emoji:'🌆',image:'img/sky_garden.png',bg:'img-p-reception',tags:['Rooftop','Vista ciudad','DJ booth'],price:'$3.500.000',per:'arriendo / evento'},
];

const galleryItems = [
  {emoji:'💐',image:'img/boda_cesped.png',bg:'img-p-wedding',title:'Boda en jardín',sub:'150 invitados'},
  {emoji:'👑',image:'img/xv_dorados.png',bg:'img-p-quince',title:'XV años dorados',sub:'200 invitados'},
  {emoji:'🎂',image:'img/cumple_30.png',bg:'img-p-birthday',title:'Cumpleaños 30',sub:'80 invitados'},
  {emoji:'🏢',image:'img/gala_coorporativa.png',bg:'img-p-corporate',title:'Gala corporativa',sub:'300 invitados'},
  {emoji:'🍼',image:'img/baby.png',bg:'img-p-baby',title:'Baby shower',sub:'60 invitados'},
  {emoji:'🌺',image:'img/boda_playa.png',bg:'img-p-reception',title:'Boda de destino',sub:'90 invitados'},
  {emoji:'💐',image:'img/salon.png',bg:'img-p-wedding',title:'Boda de salón',sub:'200 invitados'},
  {emoji:'🎓',image:'img/fiesta_grado.png',bg:'img-p-birthday',title:'Fiesta de grado',sub:'120 invitados'},
];

// ── FUNCIONES COMPARTIDAS ──────────────────────────────

function renderMedia(item, size='4rem') {
  const src = item.image || item.img || '';
  const label = item.title || item.name || 'Imagen';
  const fallback = item.emoji || item.icon || '';

  if (src) {
    return `
      <div class="img-placeholder" style="width:100%;height:100%;overflow:hidden">
        <img src="${src}" alt="${label}" style="width:100%;height:100%;object-fit:cover;display:block">
      </div>`;
  }

  return `<div class="img-placeholder" style="width:100%;height:100%;font-size:${size}">${fallback}</div>`;
}

// NAV scroll
window.addEventListener('scroll',()=>{
  const nav=document.getElementById('navbar');
  const st=document.getElementById('scrollTop');
  if(nav){window.scrollY>60?nav.classList.add('scrolled'):nav.classList.remove('scrolled')}
  if(st){window.scrollY>400?st.classList.add('visible'):st.classList.remove('visible')}
});

function toggleNav(){
  document.getElementById('navLinks').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('active');
}
function closeNav(){
  document.getElementById('navLinks').classList.remove('open');
}

// Reveal observer
const observer=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')});
},{threshold:0.12});

function initReveal(){
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}

// Toast
function showToast(msg,icon='✓'){
  const t=document.getElementById('toast');
  document.getElementById('toastMsg').textContent=msg;
  document.getElementById('toastIcon').textContent=icon;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),4000);
}

// Ir a contacto
function openBooking(){
  window.location.href='contacto.html';
}

// Modal (eventos)
function openModal(id){
  const ev=events.find(e=>e.id===id);
  if(!ev)return;
  document.getElementById('modalImg').innerHTML=`${renderMedia(ev, '8rem')}`;
  document.getElementById('modalBody').innerHTML=`
    <span class="modal-tag">${ev.tag}</span>
    <div class="modal-title">${ev.title}</div>
    <div class="modal-meta">
      <div class="modal-meta-item"><strong>${ev.guests}</strong><span>Invitados</span></div>
      <div class="modal-meta-item"><strong>${ev.hours}h</strong><span>Duración</span></div>
      <div class="modal-meta-item"><strong>${ev.price}</strong><span>Desde</span></div>
    </div>
    <p style="font-size:.9rem;color:var(--text-mid);line-height:1.7;margin-bottom:1.5rem">${ev.desc}</p>
    <div class="modal-includes">
      <h4>¿Qué incluye?</h4>
      <ul>${ev.includes.map(i=>`<li>${i}</li>`).join('')}</ul>
    </div>
    <div class="modal-price-row">
      <div><div class="modal-price">${ev.price}</div><div class="modal-price-note">Precio base · Personalizable</div></div>
      <button class="btn-primary" onclick="closeModalDirect();openBooking()" style="font-size:.9rem">Cotizar ahora →</button>
    </div>`;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeModal(e){if(e.target===document.getElementById('modalOverlay'))closeModalDirect();}
function closeModalDirect(){
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow='';
}

// Partículas
function createParticles(){
  const c=document.getElementById('particles');
  if(!c)return;
  for(let i=0;i<30;i++){
    const p=document.createElement('div');
    p.className='particle';
    const size=Math.random()*6+2;
    p.style.cssText=`width:${size}px;height:${size}px;left:${Math.random()*100}%;background:${Math.random()>.5?'rgba(201,168,76,0.6)':'rgba(245,230,239,0.4)'};animation-duration:${Math.random()*15+10}s;animation-delay:${Math.random()*10}s`;
    c.appendChild(p);
  }
}

// Galería
function renderGallery(){
  const track=document.getElementById('galleryTrack');
  if(!track)return;
  const items=[...galleryItems,...galleryItems];
  items.forEach(g=>{
    const d=document.createElement('div');
    d.className='gallery-item';
    d.innerHTML=`${renderMedia(g, '5rem')}
      <div class="gallery-item-overlay"><div><div class="gallery-item-title">${g.title}</div><div class="gallery-item-sub">${g.sub}</div></div></div>`;
    track.appendChild(d);
  });
}

// Testimonios
function renderTestimonials(){
  const grid=document.getElementById('testimonialsGrid');
  if(!grid)return;
  testimonials.forEach(t=>{
    const card=document.createElement('div');
    card.className='testimonial-card reveal'+(t.featured?' featured':'');
    card.innerHTML=`
      <div class="t-event-tag">${t.event}</div>
      <div class="t-stars">${'★'.repeat(t.stars)}</div>
      <p class="t-text">"${t.text}"</p>
      <div class="t-author">
        <div class="t-avatar">${t.initials}</div>
        <div><div class="t-name">${t.name}</div><div class="t-role">${t.role}</div></div>
      </div>`;
    grid.appendChild(card);
    setTimeout(()=>observer.observe(card),50);
  });
}

// Venues
function renderVenues(){
  const grid=document.getElementById('venueGrid');
  if(!grid)return;
  venues.forEach(v=>{
    const card=document.createElement('div');
    card.className='venue-card reveal';
    card.innerHTML=`
      <div class="venue-img">
        ${renderMedia(v, '3.5rem')}
        <div class="venue-capacity">👥 ${v.capacity} personas</div>
      </div>
      <div class="venue-body">
        <div class="venue-name">${v.name}</div>
        <div class="venue-location">📍 ${v.location}</div>
        <div class="venue-tags">${v.tags.map(t=>`<span class="venue-tag">${t}</span>`).join('')}</div>
        <div class="venue-price-row">
          <div class="venue-price">${v.price} <span>${v.per}</span></div>
          <button class="btn-sm-outline" onclick="openBooking()" style="white-space:nowrap">Reservar</button>
        </div>
      </div>`;
    grid.appendChild(card);
    setTimeout(()=>observer.observe(card),50);
  });
}

// Eventos (grid con filtro)
function renderEvents(filter='todos'){
  const grid=document.getElementById('eventsGrid');
  if(!grid)return;
  grid.innerHTML='';
  const filtered=filter==='todos'?events:events.filter(e=>e.cat===filter);
  filtered.forEach(ev=>{
    const card=document.createElement('div');
    card.className='event-card reveal';
    card.innerHTML=`
      <div class="event-card-img">
        ${renderMedia(ev, '5rem')}
        <div class="event-price">${ev.price}</div>
        <div class="event-tag">${ev.tag}</div>
      </div>
      <div class="event-card-body">
        <div class="event-card-title">${ev.title}</div>
        <div class="event-card-meta">
          <span class="event-meta-item">👥 ${ev.guests} invitados</span>
          <span class="event-meta-item">⏱ ${ev.hours} horas</span>
        </div>
        <p class="event-card-desc">${ev.desc}</p>
        <div class="event-card-footer">
          <button class="btn-sm-primary" onclick="openModal(${ev.id})">Ver detalles</button>
          <button class="btn-sm-outline" onclick="openBooking()">Cotizar</button>
        </div>
      </div>`;
    grid.appendChild(card);
    setTimeout(()=>observer.observe(card),50);
  });
}

function filterEvents(cat,btn){
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderEvents(cat);
}

function loadMore(){showToast('Cargando más eventos...','🎉');}

// Formulario contacto
function submitForm(){
  const n=document.getElementById('fname').value.trim();
  const e=document.getElementById('femail').value.trim();
  const t=document.getElementById('ftype').value;
  if(!n||!e||!t){showToast('Por favor completa los campos requeridos','⚠️');return;}
  showToast('¡Solicitud enviada! Te contactamos en 24h 🎉','✦');
  document.querySelectorAll('#contactForm input,#contactForm select,#contactForm textarea').forEach(el=>el.value='');
}

