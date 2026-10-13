import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useForm } from "react-hook-form";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form";
import "react-phone-number-input/style.css";
import { useStaffRegisterForm } from "../../store/staff-register-form";
import { CountrySelectWithCode } from "../register/CountrySelectWithCode";

import "../register/Form.css";

const TEXT_PATTERN = /^[\p{L}\p{M}' -]+$/u;

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
  const [processing, setProcessing] = useState(false);

  const requiredMessage = translates.requiered || "Campo requerido";
  const selectOption = translates.select_option || "Selecciona una opcion";

  const urlbase = import.meta.env.DEV
    ? "http://localhost:3005/"
    : "https://smarttechnologyexpo.mx/server/";

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

  const handleRegister = async () => {
    const selectedTypeRegister = String(
      useStaffRegisterForm.getState().typeRegister || "",
    ).trim();

    setProcessing(true);

    try {
      const response = await fetch(urlbase + "free-register-ste-onsite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...emptyRegistrationFields,
          name,
          paternSurname,
          email,
          phone,
          typeRegister: selectedTypeRegister,
          company,
          position,
          currentLanguage,
        }),
      });

      const orderData = await response.json();

      if (orderData?.status) {
        if (!orderData?.uuid) {
          setProcessing(false);
          setMessage("No se recibio el UUID para generar la etiqueta.");
          setTimeout(() => setMessage(""), 8000);
          return;
        }

        const labelData = {
          qr: orderData.uuid,
          name,
          paternSurname,
          company,
          position,
          typeRegister: selectedTypeRegister,
        };

        clear();
        setPrintableLabel(labelData);
        setCompleteRegister(true);

        flushSync(() => {
          setProcessing(false);
        });

        window.location.replace("/registro-operativo/etiqueta");
        return;
      }

      setProcessing(false);
      setMessage(orderData?.message || "No se pudo completar el registro.");
      setTimeout(() => setMessage(""), 8000);
    } catch (error) {
      console.error(error);
      setProcessing(false);
      setMessage("Hubo un error al procesar el registro.");
      setTimeout(() => setMessage(""), 8000);
    }
  };

  return (
    <section className="py-5">
      <form className="mx-auto" onSubmit={handleSubmit(handleRegister)}>
        <div className="rounded-lg shadow-lg border border-gray-800/20 p-8">

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

        <div className="flex justify-center mt-10">
          <button type="submit" className="button">
            {translates.finish || "FINALIZAR"}
          </button>
        </div>

        {message && (
          <p className="mt-5 text-red-600 bg-red-100 p-4 font-bold text-center">
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
