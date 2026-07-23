import { useState } from "react";
import { ExhibitorInfo } from "./ExhibitorInfo.jsx";

const hasValue = (value) => value !== null && value !== undefined && value !== "";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

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

  return (
    <>
      <div className="grid grid-cols-3 gap-2 px-2 py-10 sm:py-16 sm:gap-3 sm:px-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-4 lg:px-6 xl:grid-cols-6">
        {exhibitors.map((exhibitor) => {
          const name = exhibitor.tradename || exhibitor.legal_company_name;
          const coexhibitors = exhibitor.coexhibitors || "Sin coexpositor";

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
                <h2 className="overflow-hidden break-words text-[10px] font-bold uppercase leading-4 text-slate-950 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] sm:text-xs sm:leading-5 lg:text-[13px]">
                  {name}
                </h2>
                <div className="flex flex-wrap items-center gap-1 pt-1.5 sm:pt-2">
                  {hasValue(exhibitor.stand_number) && (
                    <p className="rounded bg-slate-100 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.06em] text-slate-800 sm:px-2 sm:py-1 sm:text-[9px]">
                      Stand {exhibitor.stand_number}
                    </p>
                  )}
                </div>
                <div className="my-1.5 flex flex-col gap-1 sm:mt-2">
                  {coexhibitors && (
                    <div className="mt-2 border-t border-slate-200 pt-2 sm:mt-3">
                      <TextBlock label="Coexpositor">{coexhibitors}</TextBlock>
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

      {selectedExhibitor && (
        <ExhibitorInfo
          exhibitor={selectedExhibitor}
          onClose={() => setSelectedExhibitor(null)}
        />
      )}
    </>
  );
}
