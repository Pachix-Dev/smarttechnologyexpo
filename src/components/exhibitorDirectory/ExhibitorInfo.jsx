const normalizeUrl = (url) => {
  if (!url) return null;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

const InfoRow = ({ label, value, href }) => {
  if (!value) return null;

  return (
    <div className="border-b border-slate-200 py-3 last:border-b-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-800">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="break-words font-medium text-red-700 hover:text-red-800"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
};

export function ExhibitorInfo({ exhibitor, onClose }) {
  if (!exhibitor) return null;

  const name = exhibitor.tradename || exhibitor.legal_company_name;
  const website = normalizeUrl(exhibitor.webpage);
  const linkedin = normalizeUrl(exhibitor.linkedin);
  const facebook = normalizeUrl(exhibitor.facebook);
  const instagram = normalizeUrl(exhibitor.instagram);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-3 sm:items-center sm:p-6"
      role="presentation"
      onClick={onClose}
    >
      <section
        className="my-3 w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-2xl sm:my-0 sm:max-h-[90vh] sm:overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exhibitor-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="sticky top-0 z-10 flex flex-col gap-4 border-b border-slate-200 bg-white p-4 pr-14 sm:flex-row sm:items-start sm:justify-between sm:p-5 sm:pr-16">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            {exhibitor.logo && (
              <div className="flex h-16 w-24 flex-none items-center justify-center rounded-md bg-slate-50 p-2 sm:h-20">
                <img
                  src={exhibitor.logo}
                  alt={`${name} logo`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            )}
            <div className="min-w-0">
              <h2
                id="exhibitor-modal-title"
                className="break-words text-xl font-bold leading-tight text-slate-950 sm:text-2xl"
              >
                {name}
              </h2>
              {exhibitor.stand_number && (
                <p className="mt-2 text-sm font-semibold text-red-700">
                  Stand {exhibitor.stand_number}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-slate-100 text-xl leading-none text-slate-700 hover:bg-slate-200 sm:right-4 sm:top-4"
            aria-label="Cerrar modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 7l10 10M7 17L17 7"/></svg>
          </button>
        </header>

        <div className="grid gap-6 p-4 sm:p-5 lg:grid-cols-[1.2fr_0.8fr]">
          <section>
            <h3 className="text-lg font-bold text-slate-950">Información</h3>
            <dl className="mt-3">
              <InfoRow label="Razón social" value={exhibitor.legal_company_name} />
              <InfoRow label="Descripción en español" value={exhibitor.description_es} />
              <InfoRow label="Descripción en inglés" value={exhibitor.description_en} />
              <InfoRow
                label="Coexpositor"
                value={exhibitor.coexhibitors || "Sin coexpositor"}
              />
            </dl>
          </section>

          <aside>
            <h3 className="text-lg font-bold text-slate-950">Contacto</h3>
            <dl className="mt-3">
              <InfoRow label="Sitio web" value={exhibitor.webpage} href={website} />
              <InfoRow label="LinkedIn" value={exhibitor.linkedin} href={linkedin} />
              <InfoRow label="Facebook" value={exhibitor.facebook} href={facebook} />
              <InfoRow label="Instagram" value={exhibitor.instagram} href={instagram} />
              <InfoRow label="Dirección" value={exhibitor.address} />
              <InfoRow label="Ciudad" value={exhibitor.city} />
              <InfoRow label="Estado" value={exhibitor.state} />
              <InfoRow label="País" value={exhibitor.country} />
              <InfoRow label="Código postal" value={exhibitor.zip_code} />
              <InfoRow label="Contacto" value={exhibitor.contact_name} />
              <InfoRow
                label="Correo"
                value={exhibitor.contact_email}
                href={exhibitor.contact_email ? `mailto:${exhibitor.contact_email}` : null}
              />
              <InfoRow
                label="Teléfono"
                value={exhibitor.contact_phone}
                href={exhibitor.contact_phone ? `tel:${exhibitor.contact_phone}` : null}
              />
            </dl>
          </aside>
        </div>
      </section>
    </div>
  );
}
