// ============================================================================
//  MÓDULO insightsApi.js — Capa de datos del apartado SMART INSIGHTS
//  Autor: Donovan Oswaldo Villalba Hernandez
//
//  Punto único de acceso a los datos del escenario. Aquí vive: la configuración
//  (URL de la API, base de imágenes, escenario a mostrar), el fetch + selección
//  de escenario, y un conjunto de helpers que las islas React reutilizan
//  (idioma, imágenes, estilo por tipo de sesión, formato y derivación de datos).
//
//  Consume el mismo endpoint que Ecomondo. Cuando tengas la API de tu evento,
//  solo cambia INSIGHTS_API_URL (o la variable de entorno PUBLIC_INSIGHTS_API_URL).
// ============================================================================

// ---------------------------------------------------------------------------
// CONFIGURACIÓN — lo único que normalmente vas a tocar
// ---------------------------------------------------------------------------

// URL del endpoint. Prioridad: variable de entorno pública > valor por defecto.
export const INSIGHTS_API_URL =
  (import.meta.env.PUBLIC_INSIGHTS_API_URL ||
    "https://dashboard.igeco.mx/api/programa/completo");

// Base para imágenes (fotos de ponentes y logos). Suele ir junto con la API.
export const INSIGHTS_MEDIA_BASE =
  (import.meta.env.PUBLIC_INSIGHTS_MEDIA_BASE || "https://dashboard.igeco.mx");

// Escenario a mostrar en Insights (igual que Ecomondo pasa stageId).
// Cambia este número por el de tu evento cuando tengas tu API.
export const INSIGHTS_STAGE_ID = Number(
  import.meta.env.PUBLIC_INSIGHTS_STAGE_ID || 8,
);

// ---------------------------------------------------------------------------
// FETCH + SELECCIÓN DE ESCENARIO
// ---------------------------------------------------------------------------

// Descarga el programa completo y devuelve el escenario elegido (o el primero).
// Pasos: fetch → valida HTTP → toma json.data → busca el escenario por id →
// ordena sus días por fecha ascendente → devuelve el escenario con días ordenados.
export async function fetchStage(stageId = INSIGHTS_STAGE_ID) {
  const res = await fetch(INSIGHTS_API_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const stages = Array.isArray(json?.data) ? json.data : [];

  // Busca el escenario pedido; si no aparece, usa el primero disponible.
  const stage =
    stages.find((s) => Number(s.id) === Number(stageId)) || stages[0] || null;
  if (!stage) return null;

  // Ordenar días por fecha ascendente.
  const dias = (stage.dias || [])
    .slice()
    .sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));

  return { ...stage, dias };
}

// ---------------------------------------------------------------------------
// HELPERS DE IDIOMA
// ---------------------------------------------------------------------------

// pick: devuelve la versión del texto según el idioma, con respaldo al otro
// idioma si el elegido viene vacío (evita huecos cuando falta una traducción).
export const pick = (lang, es, en) => (lang === "en" ? en || es : es || en);

// Atajos de pick para los campos bilingües más comunes de la API.
export const confTitle = (c, lang) => pick(lang, c.title, c.title_en);
export const confDesc = (c, lang) => pick(lang, c.description, c.description_en);
export const speakerBio = (p, lang) => pick(lang, p.bio_esp, p.bio_eng);
// Cargo del ponente: position_esp / position_eng (con respaldo al otro idioma).
export const speakerRole = (p, lang) => pick(lang, p.position_esp, p.position_eng);
// Empresa del ponente: company (español) / company_eng (inglés).
export const speakerOrg = (p, lang) => pick(lang, p.company, p.company_eng);

// ---------------------------------------------------------------------------
// HELPERS DE IMÁGENES
// ---------------------------------------------------------------------------

// Foto de ponente: si ya es URL absoluta la deja igual; si es solo el nombre de
// archivo, le antepone la base de medios + carpeta /ponentes.
export function speakerPhoto(photo) {
  if (!photo) return null;
  if (/^https?:\/\//.test(photo)) return photo;
  return `${INSIGHTS_MEDIA_BASE}/ponentes/${photo}`;
}

// Logo de empresa: misma lógica que speakerPhoto pero con la carpeta /logos.
export function companyLogo(logo) {
  if (!logo) return null;
  if (/^https?:\/\//.test(logo)) return logo;
  return `${INSIGHTS_MEDIA_BASE}/logos/${logo}`;
}

// ---------------------------------------------------------------------------
// TIPOS DE SESIÓN → estilo visual (paleta azul/teal/púrpura, sin rojo)
// ---------------------------------------------------------------------------

// Mapa tipo de sesión → { texto del badge, color de la barra }. Define la
// identidad visual de cada tipo de sesión en el programa.
const TYPE_META = {
  keynote: { badge: "KEYNOTE", bar: "#2563EB" },
  panel: { badge: "PANEL", bar: "#0D9488" },
  conference: { badge: "CONFERENCIA", bar: "#9333EA" },
  presentation: { badge: "PRESENTACIÓN", bar: "#0891B2" },
  technical: { badge: "TÉCNICA", bar: "#64748B" },
  workshop: { badge: "WORKSHOP", bar: "#C2410C" },
  break: { badge: "RECESO", bar: "#52525B" },
};

// Estilo de respaldo cuando el tipo no está en el mapa.
const FALLBACK_META = { badge: "SESIÓN", bar: "#9333EA" };

// Devuelve el estilo del tipo (normaliza a minúsculas/trim); si no existe, el fallback.
export function typeMeta(type) {
  const key = String(type || "").toLowerCase().trim();
  return TYPE_META[key] || FALLBACK_META;
}

// ---------------------------------------------------------------------------
// UTILIDADES DE FORMATO Y DERIVACIÓN
// ---------------------------------------------------------------------------

// Recorta una hora "HH:MM:SS" a "HH:MM" (si no trae minutos, deja la hora tal cual).
export function formatTime(t) {
  if (!t) return "";
  const [h, m] = String(t).split(":");
  return m != null ? `${h}:${m}` : h;
}

// Extrae el día (DD) de una fecha "YYYY-MM-DD" para el número grande del banner.
export function dayNumber(dateStr) {
  if (!dateStr) return "";
  const m = String(dateStr).match(/(\d{4})-(\d{2})-(\d{2})/);
  return m ? m[3] : "";
}

// Formatea la fecha en texto largo y localizado (ej. "martes, 18 de noviembre…").
export function formatDateLong(dateStr, lang = "es") {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString(lang === "en" ? "en-US" : "es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Sesiones de un día, ordenadas por hora de inicio.
export function daySessions(dia) {
  return (dia?.conferencias || [])
    .slice()
    .sort((a, b) =>
      String(a.start_time || "").localeCompare(String(b.start_time || "")),
    );
}

// Lista de ponentes únicos (para la grid de Keynote Speakers), deduplicados por id/nombre.
// Recorre todos los días y conferencias y usa un Map para conservar solo la
// primera aparición de cada ponente (clave: id, o nombre si no hay id).
export function uniqueSpeakers(stage) {
  const seen = new Map();
  for (const dia of stage?.dias || []) {
    for (const conf of dia.conferencias || []) {
      for (const p of conf.ponentes || []) {
        const key = p.id ?? p.name;
        if (key != null && !seen.has(key)) seen.set(key, p);
      }
    }
  }
  return Array.from(seen.values());
}