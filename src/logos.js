/**
 * Ordena un array de logos alfabéticamente por el nombre del archivo en src
 * @param {Array} logos - Array de objetos con la propiedad src
 * @return {Array} - Nuevo array ordenado alfabéticamente
 **/
const sortLogosAlphabetically = (logos) => {
  return [...logos].sort((a, b) => {
    const nameA = a.src.split("/").pop()?.toLowerCase() || "";
    const nameB = b.src.split("/").pop()?.toLowerCase() || "";
    return nameA.localeCompare(nameB);
  });
};

const strategicPartners = [
  {
    src: "/img/logos/strategic_partners/alianza_cuatro_cero.webp",
    alt: "Alianza Cuatro Cero",
    width: 300,
  },
  {
    src: "/img/logos/strategic_partners/a_tres.webp",
    alt: "A Tres",
    width: 300,
  },
  { src: "/img/logos/strategic_partners/csia.webp", alt: "CSIA", width: 300 },
  { src: "/img/logos/strategic_partners/giz.webp", alt: "GIZ", width: 400 },
  {
    src: "/img/logos/strategic_partners/camara_verde.png",
    alt: "Cámara Verde",
    width: 300,
  },
  {
    src: "/img/logos/strategic_partners/holland_house.webp",
    alt: "Holland House",
    width: 50,
  },
  // { src: "/img/logos/strategic_partners/swe.webp", alt: "SWE", width: 300 },
];

const mediaPlanito = [
  {
    src: "/img/logos/media/cluster_industrial.webp",
    alt: "Cluster Industrial",
    href: "https://new.siemens.com/mx/es.html",
    width: 300,
  },
  {
    src: "/img/media/global-energy-v2.webp",
    alt: "Global Industries",
    width: 300,
  },
  {
    src: "/img/media/global-industries_v2.webp",
    alt: "Global Energy",
    width: 300,
  },
  {
    src: "/img/logos/media/mexico_industry.webp",
    alt: "Mexico Industry",
    href: "https://new.siemens.com/mx/es.html",
    width: 300,
  },
  {
    src: "/img/logos/media/metalmecanica.webp",
    alt: "Metalmecánica",
    href: "https://new.siemens.com/mx/es.html",
    width: 300,
  },
  {
    src: "/img/logos/media/manufactura_latam.webp",
    alt: "Manufactura Latam",
    href: "https://new.siemens.com/mx/es.html",
    width: 300,
  },
];

const mediaGold = [
  {
    src: "/img/logos/media/dime.webp",
    alt: "Dime Noticias",
    href: "https://www.otromedio.com",
    width: 300,
  },
  {
    src: "/img/logos/media/energy.webp",
    alt: "Energy & Commerce",
    href: "https://www.otromedio.com",
    width: 300,
  },
  {
    src: "/img/logos/media/industry_energy_magazine.webp",
    alt: "Industry Energy Magazine",
    href: "https://www.otromedio.com",
    width: 300,
  },
  {
    src: "/img/logos/media/industry.webp",
    alt: "Industry News MX",
    href: "https://www.otromedio.com",
    width: 300,
  },
  {
    src: "/img/logos/media/revista_consultoria.webp",
    alt: "Revista Consultoria",
    href: "https://new.siemens.com/mx/es.html",
    width: 300,
  },
];

const sponsorsDiamond = [
  {
    src: "/img/logos/sponsors/beckhoff.webp",
    alt: "Beckhoff",
    href: "https://www.beckhoff.com/es-mx/",
    width: 300,
  },
];

const sponsorsBronze = [
  {
    src: "/img/exhibitors2026/euchner.webp",
    alt: "Euchner",
    href: "https://www.euchner.mx/",
    width: 300,
  },
  {
    src: "/img/logos/sponsors/robustel.webp",
    alt: "Robustel",
    href: "https://robustel.com",
    width: 300,
  },
  {
    src: "/img/logos/sponsors/smartsol.webp",
    alt: "SmartSol",
    href: "https://smartsol.mx/",
    width: 300,
  },
];

const skillsSponsors = [
  {
    src: "/img/exhibitors2026/euchner.webp",
    alt: "Euchner México",
    href: "https://www.euchner.mx/",
    width: 300,
  },
  {
    src: "/img/logos/sponsors/beckhoff.webp",
    alt: "Beckhoff",
    href: "https://www.beckhoff.com/es-mx/",
    width: 300,
  },
  {
    src: "/img/exhibitors2026/omron.webp",
    alt: "Omron",
    href: "",
    width: 300,
  }
];

const sponsorsSilver = [
  {
    src: "/img/exhibitors2026/telcel_empresas.webp",
    alt: "Robustel",
    href: "https://robustel.com",
    width: 300,
  },
];

const sponsorsPlatinum = [
  {
    src: "/img/logos/sponsors/mitsubishi_electric_v2.webp",
    alt: "Mitsubishi Electric",
    href: "https://mx.mitsubishielectric.com/es/",
    width: 300,
  },
];

const sponsorsGold = [
  {
    src: "/img/exhibitors2026/nojoxten_v2.webp",
    alt: "Nojoxten",
    href: "",
    width: 400,
  },
];

const bannerSponsors = [
  {
    src: "/img/logos/sponsors/banners/robustel_es.webp",
    alt: "Robustel",
    href: "https://robustel.com/",
    width: 540,
  },
  {
    src: "/img/logos/sponsors/banners/smartechnologyexpo.webp",
    alt: "Smart Technology Expo",
    href: "https://smartsol.mx/",
    width: 540,
  },
  {
    src: "/img/logos/sponsors/banners/telcel.webp",
    alt: "Telcel Empresas",
    href: "https://www.telcel.com/empresas",
    width: 540,
  },
  {
    src: "/img/logos/sponsors/banners/nojoxten.webp",
    alt: "Nojoxten",
    href: "",
    width: 540,
  },
];

const bannerMedios = [
  {
    src: "/img/logos/sponsors/banners/global_energy.webp",
    alt: "Global Energy",
    href: "",
    width: 540,
  },
  {
    src: "/img/logos/sponsors/banners/axioma.webp",
    alt: "Axioma",
    href: "",
    width: 540,
  },
  {
    src: "/img/logos/sponsors/banners/cluster_industrial.webp",
    alt: "Cluster Industrial",
    href: "",
    width: 540,
  },
  {
    src: "/img/logos/sponsors/banners/dime.webp",
    alt: "Dime Noticias",
    href: "",
    width: 540,
  },
];

export {
  mediaPlanito,
  strategicPartners,
  sponsorsDiamond,
  mediaGold,
  sponsorsBronze,
  skillsSponsors,
  sponsorsSilver,
  sponsorsPlatinum,
  bannerSponsors,
  bannerMedios,
  sponsorsGold,
  sortLogosAlphabetically,
};
