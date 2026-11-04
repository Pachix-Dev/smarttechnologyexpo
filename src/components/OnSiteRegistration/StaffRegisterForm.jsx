import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useForm } from "react-hook-form";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form";
import "react-phone-number-input/style.css";
import { useStaffRegisterForm } from "../../store/staff-register-form";
import { CountrySelectWithCode } from "../register/CountrySelectWithCode";
import { RegistrationLookup } from "./RegistrationLookup";
import {
  markRegistrationPrinted,
  updateRegistration,
} from "./registrationApi";

import "../register/Form.css";

const TEXT_PATTERN = /^[\p{L}\p{M}' -]+$/u;
const STAFF_REGISTER_TYPES = [
  "EXPOSITOR",
  "CONFERENCISTA",
  "VIP",
  "VISITANTE",
  "MEDIO",
];

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
    setPrintableLabels,
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
  const [editingVisitor, setEditingVisitor] = useState(null);
  const [resetVersion, setResetVersion] = useState(0);

  const requiredMessage = translates.requiered || "Campo requerido";
  const selectOption = translates.select_option || "Selecciona una opcion";
  const editCopy =
    currentLanguage === "es"
      ? {
          updated: "Registro actualizado.",
          updateError: "No se pudo actualizar el registro.",
          cancelEdit: "Cancelar actualizacion",
          createSubmit: "FINALIZAR",
          updateSubmit: "Actualizar registro",
          updatePrintSubmit: "Actualizar e imprimir",
          editMode: "Editando registro existente",
        }
      : {
          updated: "Record updated.",
          updateError: "The record could not be updated.",
          cancelEdit: "Cancel update",
          createSubmit: "FINISH",
          updateSubmit: "Update record",
          updatePrintSubmit: "Update and print",
          editMode: "Editing existing record",
        };

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

  const resetRegistrationForm = () => {
    setEditingVisitor(null);
    setResetVersion((version) => version + 1);
    setMessage("");
    setMessageType("error");
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
  };

  const goToPrintLabels = (visitors) => {
    const labels = visitors.map(buildLabelData);
    resetRegistrationForm();
    setPrintableLabels(labels);
    setCompleteRegister(true);

    flushSync(() => {
      setProcessing(false);
    });

    window.location.replace("/registro-operativo/etiqueta");
  };

  const goToPrintLabel = (visitor) => goToPrintLabels([visitor]);

  const handlePrintVisitor = async (visitor) => {
    goToPrintLabel(visitor);
  };

  const handleEditVisitor = (visitor) => {
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
        const updatedVisitor = await updateRegistration(
          editingVisitor.uuid,
          {
            ...editingVisitor,
            ...payload,
          },
          editingVisitor.source,
        );

        setEditingVisitor(updatedVisitor);

        if (shouldPrintAfterUpdate) {
          const printedVisitor = await markRegistrationPrinted(
            updatedVisitor.uuid,
            updatedVisitor.source,
          );
          handlePrintVisitor(printedVisitor);
          return;
        }

        resetRegistrationForm();
        setProcessing(false);
        showMessage(editCopy.updated, "success");
        return;
      }

      const response = await fetch(
        import.meta.env.DEV
          ? "http://localhost:3005/free-register-ste-onsite"
          : "https://smarttechnologyexpo.mx/server/free-register-ste-onsite",
        {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...emptyRegistrationFields,
          ...payload,
        }),
        },
      );

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
      showMessage(error.message || "Hubo un error al procesar el registro.");
    }
  };

  return (
    <section className="py-5">
      <form className="mx-auto" onSubmit={handleSubmit(handleRegister)}>
        <div className="rounded-lg shadow-lg border border-gray-800/20 p-8">
          <RegistrationLookup
            key={resetVersion}
            currentLanguage={currentLanguage}
            onEdit={handleEditVisitor}
            onPrint={handlePrintVisitor}
            onPrintMultiple={goToPrintLabels}
          />

          {editingVisitor && (
            <div className="mb-8 flex flex-col gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-900 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">{editCopy.editMode}</p>
                <p className="text-sm">
                  {`${editingVisitor.name || ""} ${editingVisitor.paternSurname || ""}`.trim() ||
                    editingVisitor.email ||
                    "Sin nombre"}
                </p>
              </div>
              <button
                type="button"
                onClick={resetRegistrationForm}
                className="rounded-lg border border-blue-900 px-4 py-2 text-sm font-semibold text-blue-900 transition hover:bg-blue-900 hover:text-white"
              >
                {editCopy.cancelEdit}
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
                  key={resetVersion}
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
                {editCopy.updateSubmit}
              </button>
              <button type="submit" data-print="true" className="button">
                {editCopy.updatePrintSubmit}
              </button>
            </>
          ) : (
            <button type="submit" className="button">
              {translates.finish || editCopy.createSubmit}
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
