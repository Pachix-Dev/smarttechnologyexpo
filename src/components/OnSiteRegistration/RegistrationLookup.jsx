import { useEffect, useRef, useState } from "react";
import {
  getRegistrationByUuid,
  markRegistrationPrinted,
  searchRegistrations,
} from "./registrationApi";

const getRegistrationKey = (visitor) => `${visitor.source || "main"}:${visitor.uuid}`;

export function RegistrationLookup({ currentLanguage, onEdit, onPrint, onPrintMultiple }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVisitors, setSelectedVisitors] = useState([]);
  const [message, setMessage] = useState("");
  const [busyUuid, setBusyUuid] = useState("");
  const [printingSelected, setPrintingSelected] = useState(false);
  const [searching, setSearching] = useState(false);
  const requestVersion = useRef(0);
  const actionInProgress = useRef(false);
  const isBusy = Boolean(busyUuid) || printingSelected;
  const selectedKeys = new Set(selectedVisitors.map(getRegistrationKey));
  const allResultsSelected = searchResults.length > 0 &&
    searchResults.every((visitor) => selectedKeys.has(getRegistrationKey(visitor)));
  const someResultsSelected = searchResults.some((visitor) =>
    selectedKeys.has(getRegistrationKey(visitor)),
  );

  useEffect(() => () => {
    requestVersion.current += 1;
  }, []);

  const clearSearch = () => {
    if (actionInProgress.current) return;
    requestVersion.current += 1;
    setSearchTerm("");
    setSearchResults([]);
    setMessage("");
    setBusyUuid("");
    setSearching(false);
  };

  const copy =
    currentLanguage === "es"
      ? {
          label: "Buscar registro",
          placeholder: "Nombre, correo, empresa o QR",
          button: "Buscar",
          clear: "Limpiar búsqueda",
          loading: "Buscando...",
          print: "Imprimir",
          select: "Seleccionar registro",
          selectAll: "Seleccionar todos los resultados",
          selected: "Registros seleccionados",
          clearSelection: "Limpiar selección",
          printSelected: "Imprimir seleccionados",
          preparing: "Preparando etiquetas...",
          selectionHint: "Puedes hacer otra búsqueda y seguir agregando registros a la selección.",
          printError: "No se pudo preparar la impresión completa. Tu selección se conserva para reintentar.",
          remove: "Quitar de la selección",
          update: "Actualizar",
          emptyCompany: "Sin empresa",
          emptyPosition: "Sin puesto",
          emptyName: "Sin nombre",
          minLength: "Ingresa al menos 2 caracteres para buscar.",
          noResults: "No se encontraron registros con ese criterio.",
          error: "No se pudo completar la busqueda.",
          loaded: "Registro cargado para actualizar.",
        }
      : {
          label: "Search registration",
          placeholder: "Name, email, company or QR",
          button: "Search",
          clear: "Clear search",
          loading: "Searching...",
          print: "Print",
          select: "Select registration",
          selectAll: "Select all results",
          selected: "Selected registrations",
          clearSelection: "Clear selection",
          printSelected: "Print selected",
          preparing: "Preparing labels...",
          selectionHint: "You can search again and keep adding registrations to your selection.",
          printError: "The complete print job could not be prepared. Your selection is kept so you can retry.",
          remove: "Remove from selection",
          update: "Update",
          emptyCompany: "No company",
          emptyPosition: "No position",
          emptyName: "No name",
          minLength: "Enter at least 2 characters to search.",
          noResults: "No records were found with that criteria.",
          error: "The search could not be completed.",
          loaded: "Record loaded for update.",
        };

  const handleSearch = async () => {
    if (isBusy || actionInProgress.current) return;
    const version = ++requestVersion.current;
    const query = searchTerm.trim();

    if (query.length < 2) {
      setSearchResults([]);
      setMessage(copy.minLength);
      setSearching(false);
      return;
    }

    setSearching(true);
    setMessage("");
    setSearchResults([]);

    try {
      const records = await searchRegistrations(query);
      if (version !== requestVersion.current) return;
      setSearchResults(records);

      if (records.length === 0) {
        setMessage(copy.noResults);
      }
    } catch (error) {
      if (version !== requestVersion.current) return;
      console.error(error);
      setMessage(error.message || copy.error);
    } finally {
      if (version === requestVersion.current) setSearching(false);
    }
  };

  const handleEdit = async (visitor) => {
    if (isBusy || searching || actionInProgress.current) return;
    actionInProgress.current = true;
    const version = ++requestVersion.current;
    setBusyUuid(visitor.uuid);
    setMessage("");

    try {
      const detail = await getRegistrationByUuid(visitor.uuid, visitor.source);
      if (version !== requestVersion.current) return;
      await onEdit(detail);
      if (version !== requestVersion.current) return;
      setSearchTerm(
        `${detail.name || ""} ${detail.paternSurname || ""}`.trim() ||
          detail.email ||
          detail.company ||
          "",
      );
      setSearchResults([]);
      setMessage(copy.loaded);
    } catch (error) {
      if (version !== requestVersion.current) return;
      console.error(error);
      setMessage(error.message || copy.error);
    } finally {
      actionInProgress.current = false;
      if (version === requestVersion.current) setBusyUuid("");
    }
  };

  const handlePrint = async (visitor) => {
    if (isBusy || searching || actionInProgress.current) return;
    actionInProgress.current = true;
    const version = ++requestVersion.current;
    setBusyUuid(visitor.uuid);
    setMessage("");

    try {
      const printedVisitor = await markRegistrationPrinted(
        visitor.uuid,
        visitor.source,
      );
      if (version !== requestVersion.current) return;
      await onPrint(printedVisitor);
    } catch (error) {
      if (version !== requestVersion.current) return;
      console.error(error);
      setMessage(error.message || copy.error);
    } finally {
      actionInProgress.current = false;
      if (version === requestVersion.current) setBusyUuid("");
    }
  };

  const toggleVisitor = (visitor) => {
    const key = getRegistrationKey(visitor);
    setSelectedVisitors((current) =>
      current.some((item) => getRegistrationKey(item) === key)
        ? current.filter((item) => getRegistrationKey(item) !== key)
        : [...current, visitor],
    );
  };

  const toggleAllResults = () => {
    const resultKeys = new Set(searchResults.map(getRegistrationKey));
    setSelectedVisitors((current) => {
      if (allResultsSelected) {
        return current.filter((visitor) => !resultKeys.has(getRegistrationKey(visitor)));
      }
      const visitors = new Map(current.map((visitor) => [getRegistrationKey(visitor), visitor]));
      searchResults.forEach((visitor) => visitors.set(getRegistrationKey(visitor), visitor));
      return [...visitors.values()];
    });
  };

  const handlePrintSelected = async () => {
    if (isBusy || searching || actionInProgress.current || selectedVisitors.length === 0) return;
    actionInProgress.current = true;
    const version = ++requestVersion.current;
    setPrintingSelected(true);
    setMessage("");

    try {
      const printedVisitors = [];
      for (const visitor of selectedVisitors) {
        const printedVisitor = await markRegistrationPrinted(visitor.uuid, visitor.source);
        if (version !== requestVersion.current) return;
        printedVisitors.push(printedVisitor);
      }
      await onPrintMultiple(printedVisitors);
    } catch (error) {
      if (version !== requestVersion.current) return;
      console.error(error);
      setMessage(`${copy.printError} ${error.message || ""}`.trim());
    } finally {
      actionInProgress.current = false;
      if (version === requestVersion.current) setPrintingSelected(false);
    }
  };

  return (
    <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <label
        htmlFor="registration-search"
        className="block text-sm font-semibold text-black"
      >
        {copy.label}
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          id="registration-search"
          value={searchTerm}
          onChange={(event) => {
            const value = event.target.value;
            if (!value) clearSearch();
            else setSearchTerm(value);
          }}
          disabled={isBusy}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSearch();
            }
          }}
          className="w-full rounded-lg border border-gray-200 bg-white p-4 text-sm shadow-sm"
          placeholder={copy.placeholder}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching || isBusy}
          className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {searching ? copy.loading : copy.button}
        </button>
        <button
          type="button"
          onClick={clearSearch}
          disabled={isBusy}
          className="whitespace-nowrap rounded-lg border border-gray-900 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:border-gray-400 disabled:text-gray-400"
        >
          {copy.clear}
        </button>
      </div>

      {message && <p role="status" className="mt-3 text-sm font-semibold text-gray-700">{message}</p>}

      {(searchResults.length > 0 || selectedVisitors.length > 0) && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {searchResults.length > 0 && (
              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-black">
                <input
                  type="checkbox"
                  checked={allResultsSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someResultsSelected && !allResultsSelected;
                  }}
                  onChange={toggleAllResults}
                  disabled={isBusy || searching}
                  className="h-4 w-4 accent-black"
                />
                {copy.selectAll}
              </label>
            )}
            <p role="status" className="text-sm font-semibold text-black">
              {copy.selected}: {selectedVisitors.length}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedVisitors([])}
                disabled={isBusy || selectedVisitors.length === 0}
                className="rounded-lg border border-gray-900 px-4 py-2 text-sm font-semibold text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copy.clearSelection}
              </button>
              <button
                type="button"
                onClick={handlePrintSelected}
                disabled={isBusy || searching || selectedVisitors.length === 0}
                className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {printingSelected ? copy.preparing : `${copy.printSelected} (${selectedVisitors.length})`}
              </button>
            </div>
          </div>
          {selectedVisitors.length > 0 && (
            <>
              <p className="mt-3 text-sm text-gray-600">{copy.selectionHint}</p>
              <ul aria-label={copy.selected} className="mt-2 flex flex-wrap gap-2">
                {selectedVisitors.map((visitor) => {
                  const name = `${visitor.name || ""} ${visitor.paternSurname || ""}`.trim() ||
                    visitor.email || copy.emptyName;
                  return (
                    <li key={getRegistrationKey(visitor)}>
                      <button
                        type="button"
                        onClick={() => toggleVisitor(visitor)}
                        disabled={isBusy}
                        aria-label={`${copy.remove}: ${name}`}
                        className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-900 disabled:opacity-50"
                      >
                        {name} <span aria-hidden="true">×</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      )}

      {searchResults.length > 0 && (
        <ul className="mt-4 divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white">
          {searchResults.map((visitor) => {
            const fullName =
              `${visitor.name || ""} ${visitor.paternSurname || ""}`.trim() ||
              visitor.email ||
              copy.emptyName;
            const isVisitorBusy = busyUuid === visitor.uuid;

            return (
              <li
                key={getRegistrationKey(visitor)}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedKeys.has(getRegistrationKey(visitor))}
                    onChange={() => toggleVisitor(visitor)}
                    disabled={isBusy || searching}
                    aria-label={`${copy.select}: ${fullName}`}
                    className="mt-1 h-4 w-4 shrink-0 accent-black"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-black">{fullName}</p>
                    <p className="break-all text-sm text-gray-600">{visitor.email}</p>
                    <p className="text-sm text-gray-600">
                      {visitor.company || copy.emptyCompany}
                    </p>
                    <p className="text-sm text-gray-500">
                      {visitor.position || copy.emptyPosition}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => handlePrint(visitor)}
                    disabled={isBusy || searching}
                    className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {isVisitorBusy ? copy.loading : copy.print}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(visitor)}
                    disabled={isBusy || searching}
                    className="rounded-lg border border-gray-900 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:border-gray-400 disabled:text-gray-400"
                  >
                    {copy.update}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
