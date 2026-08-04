// ============================================================================
//  ISLA REACT InsightsSpeakersLive.jsx — Keynote Speakers (SMART INSIGHTS)
//  Autor: Donovan Oswaldo Villalba Hernandez
//
//  Isla React con la grid de "Keynote Speakers" construida desde la API
//  (ponentes únicos del escenario). Se muestran en un carrusel horizontal
//  AUTOMÁTICO (marquee con animación CSS) que se desliza solo, en bucle sin
//  cortes y sin botones. Se pausa al pasar el mouse y respeta prefers-reduced-motion.
//
//  NOTA (ajustes STE 2026): en el carrusel se OMITE la opción "VER SEMBLANZA"
//  (ya no hay botón ni apertura del BioModal desde aquí) y se quitó el eyebrow
//  "PONENTES DESTACADOS": queda únicamente el encabezado "Keynote Speakers".
//
//  Flujo:
//   - Al montar, fetchStage(stageId) → uniqueSpeakers → filtra los que tienen foto.
//   - Maneja loading / error / vacío y, si hay ponentes, arma el marquee.
//   - Los textos de interfaz llegan traducidos en `labels` desde el wrapper.
// ============================================================================

import { useEffect, useState } from "react";
import {
  fetchStage,
  INSIGHTS_STAGE_ID,
  speakerPhoto,
  uniqueSpeakers,
} from "./insightsApi.js";

// Segundos que tarda cada tarjeta en cruzar. Menos = más rápido.
const SECONDS_PER_CARD = 5;

export default function InsightsSpeakersLive({
  lang = "es",
  stageId = INSIGHTS_STAGE_ID,
  labels = {},
}) {
  // Estado: lista de ponentes + banderas de carga/error.
  const [speakers, setSpeakers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carga al montar (y al cambiar stageId). `alive` evita setState tras desmontar.
  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchStage(stageId)
      .then((stage) => {
        if (!alive) return;
        // Solo entran al carrusel los ponentes con foto: si la ficha aún está
        // incompleta (sin foto), el ponente se omite hasta que la suban al CMS.
        const conFoto = uniqueSpeakers(stage).filter((sp) =>
          Boolean(speakerPhoto(sp.photo)),
        );
        setSpeakers(conFoto);
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

  // t: texto por idioma. lbl: label traducido si existe, si no t().
  const t = (es, en) => (lang === "en" ? en : es);
  const lbl = (key, es, en) => (labels && labels[key]) || t(es, en);

  // renderCard: dibuja una tarjeta de ponente (foto + nombre + cargo + empresa).
  // En STE 2026 ya no incluye botón de semblanza.
  const renderCard = (sp, i) => {
    const photo = speakerPhoto(sp.photo);
    // Cargo/empresa en inglés si la API los trae (position_en/company_en);
    // si no, cae al valor en español. Ajuste STE 2026.
    const role =
      lang === "en"
        ? sp.position_en || sp.position || sp.role || ""
        : sp.position || sp.role || "";
    const org =
      lang === "en"
        ? sp.company_en || sp.company || ""
        : sp.company || "";
    return (
      <div key={`${sp.id ?? sp.name}-${i}`} className="isp-card">
        <div className="isp-photo">
          <span className="isp-badge">KEYNOTE</span>
          {photo ? (
            <img
              className="isp-photo-img"
              src={photo}
              alt={sp.name}
              loading="lazy"
            />
          ) : (
            <span className="isp-photo-label">
              {lbl("photo", "foto ponente", "speaker photo")}
            </span>
          )}
        </div>
        <div className="isp-body">
          <div className="isp-name">{sp.name}</div>
          {role && <div className="isp-role">{role}</div>}
          {org && <div className="isp-company">{org}</div>}
        </div>
      </div>
    );
  };

  // Duración de una vuelta completa (recorre un set de tarjetas).
  // Se usa un mínimo de 4 tarjetas para que el bucle no sea demasiado rápido.
  const duration = speakers
    ? `${Math.max(speakers.length, 4) * SECONDS_PER_CARD}s`
    : "30s";

  return (
    <section className="isp-section">
      <div className="isp-inner">
        {/* Encabezado: título a la izquierda, nota a la derecha (sin eyebrow en STE 2026) */}
        <div className="isp-head">
          <div>
            <h2 className="isp-title">
              {lbl("title", "Keynote Speakers", "Keynote Speakers")}
            </h2>
          </div>
          <span className="isp-note">
            {lbl(
              "note",
              "Programa preliminar · sujeto a cambios",
              "Preliminary program · subject to change",
            )}
          </span>
        </div>

        {/* Estado: cargando */}
        {loading && (
          <div className="ins-spinner-wrap">
            <div className="ins-spinner" />
          </div>
        )}

        {/* Estado: error */}
        {!loading && error && (
          <div className="ins-error">
            {t("Error al cargar los ponentes: ", "Error loading speakers: ")}
            {error}
          </div>
        )}

        {/* Estado: vacío */}
        {!loading && !error && (!speakers || speakers.length === 0) && (
          <div className="ins-empty">
            {t("Aún no hay ponentes publicados.", "No speakers published yet.")}
          </div>
        )}

        {/* Carrusel: la lista se duplica y el CSS (translateX -50%) hace el bucle */}
        {!loading && !error && speakers && speakers.length > 0 && (
          <div className="isp-carousel">
            <div className="isp-viewport">
              <div className="isp-marquee" style={{ animationDuration: duration }}>
                {/* Lista duplicada: el translateX(-50%) hace el bucle sin cortes */}
                {speakers.map((sp, i) => renderCard(sp, i))}
                {speakers.map((sp, i) => renderCard(sp, speakers.length + i))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}