import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useForm } from "react-hook-form";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form";
import "react-phone-number-input/style.css";
import { useStaffRegisterForm } from "../../store/staff-register-form";
import { CountrySelectWithCode } from "../register/CountrySelectWithCode";

import "../register/Form.css";

const TEXT_PATTERN = /^[\p{L}\p{M}' -]+$/u;
const STAFF_REGISTER_TYPES = ["EXPOSITOR", "CONFERENCISTA", "VIP"];

const emptyRegistrationFields = {
  maternSurname: "",
  genre: "",
  nacionality: "",
  code_invitation: "",
  industry: "",
  area: "",
  country: "",
  municipality: "",
  state: "",
  city: "",
  address: "",
  colonia: "",
  postalCode: "",
  webPage: "",
  phoneCompany: "",
  rfcNif: "",
  eventKnowledge: "",
  productInterest: "",
  levelInfluence: "",
  wannaBeExhibitor: "",
  alreadyVisited: "",
};

export function StaffRegisterForm({ translates, currentLanguage }) {
  const {
    name,
    paternSurname,
    email,
    phone,
    typeRegister,
    company,
    position,
    setName,
    setPaternSurname,
    setEmail,
    setPhone,
    setTypeRegister,
    setCompany,
    setPosition,
    setCompleteRegister,
    setPrintableLabel,
    clear,
  } = useStaffRegisterForm();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name,
      paternSurname,
      email,
      phone,
      typeRegister: "",
      company,
      position,
    },
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchMessage, setSearchMessage] = useState("");
  const [searching, setSearching] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState(null);

  const requiredMessage = translates.requiered || "Campo requerido";
  const selectOption = translates.select_option || "Selecciona una opcion";
  const searchCopy =
    currentLanguage === "es"
      ? {
          label: "Buscar registro",
          placeholder: "Nombre, correo, empresa o QR",
          button: "Buscar",
          loading: "Buscando...",
          print: "Imprimir",
          update: "Actualizar",
          emptyCompany: "Sin empresa",
          emptyPosition: "Sin puesto",
          emptyName: "Sin nombre",
          minLength: "Ingresa al menos 2 caracteres para buscar.",
          unable: "No se pudo completar la busqueda.",
          noResults: "No se encontraron registros con ese criterio.",
          error: "Hubo un error al buscar registros.",
          loaded: "Registro cargado para actualizar.",
          created: "Tu registro fue exitoso...",
          updated: "Registro actualizado.",
          updateError: "No se pudo actualizar el registro.",
          cancelEdit: "Cancelar actualizacion",
          createSubmit: "FINALIZAR",
          updateSubmit: "Actualizar registro",
          updatePrintSubmit: "Actualizar e imprimir",
          editMode: "Editando registro existente",
          printError: "No se pudo preparar la impresion.",
        }
      : {
          label: "Search registration",
          placeholder: "Name, email, company or QR",
          button: "Search",
          loading: "Searching...",
          print: "Print",
          update: "Update",
          emptyCompany: "No company",
          emptyPosition: "No position",
          emptyName: "No name",
          minLength: "Enter at least 2 characters to search.",
          unable: "The search could not be completed.",
          noResults: "No records were found with that criteria.",
          error: "There was an error searching records.",
          loaded: "Record loaded for update.",
          created: "Your registration was successful...",
          updated: "Record updated.",
          updateError: "The record could not be updated.",
          cancelEdit: "Cancel update",
          createSubmit: "FINISH",
          updateSubmit: "Update record",
          updatePrintSubmit: "Update and print",
          editMode: "Editing existing record",
          printError: "The print could not be prepared.",
        };

  const urlbase = import.meta.env.DEV
    ? "http://localhost:3005/"
    : "https://smarttechnologyexpo.mx/server/";

  const showMessage = (text, type = "error") => {
    setMessageType(type);
    setMessage(text);
    setTimeout(() => setMessage(""), 8000);
  };

  const syncField = (field, value, setter) => {
    const nextValue = value || "";
    setter(nextValue);
    setValue(field, nextValue, {
      shouldDirty: true,
      shouldValidate: Boolean(nextValue),
    });
  };

  const buildLabelData = (visitor) => ({
    qr: visitor.uuid,
    name: visitor.name || "",
    paternSurname: visitor.paternSurname || "",
    company: visitor.company || "",
    position: visitor.position || "",
    typeRegister: String(visitor.typeRegister || typeRegister || "").trim(),
  });

  const goToPrintLabel = (visitor) => {
    clear();
    setPrintableLabel(buildLabelData(visitor));
    setCompleteRegister(true);

    flushSync(() => {
      setProcessing(false);
    });

    window.location.replace("/registro-operativo/etiqueta");
  };

  const handleSearch = async () => {
    const query = searchTerm.trim();

    if (query.length < 2) {
      setSearchResults([]);
      setSearchMessage(searchCopy.minLength);
      return;
    }

    setSearching(true);
    setSearchMessage("");
    setSearchResults([]);

    try {
      const response = await fetch(
        `${urlbase}onsite-registration-search?q=${encodeURIComponent(query)}`,
      );
      const data = await response.json();

      if (!response.ok || !data?.status) {
        setSearchMessage(data?.message || searchCopy.unable);
        return;
      }

      const records = Array.isArray(data.records) ? data.records : [];
      setSearchResults(records);

      if (records.length === 0) {
        setSearchMessage(searchCopy.noResults);
      }
    } catch (error) {
      console.error(error);
      setSearchMessage(searchCopy.error);
    } finally {
      setSearching(false);
    }
  };

  const handlePrintVisitor = async (visitor) => {
    if (!visitor?.uuid) {
      setSearchMessage(searchCopy.printError);
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch(
        `${urlbase}onsite-registration/${encodeURIComponent(visitor.uuid)}/print`,
        {
          method: "POST",
        },
      );
      const data = await response.json();

      if (!response.ok || !data?.status) {
        throw new Error(data?.message || searchCopy.printError);
      }

      goToPrintLabel(data.visitor || visitor);
    } catch (error) {
      console.error(error);
      setProcessing(false);
      setSearchMessage(error.message || searchCopy.printError);
    }
  };

  const handleSelectVisitor = (visitor) => {
    setEditingVisitor(visitor);
    syncField("name", visitor.name, setName);
    syncField("paternSurname", visitor.paternSurname, setPaternSurname);
    syncField("email", visitor.email, setEmail);
    syncField("phone", visitor.phone, setPhone);
    syncField("company", visitor.company, setCompany);
    syncField("position", visitor.position, setPosition);

    const nextTypeRegister = String(visitor.typeRegister || "").toUpperCase();

    if (STAFF_REGISTER_TYPES.includes(nextTypeRegister)) {
      syncField("typeRegister", nextTypeRegister, setTypeRegister);
    } else {
      syncField("typeRegister", "", setTypeRegister);
    }

    const fullName = `${visitor.name || ""} ${visitor.paternSurname || ""}`.trim();
    setSearchTerm(fullName || visitor.email || visitor.company || "");
    setSearchResults([]);
    setSearchMessage(searchCopy.loaded);
  };

  const handleCancelEdit = () => {
    setEditingVisitor(null);
    clear();
    reset({
      name: "",
      paternSurname: "",
      email: "",
      phone: "",
      typeRegister: "",
      company: "",
      position: "",
    });
    setSearchMessage("");
  };

  useEffect(() => {
    setTypeRegister("");
    setValue("typeRegister", "");
  }, [setTypeRegister, setValue]);

  useEffect(() => {
    const resetProcessingOnRestore = () => {
      setProcessing(false);
    };

    window.addEventListener("pageshow", resetProcessingOnRestore);

    return () => {
      window.removeEventListener("pageshow", resetProcessingOnRestore);
    };
  }, []);

  const handleRegister = async (_, event) => {
    const selectedTypeRegister = String(
      useStaffRegisterForm.getState().typeRegister || "",
    ).trim();
    const shouldPrintAfterUpdate =
      event?.nativeEvent?.submitter?.dataset?.print === "true";
    const payload = {
      name,
      paternSurname,
      email,
      phone,
      typeRegister: selectedTypeRegister,
      company,
      position,
      currentLanguage,
    };

    setProcessing(true);

    try {
      if (editingVisitor?.uuid) {
        const response = await fetch(
          `${urlbase}onsite-registration/${encodeURIComponent(editingVisitor.uuid)}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );

        const updateData = await response.json();

        if (!response.ok || !updateData?.status) {
          setProcessing(false);
          showMessage(updateData?.message || searchCopy.updateError);
          return;
        }

        const updatedVisitor = updateData.visitor || {
          ...editingVisitor,
          ...payload,
          uuid: editingVisitor.uuid,
        };

        setEditingVisitor(updatedVisitor);

        if (shouldPrintAfterUpdate) {
          await handlePrintVisitor(updatedVisitor);
          return;
        }

        setProcessing(false);
        showMessage(searchCopy.updated, "success");
        return;
      }

      const response = await fetch(urlbase + "free-register-ste-onsite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...emptyRegistrationFields,
          ...payload,
        }),
      });

      const orderData = await response.json();

      if (orderData?.status) {
        if (!orderData?.uuid) {
          setProcessing(false);
          showMessage("No se recibio el UUID para generar la etiqueta.");
          return;
        }

        goToPrintLabel({
          uuid: orderData.uuid,
          ...payload,
        });
        return;
      }

      setProcessing(false);
      showMessage(orderData?.message || "No se pudo completar el registro.");
    } catch (error) {
      console.error(error);
      setProcessing(false);
      showMessage("Hubo un error al procesar el registro.");
    }
  };

  return (
    <section className="py-5">
      <form className="mx-auto" onSubmit={handleSubmit(handleRegister)}>
        <div className="rounded-lg shadow-lg border border-gray-800/20 p-8">
          <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <label
              htmlFor="staff-search"
              className="block text-sm font-semibold text-black"
            >
              {searchCopy.label}
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                id="staff-search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSearch();
                  }
                }}
                className="w-full rounded-lg bg-white border border-gray-200 p-4 text-sm shadow-sm"
                placeholder={searchCopy.placeholder}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={searching}
                className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {searching ? searchCopy.loading : searchCopy.button}
              </button>
            </div>

            {searchMessage && (
              <p className="mt-3 text-sm font-semibold text-gray-700">
                {searchMessage}
              </p>
            )}

            {searchResults.length > 0 && (
              <ul className="mt-4 divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white">
                {searchResults.map((visitor) => {
                  const fullName =
                    `${visitor.name || ""} ${visitor.paternSurname || ""}`.trim() ||
                    visitor.email ||
                    searchCopy.emptyName;

                  return (
                    <li
                      key={`${visitor.uuid || visitor.id}-${visitor.email}`}
                      className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-black">{fullName}</p>
                        <p className="break-all text-sm text-gray-600">
                          {visitor.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          {visitor.company || searchCopy.emptyCompany}
                        </p>
                        <p className="text-sm text-gray-500">
                          {visitor.position || searchCopy.emptyPosition}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => handlePrintVisitor(visitor)}
                          className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                        >
                          {searchCopy.print}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectVisitor(visitor)}
                          className="rounded-lg border border-gray-900 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white"
                        >
                          {searchCopy.update}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {editingVisitor && (
            <div className="mb-8 flex flex-col gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-900 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">{searchCopy.editMode}</p>
                <p className="text-sm">
                  {`${editingVisitor.name || ""} ${editingVisitor.paternSurname || ""}`.trim() ||
                    editingVisitor.email ||
                    searchCopy.emptyName}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-lg border border-blue-900 px-4 py-2 text-sm font-semibold text-blue-900 transition hover:bg-blue-900 hover:text-white"
              >
                {searchCopy.cancelEdit}
              </button>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="mb-4 font-semibold text-black">
                {translates.type_register || "Tipo de registro"}
                <span className="text-red-600"> * </span>
              </p>
              <select
                {...register("typeRegister", {
                  required: requiredMessage,
                  onChange: (e) => setTypeRegister(e.target.value),
                })}
                value={typeRegister}
                className="w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm uppercase shadow-sm"
              >
                <option value="" className="text-black">
                  {selectOption}
                </option>
                <option value="EXPOSITOR" className="text-black">
                  {translates.type_register_5 || "EXPOSITOR"}
                </option>
                <option value="CONFERENCISTA" className="text-black">
                  {translates.type_register_3 || "CONFERENCISTA"}
                </option>
                <option value="VIP" className="text-black">
                  {translates.type_register_4 || "VIP"}
                </option>
                <option value="VISITANTE" className="text-black">
                  {translates.type_register_2 || "VISITANTE"}
                </option>
              </select>
              {errors.typeRegister && (
                <p className="text-red-600 font-light">
                  {errors.typeRegister.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="mt-5 text-black font-semibold">
                {translates.name || "Nombre"}
                <span className="text-red-600"> * </span>
              </p>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("name", {
                    required: requiredMessage,
                    minLength: {
                      value: 3,
                      message: translates.min_char || "Minimo 3 caracteres",
                    },
                    maxLength: {
                      value: 50,
                      message: translates.max_char || "Maximo 50 caracteres",
                    },
                    pattern: {
                      value: TEXT_PATTERN,
                      message:
                        translates.numbers_symbols ||
                        "No se permiten numeros ni simbolos",
                    },
                    onChange: (e) => setName(e.target.value),
                  })}
                  name="name"
                  id="name"
                  className="w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder={
                    translates.placeholder_name || "Ingresa tu nombre"
                  }
                  autoComplete="given-name"
                  defaultValue={name}
                />
              </div>
              {errors.name && (
                <p className="text-red-600 font-light">{errors.name.message}</p>
              )}
            </div>

            <div>
              <p className="mt-5 text-black font-semibold">
                {translates.lastname || "Apellido"}
                <span className="text-red-600"> *</span>
              </p>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("paternSurname", {
                    required: requiredMessage,
                    minLength: {
                      value: 3,
                      message: translates.min_char || "Minimo 3 caracteres",
                    },
                    maxLength: {
                      value: 50,
                      message: translates.max_char || "Maximo 50 caracteres",
                    },
                    pattern: {
                      value: TEXT_PATTERN,
                      message:
                        translates.numbers_symbols ||
                        "No se permiten numeros ni simbolos",
                    },
                    onChange: (e) => setPaternSurname(e.target.value),
                  })}
                  name="paternSurname"
                  id="paternSurname"
                  className="w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder={
                    translates.placeholder_lastname || "Ingresa tu apellido"
                  }
                  autoComplete="family-name"
                  defaultValue={paternSurname}
                />
              </div>
              {errors.paternSurname && (
                <p className="text-red-600 font-light">
                  {errors.paternSurname.message}
                </p>
              )}
            </div>

            <div>
              <p className="mt-5 text-black font-semibold">
                {translates.email || "Correo"}
                <span className="text-red-600"> * </span>
              </p>
              <div className="relative mt-2">
                <input
                  type="email"
                  {...register("email", {
                    required: requiredMessage,
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: translates.no_email_valid || "Correo invalido",
                    },
                    onChange: (e) => setEmail(e.target.value),
                  })}
                  name="email"
                  id="email"
                  className="w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder={
                    translates.placeholder_email || "Ingresa tu correo"
                  }
                  autoComplete="email"
                  defaultValue={email}
                />
              </div>
              {errors.email && (
                <p className="text-red-600 font-light">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="mt-5 text-black font-semibold">
                {currentLanguage === "es" ? "Teléfono con lada internacional" : "Phone with international code" }
                <span className="text-red-600"> * </span>
              </p>
              <div className="relative mt-2">
                <PhoneInputWithCountry
                  name="phone"
                  control={control}
                  rules={{ required: requiredMessage }}
                  defaultValue={phone}
                  onChange={(value) => setPhone(value)}
                  defaultCountry="MX"
                  countrySelectComponent={CountrySelectWithCode}
                  international
                  withCountryCallingCode
                  className="w-full rounded-lg border border-gray-200 ps-4 text-sm shadow-sm"
                  placeholder={
                    translates.placeholder_phone || "Ingresa tu telefono"
                  }
                />
              </div>
              {errors.phone && (
                <p className="text-red-600 font-light">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <p className="mt-5 text-black font-semibold">
                {translates.company_name || "Nombre de la empresa"}
                <span className="text-red-600"> * </span>
              </p>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("company", {
                    required: requiredMessage,
                    maxLength: {
                      value: 100,
                      message: translates.max_char || "Maximo 100 caracteres",
                    },
                    onChange: (e) => setCompany(e.target.value),
                  })}
                  name="company"
                  id="company"
                  className="w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder={
                    translates.placeholder_company_name ||
                    "Ingresa el nombre de tu empresa"
                  }
                  autoComplete="organization"
                  defaultValue={company}
                />
              </div>
              {errors.company && (
                <p className="text-red-600 font-light">
                  {errors.company.message}
                </p>
              )}
            </div>

            <div>
              <p className="mt-5 text-black font-semibold">
                {translates.position || "Puesto"}
                <span className="text-red-600"> * </span>
              </p>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("position", {
                    required: requiredMessage,
                    maxLength: {
                      value: 80,
                      message: translates.max_char || "Maximo 80 caracteres",
                    },
                    onChange: (e) => setPosition(e.target.value),
                  })}
                  name="position"
                  id="position"
                  className="w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Ingresa tu puesto"
                  autoComplete="organization-title"
                  defaultValue={position}
                />
              </div>
              {errors.position && (
                <p className="text-red-600 font-light">
                  {errors.position.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 mt-10 sm:flex-row">
          {editingVisitor ? (
            <>
              <button type="submit" className="button">
                {searchCopy.updateSubmit}
              </button>
              <button type="submit" data-print="true" className="button">
                {searchCopy.updatePrintSubmit}
              </button>
            </>
          ) : (
            <button type="submit" className="button">
              {translates.finish || searchCopy.createSubmit}
            </button>
          )}
        </div>

        {message && (
          <p
            className={`mt-5 p-4 font-bold text-center ${
              messageType === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {processing && (
          <div className="absolute top-0 left-0 bg-gray-400 bg-opacity-85 z-[999] w-full h-full px-4">
            <div
              role="status"
              className="grid content-end justify-center w-full h-full p-10"
            >
              <p className="text-center flex gap-2">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="font-bold text-black text-2xl">
                  Estamos procesando la informacion por favor espere...
                </span>
              </p>
            </div>
          </div>
        )}
      </form>
    </section>
  );
}
