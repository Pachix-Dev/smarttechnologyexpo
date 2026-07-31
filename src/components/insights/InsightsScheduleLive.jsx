// InsightsScheduleLive.jsx — Isla React que reemplaza los datos estáticos de
// InsightsSchedule por el programa en vivo de la API (mismo patrón que Ecomondo).
// Conserva el look oscuro: usa las mismas clases isc-* de insights.css.
// Los ponentes con semblanza abren el BioModal.astro compartido vía data-bio-*.
//
// AJUSTES STE 2026 (nada se borró; lo que se oculta queda COMENTADO):
//  - "Descarga programa" comentado (queda solo el aviso de idioma).
//  - La fecha del banner ahora muestra solo mes + año (p. ej. "Noviembre 2026").
//  - Categoría "Conferencia" de la leyenda comentada (quedan Keynote y Panel).

import { useEffect, useMemo, useState } from "react";
import {
  fetchStage,
  INSIGHTS_STAGE_ID,
  confTitle,
  confDesc,
  speakerBio,
  speakerPhoto,
  companyLogo,
  typeMeta,
  formatTime,
  dayNumber,
  daySessions,
} from "./insightsApi.js";

export default function InsightsScheduleLive({
  lang = "es",
  stageId = INSIGHTS_STAGE_ID,
  pdfHref = "#",
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

  // Fecha del banner: SOLO mes + año, sin día de la semana ni "de".
  // ES -> "Noviembre 2026", EN -> "November 2026".
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
      <section className="isc-section">
        <div className="ins-state">
          <div className="ins-spinner-wrap">
            <div className="ins-spinner" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="isc-section">
        <div className="ins-state">
          <div className="ins-error">
            {t("Error al cargar el programa: ", "Error loading the program: ")}
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (!stage || days.length === 0) {
    return (
      <section className="isc-section">
        <div className="ins-state">
          <div className="ins-empty">
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
    <section className="isc-section">
      <div className="isc-inner">
        <div className="isc-eyebrow">{lbl("eyebrow", "AGENDA", "AGENDA")}</div>
        <h2 className="isc-title">{lbl("title", "Programa por día", "Daily program")}</h2>
        <p className="isc-sub">
          {lbl(
            "sub",
            "Selecciona un día para ver las conferencias, paneles y horarios.",
            "Pick a day to see the conferences, panels and schedule.",
          )}
        </p>

        <div className="isc-toprow">
          {/* OCULTO POR AHORA (ajuste STE 2026): sección "Descarga programa".
              No se borró; para reactivarla, descomenta este bloque.
          <div>
            <div className="isc-dl-label">
              {lbl("dlLabel", "DESCARGA GRATUITA", "FREE DOWNLOAD")}
            </div>
            <a href={pdfHref} className="isc-dl-btn">
              <span className="isc-dl-icon">PDF</span>
              {lbl("dlBtn", "DESCARGA PROGRAMA", "DOWNLOAD PROGRAM")}
              <span>⬇</span>
            </a>
          </div>
          */}
          <div className="isc-notice">
            <span className="isc-notice-i">i</span>
            <span>
              {lbl(
                "notice",
                "Todas las ponencias se realizarán en español",
                "All presentations will be held in Spanish",
              )}
            </span>
          </div>
        </div>

        <div className="isc-day-label">
          {lbl("selectDay", "SELECCIONA EL DÍA", "SELECT A DAY")}
        </div>
        <div className="isc-day-pills">
          {days.map((d, i) => (
            <button
              key={d.id ?? i}
              type="button"
              className={
                i === activeDay ? "isc-pill isc-pill--active" : "isc-pill"
              }
              onClick={() => setActiveDay(i)}
            >
              {d.name || `${t("Día", "Day")} ${i + 1}`}
            </button>
          ))}
        </div>

        {dia && (
          <div className="isc-banner">
            <div className="isc-banner-left">
              <div className="isc-banner-num">{dayNumber(dia.date)}</div>
              <div>
                <div className="isc-banner-name">{dia.name}</div>
                <div className="isc-banner-date">{monthYear(dia.date)}</div>
              </div>
            </div>
            <span className="isc-banner-count">
              <span className="isc-banner-dot" />
              {sessions.length} {lbl("sessionsWord", "sesiones", "sessions")}
            </span>
          </div>
        )}

        <div className="isc-legend">
          <div className="isc-legend-item">
            <span className="isc-legend-dot" style={{ background: "#2563EB" }} />
            Keynote
          </div>
          <div className="isc-legend-item">
            <span className="isc-legend-dot" style={{ background: "#0D9488" }} />
            Panel
          </div>
          {/* OCULTO (ajuste STE 2026): categoría "Conferencia". No se borró.
          <div className="isc-legend-item">
            <span className="isc-legend-dot" style={{ background: "#9333EA" }} />
            {lbl("legendConference", "Conferencia", "Conference")}
          </div>
          */}
        </div>

        <div className="isc-sessions">
          {sessions.length === 0 ? (
            <div className="ins-empty">
              {t("No hay sesiones para este día.", "No sessions for this day.")}
            </div>
          ) : (
            sessions.map((s) => {
              const meta = typeMeta(s.type);
              const speakers = s.ponentes || [];
              const desc = confDesc(s, lang);
              // Logo de la empresa de la conferencia (viene de la API en company_logo).
              const logo = companyLogo(s.company_logo);
              return (
                <div
                  key={s.id}
                  className="isc-card"
                  // tarjeta neutra: el color de tipo vive en la barra/pill/hover, no en el fondo
                  style={{ background: "#111", borderColor: meta.bar, "--hover": meta.bar }}
                >
                  <div className="isc-bar" style={{ background: meta.bar }}>
                    {(labels.badges &&
                      labels.badges[String(s.type || "").toLowerCase()]) ||
                      meta.badge}
                  </div>
                  <div className="isc-body">
                    {/* Duración y título en la MISMA fila; recuadro "Powered by" a la derecha */}
                    <div className="isc-title-row">
                      <div className="isc-title-left">
                        <span
                          className="isc-time-pill"
                          style={{ background: meta.bar }}
                        >
                          {formatTime(s.start_time)} – {formatTime(s.end_time)}
                        </span>
                        <div className="isc-session-title">
                          {confTitle(s, lang)}
                        </div>
                      </div>
                      {logo ? (
                        <div className="isc-powered">
                          <span className="isc-powered-label">
                            {lbl("poweredBy", "Powered by", "Powered by")}
                          </span>
                          <img
                            className="isc-powered-logo"
                            src={logo}
                            alt={s.company || ""}
                            loading="lazy"
                          />
                        </div>
                      ) : null}
                    </div>
                    {desc ? <p className="isc-session-desc">{desc}</p> : null}

                    {speakers.length > 0 && (
                      <div className="isc-speakers">
                        <div className="isc-speakers-label">
                          {speakers.length > 1
                            ? lbl("speakersWord", "Ponentes", "Speakers")
                            : lbl("speakerWord", "Ponente", "Speaker")}
                        </div>
                        {/* Grid en vez de columna única: aprovecha el ancho cuando hay 2+ ponentes */}
                        <div
                          className="isc-speakers-list"
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
                            // Cargo/empresa en inglés si la API los trae (position_en/
                            // company_en); si no, cae al valor en español. Ajuste STE 2026.
                            const role =
                              lang === "en"
                                ? p.position_en || p.position || p.role || ""
                                : p.position || p.role || "";
                            const org =
                              lang === "en"
                                ? p.company_en || p.company || ""
                                : p.company || "";
                            return (
                              <div
                                key={p.id ?? p.name}
                                className="isc-speaker-row"
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
                                    className="isc-avatar"
                                    src={photo}
                                    alt={p.name}
                                    loading="lazy"
                                  />
                                ) : (
                                  <span className="isc-avatar" />
                                )}
                                <div>
                                  <div className="isc-speaker-name">
                                    {p.name}
                                  </div>
                                  {role && (
                                    <div className="isc-speaker-role">{role}</div>
                                  )}
                                  {org && (
                                    <div className="isc-speaker-org">{org}</div>
                                  )}
                                </div>
                                {hasBio && (
                                  <span className="isc-chevron">›</span>
                                )}
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