import { useEffect, useId, useRef, useState } from "react";
import {
  getRegistrationByUuid,
  markRegistrationPrinted,
  searchRegistrations,
} from "./registrationApi";

import "./RegistrationLookup.css";

const getRegistrationKey = (visitor) => `${visitor.source || "main"}:${visitor.uuid}`;

function PrintIcon() {
  return (
    <svg
      className="registration-action-icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 9V3h12v6" />
      <path d="M6 17H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="13" width="12" height="8" rx="1" />
      <path d="M9 17h6m2-6h.01" />
    </svg>
  );
}

function PrintStatusIcon({ isPrinted }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="registration-print-status-icon"
      width="16"
      height="16"
      viewBox={isPrinted ? "0 0 22 22" : "0 0 256 256"}
      aria-hidden="true"
      focusable="false"
    >
      {isPrinted ? (
        <path
          fill="currentColor"
          d="M4 11h2v1h1v1h1v1h2v-1h1v-1h1v-1h1v-1h1V9h1V8h1V7h1V6h2v2h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1H8v-1H7v-1H6v-1H5v-1H4z"
        />
      ) : (
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="16"
        >
          <path d="M 80.039519,211.06969 64.056987,239.90745" />
          <path d="m 175.96058,211.06969 15.98254,28.83776" />
          <circle cx="128" cy="128.007" r="95.915" />
          <path d="M 35.294352,102.43866 A 47.957299,47.957299 0 0 1 17.212686,53.792007 47.957299,47.957299 0 0 1 53.990946,17.175027 47.957299,47.957299 0 0 1 102.55767,35.470309" />
          <path d="m 127.99967,32.092482 3.8e-4,-15.985761" />
          <path d="M 128.00005,80.049788 V 128.00708" />
          <path d="m 128.00005,128.00708 33.91093,33.91093" />
          <path d="M 220.70575,102.43866 A 47.957299,47.957299 0 0 0 238.78742,53.792007 47.957299,47.957299 0 0 0 202.00916,17.175027 47.957299,47.957299 0 0 0 153.44244,35.470309" />
        </g>
      )}
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      className="registration-action-icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m15 3 6 6-10 10H7l-4-4L15 3Z" />
      <path d="m8 10 6 6M7 21h14" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      className="registration-action-icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m15 5 4 4" />
      <path d="m4 20 4-1L20 7a2.83 2.83 0 0 0-4-4L4 15v5Z" />
    </svg>
  );
}

export function RegistrationLookup({ currentLanguage, onEdit, onPrint, onPrintMultiple }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVisitors, setSelectedVisitors] = useState([]);
  const [message, setMessage] = useState("");
  const [busyUuid, setBusyUuid] = useState("");
  const [busyAction, setBusyAction] = useState(null);
  const [printingSelected, setPrintingSelected] = useState(false);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const componentId = useId();
  const searchInputRef = useRef(null);
  const selectAllRef = useRef(null);
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
    setHasSearched(false);
    setMessage("");
    setBusyUuid("");
    setBusyAction(null);
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
          loadingRecord: "Cargando...",
          preparingRecord: "Preparando...",
          searchHint: "Escribe al menos 2 caracteres para buscar.",
          results: "Resultados de búsqueda",
          resultsFound: "Resultados encontrados",
          print: "Imprimir",
          reprint: "Reimprimir",
          badgeStatus: "Estatus de gafete",
          printed: "Impreso",
          notPrinted: "No impreso",
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
          person: "Nombre y correo",
          company: "Empresa",
          position: "Puesto",
          emptyEmail: "Sin correo",
          emptyCompany: "Sin empresa",
          emptyPosition: "Sin puesto",
          registrationType: "Tipo de registro",
          emptyRegistrationType: "Sin especificar",
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
          loadingRecord: "Loading...",
          preparingRecord: "Preparing...",
          searchHint: "Enter at least 2 characters to search.",
          results: "Search results",
          resultsFound: "Results found",
          print: "Print",
          reprint: "Reprint",
          badgeStatus: "Badge status",
          printed: "Printed",
          notPrinted: "Not printed",
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
          person: "Name and email",
          company: "Company",
          position: "Position",
          emptyEmail: "No email",
          emptyCompany: "No company",
          emptyPosition: "No position",
          registrationType: "Registration type",
          emptyRegistrationType: "Not specified",
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
      setHasSearched(false);
      setMessage(copy.minLength);
      setSearching(false);
      return;
    }

    setSearching(true);
    setHasSearched(true);
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
    setBusyAction("edit");
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
      if (version === requestVersion.current) {
        setBusyUuid("");
        setBusyAction(null);
      }
    }
  };

  const syncPrintedVisitor = (printedVisitor) => {
    const key = getRegistrationKey(printedVisitor);
    const updateVisitor = (current) => current.map((visitor) =>
      getRegistrationKey(visitor) === key ? { ...visitor, ...printedVisitor } : visitor,
    );
    setSearchResults(updateVisitor);
    setSelectedVisitors(updateVisitor);
  };

  const handlePrint = async (visitor) => {
    if (isBusy || searching || actionInProgress.current) return;
    actionInProgress.current = true;
    const version = ++requestVersion.current;
    setBusyUuid(visitor.uuid);
    setBusyAction("print");
    setMessage("");

    try {
      const printedVisitor = await markRegistrationPrinted(
        visitor.uuid,
        visitor.source,
      );
      if (version !== requestVersion.current) return;
      syncPrintedVisitor(printedVisitor);
      await onPrint(printedVisitor);
    } catch (error) {
      if (version !== requestVersion.current) return;
      console.error(error);
      setMessage(error.message || copy.error);
    } finally {
      actionInProgress.current = false;
      if (version === requestVersion.current) {
        setBusyUuid("");
        setBusyAction(null);
      }
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

  const focusSelectionControl = () => {
    (selectAllRef.current || searchInputRef.current)?.focus();
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
        syncPrintedVisitor(printedVisitor);
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
    <section className="registration-lookup" aria-labelledby={`${componentId}-label`}>
      <label
        id={`${componentId}-label`}
        htmlFor={`${componentId}-search`}
        className="registration-lookup-title"
      >
        {copy.label}
      </label>
      <p id={`${componentId}-hint`} className="registration-lookup-hint">{copy.searchHint}</p>
      <div className="registration-search-controls">
        <input
          type="search"
          ref={searchInputRef}
          id={`${componentId}-search`}
          aria-describedby={`${componentId}-hint`}
          aria-controls={`${componentId}-results`}
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
          className="registration-search-input"
          placeholder={copy.placeholder}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching || isBusy}
          className="registration-button registration-button-primary"
        >
          {searching ? copy.loading : copy.button}
        </button>
        <button
          type="button"
          onClick={clearSearch}
          disabled={isBusy}
          className="registration-button registration-button-with-icon registration-button-secondary"
        >
          <ClearIcon />
          <span>{copy.clear}</span>
        </button>
      </div>

      <p role="status" aria-atomic="true" className="registration-search-status">
        {searching ? copy.loading : message || (hasSearched ? `${copy.resultsFound}: ${searchResults.length}` : "")}
      </p>

      <div id={`${componentId}-results`} aria-busy={searching || isBusy}>
        {(searchResults.length > 0 || selectedVisitors.length > 0) && (
          <div className="registration-selection">
            <div className="registration-selection-toolbar">
              <div className="registration-selection-summary">
                {searchResults.length > 0 && (
                  <label className="registration-select-all">
                    <input
                      type="checkbox"
                      checked={allResultsSelected}
                      ref={(input) => {
                        selectAllRef.current = input;
                        if (input) input.indeterminate = someResultsSelected && !allResultsSelected;
                      }}
                      onChange={toggleAllResults}
                      disabled={isBusy || searching}
                      className="registration-checkbox"
                    />
                    {copy.selectAll}
                  </label>
                )}
                <p role="status" aria-atomic="true" className="registration-selection-count">
                  {copy.selected}: {selectedVisitors.length}
                </p>
              </div>
              <div className="registration-selection-actions">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVisitors([]);
                    focusSelectionControl();
                  }}
                  disabled={isBusy || selectedVisitors.length === 0}
                  className="registration-button registration-button-with-icon registration-button-secondary"
                >
                  <ClearIcon />
                  <span>{copy.clearSelection}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrintSelected}
                  disabled={isBusy || searching || selectedVisitors.length === 0}
                  className="registration-button registration-button-with-icon registration-button-print"
                >
                  <PrintIcon />
                  <span>{printingSelected ? copy.preparing : `${copy.printSelected} (${selectedVisitors.length})`}</span>
                </button>
              </div>
            </div>
            {selectedVisitors.length > 0 && (
              <>
                <p className="registration-selection-hint">{copy.selectionHint}</p>
                <ul aria-label={copy.selected} className="registration-selected-list">
                  {selectedVisitors.map((visitor) => {
                    const name = `${visitor.name || ""} ${visitor.paternSurname || ""}`.trim() ||
                      visitor.email || copy.emptyName;
                    return (
                      <li key={getRegistrationKey(visitor)}>
                        <button
                          type="button"
                          onClick={() => {
                            toggleVisitor(visitor);
                            focusSelectionControl();
                          }}
                          disabled={isBusy}
                          aria-label={`${copy.remove}: ${name}`}
                          className="registration-selection-chip"
                        >
                          <span>{name}</span> <span aria-hidden="true">×</span>
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
          <ul aria-label={copy.results} className="registration-results">
            {searchResults.map((visitor) => {
              const fullName =
                `${visitor.name || ""} ${visitor.paternSurname || ""}`.trim() ||
                visitor.email ||
                copy.emptyName;
              const isVisitorBusy = busyUuid === visitor.uuid;
              const isSelected = selectedKeys.has(getRegistrationKey(visitor));
              const isPrinted = Number(visitor.imprimir_gafete) === 1;
              const printLabel = isVisitorBusy && busyAction === "print"
                ? copy.preparingRecord
                : isPrinted ? copy.reprint : copy.print;
              const editLabel = isVisitorBusy && busyAction === "edit" ? copy.loadingRecord : copy.update;

              return (
                <li
                  key={getRegistrationKey(visitor)}
                  className="registration-result"
                  data-selected={isSelected}
                  aria-busy={isVisitorBusy}
                >
                  <label className="registration-result-select registration-checkbox-target">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleVisitor(visitor)}
                      disabled={isBusy || searching}
                      aria-label={`${copy.select}: ${fullName}`}
                      className="registration-checkbox"
                    />
                  </label>
                  <div className="registration-result-person">
                    <p className="registration-field-label">
                      {copy.person}
                    </p>
                    <p className="registration-result-name">{fullName}</p>
                    <p className="registration-result-email">
                      {visitor.email || copy.emptyEmail}
                    </p>
                  </div>
                  <dl className="registration-result-company">
                    <div>
                      <dt className="registration-field-label">
                        {copy.company}
                      </dt>
                      <dd className="registration-field-value font-bold">
                        {visitor.company || copy.emptyCompany}
                      </dd>
                    </div>
                    <div>
                      <dt className="registration-field-label">
                        {copy.position}
                      </dt>
                      <dd className="registration-field-value">
                        {visitor.position || copy.emptyPosition}
                      </dd>
                    </div>
                  </dl>
                  <dl className="registration-result-type">
                    <div>
                      <dt className="registration-field-label">
                        {copy.registrationType}
                      </dt>
                      <dd>
                        <span className="registration-type-badge">
                          {String(visitor.typeRegister ?? "").trim() || copy.emptyRegistrationType}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="registration-field-label">
                        {copy.badgeStatus}
                      </dt>
                      <dd>
                        <span className="registration-print-status" data-printed={isPrinted}>
                          <PrintStatusIcon isPrinted={isPrinted} />
                          <span>{isPrinted ? copy.printed : copy.notPrinted}</span>
                        </span>
                      </dd>
                    </div>
                  </dl>
                  <div className="registration-result-actions">
                    <button
                      type="button"
                      onClick={() => handlePrint(visitor)}
                      aria-label={`${printLabel}: ${fullName}`}
                      disabled={isBusy || searching}
                      className="registration-button registration-button-with-icon registration-button-print"
                    >
                      <PrintIcon />
                      <span>{printLabel}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(visitor)}
                      aria-label={`${editLabel}: ${fullName}`}
                      disabled={isBusy || searching}
                      className="registration-button registration-button-with-icon registration-button-edit"
                    >
                      <EditIcon />
                      <span>{editLabel}</span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
