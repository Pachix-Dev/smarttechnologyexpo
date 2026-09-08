// src/data/workshops.js
// Datos del catálogo de TALLERES (Smart Skills).
// Temporal: se muestra desde aquí hasta que exista la API real de talleres.
// El CUPO en vivo NO se toma de aquí, viene de la base de datos.
// IMPORTANTE: `workshopId` debe coincidir con el `workshop_id` de la tabla
// `workshops` en la base de datos, para que la barra de cupo se conecte bien.
//
// AJUSTE STE 2026: los talleres de PRUEBA quedan OCULTOS (comentados, no borrados).
// Mientras el array esté vacío, el catálogo no muestra tarjetas y el <select> del
// formulario solo tendrá el placeholder. Para volver a mostrarlos (o cuando lleguen
// los talleres reales), descomenta / reemplaza el bloque de abajo.

const workshops = [
 
  {
    workshopId: 1,
    name: 'SEGURIDAD EN MAQUINARIA: ANÁLISIS Y MITIGACIÓN DE RIESGOS',
    name_en: 'EMACHINE SAFETY: RISK ANALYSIS AND MITIGATION',
    company: 'Euchner',
    nivel: 'INTERMEDIO',
    instructor: [
      {
        name: 'Timothy Castillejos',
        role: 'Gerente Nacional',
        role_en: 'National Manager',
      }
    ],
    duracion: '4 horas',
    duracion_en: '4 hours',
    dia: "18 Noviembre",    
    dia_en: "November 18",
    horario: '11:00 – 15:00',
    sala: 'Smart Skills Stage',
    cupo: 50,
    profile_es: ['Ingenieros de proyecto', 'Personal de seguridad e higiene', 'Integradores y fabricantes de máquinas'],
    profile_en: ['Project engineers', 'Health and safety personnel', 'Machine integrators and manufacturers'],
  },
  {
    workshopId: 2,
    name: 'CONTROL BASADO EN PC: LA PLATAFORMA IDEAL PARA LA MANUFACTURA INTELIGENTE',
    name_en: 'PC-BASED CONTROL: THE IDEAL PLATFORM FOR SMART MANUFACTURING',
    company: 'Beckhoff',
    nivel: 'INTERMEDIO',
    instructor: [
      {
        name: 'Juan Daniel Rodríguez',
        role: 'Ingeniero de Aplicaciones',
        role_en: 'Applications Engineer',
      },
      {
        name: 'Rosario Ramírez',
        role: 'Desarrollador de Negocios',
        role_en: 'Business Developer',
      }
    ],
    duracion: '4 horas',
    duracion_en: '4 hours',
    dia: "19 Noviembre",    
    dia_en: "November 19",
    horario: '11:00 – 15:00',
    sala: 'Smart Skills Stage',
    cupo: 50,
    profile_es: ['Project managers', 'Ingenieros de automatización y control', 'Gerentes de ingeniería con conocimientos básicos de automatización industrial'],
    profile_en: ['Project managers', 'Automation and control engineers', 'Engineering managers with basic knowledge of industrial automation'],
  }
  // {
  //   workshopId: 3,
  //   name: 'Ciberseguridad industrial: fundamentos',
  //   name_en: 'Industrial cybersecurity: fundamentals',
  //   nivel: 'BÁSICO',
  //   instructor: 'Dr. Javier Soto',
  //   instructorRole: 'Consultor en seguridad OT',
  //   instructorRole_en: 'OT security consultant',
  //   instructorBio: 'Doctor en robótica industrial con investigación enfocada en sistemas autónomos aplicados a manufactura.',
  //   instructorBio_en: 'PhD in industrial robotics with research focused on autonomous systems applied to manufacturing.',
  //   duracion: '3 horas',
  //   duracion_en: '3 hours',
  //   horario: '15:00 – 18:00',
  //   sala: 'Lab Smart Skills A',
  //   cupo: 30,
  //   requisitos: ['Sin requisitos previos'],
  //   requisitos_en: ['No prior requirements'],
  // },
  // {
  //   workshopId: 4,
  //   name: 'Visión artificial para control de calidad',
  //   name_en: 'Machine vision for quality control',
  //   nivel: 'INTERMEDIO',
  //   instructor: 'Dra. Ana Martínez',
  //   instructorRole: 'Directora de innovación',
  //   instructorRole_en: 'Innovation director',
  //   instructorBio: 'Especialista en transformación digital con más de 15 años liderando proyectos de innovación en el sector industrial.',
  //   instructorBio_en: 'Digital transformation specialist with over 15 years leading innovation projects in the industrial sector.',
  //   duracion: '4 horas',
  //   duracion_en: '4 hours',
  //   horario: '10:00 – 14:00',
  //   sala: 'Lab Smart Skills B',
  //   cupo: 18,
  //   requisitos: ['Laptop propia', 'Python básico'],
  //   requisitos_en: ['Your own laptop', 'Basic Python'],
  // },
];

export { workshops };