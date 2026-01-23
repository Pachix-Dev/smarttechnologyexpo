const hotels = [
  {
    src: '/hotel_westin.webp',
    name: 'The Westin Guadalajara',
    address: 'Av. Las Rosas 2911, colonia Verde Valle, C.P. 44530, Guadalajara, Jalisco.',
    rate: '$135.00 USD',
    phone: '+52 (55) 33 3880 2700',
    email: 'reservaciones.gdl@westinhotels.com',
    code: 'RE+ MEXICO / ECOMONDO MEXICO',
    link: 'https://www.marriott.com/es/event-reservations/reservation-link.mi?id=1761175449045&key=GRP&dtt=true&guestreslink2=true&app=resvlink',
    time_walk: '1',
    time_drive: '1',
    whatsapp: ''
  }, 
  {
    src: '/hotel_barcelo.webp',
    name: 'Barceló Guadalajara',
    address: 'Av. De las Rosas 2933 Col. Rinconada del Bosque.',
    rate: '15% de descuento sobre tarifa bar',
    phone: '+52 (33) 3678 0505  ext. 3141, 3142, 3143 y 3144',
    email: 'guadalajara.res@barcelo.com',
    code: 'EXPO RE+ / MEXICO - ECOMONDO',
    link: '',
    time_walk: '1',
    time_drive: '1',
    whatsapp: ''
  },
  {
      src: '/hotel_ibis.webp',
      name: 'IBIS Expo Guadalajara',
      address: 'Av. Mariano Otero 1400 Col, Jardines del Bosque, 44520 Guadalajara, Jalisco.',
      rate: 'Sencilla $946.28 MXN <br/> Doble $1,144.63 MXN',
      phone: '+52 (33) 3880 9600',
      email: 'cristina.casillas@accor.com',
      code: 'ECOMONDO / RE+ MEXICO 2026',
      link: '',
      time_walk: '3 ',
      time_drive: '5 ',
      whatsapp: '33 3880 96 00'
    },
    {
    src: '/hotel_fiesta_inn.webp',
    name: 'Fiesta Inn Guadalajara Expo',
    address: 'Av. Mariano Otero 1550 Col, Rinconada del Sol, 45055 Guadalajara, Jalisco.',
    rate: '$1,800 MXN',
    phone: 'POR CONFIRMAR',
    email: 'POR CONFIRMAR',
    code: 'ECOMONDO / RE+ MEXICO 2026',
    link: '',
    time_walk: '8',
    time_drive: '5 ',
    whatsapp: ''
  },
 {
    src: '/hotel_marriot.webp',
    name: 'AC Marriot Guadalajara Expo',
    address: 'Av. López Mateos Sur 2375, Plaza del Sol, 45055 Zapopan, Jalisco.',
    rate: '$1,620 MXN',
    phone: '+52 (33) 38 80 06 00',
    email: 'POR CONFIRMAR',
    code: 'RE+ MEXICO / ECOMONDO MEXICO',
    link: '',
    time_walk: '20',
    time_drive: '5  ',
    whatsapp: '33 18 93 37 90'
  },
  {
    src: '/hotel_rui.webp',
    name: 'RIU Plaza Guadalajara',
    address: 'Av. López Mateos, 830 - Fracc. Chapalita · 44500 Guadalajara, Jalisco',
    rate: '$2,490 MXN',
    phone: '01 800 225 5748',
    email: 'mcastelan@riu.com',
    code: 'RE+: RE2026 // ECOMONDO: ECO26',
    link: 'https://www.riu.com/es/posts/codigo-corporativo.jsp',
    time_walk: '35 ',
    time_drive: '8',
    whatsapp: '33 3956 2291'
  },
  {
    src: '/hotel_presidente.webp',
    name: 'Hotel Presidente InterContinental Guadalajara ',
    address: 'Av. Moctezuma 3515, Ciudad del Sol, 45050, Zapopan, Jalisco.',
    rate: '$2,050 MXN',
    phone: '+52 (33) 3678-1234 ',
    email: 'guadalajara@grupopresidente.com',
    code: 'CA ECOMONDO MÉXICO Abr 202 o RM3',
    link: '',
    time_walk: '0',
    time_drive: '0',
    whatsapp: '',
    link: '',
  },
  {
    src: '/onegdl.webp',
    name: 'One Guadalajara Expo',
    address: 'Av. Chapalita 1470, Chapalita, 44510 Guadalajara, Jalisco.',
    rate: '$1,300 MXN',
    phone: '33 3880 9200',
    email: 'POR CONFIRMAR',
    code: 'G1VHU3@OGX',
    link: ' https://www.corpo-rate.com/login?groupId= G1VHU3@OGX',
    time_walk: '15',
    time_drive: '5 ',
    whatsapp: ''
  },
  {
    src: '/city_express.webp',
    name: 'City Express Plus',
    address: 'Av. Mariano Otero 1550 Col, Rinconada del Sol, 45055 Guadalajara, Jalisco.',
    rate: '1,430 MXN',
    phone: '33 3880 3700',
    email: 'ceegd.ventas1@norte19.com',
    code: 'REM RE+ MEXICO & ECOMONDO MEXICO 2026',
    link: 'https://www.marriott.com/es/event-reservations/reservation-link.mi?id=1761782518702&key=GRP&dtt=true&guestreslink2=true&app=resvlink',
    time_walk: '7',
    time_drive: '5',
    whatsapp: ''
  },
  {
    src: '/holiday-inn.webp',
    name: 'Holiday Inn Guadalajara Expo',
    address: 'Av. Niños Héroes 3089 Col. Jardines de los Arcos C.P. 44500, Guadalajara, Jalisco.',
    rate: '$1,500 MXN',
    phone: '+52 (33) 3634 1034',
    email: 'reservaciones@higuadalajara.com.mx',
    code: 'ECOMONDO / RE+ MEXICO 2026',
    link: 'https://www.ihg.com.cn/redirect?path=hd&brandCode=HI&localeCode=es&regionCode=1&hotelCode=GDLMX&_PMID=99801505&GPC=IG3&cn=yes&adjustMonth=false&showApp=true&monthIndex=00',
    time_walk: '18',
    time_drive: '5',
    whatsapp: ''
  },
  {
    src: '/holiday-inn-guadalajara-select.webp',
    name: 'Holiday Inn Guadalajara Select',
    address: 'Av. López Mateos Sur 2500 Col. Ciudad del Sol, C.P. 45050, Guadalajara, Jalisco.',
    rate: '$1,500 MXN',
    phone: '+52 (33) 3122 2020',
    email: 'reservaciones@hisguadalajara.com.mx',
    code: 'ECOMONDO / RE+ MEXICO 2026',
    link: 'https://www.ihg.com/redirect?path=hd&brandCode=HI&localeCode=es&regionCode=1&hotelCode=GDLHI&_PMID=99801505&GPC=EC0&cn=no&adjustMonth=false&showApp=true&monthIndex=00',
    time_walk: '22',
    time_drive: '5 ',
    whatsapp: ''
  },
  {
    src: '/wyndham.webp',
    name: 'Wyndham Garden',
    address: 'Av. Mariano Otero 3875 Col. Ciudad del Sol, C.P. 45050, Guadalajara, Jalisco.',
    rate: '$1,290 MXN',
    phone: '+52 (33) 3634 1000',
    email: 'reservaciones@wgardengdlexpo.com',
    code: 'ECOMONDO / RE+ MEXICO 2026',
    link: '',
    time_walk: '22',
    time_drive: '5 ',
    whatsapp: ''
  },
  {
    src: '/Hampton_Hilton.webp',
    name: 'Hampton by Hilton',
    address: 'Av. de las Rosas 3030 Col. Chapalita, C.P. 44500, Guadalajara, Jalisco.',
    rate: '$1,950 MXN',
    phone: '+52 (33) 1598 9005',
    email: 'reservacionesgdlex@inverhoteles.com',
    code: 'RE+ MEXICO & ECOMONDO MEXICO 2026',
    link: '',
    time_walk: '10',
    time_drive: '5 ',
    whatsapp: ''
  }
  // {
  //   src: '/hotel_presidente.webp',
  //   name: 'Hotel Presidente InterContinental Guadalajara ',
  //   address: 'Moctezuma 2515, esquina Av. Adolfo López Mateos, Cd del Sol, Zapopan Jalisco.',
  //   rate: '$2,050 MXN',
  //   phone: '+52 (33) 3880 7000',
  //   email: 'guadalajara@grupopresidente.com',
  //   code: 'RE+ MEXICO 2025 / ECOMONDO 2025',
  //   link: '',
  //   time_walk: '25 ',
  //   time_drive: '7 ',
  //   whatsapp: '',
  //   link: 'https://www.ihg.com/redirect?path=hd&brandCode=6C&localeCode=es&regionCode=1&hotelCode=GDLHA&_PMID=99801505&GPC=RE3&cn=no&viewfullsite=true',
  // },
  /*{
    src: '/hotel_marriot.webp',
    name: 'AC Marriot Guadalajara Expo',
    address: 'Av. López Mateos 2375. Ciudad del Sol. C.P. 45050. Guadalajara, Jalisco.',
    rate: '$1,850.00 MXN',
    phone: '+52 (33) 38 80 06 00',
    email: 'ana.maldonado@aimbridge.com',
    code: 'SOLAR - ECOMONDO',
    link: '',
    time_walk: '10 a 15 ',
    time_drive: '5  ',
    whatsapp: '33 18 93 37 90'
  },
  {
    src: '/hotel_rui.webp',
    name: 'RIU Plaza Guadalajara',
    address: 'Av. Av. López Mateos No. 830 Fracc. Chapalita.',
    rate: '$1,990.00 MXN',
    phone: '01 800 225 5748',
    email: 'WhatsApp + 33 3956 2291',
    code: 'SOLAR / ECO 24',
    link: 'https://www.riu.com/consultar-disponibilidad/?corporate',
    time_walk: '30 ',
    time_drive: '8 ',
    whatsapp: '33 3956 2291'
  },
  {
    src: '/hotel_ibis.webp',
    name: 'IBIS Guadalajara Expo',
    address: 'Av. Mariano Otero 1400 Col, Jardines del Bosque, 44520 Guadalajara, Jal.',
    rate: '$1,132.00 MXN',
    phone: '+52 (33) 3880 9600 ',
    email: 'H3355-SL1@accor.com',
    code: 'Solar + Storage // Ecomondo',
    link: '',
    time_walk: '3 ',
    time_drive: '5 ',
    whatsapp: '33 3880 96 00'
  },*/
  
  /*{
    src: '/hotel_real_inn.webp',
    name: 'Real Inn Expo',
    address: 'Av. Mariano Otero N. 1326, Col. Jardines de San Ignacio. C.P 45040.',
    rate: '$1,900.00 MXN',
    phone: '+52 (55) 5263 0536 ext 7338',
    email: 'brenda.martinez@caoreal.com',
    code: ': Ind. Solar + Storage Mexico',
    link: '',
    time_walk: '2 ',
    time_drive: '5 ',
    whatsapp: ''
  },
  
  {
    src: '/hotel_indigo.webp',
    name: 'Hotel INDIGO Guadalajara Expo',
    address: 'Av. López Mateos Sur 1280, Col. Chapalita.',
    rate: '$1,790.00 MXN',
    phone: '+52 (33) 3121 2424',
    email: 'rm@opratium.mx',
    code: 'SSM',
    link: 'https://www.ihg.com/hotelindigo/hotels/us/es/guadalajara/gdlal/hoteldetail?fromRedirect=true&qSrt=sBR&qIta=99801505&icdv=99801505&qSlH=GDLAL&qGrpCd=SSM&setPMCookies=true&qSHBrC=IN&qDest=Av.%20Adolfo%20L%C3%B3pez%20Mateos%20Sur%201280%2C%20Guadalajara%2C%20JAL%2C%20MX&srb_u=1',
    time_walk: '10 ',
    time_drive: '5 ',
    whatsapp: ''
  }*/
]

const restaurants = [
  {
    src: '/cocina_tres16.webp',
    name: 'Cocina Tres16',
    description_es: 'Ubicado a menos de 5 minutos de la Expo, es una opción conveniente para desayunar o almorzar, abriendo de 8 AM a 5 PM todos los días.',
    description_en: 'Located less than a 5-minute walk from the Expo, it is a convenient option for breakfast or lunch, open from 8 AM to 5 PM every day.',
    link: 'https://www.google.com/search?q=Cocina+Tres16&sca_esv=a63806a710cbffd6&sxsrf=AE3TifMQqH-DSF-toRByYOhb0H7fituWnQ%3A1764355692071&ei=bO4pafiDBP7NkPIPprzpqA0&ved=2ahUKEwiTyLzjxZWRAxX3l-4BHcOJDv8QgK4QegQIAxAB&uact=5&oq=que+hacer+en+guadalajara+gastronomicamente+cerca+de+expo+gdl&gs_lp=Egxnd3Mtd2l6LXNlcnAiPHF1ZSBoYWNlciBlbiBndWFkYWxhamFyYSBnYXN0cm9ub21pY2FtZW50ZSBjZXJjYSBkZSBleHBvIGdkbDIFECEYoAFIhVxQtBZYrFhwCHgBkAEAmAHxAqAB4jOqAQgwLjI5LjYuMrgBA8gBAPgBAZgCLaACqzbCAgoQABiwAxjWBBhHwgIFEAAYgATCAgoQABiABBgUGIcCwgIJEAAYFhjJAxgewgIGEAAYFhgewgIIEAAYgAQYogTCAgsQABiABBiSAxiKBcICBBAjGCfCAg0QABiABBixAxgUGIcCwgIFEAAY7wXCAgUQIRiSA8ICBBAhGBWYAwCIBgGQBgiSBwg4LjI4LjYuM6AHq9kBsgcIMC4yOC42LjO4B_I1wgcIMC42LjM3LjLIB9sB&sclient=gws-wiz-serp&mstk=AUtExfC4jmUvjHGe_XO5eQGgvZjB0SZRWyFvYyjCOLqOzPQ3e0nW-wil3WvipfjxNgvM5YfuEGLGCeL6aRZRuWeG4KMXlbZRVBZX131YLFnE4DodfN2LBsvxiCdkdaCWtv5Tdqfsx0tqSXd0xkot1IRJY6nEYgPF7cA7lRhKJushjMB7MWY&csui=3'
  },
  {
    src: '/palo_alto.webp',
    name: 'Palo Alto Cocina Italoamericana',
    description_es: 'Restaurante de comida mexicana contemporánea ubicado dentro del hotel Barceló Guadalajara.',
    description_en: 'Contemporary Mexican cuisine restaurant located inside the Barceló Guadalajara hotel.',
    link: 'https://share.google/PFAuj5yQkvZLMGaHv'
  },
  {
    src: '/isabela_gdl.webp',
    name: 'Isabela - GDL',
    description_es: 'Otra opción bien calificada y cerca de la Expo.',
    description_en: 'Another well-rated option near the Expo.',
    link: 'https://share.google/s2DZFm7DV331bZKwI'
  },
  {
    src: '/Losteria.webp',
    name: "L'Osteria de Il Duomo",
    description_es: 'Si buscas comida italiana, este es un restaurante bien valorado en la zona',
    description_en: 'If you are looking for Italian food, this is a highly rated restaurant in the area.',
    link: 'https://maps.app.goo.gl/QsfZk9hEm1jYcGvE9'
  },
  {
    src: '/plaza_perla.webp',
    name: 'Centro Comercial La Perla',
    description_es: 'La Perla es una plaza moderna en Zapopan con tiendas, áreas verdes y espacios para pasear y disfrutar al aire libre.',
    description_en: 'La Perla is a modern mall in Zapopan with stores, green areas, and spaces to stroll and enjoy the outdoors.',
    link: 'https://laperla.com.mx/'
  }
]

const gastronomiaLocal = [
  {
    src: '/lugares_gdl/coyote.webp',
    name: 'Santo Coyote',
    description_es: 'Es un lugar que ofrece una experiencia única donde se combinan sabores, aromas y espacios llenos de magia, cultura y misticismo mexicano. El restaurante celebra la fusión de dos razas en Nuevo México, dando origen a la cocina criolla y reflejando tradiciones paganas con calidez y orgullo en cada rincón.',
    description_en: 'It is a place that offers a unique experience where flavors, aromas, and spaces full of magic, culture, and Mexican mysticism are combined. The restaurant celebrates the fusion  of two races in New Mexico, giving rise to Creole cuisine and reflecting pagan traditions with warmth and pride in every corner.',
    link: ''
  },
  {
    src: '/lugares_gdl/bariachi.webp',
    name: 'Casa bariachi',
    description_es: 'Casa Bariachi abrió en 1995 en Guadalajara para ofrecer a visitantes nacionales y extranjeros una experiencia llena de hospitalidad, mariachi y folklore mexicano. El lugar combina excelente gastronomía, música tradicional, bailes regionales y bebidas mexicanas en una fiesta colorida y alegre que celebra la cultura de México.',
    description_en: 'Casa Bariachi opened in 1995 in Guadalajara to offer national and international visitors an experience full of hospitality, mariachi, and Mexican folklore. The place combines excellent gastronomy, traditional music, regional dances, and Mexican drinks in a colorful and joyful party that celebrates Mexican culture.',
    link: ''
  },
  {
    src: '/lugares_gdl/abanejo.webp',
    name: 'Abajeño',
    description_es: 'Ofrece una experiencia gastronómica única con platillos 100% mexicanos de sabores auténticos y tradicionales transmitidos de generación en generación. Cada plato está diseñado para deleitar tu paladar con recetas excepcionales de la cocina mexicana.',
    description_en: ' It offers a unique gastronomic experience with 100% Mexican dishes of authentic and traditional flavors passed down from generation to generation. Each dish is designed to delight your palate with exceptional recipes from Mexican cuisine.',
    link: ''
  },
  {
    src: '/lugares_gdl/garibaldi.webp',
    name: 'Karne Garibaldi',
    description_es: 'Es un famoso restaurante de Guadalajara con Récord Guinness por servir comida en menos de 20 segundos. Desde 1970, su especialidad es la Carne en su Jugo, un ícono tapatío que llega a la mesa casi instantáneamente junto con aperitivos como frijoles, cebolla y limón.',
    description_en: ' It is a famous restaurant in Guadalajara with a Guinness World Record for serving food in less than 20 seconds. Since 1970, its specialty has been Carne en su Jugo, a Tapatío icon that arrives at the table almost instantly along with appetizers such as beans, onion, and lime.',
    link: ''
  }
]

const gastronomiaGurmet = [
  {
    src: '/lugares_gdl/hueso.webp',
    name: 'Hueso',
    description_es: 'Restaurante de cocina mexicana de autor del Chef Poncho Cadena, ubicado en una casa de los años 40 en el distrito de diseño de Guadalajara. Destaca por sus paredes con más de 10,000 huesos, menú de temporada, coctelería de autor y una experiencia sensorial que combina música, diseño y gastronomía. Reconocido en 2015 como The Americas Restaurant en Londres.',
    description_en: 'Author Mexican cuisine restaurant by Chef Poncho Cadena, located in a 1940s house in Guadalajara\'s design district. It stands out for its walls with more than 10,000 bones, seasonal menu, signature cocktails, and a sensory experience that combines music, design, and gastronomy. Recognized in 2015 as The Americas Restaurant in London.',
    link: ''
  },
  {
    src: '/lugares_gdl/octo.webp',
    name: 'Octo',
    description_es: 'Es un restaurante único en Guadalajara que combina arquitectura impresionante de ladrillo hexagonal con exposiciones de arte. Su menú se especializa en comida del mar y carnes selectas, complementado con mixología elaborada con destilados mexicanos. Ganador del PRIX VERSAILLES 2022.',
    description_en: 'Es un restaurante único en Guadalajara que combina arquitectura impresionante de ladrillo hexagonal con exposiciones de arte. Su menú se especializa en comida del mar y carnes selectas, complementado con mixología elaborada con destilados mexicanos. Ganador del PRIX VERSAILLES 2022.',
    link: ''
  },
  {
    src: '/lugares_gdl/bruna.webp',
    name: 'Bruna',
    description_es: 'La tarea del Chef Óscar Garza ha sido innovar en la preparación de platillos mexicanos tradicionales, haciendo intervención con técnicas, procesos y nuevos sabores con la finalidad de obtener piezas abstractas y contemporáneas convertidas en platillos, siempre respetando la esencia de cada receta apegándose a la tradición',
    description_en: 'Chef Óscar Garza\'s task has been to innovate in the preparation of traditional Mexican dishes, intervening with techniques, processes, and new flavors to obtain abstract and contemporary pieces turned into dishes, always respecting the essence of each recipe while adhering to tradition.',
    link: ''
  },
  {
    src: '/lugares_gdl/alcalde.webp',
    name: 'Alcalde',
    description_es: 'Fundado en 2013, ofrece cocina viva y sincera que respeta las estaciones del año y los ciclos de la tierra. Busca la excelencia en lo sencillo, presentando gastronomía actual sin artificios, solo sabor auténtico.',
    description_en: 'Founded in 2013, it offers lively and sincere cuisine that respects the seasons of the year and the cycles of the earth. It seeks excellence in simplicity, presenting contemporary gastronomy without artifice, only authentic flavor.',
    link: ''
  }
]

const parques = [
  {
    src: '/lugares_gdl/centroGDL.webp',
    name: 'Centro Histórico',
    description_es: 'Descubre el corazón cultural de Guadalajara: recorre su arquitectura colonial y visita la Catedral, el Cabañas y el Degollado.',
    description_en: ' Discover the cultural heart of Guadalajara: explore its colonial architecture and visit the Cathedral, Cabañas, and Degollado.',
    link: 'https://share.google/sC07UlHDHaVJh4hss'
  },
  {
    src: '/lugares_gdl/tlaquepaque.webp',
    name: 'Tlaquepaque',
    description_es: 'Recorre las coloridas calles de este pueblo mágico cercano y descubre su riqueza artística y artesanal.',
    description_en: 'Stroll through the colorful streets of this nearby magical town and discover its artistic and artisanal treasures.',
    link: 'https://maps.app.goo.gl/psLE5Vto2LNbsfSWA'
  },
   {
    src: '/lugares_gdl/tequila.webp',
    name: 'Tour a Tequila',
    description_es: 'Visita el pueblo de Tequila, conoce cómo se elabora la bebida y disfruta un recorrido en tren.',
    description_en: ' Visit the town of Tequila, learn how the drink is made, and enjoy a train tour.',
    link: 'https://share.google/lR5QHSwxYylTRqqbe'
  },
  {
    src: '/lugares_gdl/acuario.webp',
    name: 'Acuario Michin',
    description_es: 'Ubicado en pleno centro de la ciudad, con una amplia variedad de peces y rayas que enriquecen la experiencia de los visitantes',
    description_en: 'Located in the heart of the city, with a wide variety of fish and rays that enrich the visitor experience.',
    link: 'https://share.google/Dw5Hqa5j61Pm5Awwb'
  },
  {
    src: '/lugares_gdl/zoologico.webp',
    name: 'Zoológico Guadalajara',
    description_es: 'Un espacio verde ideal para caminatas, picnics y actividades al aire libre, ubicado a solo 10 minutos en coche de la Expo Guadalajara.',
    description_en: 'A green space ideal for walks, picnics, and outdoor activities, located just a 10-minute drive from Expo Guadalajara.',
    link: 'https://share.google/6WS3QpR6pVTpRsygD'
  },
  {
    src: '/lugares_gdl/selvaMagica.webp',
    name: 'Selva Mágica',
    description_es: 'Un parque de atracciones lleno de emoción y diversión, perfecto para los amantes de las aventuras extremas',
    description_en: 'An amusement park full of excitement and fun, perfect for lovers of extreme adventures.',
    link: 'https://share.google/gZ9a7ujVXSMma52Zt'
  },
  {
    src: '/lugares_gdl/plaza_mariachi.webp',
    name: 'Plaza de los Mariachis',
    description_es: 'Vive el ambiente tradicional tapatío en este lugar emblemático.  ',
    description_en: ' Experience the traditional Tapatío atmosphere in this iconic place.',
    link: 'https://share.google/gpFsOq9Rc3GyAmqzj'
  },
]

export { hotels, restaurants, parques, gastronomiaLocal, gastronomiaGurmet };