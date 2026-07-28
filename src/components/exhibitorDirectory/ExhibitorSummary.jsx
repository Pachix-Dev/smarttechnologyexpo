import { useMemo, useState } from "react";
import { ExhibitorInfo } from "./ExhibitorInfo.jsx";

const hasValue = (value) => value !== null && value !== undefined && value !== "";

const hasCoexhibitorRecord = (exhibitor) =>
  exhibitor.has_coexhibitors === "Sí" && hasValue(exhibitor.coexhibitors?.trim());

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const copy = {
  es: {
    searchLabel: "Buscar expositor",
    searchPlaceholder: "Buscar por empresa o stand",
    showing: "Mostrando",
    of: "de",
    exhibitors: "expositores",
    stand: "Stand",
    noStand: "Stand por confirmar",
    coexhibitor: "Coexpositor",
    details: "Ver detalles",
    emptyTitle: "No encontramos expositores",
    emptyText: "Prueba con otro nombre, stand o ubicación.",
  },
  en: {
    searchLabel: "Search exhibitor",
    searchPlaceholder: "Search by company or booth",
    showing: "Showing",
    of: "of",
    exhibitors: "exhibitors",
    stand: "Booth",
    noStand: "Booth pending",
    coexhibitor: "Co-exhibitor",
    details: "View details",
    emptyTitle: "No exhibitors found",
    emptyText: "Try another name, booth, or location.",
  },
};

const TextBlock = ({ label, children }) => {
  if (!hasValue(children)) return null;

  return (
    <div className="min-w-0">
      <p className="text-[8px] font-bold uppercase tracking-[0.08em] text-slate-500 sm:text-[9px]">
        {label}
      </p>
      <p className="mt-0.5 overflow-hidden break-words text-[10px] font-medium leading-4 text-slate-700 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:text-xs sm:leading-5">
        {children}
      </p>
    </div>
  );
};

export function ExhibitorSummary({ exhibitors, language }) {
  const [selectedExhibitor, setSelectedExhibitor] = useState(null);
  const [query, setQuery] = useState("");
  const labels = copy[language] || copy.es;

  const filteredExhibitors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return exhibitors;

    return exhibitors.filter((exhibitor) => {
      const fields = [
        exhibitor.tradename,
        exhibitor.legal_company_name,
        exhibitor.stand_number,
        exhibitor.city,
        exhibitor.state,
        exhibitor.country,
        exhibitor.webpage,
        exhibitor.coexhibitors,
      ];

      return fields
        .filter(hasValue)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [exhibitors, query]);

  return (
    <>
      <div className="mx-auto w-full max-w-[1240px] p-2 sm:p-4 sm:px-6 lg:px-8">
        <div className="sm:mt-8 border border-slate-200 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.14)] sm:p-5 lg:flex lg:items-center lg:justify-between lg:gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e30613]">
              {labels.showing} {filteredExhibitors.length} {labels.of} {exhibitors.length} {labels.exhibitors}
            </p>
          </div>

          <label className="mt-5 block w-full lg:mt-0 lg:max-w-xl">
            <span className="sr-only">{labels.searchLabel}</span>
            <span className="relative block">
              <svg
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={labels.searchPlaceholder}
                className="h-[52px] w-full border border-slate-300 bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#e30613] focus:bg-white focus:ring-4 focus:ring-red-100 sm:h-14"
              />
            </span>
          </label>
        </div>

        {filteredExhibitors.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 py-10 sm:gap-3 sm:py-16 md:grid-cols-4 lg:grid-cols-5 lg:gap-4 xl:grid-cols-6">
            {filteredExhibitors.map((exhibitor) => {
              const name = exhibitor.tradename || exhibitor.legal_company_name;
              const shouldShowCoexhibitors = hasCoexhibitorRecord(exhibitor);
              const coexhibitors = exhibitor.coexhibitors?.trim();

              return (
                <article
                  key={exhibitor.id || name}
                  className="group flex min-h-[205px] min-w-0 flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:min-h-[230px] lg:min-h-[250px]"
                >
                  <div className="flex h-16 items-center justify-center border-b border-slate-100 bg-slate-50 p-2 sm:h-20 sm:p-3 lg:h-24">
                    {exhibitor.logo ? (
                      <img
                        src={exhibitor.logo}
                        alt={`${name} logo`}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-xl font-bold text-slate-300 sm:text-2xl">
                        {getInitials(name)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-2 sm:p-3">
                    <span className="text-[8px] font-bold uppercase tracking-[0.06em] text-slate-500 sm:text-[9px]">
                      {language === "es" ? "Expositor" : "Exhibitor"}
                    </span>
                    <h2 className="overflow-hidden break-words text-[10px] font-bold uppercase leading-4 text-slate-950 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] sm:text-xs sm:leading-5 lg:text-[13px]">
                      {name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-1 pt-1.5 sm:pt-2">
                      {hasValue(exhibitor.stand_number) && (
                        <p className="rounded bg-slate-100 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.06em] text-slate-800 sm:px-2 sm:py-1 sm:text-[9px]">
                          {labels.stand} {exhibitor.stand_number}
                        </p>
                      )}
                    </div>

                    <div className="my-1.5 flex flex-col gap-1 sm:mt-2">
                      {shouldShowCoexhibitors && (
                        <div className="mt-2 border-t border-slate-200 pt-2 sm:mt-3">
                          <TextBlock label={labels.coexhibitor}>
                            {coexhibitors}
                          </TextBlock>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedExhibitor(exhibitor)}
                      className="mx-auto mt-auto inline-flex min-h-8 w-full items-center justify-center rounded-md border border-red-700 bg-white px-2 text-[7px] font-bold uppercase text-red-700 transition-colors hover:bg-red-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 sm:min-h-9 sm:w-auto sm:min-w-24 sm:px-3 sm:text-[7px] lg:min-h-10 lg:min-w-28 lg:text-xs"
                    >
                      {language === "es" ? "Ver más" : "View more"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <p className="text-2xl font-black uppercase text-slate-950">
              {labels.emptyTitle}
            </p>
            <p className="mt-3 text-sm font-medium text-slate-500">
              {labels.emptyText}
            </p>
          </div>
        )}
      </div>

      {selectedExhibitor && (
        <ExhibitorInfo
          exhibitor={selectedExhibitor}
          language={language}
          onClose={() => setSelectedExhibitor(null)}
        />
      )}
    </>
  );
}
