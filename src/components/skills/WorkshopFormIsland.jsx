// WorkshopFormIsland.jsx — Isla React del registro a talleres (3 pasos).
// La lógica vive aquí con estado (useState); los textos llegan traducidos
// desde el wrapper .astro vía la prop `labels` (que sale de tus locales).

import { useEffect, useState } from "react";
// Los NOMBRES de los talleres del <select> salen de la MISMA fuente estática
// que el catálogo (src/data/workshops.js), no del backend. Así las opciones
// siempre están presentes y no dependen de que /workshops responda.
import { workshops as workshopsData } from "../../data/workshops.js";

// Base de la API del backend: localhost en dev, dominio /server/ en prod.
const API = import.meta.env.DEV
  ? "http://localhost:3010/"
  : "https://smarttechnologyexpo.mx/server/";

export default function WorkshopFormIsland({
  lang = "es",
  labels = {},
  accent = "#E2101A",
  registroHref = "/registro/",
}) {
  const L = labels; // atajo

  // Opciones del <select>, localizadas. workshopId debe coincidir con el
  // workshop_id de la base de datos (ya lo garantiza src/data/workshops.js).
  const workshopOptions = workshopsData.map((w) => ({
    id: w.workshopId,
    name: lang === "en" ? w.name_en : w.name,
  }));

  // --- Estado ---
  const [step, setStep] = useState("lookup"); // 'lookup' | 'found' | 'success'
  const [email, setEmail] = useState("");
  const [lookupError, setLookupError] = useState(false);
  const [loadingLookup, setLoadingLookup] = useState(false);

  const [visitor, setVisitor] = useState(null); // { name, paternSurname, email, phone, company, position }
  const [workshopId, setWorkshopId] = useState("");
  const [selectError, setSelectError] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // --- Preselección desde el catálogo ---
  // Cuando en una card se pulsa "Inscribirme", SkillsWorkshopsLive dispara el
  // evento global "workshop:preselect" con el id del taller. Aquí lo escuchamos
  // y lo guardamos en `workshopId`; como el estado persiste entre pasos, cuando
  // el usuario llegue al Paso 2 el <select> ya aparecerá con ese taller elegido
  // (y como las opciones ya existen, se marca explícitamente).
  useEffect(() => {
    const onPreselect = (e) => {
      const id = e.detail?.workshop_id;
      if (id != null) setWorkshopId(String(id)); // string, para que case con el <option>
    };
    window.addEventListener("workshop:preselect", onPreselect);
    return () => window.removeEventListener("workshop:preselect", onPreselect);
  }, []);

  // --- PASO 1: buscar visitante por correo ---
  const handleLookup = async () => {
    const value = email.trim();
    if (!value) return;
    setLoadingLookup(true);
    setLookupError(false);
    try {
      const res = await fetch(
        API + "workshop-visitor?email=" + encodeURIComponent(value),
      );
      const data = await res.json();
      if (!res.ok || !data.status) {
        setLookupError(true);
        return;
      }
      setVisitor(data.visitor);
      setStep("found");
    } catch (e) {
      setLookupError(true);
    } finally {
      setLoadingLookup(false);
    }
  };

  // --- PASO 2: confirmar inscripción ---
  const handleSubmit = async () => {
    if (!workshopId) {
      setSelectError(L.select_err || "Por favor selecciona un taller.");
      return;
    }
    setSelectError("");
    setLoadingSubmit(true);
    try {
      const res = await fetch(API + "workshop-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: visitor.email,
          workshop_id: Number(workshopId),
          currentLanguage: lang,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.status) {
        setSelectError(data.message || "No se pudo completar el registro.");
        return;
      }
      setStep("success");
      // Avisa al catálogo para que la barra de cupo se actualice al instante.
      window.dispatchEvent(new CustomEvent("workshop:registered"));
    } catch (e) {
      setSelectError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const resetAll = () => {
    setEmail("");
    setWorkshopId("");
    setLookupError(false);
    setSelectError("");
    setStep("lookup");
  };

  const fullName = visitor ? `${visitor.name} ${visitor.paternSurname}` : "";

  return (
    <section className="wf-section" id="wf-form" style={{ "--accent": accent }}>
      <div className="wf-inner">
        <div className="wf-grid">
          {/* Columna izquierda: copy */}
          <div>
            <div className="wf-eyebrow">{L.eyebrow}</div>
            <h2 className="wf-title">{L.title}</h2>
            <p className="wf-desc">{L.desc}</p>

            <div className="wf-notice">
              <span className="wf-notice-i">!</span>
              <span>
                {L.notice_a}
                <strong>{L.notice_b}</strong>
                {L.notice_c}
              </span>
            </div>

            <div className="wf-perks">
              <div className="wf-perk">
                <span className="wf-perk-n">1</span>
                {L.perk1}
              </div>
              <div className="wf-perk">
                <span className="wf-perk-n">2</span>
                {L.perk2}
              </div>
              {/* OMITIDO (ajuste STE 2026): perk "Constancia de participación
                  Smart Technology Expo". No se borró; para reactivarlo, descomenta.
              <div className="wf-perk">
                <span className="wf-perk-n">3</span>
                {L.perk3}
              </div>
              */}
            </div>
          </div>

          {/* Columna derecha: tarjeta con los 3 pasos */}
          <div className="wf-card">
            {/* PASO 1: lookup */}
            {step === "lookup" && (
              <div className="wf-step">
                <div className="wf-step-label">{L.step1}</div>
                <h3 className="wf-step-title">{L.step1_title}</h3>
                <p className="wf-step-sub">{L.step1_sub}</p>
                <label className="wf-field">
                  <span>{L.email}</span>
                  <input
                    type="email"
                    placeholder={L.email_ph}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                  />
                </label>
                {lookupError && <div className="wf-error">{L.lookup_err}</div>}
                <button
                  className="wf-btn"
                  type="button"
                  onClick={handleLookup}
                  disabled={loadingLookup}
                >
                  {loadingLookup ? "..." : L.lookup_btn}
                </button>
                <p className="wf-fineprint">
                  {L.fine1_a}
                  <a href={registroHref} className="wf-fineprint-link">
                    {L.fine1_b}
                  </a>
                </p>
              </div>
            )}

            {/* PASO 2: found + confirm */}
            {step === "found" && visitor && (
              <div className="wf-step">
                <div className="wf-found-banner">
                  <span className="wf-found-check">✓</span>
                  <span>{L.found}</span>
                </div>
                <div className="wf-fields-grid">
                  <label className="wf-field">
                    <span>{L.full_name}</span>
                    <input value={fullName} disabled />
                  </label>
                  <label className="wf-field">
                    <span>{L.email}</span>
                    <input value={visitor.email || ""} disabled />
                  </label>
                  <label className="wf-field">
                    <span>{L.phone}</span>
                    <input value={visitor.phone || ""} disabled />
                  </label>
                  <label className="wf-field">
                    <span>{L.company}</span>
                    <input value={visitor.company || ""} disabled />
                  </label>
                </div>
                <label className="wf-field">
                  <span>{L.position}</span>
                  <input value={visitor.position || ""} disabled />
                </label>
                <label className="wf-field">
                  <span>{L.select_ws}</span>
                  <select
                    value={workshopId}
                    onChange={(e) => setWorkshopId(e.target.value)}
                  >
                    <option value="">{L.choose_ws}</option>
                    {workshopOptions.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </label>
                {selectError && <div className="wf-error">{selectError}</div>}
                <button
                  className="wf-btn"
                  type="button"
                  onClick={handleSubmit}
                  disabled={loadingSubmit}
                >
                  {loadingSubmit ? "..." : L.submit}
                </button>
                <button
                  className="wf-link-btn"
                  type="button"
                  onClick={() => {
                    setEmail("");
                    setLookupError(false);
                    setStep("lookup");
                  }}
                >
                  {L.other_email}
                </button>
                <p className="wf-fineprint">{L.fine2}</p>
              </div>
            )}

            {/* PASO 3: success */}
            {step === "success" && (
              <div className="wf-step wf-step--center">
                <div className="wf-success-icon">✓</div>
                <h3 className="wf-success-title">{L.success_title}</h3>
                <p className="wf-success-text">
                  {L.thanks}
                  <strong>{fullName}</strong>
                  {L.sent_to}
                  <strong>{visitor?.email}</strong>.
                </p>
                <button className="wf-outline-btn" type="button" onClick={resetAll}>
                  {L.another}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}