import { useState } from "react";
import { ExhibitorInfo } from "./ExhibitorInfo.jsx";

export function ExhibitorSummary({ exhibitors }) {
  const [selectedExhibitor, setSelectedExhibitor] = useState(null);

  return (
    <>
      <div className="exhibitor-summary grid grid-cols-2 gap-4 px-4 py-6 sm:grid-cols-2 sm:p-14 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:px-10">
        {exhibitors.map((exhibitor) => {
          const name = exhibitor.tradename || exhibitor.legal_company_name;
          const coexhibitors = exhibitor.coexhibitors || "Sin coexpositor";

          return (
            <div
              key={exhibitor.id || name}
              className="flex min-h-[260px] min-w-0 flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex h-28 items-center justify-center rounded-md bg-slate-50 p-3">
                {exhibitor.logo && (
                  <img
                    src={exhibitor.logo}
                    alt={`${name} logo`}
                    className="max-h-full max-w-full object-contain"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <h2 className="break-words text-base font-semibold leading-snug text-slate-900 sm:text-lg">
                  {name}
                </h2>
                {exhibitor.stand_number && (
                  <p className="text-sm font-medium text-slate-700">
                    Stand {exhibitor.stand_number}
                  </p>
                )}
                <p className="break-words text-sm leading-relaxed text-slate-600">
                  <span className="font-medium text-slate-800">Coexpositor:</span>{" "}
                  {coexhibitors}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExhibitor(exhibitor)}
                className="mt-auto w-28 flex flex-row items-center justify-center rounded-md bg-gray-700/50 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
              >
                Ver más
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M9.97 7.47a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 1 1-1.06-1.06L13.44 12L9.97 8.53a.75.75 0 0 1 0-1.06" clip-rule="evenodd"/></svg>
              </button>
            </div>
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
