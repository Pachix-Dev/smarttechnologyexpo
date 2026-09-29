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

import { companyLogo } from "../components/insights/insightsApi";

const workshops = [
 
  {
    workshopId: 1,
    name: 'SEGURIDAD EN MAQUINARIA: ANÁLISIS Y MITIGACIÓN DE RIESGOS',
    name_en: 'EMACHINE SAFETY: RISK ANALYSIS AND MITIGATION',
    company: 'Euchner',
    companyLogo: '/img/exhibitors2026/euchner.webp',
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
    date: "2026-11-18",
    startTime: "11:00",
    dia: "18 noviembre",    
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
    companyLogo: '/img/exhibitors2026/beckhoff.webp',
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
    date: "2026-11-19",
    startTime: "11:00",
    dia: "19 noviembre",    
    dia_en: "November 19",
    horario: '11:00 – 15:00',
    sala: 'Smart Skills Stage',
    cupo: 50,
    profile_es: ['Project managers', 'Ingenieros de automatización y control', 'Gerentes de ingeniería con conocimientos básicos de automatización industrial'],
    profile_en: ['Project managers', 'Automation and control engineers', 'Engineering managers with basic knowledge of industrial automation'],
  },
  {
    workshopId: 3,
    name: 'TALLER ESPECIALIZADO OMRON',
    name_en: 'OMRON SPECIALIZED WORKSHOP',
    company: 'Omron',
    companyLogo: '/img/exhibitors2026/omron.webp',
    nivel: 'INTERMEDIO',
    instructor: [
      {
        name: '',
        role: '',
        role_en: '',
      }
    ],
    instructorRole: '',
    instructorRole_en: '',
    instructorBio: '',
    instructorBio_en: '',
    dia: "18 noviembre",    
    dia_en: "November 18",
    duracion: '3 horas',
    duracion_en: '3 hours',
    date: "2026-11-18",
    startTime: "15:30",
    horario: '15:30 – 18:30',
    sala: 'Smart Skills Stage',
    cupo: 0,
    profile_es: ['Información por confirmar'],
    profile_en: ['Pending information'],
  },
  // {
  //  workshopId: 0,
  //   name: '',
  //   name_en: '',
  //   company: '',
  //   companyLogo: '/img/exhibitors2026/',
  //   nivel: '',
  //   instructor: [
  //     {
  //       name: '',
  //       role: '',
  //       role_en: '',
  //     }
  //   ],
  //   duracion:'4 horas',
  //   duracion_en:'4 hours',
  //   date: "2026-11-18",
  //   startTime: "11:00",
  //   dia:"18 noviembre",    
  //   dia_en: "November 18",
  //   horario: '11:00 – 15:00',
  //   sala: 'Smart Skills Stage',
  //   cupo: 50,
  //   profile_es: ['Ingenieros de proyecto', 'Personal de seguridad e higiene', 'Integradores y fabricantes de máquinas'],
  //   profile_en: ['Project engineers', 'Health and safety personnel', 'Machine integrators and manufacturers'],
  // }
];

export { workshops };
