// ============================================================================
//  ISLA REACT SkillsWorkshopsLive.jsx — Catálogo "Talleres disponibles"
//  Autor: Donovan Oswaldo Villalba Hernandez
//
//  Isla React del catálogo de talleres de SMART SKILLS. La info de cada taller
//  es ESTÁTICA (llega como prop `workshops` desde el .astro, tomada de
//  src/data/workshops.js). Lo ÚNICO que se consume en vivo de la base de datos
//  es la BARRA DE CUPO (endpoint /workshops): capacidad e inscritos.
//
//  Reemplaza al <script> que antes vivía dentro del .astro (mala práctica): aquí
//  la lógica de fetch/estado/eventos está encapsulada en React. Usa las clases
//  sw-*, servidas desde skills.css.
//
//  Flujo:
//   - Al montar, hace fetch a /workshops y guarda el cupo en `cupoMap`; refresca
//     cada 20 s y cada vez que se dispara el evento "workshop:registered".
//   - "Inscribirme" emite "workshop:preselect" y hace scroll al formulario (#wf-form).
// ============================================================================

import { useEffect, useState } from "react";

// Colores por nivel (la llave es el valor "crudo" del dato: BÁSICO/INTERMEDIO/AVANZADO).
const NIVEL_COLORS = {
  "BÁSICO": "#3a8f5a",
  "INTERMEDIO": "#c79a2a",
  "AVANZADO": "#E2101A",
};

export default function SkillsWorkshopsLive(props) {
  // Defaults adentro (no en la firma) para no forzar el tipo never[] que hace
  // que TS reclame al pasar el arreglo desde el .astro.
  const workshops = props.workshops || [];
  const labels = props.labels || {};
  const accent = props.accent || "#E2101A";

  // Base del API. En DEV ajusta el puerto al de tu server local (aquí 3005,
  // igual que tenías en el .astro). En producción va contra /server/.
  const API = import.meta.env.DEV
    ? "http://localhost:3010/"
    : "https://smarttechnologyexpo.mx/server/";

  // cupoMap: { [workshop_id]: { capacity, registered } } que llega de /workshops.
  // null mientras no se ha cargado (se muestra el cupo estático inicial).
  const [cupoMap, setCupoMap] = useState(null);

  // Trae el cupo en vivo al montar y lo mantiene actualizado (intervalo + evento).
  useEffect(() => {
    let alive = true;

    // refresh: consulta /workshops e indexa el resultado por workshop_id.
    async function refresh() {
      try {
        const res = await fetch(API + "workshops");
        const data = await res.json();
        if (!alive || !data.status || !Array.isArray(data.workshops)) return;
        const map = {};
        for (const w of data.workshops) map[Number(w.workshop_id)] = w;
        setCupoMap(map);
      } catch (e) {
        // Si el backend no responde, dejamos el cupo estático; no rompemos la UI.
        console.error("No se pudo obtener el cupo", e);
      }
    }

    refresh();
    const id = setInterval(refresh, 20000);          // refresco cada 20 s
    window.addEventListener("workshop:registered", refresh); // y al registrarse alguien

    return () => {
      alive = false;
      clearInterval(id);
      window.removeEventListener("workshop:registered", refresh);
    };
  }, [API]);

  // Al pulsar "Inscribirme": preselecciona el taller en el formulario y baja a él.
  const handleEnroll = (workshopId, disabled) => {
    if (disabled) return;
    window.dispatchEvent(
      new CustomEvent("workshop:preselect", { detail: { workshop_id: Number(workshopId) } }),
    );
    const form = document.querySelector("#wf-form");
    if (form) form.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Atajos de textos de cupo (con respaldo por si falta el label traducido).
  const t_avail = labels.seatsAvailable || "lugares disponibles";
  const t_last = labels.seatsLast || "¡Últimos {n} lugares!";
  const t_full = labels.soldOut || "Cupo lleno";
  const t_cap = labels.capacity || "Cupo";

  // Traduce la etiqueta de nivel según los labels recibidos.
  const nivelLabel = (nivel) =>
    ({
      "BÁSICO": labels.nivelBasic || "BÁSICO",
      "INTERMEDIO": labels.nivelIntermediate || "INTERMEDIO",
      "AVANZADO": labels.nivelAdvanced || "AVANZADO",
    }[nivel] || nivel);

  return (
    <section className="sw-section">
      <div className="sw-inner">
        {/* Encabezado: eyebrow + título + nota */}
        <div className="sw-eyebrow">{labels.eyebrow || "CATÁLOGO"}</div>
        <h2 className="sw-title">{labels.title || "Talleres disponibles"}</h2>
        <p className="sw-note">{labels.note || ""}</p>

        {/* Rejilla de tarjetas: una por taller */}
        <div className="sw-grid">
          {workshops.map((w, idx) => {
            const workshopId = w.workshopId ?? idx + 1;

            // Cupo: si ya llegó el dato en vivo, se usa capacity/registered de la BD;
            // si no, se usa el cupo estático del dato como valor inicial.
            const live = cupoMap ? cupoMap[Number(workshopId)] : null;
            const capacity = live ? Number(live.capacity) || 0 : w.cupo;
            const registered = live ? Number(live.registered) || 0 : 0;
            const disp = Math.max(capacity - registered, 0);
            const soldOut = disp <= 0;
            const low = disp > 0 && disp <= 5;
            const fillPercent = capacity > 0 ? Math.round(((capacity - disp) / capacity) * 100) : 0;

            // Texto y colores del cupo según disponibilidad (agotado / pocos / normal).
            const cupoText = soldOut
              ? t_full
              : low
                ? t_last.replace("{n}", String(disp))
                : `${disp} ${t_avail}`;
            const cupoColor = low || soldOut ? accent : "#cfcfcf";
            const fillBg = low || soldOut ? accent : `linear-gradient(90deg,#0D3B66,${accent})`;
            const nivelColor = NIVEL_COLORS[w.nivel] || accent;

            return (
              <div className="sw-card" data-ws-id={workshopId} key={workshopId}>
                <div className="sw-card-top"></div>
                <div className="sw-card-body">
                  {/* Cabecera: nivel + duración (con ícono de reloj) */}
                  <div className="sw-card-head">
                    <span className="sw-nivel" style={{ background: nivelColor }}>
                      {nivelLabel(w.nivel)}
                    </span>
                    <span className="sw-duracion">
                      <svg className="sw-clock-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {w.duracion}
                    </span>
                  </div>
                  <h3 className="sw-name">{w.name}</h3>

                  {/* Instructor: nombre + cargo (sin foto ni botón de semblanza) */}
                  <div className="sw-instructor">
                    <div>
                      <div className="sw-instructor-name">{w.instructor}</div>
                      <div className="sw-instructor-role">{w.instructorRole}</div>
                    </div>
                  </div>

                  {/* Datos: día, horario y sala */}
                  <div className="sw-info">
                    <div className="sw-info-row"><span>{labels.day || "DÍA"}</span><span>{w.dia}</span></div>
                    <div className="sw-info-row"><span>{labels.schedule || "HORARIO"}</span><span>{w.horario}</span></div>
                    <div className="sw-info-row"><span>{labels.room || "SALA"}</span><span>{w.sala}</span></div>
                  </div>

                  {/* Requisitos del taller */}
                  <div className="sw-req">
                    <div className="sw-req-label">{labels.reqs || "REQUISITOS"}</div>
                    <ul className="sw-req-list">
                      {(w.requisitos || []).map((req, i) => (
                        <li key={i}><span className="sw-req-bullet">›</span>{req}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Pie: barra de cupo en vivo + botón Inscribirme (deshabilitado si lleno) */}
                  <div className="sw-footer">
                    <div className="sw-cupo-row">
                      <span className="sw-cupo-text" style={{ color: cupoColor }}>{cupoText}</span>
                      <span className="sw-cupo-total">{t_cap} {capacity}</span>
                    </div>
                    <div className="sw-cupo-bar">
                      <div className="sw-cupo-fill" style={{ width: `${fillPercent}%`, background: fillBg }}></div>
                    </div>
                    <button
                      className="sw-cta"
                      type="button"
                      disabled={soldOut}
                      style={{ background: soldOut ? "#333" : accent }}
                      onClick={() => handleEnroll(workshopId, soldOut)}
                    >
                      {soldOut ? t_full : (labels.enroll || "Inscribirme")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}