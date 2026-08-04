// ============================================================================
//  ISLA REACT SkillsScheduleLive.jsx — Programa en vivo (SMART SKILLS)
//  Autor: Donovan Oswaldo Villalba Hernandez
//
//  Isla React del "Programa por día" de SMART SKILLS. Consume EN VIVO la misma
//  API que Insights, pero con OTRO escenario (stageId = 9). Usa las clases ssc-*
//  (ahora servidas desde skills.css) con el look de Skills: acento rojo y badge
//  "TALLER". Los instructores con semblanza abren el BioModal compartido.
//
//  AJUSTES STE 2026 incluidos:
//   - "Descarga programa" oculto (comentado).
//   - Fecha del banner: solo mes + año ("Noviembre 2026").
//   - Cargo/empresa en inglés vía speakerRole/speakerOrg (API en > diccionario > es).
//
//  Flujo:
//   - Al montar, fetchStage(stageId) y guarda el escenario en estado.
//   - Maneja 3 estados de carga: loading (spinner) / error / vacío.
//   - El usuario cambia de día con los "pills"; se muestran sus sesiones.
//   - Los textos de interfaz llegan ya traducidos en `labels` desde el wrapper.
//   - El color de acento se aplica inline (barra, pill activa, banner, time-pill).
// ============================================================================

import { useEffect, useMemo, useState } from "react";
import {
  fetchStage,
  SKILLS_STAGE_ID,
  confTitle,
  confDesc,
  speakerBio,
  speakerPhoto,
  speakerRole,
  speakerOrg,
  companyLogo,
  formatTime,
  dayNumber,
  daySessions,
} from "./skillsApi.js";

export default function SkillsScheduleLive({
  lang = "es",
  stageId = SKILLS_STAGE_ID, // escenario de TALLERES en la API (9)
  pdfHref = "#",
  accent = "#E2101A",
  labels = {},
}) {
  // Estado: escenario cargado, banderas de carga/error y día activo.
  const [stage, setStage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDay, setActiveDay] = useState(0);

  // Carga los datos al montar (y cada vez que cambie stageId).
  // `alive` evita actualizar estado si el componente se desmontó a mitad del fetch.
  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchStage(stageId)
      .then((data) => {
        if (!alive) return;
        setStage(data);
        // Selecciona por defecto el primer día que tenga sesiones.
        const idx = (data?.dias || []).findIndex(
          (d) => (d.conferencias || []).length > 0,
        );
        setActiveDay(idx >= 0 ? idx : 0);
        setLoading(false);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err?.message || "Error desconocido");
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [stageId]);

  // t: elige texto por idioma. lbl: usa el label traducido si existe, si no t().
  const t = (es, en) => (lang === "en" ? en : es);
  const lbl = (key, es, en) => (labels && labels[key]) || t(es, en);

  // Fecha del banner: SOLO mes + año ("Noviembre 2026" / "November 2026").
  const monthYear = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d)) return "";
    const month = d.toLocaleDateString(lang === "en" ? "en-US" : "es-MX", {
      month: "long",
    });
    // Capitaliza la primera letra del mes (locale ES lo da en minúscula).
    const cap = month.charAt(0).toUpperCase() + month.slice(1);
    return `${cap} ${d.getFullYear()}`;
  };

  // Día activo y sus sesiones (memorizadas para no reordenar en cada render).
  const days = stage?.dias || [];
  const dia = days[activeDay] || days[0] || null;
  const sessions = useMemo(() => daySessions(dia), [dia]);

  // ── ESTADO: cargando (spinner) ───────────────────────────────────────────
  if (loading) {
    return (
      <section className="ssc-section">
        <div className="ssc-state">
          <div className="ssc-spinner-wrap">
            <div className="ssc-spinner" />
          </div>
        </div>
      </section>
    );
  }

  // ── ESTADO: error ────────────────────────────────────────────────────────
  if (error) {
    return (
      <section className="ssc-section">
        <div className="ssc-state">
          <div className="ssc-error">
            {t("Error al cargar el programa: ", "Error loading the program: ")}
            {error}
          </div>
        </div>
      </section>
    );
  }

  // ── ESTADO: sin datos ────────────────────────────────────────────────────
  if (!stage || days.length === 0) {
    return (
      <section className="ssc-section">
        <div className="ssc-state">
          <div className="ssc-empty">
            {t(
              "No hay información de programa disponible.",
              "No program information available.",
            )}
          </div>
        </div>
      </section>
    );
  }

  // ── RENDER PRINCIPAL ─────────────────────────────────────────────────────
  return (
    <section className="ssc-section">
      <div className="ssc-inner">
        {/* Encabezado: eyebrow + título */}
        <div className="ssc-eyebrow">{lbl("eyebrow", "AGENDA", "AGENDA")}</div>
        <h2 className="ssc-title">{lbl("title", "Programa por día", "Daily program")}</h2>

        {/* Fila superior: (descarga oculta en STE 2026) + aviso de idioma */}
        <div className="ssc-toprow">
          {/* OCULTO POR AHORA (ajuste STE 2026): sección "Descarga programa". No se borró.
          <div>
            <div className="ssc-dl-label" style={{ color: accent }}>
              {lbl("dlLabel", "DESCARGA GRATUITA", "FREE DOWNLOAD")}
            </div>
            <a href={pdfHref} className="ssc-dl-btn" style={{ background: accent }}>
              <span className="ssc-dl-icon">PDF</span>
              {lbl("dlBtn", "DESCARGA PROGRAMA", "DOWNLOAD PROGRAM")}
              <span>⬇</span>
            </a>
          </div>
          */}
          <div className="ssc-notice">
            <span className="ssc-notice-i">i</span>
            <span>
              {lbl(
                "notice",
                "Todos los talleres serán impartidos en español",
                "All workshops will be delivered in Spanish",
              )}
            </span>
          </div>
        </div>

        {/* Selector de día: un "pill" por cada día (acento inline en el activo) */}
        <div className="ssc-day-label">
          {lbl("selectDay", "SELECCIONA EL DÍA", "SELECT A DAY")}
        </div>
        <div className="ssc-day-pills">
          {days.map((d, i) => (
            <button
              key={d.id ?? i}
              type="button"
              className={i === activeDay ? "ssc-pill ssc-pill--active" : "ssc-pill"}
              style={i === activeDay ? { background: accent, borderColor: accent } : undefined}
              onClick={() => setActiveDay(i)}
            >
              {d.name || `${t("Día", "Day")} ${i + 1}`}
            </button>
          ))}
        </div>

        {/* Banner del día activo: número, nombre, mes+año y conteo de sesiones */}
        {dia && (
          <div className="ssc-banner">
            <div className="ssc-banner-left">
              <div className="ssc-banner-num" style={{ background: accent }}>
                {dayNumber(dia.date)}
              </div>
              <div>
                <div className="ssc-banner-name">{dia.name}</div>
                <div className="ssc-banner-date">{monthYear(dia.date)}</div>
              </div>
            </div>
            <span className="ssc-banner-count">
              <span className="ssc-banner-dot" style={{ borderColor: accent }} />
              {sessions.length} {lbl("sessionsWord", "sesiones", "sessions")}
            </span>
          </div>
        )}

        {/* Lista de sesiones del día activo */}
        <div className="ssc-sessions">
          {sessions.length === 0 ? (
            <div className="ssc-empty">
              {t("No hay sesiones para este día.", "No sessions for this day.")}
            </div>
          ) : (
            sessions.map((s) => {
              const speakers = s.ponentes || [];
              const desc = confDesc(s, lang);
              // Logo de la empresa del taller (viene de la API en company_logo).
              const logo = companyLogo(s.company_logo);
              return (
                <div
                  key={s.id}
                  className="ssc-card"
                  style={{ background: "#111", borderColor: accent, "--hover": accent }}
                >
                  {/* Barra "TALLER" con el color de acento */}
                  <div className="ssc-bar" style={{ background: accent }}>
                    {lbl("badge", "TALLER", "WORKSHOP")}
                  </div>
                  <div className="ssc-body">
                    {/* Duración + título a la izquierda; recuadro "Powered by" a la derecha */}
                    <div className="ssc-title-row">
                      <div className="ssc-title-left">
                        <span className="ssc-time-pill" style={{ background: accent }}>
                          {formatTime(s.start_time)} – {formatTime(s.end_time)}
                        </span>
                        <div className="ssc-session-title">{confTitle(s, lang)}</div>
                      </div>
                      {/* Recuadro "Powered by": solo si la sesión trae logo */}
                      {logo ? (
                        <div className="ssc-powered">
                          <span className="ssc-powered-label">
                            {lbl("poweredBy", "Powered by", "Powered by")}
                          </span>
                          <img
                            className="ssc-powered-logo"
                            src={logo}
                            alt={s.company || ""}
                            loading="lazy"
                          />
                        </div>
                      ) : null}
                    </div>
                    {desc ? <p className="ssc-session-desc">{desc}</p> : null}

                    {/* Bloque de instructores de la sesión (si los hay) */}
                    {speakers.length > 0 && (
                      <div className="ssc-speakers">
                        <div className="ssc-speakers-label">
                          {speakers.length > 1
                            ? lbl("instructorsWord", "Instructores", "Instructors")
                            : lbl("instructorWord", "Instructor", "Instructor")}
                        </div>
                        <div
                          className="ssc-speakers-list"
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: "12px 16px",
                          }}
                        >
                          {speakers.map((p) => {
                            const bio = speakerBio(p, lang);
                            const photo = speakerPhoto(p.photo);
                            const hasBio = Boolean(bio);
                            // Cargo y empresa resueltos por idioma (helpers del API).
                            const role = speakerRole(p, lang);
                            const org = speakerOrg(p, lang);
                            return (
                              <div
                                key={p.id ?? p.name}
                                className="ssc-speaker-row"
                                // Si el instructor tiene semblanza, la fila es clickeable
                                // y expone los data-bio-* que abren el BioModal compartido.
                                {...(hasBio
                                  ? {
                                      "data-bio-trigger": true,
                                      "data-bio-name": p.name || "",
                                      "data-bio-role": role,
                                      "data-bio-org": org,
                                      "data-bio-bio": bio,
                                      "data-bio-photo": photo || "",
                                      style: { cursor: "pointer" },
                                    }
                                  : { style: { cursor: "default" } })}
                              >
                                {photo ? (
                                  <img
                                    className="ssc-avatar"
                                    src={photo}
                                    alt={p.name}
                                    loading="lazy"
                                  />
                                ) : (
                                  <span className="ssc-avatar" />
                                )}
                                <div>
                                  <div className="ssc-speaker-name">{p.name}</div>
                                  {role && (
                                    <div className="ssc-speaker-role">{role}</div>
                                  )}
                                  {org && (
                                    <div className="ssc-speaker-org">{org}</div>
                                  )}
                                </div>
                                {/* Chevron: solo cuando hay semblanza que abrir */}
                                {hasBio && <span className="ssc-chevron">›</span>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}