// ============================================================================
//  MÓDULO skillsApi.js — Capa de datos del apartado SMART SKILLS (Programa por día)
//  Autor: Donovan Oswaldo Villalba Hernandez
//
//  Punto único de acceso a los datos del escenario de talleres. Consume la MISMA
//  API que Insights (dashboard.igeco.mx) pero con OTRO escenario (SKILLS_STAGE_ID
//  = 9). La estructura de datos es idéntica a la de Insights, por eso los helpers
//  son los mismos; se duplican aquí para que Skills sea autónomo.
// ============================================================================

// ---------------------------------------------------------------------------
// CONFIGURACIÓN
// ---------------------------------------------------------------------------
// URL del endpoint. Prioridad: variable de entorno pública > valor por defecto.
export const SKILLS_API_URL =
  (import.meta.env.PUBLIC_SKILLS_API_URL ||
    "https://dashboard.igeco.mx/api/programa/completo");

// Base para imágenes (fotos de ponentes y logos).
export const SKILLS_MEDIA_BASE =
  (import.meta.env.PUBLIC_SKILLS_MEDIA_BASE || "https://dashboard.igeco.mx");

// Escenario de TALLERES en la API.
export const SKILLS_STAGE_ID = Number(
  import.meta.env.PUBLIC_SKILLS_STAGE_ID || 9,
);

// ---------------------------------------------------------------------------
// FETCH + SELECCIÓN DE ESCENARIO
// ---------------------------------------------------------------------------
// Descarga el programa completo y devuelve el escenario de talleres.
// Pasos: fetch → valida HTTP → toma json.data → busca el escenario por id →
// ordena sus días por fecha ascendente. A diferencia de Insights, aquí NO cae
// al primer escenario: si no está el id pedido, devuelve null.
export async function fetchStage(stageId = SKILLS_STAGE_ID) {
  const res = await fetch(SKILLS_API_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const stages = Array.isArray(json?.data) ? json.data : [];

  const stage =
    stages.find((s) => Number(s.id) === Number(stageId)) || null;
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

// ---------------------------------------------------------------------------
// CARGO / EMPRESA en inglés (API en > diccionario > español). Ajuste STE 2026.
// La API trae position/company solo en español; agrega entradas aquí conforme
// suban ponentes. Si algún día la API trae position_en/company_en, ganan prioridad.
// ---------------------------------------------------------------------------
// Diccionario de cargos ES → EN (respaldo mientras la API no traiga position_en).
const ROLE_EN = {
  "Presidente": "President",
  "Presidenta": "President",
  "Director General": "General Director",
  "Directora General": "General Director",
  "Director": "Director",
  "Directora": "Director",
};
// Diccionario de organizaciones ES → EN (respaldo para company_en).
const ORG_EN = {
  "Instituto Mexicano para la Competitividad": "Mexican Institute for Competitiveness",
};

// speakerRole: cargo del ponente. En ES devuelve el valor tal cual; en EN busca
// position_en de la API, luego el diccionario, y por último cae al español.
export function speakerRole(p, lang) {
  const es = p.position || p.role || "";
  if (lang !== "en") return es;
  return p.position_en || ROLE_EN[es] || es;
}
// speakerOrg: empresa del ponente, con la misma prioridad api_en > diccionario > es.
export function speakerOrg(p, lang) {
  const es = p.company || "";
  if (lang !== "en") return es;
  return p.company_en || ORG_EN[es] || es;
}

// ---------------------------------------------------------------------------
// HELPERS DE IMÁGENES
// ---------------------------------------------------------------------------
// Foto de ponente: si ya es URL absoluta la deja igual; si es solo el nombre de
// archivo, le antepone la base de medios + carpeta /ponentes.
export function speakerPhoto(photo) {
  if (!photo) return null;
  if (/^https?:\/\//.test(photo)) return photo;
  return `${SKILLS_MEDIA_BASE}/ponentes/${photo}`;
}

// Logo de empresa: misma lógica que speakerPhoto pero con la carpeta /logos.
export function companyLogo(logo) {
  if (!logo) return null;
  if (/^https?:\/\//.test(logo)) return logo;
  return `${SKILLS_MEDIA_BASE}/logos/${logo}`;
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

// Sesiones de un día, ordenadas por hora de inicio.
export function daySessions(dia) {
  return (dia?.conferencias || [])
    .slice()
    .sort((a, b) =>
      String(a.start_time || "").localeCompare(String(b.start_time || "")),
    );
}