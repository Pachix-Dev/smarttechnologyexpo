// skillsApi.js — Capa de datos del apartado SMART SKILLS (Programa por día).
// Consume la MISMA API que Insights (dashboard.igeco.mx) pero con OTRO escenario
// (SKILLS_STAGE_ID = 9). La estructura de datos es idéntica a la de Insights, por
// eso los helpers son los mismos; se duplican aquí para que Skills sea autónomo.

// ---------------------------------------------------------------------------
// CONFIGURACIÓN
// ---------------------------------------------------------------------------
export const SKILLS_API_URL =
  (import.meta.env.PUBLIC_SKILLS_API_URL ||
    "https://dashboard.igeco.mx/api/programa/completo");

export const SKILLS_MEDIA_BASE =
  (import.meta.env.PUBLIC_SKILLS_MEDIA_BASE || "https://dashboard.igeco.mx");

// Escenario de TALLERES en la API.
export const SKILLS_STAGE_ID = Number(
  import.meta.env.PUBLIC_SKILLS_STAGE_ID || 9,
);

// ---------------------------------------------------------------------------
// FETCH + SELECCIÓN DE ESCENARIO
// ---------------------------------------------------------------------------
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
export const pick = (lang, es, en) => (lang === "en" ? en || es : es || en);

export const confTitle = (c, lang) => pick(lang, c.title, c.title_en);
export const confDesc = (c, lang) => pick(lang, c.description, c.description_en);
export const speakerBio = (p, lang) => pick(lang, p.bio_esp, p.bio_eng);

// ---------------------------------------------------------------------------
// CARGO / EMPRESA en inglés (API en > diccionario > español). Ajuste STE 2026.
// La API trae position/company solo en español; agrega entradas aquí conforme
// suban ponentes. Si algún día la API trae position_en/company_en, ganan prioridad.
// ---------------------------------------------------------------------------
const ROLE_EN = {
  "Presidente": "President",
  "Presidenta": "President",
  "Director General": "General Director",
  "Directora General": "General Director",
  "Director": "Director",
  "Directora": "Director",
};
const ORG_EN = {
  "Instituto Mexicano para la Competitividad": "Mexican Institute for Competitiveness",
};

export function speakerRole(p, lang) {
  const es = p.position || p.role || "";
  if (lang !== "en") return es;
  return p.position_en || ROLE_EN[es] || es;
}
export function speakerOrg(p, lang) {
  const es = p.company || "";
  if (lang !== "en") return es;
  return p.company_en || ORG_EN[es] || es;
}

// ---------------------------------------------------------------------------
// HELPERS DE IMÁGENES
// ---------------------------------------------------------------------------
export function speakerPhoto(photo) {
  if (!photo) return null;
  if (/^https?:\/\//.test(photo)) return photo;
  return `${SKILLS_MEDIA_BASE}/ponentes/${photo}`;
}

export function companyLogo(logo) {
  if (!logo) return null;
  if (/^https?:\/\//.test(logo)) return logo;
  return `${SKILLS_MEDIA_BASE}/logos/${logo}`;
}

// ---------------------------------------------------------------------------
// UTILIDADES DE FORMATO Y DERIVACIÓN
// ---------------------------------------------------------------------------
export function formatTime(t) {
  if (!t) return "";
  const [h, m] = String(t).split(":");
  return m != null ? `${h}:${m}` : h;
}

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