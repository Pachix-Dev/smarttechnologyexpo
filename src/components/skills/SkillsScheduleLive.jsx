// SkillsScheduleLive.jsx — Isla React del "Programa por día" de SMART SKILLS.
// Consume EN VIVO la misma API que Insights, pero con OTRO escenario (stageId=9).
// Estilos propios en skillsSchedule.css (clases ssc-*), con el look de Skills:
// acento rojo y badge "TALLER". Instructores con semblanza abren el BioModal.
//
// AJUSTES STE 2026 incluidos:
//  - "Descarga programa" oculto (comentado).
//  - Fecha del banner: solo mes + año ("Noviembre 2026").
//  - Cargo/empresa en inglés vía speakerRole/speakerOrg (API en > diccionario > es).

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
  const [stage, setStage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchStage(stageId)
      .then((data) => {
        if (!alive) return;
        setStage(data);
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

  const t = (es, en) => (lang === "en" ? en : es);
  const lbl = (key, es, en) => (labels && labels[key]) || t(es, en);

  // Fecha del banner: SOLO mes + año ("Noviembre 2026" / "November 2026").
  const monthYear = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d)) return "";
    const month = d.toLocaleDateString(lang === "en" ? "en-US" : "es-MX", {
      month: "long",
    });
    const cap = month.charAt(0).toUpperCase() + month.slice(1);
    return `${cap} ${d.getFullYear()}`;
  };

  const days = stage?.dias || [];
  const dia = days[activeDay] || days[0] || null;
  const sessions = useMemo(() => daySessions(dia), [dia]);

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

  return (
    <section className="ssc-section">
      <div className="ssc-inner">
        <div className="ssc-eyebrow">{lbl("eyebrow", "AGENDA", "AGENDA")}</div>
        <h2 className="ssc-title">{lbl("title", "Programa por día", "Daily program")}</h2>

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

        <div className="ssc-sessions">
          {sessions.length === 0 ? (
            <div className="ssc-empty">
              {t("No hay sesiones para este día.", "No sessions for this day.")}
            </div>
          ) : (
            sessions.map((s) => {
              const speakers = s.ponentes || [];
              const desc = confDesc(s, lang);
              const logo = companyLogo(s.company_logo);
              return (
                <div
                  key={s.id}
                  className="ssc-card"
                  style={{ background: "#111", borderColor: accent, "--hover": accent }}
                >
                  <div className="ssc-bar" style={{ background: accent }}>
                    {lbl("badge", "TALLER", "WORKSHOP")}
                  </div>
                  <div className="ssc-body">
                    <div className="ssc-title-row">
                      <div className="ssc-title-left">
                        <span className="ssc-time-pill" style={{ background: accent }}>
                          {formatTime(s.start_time)} – {formatTime(s.end_time)}
                        </span>
                        <div className="ssc-session-title">{confTitle(s, lang)}</div>
                      </div>
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
                            const role = speakerRole(p, lang);
                            const org = speakerOrg(p, lang);
                            return (
                              <div
                                key={p.id ?? p.name}
                                className="ssc-speaker-row"
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