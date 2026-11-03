import { useEffect, useRef, useState } from "react";
import {
  getRegistrationByUuid,
  markRegistrationPrinted,
  searchRegistrations,
} from "./registrationApi";

export function RegistrationLookup({ currentLanguage, onEdit, onPrint }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [message, setMessage] = useState("");
  const [busyUuid, setBusyUuid] = useState("");
  const [searching, setSearching] = useState(false);
  const requestVersion = useRef(0);

  useEffect(() => () => {
    requestVersion.current += 1;
  }, []);

  const clearSearch = () => {
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
    if (busyUuid) return;
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
      if (version === requestVersion.current) setBusyUuid("");
    }
  };

  const handlePrint = async (visitor) => {
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
      if (version === requestVersion.current) setBusyUuid("");
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
          disabled={Boolean(busyUuid)}
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
          disabled={searching || Boolean(busyUuid)}
          className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {searching ? copy.loading : copy.button}
        </button>
        <button
          type="button"
          onClick={clearSearch}
          disabled={Boolean(busyUuid)}
          className="whitespace-nowrap rounded-lg border border-gray-900 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:border-gray-400 disabled:text-gray-400"
        >
          {copy.clear}
        </button>
      </div>

      {message && <p className="mt-3 text-sm font-semibold text-gray-700">{message}</p>}

      {searchResults.length > 0 && (
        <ul className="mt-4 divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white">
          {searchResults.map((visitor) => {
            const fullName =
              `${visitor.name || ""} ${visitor.paternSurname || ""}`.trim() ||
              visitor.email ||
              copy.emptyName;
            const isBusy = busyUuid === visitor.uuid;

            return (
              <li
                key={`${visitor.uuid || visitor.id}-${visitor.email}`}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
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
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => handlePrint(visitor)}
                    disabled={Boolean(busyUuid)}
                    className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {isBusy ? copy.loading : copy.print}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(visitor)}
                    disabled={Boolean(busyUuid)}
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
