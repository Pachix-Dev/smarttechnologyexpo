// WorkshopFormIsland.jsx — Isla React del registro a talleres (3 pasos).
// La lógica vive aquí con estado (useState); los textos llegan traducidos
// desde el wrapper .astro vía la prop `labels` (que sale de tus locales).

import { useEffect, useState } from "react";

// Base de la API del backend: localhost en dev, dominio /server/ en prod.
const API = import.meta.env.DEV
  ? "http://localhost:3005/"
  : "https://smarttechnologyexpo.mx/server/";

export default function WorkshopFormIsland({
  lang = "es",
  labels = {},
  accent = "#E2101A",
  registroHref = "/registro/",
}) {
  const L = labels; // atajo

  // --- Estado ---
  const [step, setStep] = useState("lookup"); // 'lookup' | 'found' | 'success'
  const [email, setEmail] = useState("");
  const [lookupError, setLookupError] = useState(false);
  const [loadingLookup, setLoadingLookup] = useState(false);

  const [workshops, setWorkshops] = useState([]);
  const [visitor, setVisitor] = useState(null); // { name, paternSurname, email, phone, company, position }
  const [workshopId, setWorkshopId] = useState("");
  const [selectError, setSelectError] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // --- Cargar talleres activos al montar ---
  useEffect(() => {
    let alive = true;
    fetch(API + "workshops")
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        if (data.status && Array.isArray(data.workshops)) setWorkshops(data.workshops);
      })
      .catch((e) => console.error("No se pudieron cargar los talleres", e));
    return () => {
      alive = false;
    };
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
    <section className="wf-section" style={{ "--accent": accent }}>
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
              <div className="wf-perk">
                <span className="wf-perk-n">3</span>
                {L.perk3}
              </div>
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
                    {workshops.map((w) => (
                      <option key={w.workshop_id} value={w.workshop_id}>
                        {lang === "en" ? w.name_en : w.name_es}
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