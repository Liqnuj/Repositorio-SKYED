/* =====================================================
   db.js —
   ===================================================== */
(function(){
  const K = {
    Usuario:'sky_Usuario', Kit:'sky_Kit', Evento:'sky_Evento',
    Inscripcion:'sky_Inscripcion', CatComp:'sky_CategoriaCompetencia',
    Resultado:'sky_Resultado', Patrocinador:'sky_Patrocinador',
    EventoPatro:'sky_EventoPatrocinador', RutaEvento:'sky_RutaEvento',
    PuntoHidra:'sky_PuntoHidratacion', Pago:'sky_Pago',
    EntregaKit:'sky_EntregaKit', Notificacion:'sky_Notificacion',
    QR:'sky_QREntrada', Historial:'sky_HistorialParticipacion',
    Copia:'sky_CopiaSeguridad', Seq:'sky_Seq'
  };
  const get = k => JSON.parse(localStorage.getItem(k) || '[]');
  const set = (k,v) => localStorage.setItem(k, JSON.stringify(v));
  const seq = (name)=>{ const s=JSON.parse(localStorage.getItem(K.Seq)||'{}'); s[name]=(s[name]||0)+1; localStorage.setItem(K.Seq,JSON.stringify(s)); return s[name]; };

  function seed(){
    if(localStorage.getItem('sky_seeded')) return;
    // Kits
    set(K.Kit,[
      {id_k:1,nombre_k:'Kit Gran Fondo Andes',stock_k:480,fecha_entrega_k:'2026-06-14',lugar_entrega_k:'Hotel Tequendama - Bogotá',contenido_k:'Camiseta, dorsal, chip, hidratación, kit lavable',talla_camiseta_k:'M',numero_dorsal_k:1001},
      {id_k:2,nombre_k:'Kit MTB Manizales',stock_k:120,fecha_entrega_k:'2026-07-21',lugar_entrega_k:'Coliseo Mayor - Manizales',contenido_k:'Camiseta MTB, dorsal, chip, gel energético',talla_camiseta_k:'L',numero_dorsal_k:2001},
      {id_k:3,nombre_k:'Kit Pista Cali',stock_k:80,fecha_entrega_k:'2026-08-09',lugar_entrega_k:'Velódromo Alcides Nieto',contenido_k:'Camiseta técnica, dorsal, chip',talla_camiseta_k:'S',numero_dorsal_k:3001}
    ]);
    // Eventos (con FK a Kit)
    set(K.Evento,[
      {id_e:1,nombre_e:'Gran Fondo de Los Andes',categoria_e:'ruta',fecha_e:'2026-06-15',hora_e:'06:00',ubicacion_e:'Bogotá, Colombia',descripcion_e:'Recorrido de alta montaña con vistas espectaculares para ciclistas de élite y aficionados.',distancia_total_e:'120 km',distancia_intermedia_e:'80 km',distancia_avanzada_e:'120 km',desnivel_e:'2800 m',requisitos_e:'Mayor de edad, seguro vigente, bicicleta de ruta',img_hero_e:'img/event1.jpg',img_ruta_e:'img/event1.jpg',imagen_e:'img/event1.jpg',cupos_totales_e:500,cupos_disponibles_e:213,precio_e:75000,estado_e:'abierto',estado_entrega_k_e:'pendiente',id_k:1,doc_u:null},
      {id_e:2,nombre_e:'Copa Nacional MTB Downhill',categoria_e:'mtb',fecha_e:'2026-07-22',hora_e:'09:00',ubicacion_e:'Manizales, Colombia',descripcion_e:'Descenso técnico y rápido en pista cerrada. Solo aptos para riders avanzados.',distancia_total_e:'4 km',distancia_intermedia_e:'',distancia_avanzada_e:'4 km',desnivel_e:'-650 m',requisitos_e:'Casco integral, protecciones, experiencia DH',img_hero_e:'img/event2.jpg',img_ruta_e:'img/event2.jpg',imagen_e:'img/event2.jpg',cupos_totales_e:120,cupos_disponibles_e:34,precio_e:90000,estado_e:'abierto',estado_entrega_k_e:'pendiente',id_k:2,doc_u:null},
      {id_e:3,nombre_e:'Velódromo Open Pista',categoria_e:'pista',fecha_e:'2026-08-10',hora_e:'14:00',ubicacion_e:'Cali, Colombia',descripcion_e:'Competencia de pista en velódromo cubierto: scratch, persecución y keirin.',distancia_total_e:'250 m/vuelta',distancia_intermedia_e:'',distancia_avanzada_e:'',desnivel_e:'—',requisitos_e:'Licencia federativa, bicicleta de pista',img_hero_e:'img/event3.jpg',img_ruta_e:'img/event3.jpg',imagen_e:'img/event3.jpg',cupos_totales_e:80,cupos_disponibles_e:12,precio_e:60000,estado_e:'abierto',estado_entrega_k_e:'pendiente',id_k:3,doc_u:null}
    ]);
    // Categorías por evento
    set(K.CatComp,[
      {id_cc:1,nombre_cc:'Élite Masculino',edad_minima_cc:23,edad_maxima_cc:39,genero_cc:'masculino',distancia_cc:'120 km',descripcion_cc:'Categoría profesional masculina',id_e:1},
      {id_cc:2,nombre_cc:'Élite Femenino',edad_minima_cc:23,edad_maxima_cc:39,genero_cc:'femenino',distancia_cc:'120 km',descripcion_cc:'Categoría profesional femenina',id_e:1},
      {id_cc:3,nombre_cc:'Master A',edad_minima_cc:40,edad_maxima_cc:49,genero_cc:'mixto',distancia_cc:'80 km',descripcion_cc:'Categoría master mixta',id_e:1},
      {id_cc:4,nombre_cc:'Open DH',edad_minima_cc:18,edad_maxima_cc:60,genero_cc:'mixto',distancia_cc:'4 km',descripcion_cc:'Descenso abierto',id_e:2}
    ]);
    // Patrocinadores
    set(K.Patrocinador,[
      {id_p:1,nombre_p:'Specialized Colombia',logo_p:'',telefono_p:'6017456789',correo_p:'co@specialized.com',pagina_web_p:'specialized.com',tipo_p:'Oficial',aporte_p:25000000},
      {id_p:2,nombre_p:'Gatorade',logo_p:'',telefono_p:'6018002233',correo_p:'sponsors@gatorade.com',pagina_web_p:'gatorade.com',tipo_p:'Hidratación',aporte_p:12000000},
      {id_p:3,nombre_p:'Bavaria',logo_p:'',telefono_p:'6017771234',correo_p:'eventos@bavaria.co',pagina_web_p:'bavaria.co',tipo_p:'Bronce',aporte_p:5000000}
    ]);
    set(K.EventoPatro,[{id_e:1,id_p:1},{id_e:1,id_p:2},{id_e:1,id_p:3},{id_e:2,id_p:1}]);
    set(K.RutaEvento,[
      {id_re:1,nombre_re:'Ruta principal Andes',distancia_re:'120 km',desnivel_re:'2800 m',descripcion_re:'Salida Bogotá → Patios → La Calera → Sopó → regreso',archivo_gpx_re:'',mapa_imagen_re:'img/event1.jpg',id_e:1},
      {id_re:2,nombre_re:'Ruta intermedia',distancia_re:'80 km',desnivel_re:'1900 m',descripcion_re:'Salida Bogotá → Sopó (ida y vuelta)',archivo_gpx_re:'',mapa_imagen_re:'',id_e:1}
    ]);
    set(K.PuntoHidra,[
      {id_ph:1,nombre_ph:'PH1 - Patios',tipo_ph:'hidratacion',kilometro_ph:'25',latitud_ph:4.7110,longitud_ph:-74.0721,descripcion_ph:'Agua, gel, fruta',id_e:1},
      {id_ph:2,nombre_ph:'Control La Calera',tipo_ph:'control',kilometro_ph:'45',latitud_ph:4.7220,longitud_ph:-73.9700,descripcion_ph:'Control de paso',id_e:1},
      {id_ph:3,nombre_ph:'Auxilios Sopó',tipo_ph:'primeros_auxilios',kilometro_ph:'70',latitud_ph:4.9100,longitud_ph:-73.9400,descripcion_ph:'Atención médica',id_e:1},
      {id_ph:4,nombre_ph:'Meta',tipo_ph:'meta',kilometro_ph:'120',latitud_ph:4.6097,longitud_ph:-74.0817,descripcion_ph:'Línea de meta',id_e:1}
    ]);
    // Mínimos para arranque
    set(K.Inscripcion,[]);set(K.Pago,[]);set(K.Resultado,[]);set(K.EntregaKit,[]);
    set(K.Notificacion,[]);set(K.QR,[]);set(K.Historial,[]);set(K.Copia,[]);
    localStorage.setItem(K.Seq,JSON.stringify({Inscripcion:0,Pago:0,QR:0,Notif:0,Hist:0,EK:0,Res:0,Copia:0,Kit:3,Evento:3,Cat:4,Patro:3,Ruta:2,PH:4}));
    localStorage.setItem('sky_seeded','1');
  }
  seed();

  window.SKY = {
    K, get, set, seq,
    sesion(){ try{ return JSON.parse(localStorage.getItem('cicloUser')||'null'); }catch{ return null; } },
    usuario(){ const s=this.sesion(); if(!s) return null; const u=this.get(K.Usuario).find(x=>x.correo_u===s.correo_u||x.correo_u===s.email); return u||null; },
    evento(id){ return this.get(K.Evento).find(e=>e.id_e==id); },
    kit(id){ return this.get(K.Kit).find(k=>k.id_k==id); },
    inscripcionesUsuario(doc){ return this.get(K.Inscripcion).filter(i=>i.doc_u==doc); },
    notificar(doc_u,titulo,mensaje,tipo='general'){
      const n=this.get(K.Notificacion);
      n.unshift({id_n:this.seq('Notif'),titulo_n:titulo,mensaje_n:mensaje,fecha_n:new Date().toISOString(),leida_n:false,tipo_n:tipo,doc_u});
      this.set(K.Notificacion,n);
    },
    fmtCOP(n){ return '$'+Number(n||0).toLocaleString('es-CO'); },
    fmtFecha(d){ if(!d) return '—'; const x=new Date(d); return x.toLocaleDateString('es-CO',{day:'2-digit',month:'short',year:'numeric'}); }
  };
})();
