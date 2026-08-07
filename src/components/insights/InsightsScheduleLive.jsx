// ============================================================================
//  ISLA REACT InsightsScheduleLive.jsx — Programa en vivo (SMART INSIGHTS)
//  Autor: Donovan Oswaldo Villalba Hernandez
//
//  Isla React que reemplaza los datos estáticos de InsightsSchedule por el
//  programa en vivo de la API (mismo patrón que Ecomondo). Conserva el look
//  oscuro: usa las mismas clases isc-* de insights.css. Los ponentes con
//  semblanza abren el BioModal.astro compartido vía atributos data-bio-*.
//
//  AJUSTES STE 2026 (nada se borró; lo que se oculta queda COMENTADO):
//   - "Descarga programa" comentado (queda solo el aviso de idioma).
//   - La fecha del banner ahora muestra solo mes + año (p. ej. "Noviembre 2026").
//   - Categoría "Conferencia" de la leyenda comentada (quedan Keynote y Panel).
//   - Cargo/empresa del ponente pueden venir en inglés (position_en/company_en).
//
//  Flujo:
//   - Al montar, fetchStage(stageId) y guarda el escenario en estado.
//   - Maneja 3 estados de carga: loading (spinner) / error / vacío.
//   - El usuario cambia de día con los "pills"; se muestran sus sesiones.
//   - Los textos de interfaz llegan ya traducidos en `labels` desde el wrapper.
// ============================================================================

import { useEffect, useMemo, useState } from "react";
import {
  fetchStage,
  INSIGHTS_STAGE_ID,
  confTitle,
  confDesc,
  speakerBio,
  speakerRole,
  speakerOrg,
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
        // Selecciona por defecto el primer día que tenga conferencias.
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

  // Fecha del banner: SOLO mes + año, sin día de la semana ni "de".
  // ES -> "Noviembre 2026", EN -> "November 2026".
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
      <section className="isc-section">
        <div className="ins-state">
          <div className="ins-spinner-wrap">
            <div className="ins-spinner" />
          </div>
        </div>
      </section>
    );
  }

  // ── ESTADO: error ────────────────────────────────────────────────────────
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

  // ── ESTADO: sin datos ────────────────────────────────────────────────────
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

  // ── RENDER PRINCIPAL ─────────────────────────────────────────────────────
  return (
    <section className="isc-section">
      <div className="isc-inner">
        {/* Encabezado: eyebrow + título + subtítulo */}
        <div className="isc-eyebrow">{lbl("eyebrow", "AGENDA", "AGENDA")}</div>
        <h2 className="isc-title">{lbl("title", "Programa por día", "Daily program")}</h2>
        <p className="isc-sub">
          {lbl(
            "sub",
            "Selecciona un día para ver las conferencias, paneles y horarios.",
            "Pick a day to see the conferences, panels and schedule.",
          )}
        </p>

        {/* Fila superior: (descarga oculta en STE 2026) + aviso de idioma */}
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

        {/* Selector de día: un "pill" por cada día del escenario */}
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

        {/* Banner del día activo: número, nombre, mes+año y conteo de sesiones */}
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

        {/* Leyenda de tipos (en STE 2026 solo Keynote y Panel) */}
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

        {/* Lista de sesiones del día activo */}
        <div className="isc-sessions">
          {sessions.length === 0 ? (
            <div className="ins-empty">
              {t("No hay sesiones para este día.", "No sessions for this day.")}
            </div>
          ) : (
            sessions.map((s) => {
              // meta: estilo (badge + color) según el tipo de sesión.
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
                  {/* Barra de color con el badge del tipo (traducido si hay label) */}
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
                      {/* Recuadro "Powered by": solo si la sesión trae logo */}
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

                    {/* Bloque de ponentes de la sesión (si los hay) */}
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
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "12px 16px",
                          }}
                        >
                          {speakers.map((p) => {
                            const bio = speakerBio(p, lang);
                            const photo = speakerPhoto(p.photo);
                            const hasBio = Boolean(bio);
                            // Cargo (position_esp/position_eng) y empresa
                            // (company/company_eng) según idioma, con respaldo.
                            const role = speakerRole(p, lang);
                            const org = speakerOrg(p, lang);
                            return (
                              <div
                                key={p.id ?? p.name}
                                className="isc-speaker-row"
                                // Si el ponente tiene semblanza, la fila es clickeable y
                                // expone los data-bio-* que abren el BioModal compartido.
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
                                {/* Chevron: solo cuando hay semblanza que abrir */}
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