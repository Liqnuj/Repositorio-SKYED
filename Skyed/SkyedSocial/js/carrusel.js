const slides = [
  {
    badge: '✦ Creamos momentos eternos',
    title: 'Tu evento, <em>nuestra</em><br>obra maestra',
    sub: 'Bodas de ensueño, quinceañeras que emocionan, cumpleaños que sorprenden y corporativos que inspiran.',
    btn1: { text: '✦ Explorar eventos', href: 'eventos.html' },
    btn2: { text: 'Solicitar cotización', href: 'contacto.html' }
  },
  {
    badge: '💍 Bodas que enamoran',
    title: 'El día más <em>especial</em><br>de tu vida',
    sub: 'Planificamos cada detalle de tu boda para que solo tengas que preocuparte por disfrutarlo.',
    btn1: { text: '✦ Ver paquetes boda', href: 'eventos.html' },
    btn2: { text: 'Agenda una cita', href: 'contacto.html' }
  },
  {
    badge: '🌹 Quinceañeras & fiestas',
    title: 'Celebra con <em>elegancia</em><br>y emoción',
    sub: 'Quinceañeras, cumpleaños y recepciones diseñadas para impresionar a cada invitado.',
    btn1: { text: '✦ Ver celebraciones', href: 'eventos.html' },
    btn2: { text: 'Solicitar cotización', href: 'contacto.html' }
  },
  {
    badge: '🏢 Eventos corporativos',
    title: 'Reuniones que <em>inspiran</em><br>y conectan',
    sub: 'Conferencias, lanzamientos y team buildings con producción de nivel premium.',
    btn1: { text: '✦ Ver corporativos', href: 'eventos.html' },
    btn2: { text: 'Hablar con un asesor', href: 'contacto.html' }
  }
];

let currentSlide = 0;
let carouselTimer;

function updateCarousel(index) {
  const slideEls = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const content = document.querySelector('.hero-content');
  if(!content) return;
  slideEls.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  slideEls[index].classList.add('active');
  dots[index].classList.add('active');
  content.style.opacity = '0';
  content.style.transform = 'translateY(16px)';
  setTimeout(() => {
    const s = slides[index];
    document.getElementById('heroBadge').innerHTML = s.badge;
    document.getElementById('heroTitle').innerHTML = s.title;
    document.getElementById('heroSub').textContent = s.sub;
    document.getElementById('heroBtn1').textContent = s.btn1.text;
    document.getElementById('heroBtn1').href = s.btn1.href;
    document.getElementById('heroBtn2').textContent = s.btn2.text;
    document.getElementById('heroBtn2').href = s.btn2.href;
    content.style.transition = 'opacity .6s ease, transform .6s ease';
    content.style.opacity = '1';
    content.style.transform = 'translateY(0)';
  }, 300);
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel(currentSlide);
  resetTimer();
}

function carouselNext() {
  currentSlide = (currentSlide + 1) % slides.length;
  updateCarousel(currentSlide);
  resetTimer();
}

function carouselPrev() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  updateCarousel(currentSlide);
  resetTimer();
}

function resetTimer() {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(carouselNext, 5000);
}

carouselTimer = setInterval(carouselNext, 5000);