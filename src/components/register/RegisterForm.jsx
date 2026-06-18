import { useRegisterForm } from '../../store/register-form'
import { useForm } from 'react-hook-form'
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form'
import Select from 'react-select'
import { countries } from '../../data/list_countries'
import { PrivacyNoticeAcceptance } from './PrivacyNoticeAcceptance'
import 'react-phone-number-input/style.css'
import './Form.css'
import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

export function RegisterForm({ translates, currentLanguage }) {
  const {
    name,
    paternSurname,
    maternSurname,
    email,
    code_invitation,
    phone,
    typeRegister,
    genre,
    nacionality,
    setName,
    setPaternSurname,
    setMaternSurname,
    setEmail,
    setCodeInvitation,
    setPhone,
    setTypeRegister,
    setGenre,
    setNacionality,

    company,
    industry,
    position,
    area,
    address,
    country,
    state,
    municipality,
    city,
    colonia,
    colonias,
    postalCode,
    webPage,
    phoneCompany,
    rfcNif,
    setCompany,
    setCountry,
    setPostalCode,
    setMunicipality,
    setState,
    setCity,
    setColonia,
    setColonias,
    setIndustry,
    setPosition,
    setArea,
    setAddress,
    setWebPage,
    setPhoneCompany,
    setRfcNif,

    eventKnowledge,
    productInterest,
    levelInfluence,
    wannaBeExhibitor,
    alreadyVisited,
    setEventKnowledge,
    setProductInterest,
    setLevelInfluence,
    setWannaBeExhibitor,
    setAlreadyVisited,
    setCompleteRegister,
    setInvoiceDownToLoad,

    clear,
  } = useRegisterForm()

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      state,
      municipality,
      city,
      colonia,
      privacyNoticeAccepted: false,
    },
  })

  useEffect(() => {
    setValue('state', state)
    setValue('municipality', municipality)
    setValue('city', city)
    setValue('colonia', colonia)
  }, [state, municipality, city, colonia, setValue])

  useEffect(() => {
    if (typeRegister !== 'VISITANTE') {
      setTypeRegister('VISITANTE')
    }
  }, [typeRegister, setTypeRegister])

  const [messagePostalCode, setMessagePostalCode] = useState('')
  const urlcp = 'https://industrialtransformation.mx/server/'

  const handlePostalCode = async (e) => {
    // Verificar que hay un país seleccionado antes de procesar
    if (!country) {
      setMessagePostalCode(
        translates.select_country_first || 'Selecciona un país primero',
      )
      return
    }

    setPostalCode(e)

    if (e.length === 5 && country === 'Mexico') {
      const res = await fetch(urlcp + `get-postalcode/${e}`)
      const data = await res.json()
      if (data.status) {
        setMessagePostalCode('')
        setPostalCode(e)
        setMunicipality(data.records[0].D_mnpio)
        setState(data.records[0].d_estado)
        setCity(
          data.records[0].d_ciudad === ''
            ? data.records[0].d_estado
            : data.records[0].d_ciudad,
        )
        setColonias(data.records.map((record) => record.d_asenta))
        setColonia('')
      } else {
        setMessagePostalCode(translates.no_postal_code_valid)
        setMunicipality('')
        setState('')
        setCity('')
        setColonias([])
        setColonia('')
      }
    }

    if (e.length > 5 && country === 'Mexico') {
      setMessagePostalCode(translates.no_postal_code_valid)
      setMunicipality('')
      setState('')
      setCity('')
      setColonias([])
      setColonia('')
    }

    // Para otros países, simplemente almacenar el código postal
    if (country && country !== 'Mexico') {
      setMessagePostalCode('')
    }
  }

  const isDisabled =
    country === 'Mexico'
      ? 'w-full rounded-lg bg-gray-600 border border-gray-200 p-4 pe-12 text-sm shadow-sm text-white'
      : 'w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm shadow-sm'

  const [message, setMessage] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const resetProcessingOnRestore = () => {
      setProcessing(false)
    }

    window.addEventListener('pageshow', resetProcessingOnRestore)

    return () => {
      window.removeEventListener('pageshow', resetProcessingOnRestore)
    }
  })

  const options = [
    {
      label: 'CÁMARA VERDE',
      value: 'CÁMARA VERDE',
    },
    {
      label:
        'AMRRE (Asociación Mexicana de Recicladores de Residuos Electrónicos)',
      value:
        'AMRRE (Asociación Mexicana de Recicladores de Residuos Electrónicos)',
    },
    {
      label: 'ANES (Asociación Nacional de Energía Solar)',
      value: 'ANES (Asociación Nacional de Energía Solar)',
    },
    {
      label: 'HHM (Holland House México)',
      value: 'HHM (Holland House México)',
    },
    {
      label: 'PMRJ (Profesionales en Manejo de Residuos Jalisco)',
      value: 'PMRJ (Profesionales en Manejo de Residuos Jalisco)',
    },
    { label: 'EGB (El Gran Bajio)', value: 'EGB (El Gran Bajio)' },
    {
      label:
        'IER-UNAM (Instituto de Energías Renovables, Universidad Nacional Autónoma de México)',
      value:
        'IER-UNAM (Instituto de Energías Renovables, Universidad Nacional Autónoma de México)',
    },
    {
      label: 'AMH (Asociación Mexicana de Hidráulica)',
      value: 'AMH (Asociación Mexicana de Hidráulica)',
    },
    {
      label:
        'ALADYR (Asociación Latinoamericana de Desalación y Reúso de Agua)',
      value:
        'ALADYR (Asociación Latinoamericana de Desalación y Reúso de Agua)',
    },
    {
      label: 'CNBiogás (Consejo Nacional de Biogás)',
      value: 'CNBiogás (Consejo Nacional de Biogás)',
    },
    {
      label: 'AExC (Alianza Empresarial por el Clima)',
      value: 'AExC (Alianza Empresarial por el Clima)',
    },
    {
      label: 'ARS (Asociación para el Estudio de Residuos Sólidos)',
      value: 'ARS (Asociación para el Estudio de Residuos Sólidos)',
    },
    {
      label:
        'ONUDI - UNIDO (Organización de las Naciones Unidas para el desarrollo Industrial)',
      value:
        'ONUDI - UNIDO (Organización de las Naciones Unidas para el desarrollo Industrial)',
    },
    {
      label:
        'COMCE (Consejo Empresarial Mexicano de Comercio Exterior, Inversión y Tecnología)',
      value:
        'COMCE (Consejo Empresarial Mexicano de Comercio Exterior, Inversión y Tecnología)',
    },
    {
      label: 'ANEAS (Asociación Nacional de Entidades de Agua y Saneamiento)',
      value: 'ANEAS (Asociación Nacional de Entidades de Agua y Saneamiento)',
    },
    {
      label:
        'CIDETT (Centro de Innovación, Desarrollo Empresarial y Transferencia de Tecnología)',
      value:
        'CIDETT (Centro de Innovación, Desarrollo Empresarial y Transferencia de Tecnología)',
    },
    {
      label: 'AMB (Asociación Mexicana de Bioplásticos)',
      value: 'AMB (Asociación Mexicana de Bioplásticos)',
    },
    {
      label:
        'CANACINTRA León (Cámara Nacional de la industria de Transformación)',
      value:
        'CANACINTRA León (Cámara Nacional de la industria de Transformación)',
    },
    {
      label:
        'CCP (Clúster de la Industrial del Plástico y Economía Circular del Estado de Puebla)',
      value:
        'CCP (Clúster de la Industrial del Plástico y Economía Circular del Estado de Puebla)',
    },
    {
      label: 'COMURE (Comunidad de Mujeres en el Reciclaje)',
      value: 'COMURE (Comunidad de Mujeres en el Reciclaje)',
    },
    {
      label: 'CICEJ (Colegio de Ingenieros Civiles del Estado de Jalisco)',
      value: 'CICEJ (Colegio de Ingenieros Civiles del Estado de Jalisco)',
    },
    {
      label: 'H2 México (Asociación Mexicana de Hidrógeno)',
      value: 'H2 México (Asociación Mexicana de Hidrógeno)',
    },
    {
      label:
        'Coparmex, Sustainability Committee (Confederación Patronal de la República Mexicana)',
      value:
        'Coparmex, Sustainability Committee (Confederación Patronal de la República Mexicana)',
    },
    { label: 'COGENERA MÉXICO', value: 'COGENERA MÉXICO' },
    {
      label: 'CANCHAM (Cámara de Comercio de Canadá en México)',
      value: 'CANCHAM (Cámara de Comercio de Canadá en México)',
    },
    {
      label: 'Embajada Británica en México',
      value: 'Embajada Británica en México',
    },
    {
      label: 'SMAAC (Sociedad Mexicana De Aguas)',
      value: 'SMAAC (Sociedad Mexicana De Aguas)',
    },
    {
      label:
        'IMEI - BOMA (Asociación Mexicana del Edificio Inteligente y Sustentable)',
      value:
        'IMEI - BOMA (Asociación Mexicana del Edificio Inteligente y Sustentable)',
    },
    {
      label: 'AMEE (Asociación Mexicana de Envase y Embalaje)',
      value: 'AMEE (Asociación Mexicana de Envase y Embalaje)',
    },
  ]

  const urlbase = import.meta.env.DEV
    ? 'http://localhost:3005/'
    : 'https://smarttechnologyexpo.mx/server/'

  const handleRegister = async () => {
    setProcessing(true)
    const response = await fetch(urlbase + 'free-register-ste', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        paternSurname,
        maternSurname,
        email,
        phone,
        typeRegister: 'VISITANTE',
        genre,
        nacionality,
        code_invitation,
        company,
        industry,
        position,
        area,
        country,
        municipality,
        state,
        city,
        address,
        colonia,
        postalCode,
        webPage,
        phoneCompany,
        rfcNif,
        eventKnowledge,
        productInterest: productInterest.map((item) => item.value).join(),
        levelInfluence,
        wannaBeExhibitor,
        alreadyVisited,
        currentLanguage,
      }),
    })
    const orderData = await response.json()
    if (orderData?.status) {
      clear()
      setCompleteRegister(true)
      setInvoiceDownToLoad(orderData?.invoice)

      flushSync(() => {// Aseguramos que el estado se actualice antes de redirigir
        setProcessing(false)
      })
      const thankYouPath = currentLanguage === 'es' ? '/gracias-por-registrarte' : '/en/gracias-por-registrarte'
      window.location.replace(thankYouPath)

    } else {
      setProcessing(false)
      setMessage(orderData?.message)
      setTimeout(() => {
        setMessage('')
      }, 8000)
    }
  }

  return (
    <section className="py-5">
      <form className="mx-auto" onSubmit={handleSubmit(handleRegister)}>
        {/* Personal Information */}
        <div className="rounded-lg shadow-lg p-8 ">
          <p className="text-lg font-semibold text-black flex items-center gap-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
              />
            </svg>

            {translates.info_personal}
          </p>
          <hr className="my-4 border-t border-gray-200" />

          {/* <div className="grid md:grid-cols-2 gap-6 mt-10">
            Genero
            <div>
              <p className="mb-4 font-semibold text-black">
                {translates.genre} <span className="text-red-600">*</span>
              </p>

              <ul className="items-center w-full text-sm font-medium text-black bg-gray-700 border border-gray-600 rounded-lg sm:flex">
                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r 0">
                  <div className="flex items-center ps-3">
                    <input
                      id="horizontal-list-radio-license"
                      type="radio"
                      value="Hombre"
                      checked={genre === "Hombre"}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      {...register("radio", {
                        required: `${translates.requiered}`,
                        onChange: (e) => {
                          setGenre(e.target.value);
                        },
                      })}
                    />
                    <label
                      htmlFor="horizontal-list-radio-license"
                      className="w-full py-3 ms-2 text-sm font-medium text-white "
                    >
                      {translates.genre_1}
                    </label>
                  </div>
                </li>
                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
                  <div className="flex items-center ps-3">
                    <input
                      id="horizontal-list-radio-id"
                      type="radio"
                      value="Mujer"
                      checked={genre === "Mujer"}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      {...register("radio", {
                        required: `${translates.requiered}`,
                        onChange: (e) => {
                          setGenre(e.target.value);
                        },
                      })}
                    />
                    <label
                      htmlFor="horizontal-list-radio-id"
                      className="w-full py-3 ms-2 text-sm font-medium text-white "
                    >
                      {translates.genre_2}
                    </label>
                  </div>
                </li>
                <li className="w-full border-b border-gray-200 sm:border-b-0  ">
                  <div className="flex items-center ps-3">
                    <input
                      id="horizontal-list-radio-id2"
                      type="radio"
                      value="Prefiero no decirlo"
                      checked={genre === "Prefiero no decirlo"}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      {...register("radio", {
                        required: `${translates.requiered}`,
                        onChange: (e) => {
                          setGenre(e.target.value);
                        },
                      })}
                    />
                    <label
                      htmlFor="horizontal-list-radio-id2"
                      className="w-full py-3 ms-2 text-sm font-medium text-white "
                    >
                      {translates.genre_3}
                    </label>
                  </div>
                </li>
              </ul>

              {errors.radio && (
                <p className="text-red-600 font-light">
                  {errors.radio.message}
                </p>
              )}
            </div>
            Configura el codigo para que en automatico el registro sea de tipo visitante
            <div>
              <p className="mb-4 font-semibold text-black">
                {translates.type_register}
                <span className="text-red-600">*</span> <br />
                <span className="text-red-600 font-bold">
                  {translates.media_messege}
                  <a href="mailto:social.media@igeco.mx" className="underline">
                    social.media@igeco.mx
                  </a>
                </span>
              </p>
              <select
                {...register("typeRegister", {
                  required: `${translates.requiered}`,
                  onChange: (e) => setTypeRegister(e.target.value),
                })}
                defaultValue={typeRegister}
                className="w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm uppercase"
              >
                <option value="" className="text-black">
                  {translates.select_option}
                </option>
                <option value="VISITANTE" className="text-black">
                  {translates.type_register_2}
                </option>
                El registro de medios ya no se realiza mediante este formulario
                <option value="MEDIO" className="text-black">
                  {translates.type_register_3}
                </option>
              </select>
              {errors.typeRegister && (
                <p className="text-red-600 font-light">
                  {errors.typeRegister.message}
                </p>
              )}
            </div>
          </div> */}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Nombre de visitante */}
            <div>
              <p className="mt-5 text-black">
                {translates.name} <span className="text-red-600">*</span>
              </p>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("name", {
                    required: `${translates.requiered}`,
                    minLength: {
                      value: 3,
                      message: `${translates.min_char}`,
                    },
                    maxLength: {
                      value: 15,
                      message: `${translates.max_char}`,
                    },
                    pattern: {
                      value:
                        /^[a-zA-ZáéíóúÁÉÍÓÚàèìòùÀÈÌÒÙäëïöüÄËÏÖÜâêîôûÂÊÎÔÛãõÃÕçÇñÑ ]+$/,
                      message: `${translates.numbers_symbols}`,
                    },
                    onChange: (e) => setName(e.target.value),
                  })}
                  name="name"
                  id="name"
                  className="w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder={translates.placeholder_name}
                  autoComplete="name"
                  defaultValue={name}
                />
                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </span>
              </div>
              {errors.name && (
                <p className="text-red-600 font-light">{errors.name.message}</p>
              )}
            </div>
            {/* Apellido paterno */}
            <div>
              <p className="mt-5 text-black">
                {translates.lastname} <span className="text-red-600">*</span>
              </p>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("paternSurname", {
                    required: `${translates.requiered}`,
                    minLength: {
                      value: 3,
                      message: `${translates.min_char}`,
                    },
                    maxLength: {
                      value: 50,
                      message: `${translates.max_char}`,
                    },
                    pattern: {
                      value:
                        /^[a-zA-ZáéíóúÁÉÍÓÚàèìòùÀÈÌÒÙäëïöüÄËÏÖÜâêîôûÂÊÎÔÛãõÃÕçÇñÑ ]+$/,
                      message: `${translates.numbers_symbols}`,
                    },
                    onChange: (e) => setPaternSurname(e.target.value),
                  })}
                  name="paternSurname"
                  id="paternSurname"
                  className="w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder={translates.placeholder_lastname}
                  autoComplete="paternSurname"
                  defaultValue={paternSurname}
                />
                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </span>
              </div>
              {errors.paternSurname && (
                <p className="text-red-600 font-light">
                  {errors.paternSurname.message}
                </p>
              )}
            </div>
            {/* Apellido materno */}
            {/* <div>
              <p className="mt-5 text-black">
                {translates.surname}{" "}
                <span className="text-gray-600 font-normal">
                  {translates.opcional}
                </span>
              </p>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("maternSurname", {
                    minLength: {
                      value: 3,
                      message: `${translates.min_char}`,
                    },
                    maxLength: {
                      value: 15,
                      message: `${translates.max_char}`,
                    },
                    pattern: {
                      value:
                        /^[a-zA-ZáéíóúÁÉÍÓÚàèìòùÀÈÌÒÙäëïöüÄËÏÖÜâêîôûÂÊÎÔÛãõÃÕçÇñÑ ]+$/,
                      message: `${translates.numbers_symbols}`,
                    },
                    onChange: (e) => setMaternSurname(e.target.value),
                  })}
                  name="maternSurname"
                  id="maternSurname"
                  className="w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder={translates.placeholder_surname}
                  autoComplete="maternSurname"
                  defaultValue={maternSurname}
                />
                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </span>
              </div>
              {errors.maternSurname && (
                <p className="text-red-600 font-light">
                  {errors.maternSurname.message}
                </p>
              )}
            </div> */}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <p className="mt-5 text-black">
                {translates.email} <span className="text-red-600">*</span>
              </p>
              <div className="relative mt-2 ">
                <input
                  type="email"
                  {...register("email", {
                    required: `${translates.requiered}`,
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: `${translates.no_email_valid}`,
                    },
                    onChange: (e) => setEmail(e.target.value),
                  })}
                  name="email"
                  id="email"
                  className="w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder={translates.placeholder_email}
                  autoComplete="email"
                  defaultValue={email}
                />

                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </span>
              </div>
              {errors.email && (
                <p className="text-red-600 font-light">
                  {errors.email.message}
                </p>
              )}
            </div>
            {/* Genero */}
            <div>
              <p className="mt-5 mb-4    font-semibold text-black">
                {translates.genre} <span className="text-red-600">*</span>
              </p>

              <ul className="items-center w-full text-sm font-medium text-black bg-gray-700 border border-gray-600 rounded-lg sm:flex">
                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r 0">
                  <div className="flex items-center ps-3">
                    <input
                      id="horizontal-list-radio-license"
                      type="radio"
                      value="Hombre"
                      checked={genre === "Hombre"}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      {...register("radio", {
                        required: `${translates.requiered}`,
                        onChange: (e) => {
                          setGenre(e.target.value);
                        },
                      })}
                    />
                    <label
                      htmlFor="horizontal-list-radio-license"
                      className="w-full py-3 ms-2 text-sm font-medium text-white "
                    >
                      {translates.genre_1}
                    </label>
                  </div>
                </li>
                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
                  <div className="flex items-center ps-3">
                    <input
                      id="horizontal-list-radio-id"
                      type="radio"
                      value="Mujer"
                      checked={genre === "Mujer"}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      {...register("radio", {
                        required: `${translates.requiered}`,
                        onChange: (e) => {
                          setGenre(e.target.value);
                        },
                      })}
                    />
                    <label
                      htmlFor="horizontal-list-radio-id"
                      className="w-full py-3 ms-2 text-sm font-medium text-white "
                    >
                      {translates.genre_2}
                    </label>
                  </div>
                </li>
                <li className="w-full border-b border-gray-200 sm:border-b-0  ">
                  <div className="flex items-center ps-3">
                    <input
                      id="horizontal-list-radio-id2"
                      type="radio"
                      value="Prefiero no decirlo"
                      checked={genre === "Prefiero no decirlo"}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      {...register("radio", {
                        required: `${translates.requiered}`,
                        onChange: (e) => {
                          setGenre(e.target.value);
                        },
                      })}
                    />
                    <label
                      htmlFor="horizontal-list-radio-id2"
                      className="w-full py-3 ms-2 text-sm font-medium text-white "
                    >
                      {translates.genre_3}
                    </label>
                  </div>
                </li>
              </ul>

              {errors.radio && (
                <p className="text-red-600 font-light">
                  {errors.radio.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="mt-5 text-black">
                {translates.phone} <span className="text-red-600">*</span>
              </p>
              <div className="relative mt-2">
                <PhoneInputWithCountry
                  name="phone"
                  control={control}
                  rules={{
                    required: `${translates.requiered}`,
                    validate: (value) => {
                      if (!value) {
                        return `${translates.requiered}`;
                      }
                      // Validación adicional para formato de teléfono
                      if (value.length < 10) {
                        return `${
                          translates.phone_invalid ||
                          "Número de teléfono inválido"
                        }`;
                      }
                      return true;
                    },
                  }}
                  defaultValue={phone}
                  onChange={(e) => setPhone(e)}
                  className="w-full rounded-lg border border-gray-200 ps-4 text-sm shadow-sm"
                  placeholder={translates.placeholder_phone}
                />
              </div>
              {errors.phone && (
                <p className="text-red-600 font-light">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div>
              <p className="mt-5 text-black">
                {translates.nacionality} <span className="text-red-600">*</span>
              </p>
              <select
                {...register("nacionality", {
                  required: `${translates.requiered}`,
                  onChange: (e) => setNacionality(e.target.value),
                })}
                defaultValue={nacionality}
                className="mt-2 w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm *:text-black"
              >
                <option value="">{translates.select_option}</option>
                {countries.map((country, index) => (
                  <option key={index} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.nacionality && (
                <p className="text-red-600 font-light">
                  {errors.nacionality.message}
                </p>
              )}
            </div>

            <div>
              <p className="mt-5 text-black ">
                {translates.placeholder_code_invitation}{" "}
              </p>
              <div className="relative mt-2 ">
                <input
                  type="text"
                  {...register("code_invitation", {
                    onChange: (e) => setCodeInvitation(e.target.value),
                  })}
                  name="code_invitation"
                  id="code_invitation"
                  className="w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder={translates.placeholder_code_invitation}
                  autoComplete="code_invitation"
                  defaultValue={code_invitation}
                />

                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="rounded-lg shadow-lg p-8 mt-10">
          <p className="text-lg font-semibold text-black flex items-center gap-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
              />
            </svg>

            {translates.info_company}
          </p>
          <hr className="my-4 border-t border-gray-200" />
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {/* Company Name */}
            <div>
              <p className="text-black">
                {translates.company_name}{" "}
                <span className="text-red-600">*</span>
              </p>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("company", {
                    required: `${translates.requiered}`,
                    onChange: (e) => setCompany(e.target.value),
                  })}
                  name="company"
                  id="company"
                  className="w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder={translates.placeholder_company_name}
                  autoComplete="company"
                  defaultValue={company}
                />
                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                    />
                  </svg>
                </span>
              </div>
              {errors.company && (
                <p className="text-red-600 font-light">
                  {errors.company.message}
                </p>
              )}
            </div>
            {/* Fiscal Identification */}
            <div>
              <p className="font-semibold text-black">
                Identificación fiscal (RFC) / (NIF)
                <span className="text-red-600">*</span>
              </p>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("rfcNif", {
                    required: `${translates.requiered}`,
                    maxLength: {
                      value: 30,
                      message: `${translates.max_char}`,
                    },
                    onChange: (e) => setRfcNif(e.target.value),
                  })}
                  name="rfcNif"
                  id="rfcNif"
                  className="w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm shadow-sm uppercase"
                  placeholder="Ej. XAXX010101000 / ESB12345678"
                  autoComplete="off"
                  defaultValue={rfcNif}
                />
                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 3.75h9A2.25 2.25 0 0 1 18.75 6v12A2.25 2.25 0 0 1 16.5 20.25h-9A2.25 2.25 0 0 1 5.25 18V6A2.25 2.25 0 0 1 7.5 3.75Zm2.25 4.5h4.5m-4.5 3h4.5m-4.5 3h3"
                    />
                  </svg>
                </span>
              </div>
              {errors.rfcNif && (
                <p className="text-red-600 font-light">
                  {errors.rfcNif.message}
                </p>
              )}
            </div>
            {/* Industry */}
            <div>
              <p className="font-semibold text-black">
                {translates.industry} <span className="text-red-600">*</span>
              </p>
              <select
                {...register("industry", {
                  required: `${translates.requiered}`,
                  onChange: (e) => setIndustry(e.target.value),
                })}
                defaultValue={industry}
                className="mt-2 w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm *:text-black"
              >
                <option value="">{translates.select_option}</option>
                <option value="ALIMENTOS Y BEBIDAS">
                  {translates.industry_option_1}
                </option>
                <option value="TEQUILERA">
                  {translates.industry_option_2}
                </option>
                <option value="AGRÍCOLA">{translates.industry_option_3}</option>
                <option value="GANADERA">{translates.industry_option_4}</option>
                <option value="QUÍMICA">{translates.industry_option_5}</option>
                <option value="MINERA, METALÚRGICA Y SIDERÚRGICA">
                  {translates.industry_option_6}
                </option>
                <option value="PETROQUÍMICA">
                  {translates.industry_option_7}
                </option>
                <option value="CELULOSA Y PAPEL">
                  {translates.industry_option_8}
                </option>
                <option value="AEROESPACIAL">
                  {translates.industry_option_9}
                </option>
                <option value="AUTOMOTRIZ">
                  {translates.industry_option_10}
                </option>
                <option value="MANUFACTURERA">
                  {translates.industry_option_11}
                </option>
                <option value="HOTELERÍA Y TURISMO">
                  {translates.industry_option_12}
                </option>
                <option value="RESTAURANTERA">
                  {translates.industry_option_13}
                </option>
                <option value="GOBIERNO">
                  {translates.industry_option_14}
                </option>
                <option value="FARMACÉUTICA Y HOSPITALARIA">
                  {translates.industry_option_15}
                </option>
                <option value="TEXTIL">{translates.industry_option_16}</option>
                <option value="ORGANISMOS OPERADORES DE AGUA">
                  {translates.industry_option_17}
                </option>
                <option value="TECNOLOGÍA Y ELECTRÓNICA">
                  {translates.industry_option_18}
                </option>
                <option value="CONSULTORÍA AMBIENTAL">
                  {translates.industry_option_19}
                </option>
                <option value="ACADÉMICO">
                  {translates.industry_option_20}
                </option>
                <option value="FINANCIERO">
                  {translates.industry_option_21}
                </option>
                <option value="CÁMARAS Y ASOCIACIONES">
                  {translates.industry_option_22}
                </option>
                <option value="SEGUROS">{translates.industry_option_23}</option>
                <option value="TELECOMUNICACIONES Y OPERADORAS MÓVILES">
                  {translates.industry_option_24}
                </option>
                <option value="ENERGÍA">{translates.industry_option_25}</option>
                <option value="TRANSPORTE">
                  {translates.industry_option_26}
                </option>
                <option value="CUERO, CALZADO Y MARROQUINERÍA">
                  {translates.industry_option_27}
                </option>
                <option value="PLÁSTICO">
                  {translates.industry_option_28}
                </option>
                <option value="LOGÍSTICA E INTRALOGÍSTICA">
                  {translates.industry_option_29}
                </option>
                <option value="DRONES">
                  {translates.industry_option_30}
                </option>
              </select>
              {errors.industry && (
                <p className="text-red-600 font-light">
                  {errors.industry.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-5">
            <div>
              <p className="font-semibold text-black">
                {translates.position} <span className="text-red-600">*</span>
              </p>
              <select
                {...register("position", {
                  required: `${translates.requiered}`,
                  onChange: (e) => setPosition(e.target.value),
                })}
                defaultValue={position}
                className="mt-2 w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm text-black *:text-black"
              >
                <option value="">{translates.select_option}</option>
                <option value={translates.position_1}>
                  {translates.position_1}
                </option>
                <option value={translates.position_2}>
                  {translates.position_2}
                </option>
                <option value={translates.position_3}>
                  {translates.position_3}
                </option>
                <option value={translates.position_4}>
                  {translates.position_4}
                </option>
              </select>
              {errors.position && (
                <p className="text-red-600 font-light">
                  {errors.position.message}
                </p>
              )}
            </div>
            <div>
              <p className="font-semibold text-black">
                {translates.area} <span className="text-red-600">*</span>
              </p>
              <select
                {...register("area", {
                  required: `${translates.requiered}`,
                  onChange: (e) => setArea(e.target.value),
                })}
                defaultValue={area}
                className="mt-2 w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm text-black *:text-black uppercase"
              >
                <option value="">{translates.select_option}</option>
                {translates.list_area.map((area, index) => (
                  <option key={index} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              {errors.area && (
                <p className="text-red-600 font-light">{errors.area.message}</p>
              )}
            </div>
          </div>

          {/*    
          <div className='mt-3'>
            <p className='text-black'>
              {translates.adrdress} <span className='text-red-600'>*</span>
            </p>
            <div className='relative mt-2'>
              <input
                type='text'
                {...register('address', {
                  required: `${translates.requiered}`,
                  onChange: (e) => setAddress(e.target.value),
                })}
                name='address'
                id='address'
                className='w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm shadow-sm'
                placeholder={translates.placeholder_address}
                autoComplete='address'
                defaultValue={address}
              />
              <span className='absolute inset-y-0 end-0 grid place-content-center px-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-4 w-4 text-gray-400'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z'
                  />
                </svg>
              </span>
            </div>
            {errors.address && (
              <p className='text-red-600 font-light'>
                {errors.address.message}
              </p>
            )}
          </div>
          */}

          <div className="grid md:grid-cols-2 gap-6 mt-5">
            <div>
              <p className="font-semibold text-black">
                {translates.country} <span className="text-red-600">*</span>
              </p>
              <select
                {...register("country", {
                  required: `${translates.requiered}`,
                  onChange: (e) => {
                    setCountry(e.target.value);
                    // Limpiar datos relacionados con código postal cuando cambie el país
                    setPostalCode("");
                    setMunicipality("");
                    setState("");
                    setCity("");
                    setColonias([]);
                    setColonia("");
                    setMessagePostalCode("");
                    // Limpiar el valor en el formulario
                    setValue("postalCode", "");
                  },
                })}
                defaultValue={country}
                className="mt-2 w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm text-black *:text-black"
              >
                <option value="">{translates.select_option}</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="text-red-600 font-light">
                  {errors.country.message}
                </p>
              )}
            </div>

            <div>
              <p className="text-black">
                {translates.postal_code} <span className="text-red-600">*</span>
              </p>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("postalCode", {
                    required: `${translates.requiered}`,
                    onChange: (e) => {
                      // Solo permitir cambios si hay un país seleccionado
                      if (country) {
                        handlePostalCode(e.target.value);
                      }
                    },
                  })}
                  name="postalCode"
                  id="postalCode"
                  className={`w-full rounded-lg border border-gray-200 p-4 pe-12 text-sm shadow-sm transition-all duration-200 ${
                    !country
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-transparent"
                  }`}
                  placeholder={
                    !country
                      ? translates.select_country_first ||
                        "Selecciona un país primero"
                      : translates.placeholder_postal_code
                  }
                  autoComplete="postalCode"
                  defaultValue={postalCode}
                  disabled={!country}
                  readOnly={!country}
                />
                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`h-4 w-4 transition-colors duration-200 ${
                      !country ? "text-gray-300" : "text-gray-400"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                </span>
              </div>

              {/* Mensaje de advertencia cuando no hay país seleccionado */}
              {!country && (
                <p className="text-amber-600 font-light text-sm mt-1 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  {translates.select_country_first ||
                    "Por favor selecciona un país primero"}
                </p>
              )}

              <p className="text-red-600 font-light">{messagePostalCode}</p>

              {errors.postalCode && (
                <p className="text-red-600 font-light">
                  {errors.postalCode.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-5">
            <div>
              <p className="text-black">
                {translates.state} <span className="text-red-600">*</span>
              </p>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("state", {
                    required: `${translates.requiered}`,
                    onChange: (e) => setState(e.target.value),
                    value: state,
                  })}
                  className={isDisabled}
                  placeholder={translates.placeholder_state}
                  disabled={country === "Mexico"}
                />
                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                    />
                  </svg>
                </span>
              </div>
              {errors.state && (
                <p className="text-red-600 font-light">
                  {errors.state.message}
                </p>
              )}
            </div>
            <div>
              <p className="text-black">{translates.municipality}</p>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("municipality", {
                    onChange: (e) => setMunicipality(e.target.value),
                  })}
                  name="municipality"
                  id="municipality"
                  className={isDisabled}
                  placeholder={translates.placeholder_municipality}
                  autoComplete="municipality"
                  disabled={country === "Mexico"}
                />
                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/*
          <div className='grid md:grid-cols-2 gap-6 mt-5'>
            <div>
              <p className='text-black'>
                {translates.colony}
                {country === 'Mexico' ? (
                  <span className='text-red-600'>*</span>
                ) : (
                  ''
                )}
              </p>
              <div className='relative mt-2'>
                {country === 'Mexico' ? (
                  <select
                    {...register('colonia', {
                      required: `${translates.requiered}`,
                      onChange: (e) => setColonia(e.target.value),
                    })}
                    className='mt-2 w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm text-black *:text-black'
                  >
                    <option value=''>{translates.select_option}</option>
                    {colonias.length > 0 &&
                      colonias.map((colonia) => (
                        <option key={colonia} value={colonia}>
                          {colonia}
                        </option>
                      ))}
                  </select>
                ) : (
                  <input
                    type='text'
                    {...register('colonia', {
                      onChange: (e) => setColonia(e.target.value),
                    })}
                    name='colonia'
                    id='colonia'
                    className='w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm shadow-sm'
                    placeholder={translates.placeholder_colony}
                    autoComplete='colonia'
                    defaultValue={colonia}
                  />
                )}
                <span className='absolute inset-y-0 end-0 grid place-content-center px-4'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-4 w-4 text-gray-400'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z'
                    />
                  </svg>
                </span>
              </div>
              {errors.colonia && (
                <p className='text-red-600 font-light'>
                  {errors.colonia.message}
                </p>
              )}
            </div>
            <div>
              <p className='text-black'>
                {translates.city} <span className='text-red-600'>*</span>
              </p>
              <div className='relative mt-2'>
                <input
                  type='text'
                  {...register('city', {
                    required: `${translates.requiered}`,
                    onChange: (e) => setCity(e.target.value),
                  })}
                  name='city'
                  id='city'
                  className={isDisabled}
                  placeholder={translates.placeholder_city}
                  autoComplete='city'
                  {...(city && { defaultValue: city })}
                  disabled={country === 'Mexico'}
                />
                <span className='absolute inset-y-0 end-0 grid place-content-center px-4'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-4 w-4 text-gray-400'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z'
                    />
                  </svg>
                </span>
              </div>
              {errors.city && (
                <p className='text-red-600 font-light'>{errors.city.message}</p>
              )}
            </div>
          </div>
          */}

          <div className="grid md:grid-cols-2 gap-6 mt-5">
            <div>
              <p className="text-black">
                {translates.website}{" "}
                <span className="text-gray-600 font-normal">
                  {translates.opcional}
                </span>
              </p>
              <div className="relative mt-2">
                <input
                  type="text"
                  onChange={(e) => setWebPage(e.target.value)}
                  name="webPage"
                  id="webPage"
                  className="w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder={translates.placeholder_website}
                  autoComplete="webPage"
                  defaultValue={webPage}
                />
                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <div>
              <p className="text-black">
                {translates.company_phone}{" "}
                <span className="text-gray-600 font-normal">
                  {translates.opcional}
                </span>
              </p>
              <div className="relative mt-2">
                <input
                  type="tel"
                  {...register("phoneCompany", {
                    pattern: {
                      value: /^[0-9+]+$/,
                      message: `${translates.no_phone_valid}`,
                    },
                    onChange: (e) => setPhoneCompany(e.target.value),
                  })}
                  name="phoneCompany"
                  id="phoneCompany"
                  className="w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder={translates.placeholder_company_phone}
                  autoComplete="phoneCompany"
                  defaultValue={phoneCompany}
                />
                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                    />
                  </svg>
                </span>
              </div>
              {errors.phoneCompany && (
                <p className="text-red-600 font-light">
                  {errors.phoneCompany.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Survey */}
        <div className="rounded-lg shadow-lg p-8 mt-10">
          <p className="text-lg font-semibold text-black flex items-center gap-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
              />
            </svg>

            {translates.info_survey}
          </p>
          <hr className="my-4 border-t border-gray-200" />
          <div className="grid md:grid-cols-2 gap-6 mt-5">
            <div>
              <p className="font-semibold text-black">
                {translates.how_find} <span className="text-red-600">*</span>
              </p>
              <select
                {...register("eventKnowledge", {
                  required: `${translates.requiered}`,
                  onChange: (e) => setEventKnowledge(e.target.value),
                })}
                defaultValue={eventKnowledge}
                className="mt-2 w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm text-black *:text-black uppercase"
              >
                <option value="">{translates.select_option}</option>
                <option value="ANUNCIO EN REVISTA">
                  {translates.magazine_ad}
                </option>
                <option value="CORREO ELECTRÓNICO">{translates.email}</option>
                <option value="ESPECTACULAR">{translates.spectacular}</option>
                <option value="FACEBOOK">FACEBOOK</option>
                <option value="INSTAGRAM">INSTAGRAM</option>
                <option value="INVITADO POR EXPOSITOR">
                  {translates.guest_by_exhibitor}
                </option>
                <option value="LINKEDIN">LINKEDIN</option>
                <option value="PAGINA WEB">{translates.website}</option>
                <option value="PRENSA">{translates.press}</option>
                <option value="RADIO">RADIO</option>
                <option value="TELEVISIÓN">{translates.television}</option>
                <option value="TIKTOK">TIKTOK</option>
                <option value="WHATSAPP">WHATSAPP</option>
                <option value="X">X</option>
              </select>
              {errors.eventKnowledge && (
                <p className="text-red-600 font-light">
                  {errors.eventKnowledge.message}
                </p>
              )}
            </div>
            <div>
              <p className="font-semibold text-black">
                {translates.product_interest}{" "}
                <span className="text-red-600">*</span>
              </p>
              <Select
                isMulti
                options={translates.list_interest_product.map((item) => ({
                  label: item,
                  value: item,
                }))}
                value={Array.isArray(productInterest) ? productInterest : []}
                onChange={(selected) => {
                  const selectedArray = Array.isArray(selected) ? selected : [];
                  setProductInterest(selectedArray);
                  // Actualizar el valor en react-hook-form
                  setValue(
                    "productInterest",
                    selectedArray.length > 0 ? selectedArray : null,
                  );
                }}
                placeholder={
                  translates.select_option || "Seleccionar opciones..."
                }
                noOptionsMessage={() =>
                  translates.no_options || "No hay opciones disponibles"
                }
                className="mt-2 w-full max-w-full text-sm uppercase"
                classNamePrefix="react-select"
              />

              {/* Campo oculto para validación con react-hook-form */}
              <input
                type="hidden"
                {...register("productInterest", {
                  required: `${translates.requiered}`,
                  validate: (value) => {
                    if (!productInterest || productInterest.length === 0) {
                      return `${translates.requiered}`;
                    }
                    return true;
                  },
                })}
              />
              {errors.productInterest && (
                <p className="text-red-600 font-light">
                  {errors.productInterest.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-5">
            <div>
              <p className="font-semibold text-black">
                {translates.level_influence}{" "}
                <span className="text-red-600">*</span>
              </p>
              <select
                {...register("levelInfluence", {
                  required: `${translates.requiered}`,
                  onChange: (e) => setLevelInfluence(e.target.value),
                })}
                defaultValue={levelInfluence}
                className="mt-2 w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm text-black *:text-black uppercase"
              >
                <option value="">{translates.select_option}</option>
                <option value="APRUEBO COMPRAS">
                  {translates.approve_purchases}
                </option>
                <option value="EVALUO O RECOMIENDO PROVEEDOR">
                  {translates.test_recomend}
                </option>
                <option value="NO TENGO DECISIÓN EN COMPRAS">
                  {translates.not_decide}
                </option>
              </select>
              {errors.levelInfluence && (
                <p className="text-red-600 font-light">
                  {errors.levelInfluence.message}
                </p>
              )}
            </div>
            <div>
              <p className="font-semibold text-black">
                {translates.wanna_be_exhibitor}{" "}
                <span className="text-red-600">*</span>
              </p>
              <select
                {...register("wannaBeExhibitor", {
                  required: `${translates.requiered}`,
                  onChange: (e) => setWannaBeExhibitor(e.target.value),
                })}
                defaultValue={wannaBeExhibitor}
                className="mt-2 w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm text-black *:text-black uppercase"
              >
                <option value="">{translates.select_option}</option>
                <option value="SI">{translates.yes}</option>
                <option value="NO">{translates.no}</option>
              </select>
              {errors.wannaBeExhibitor && (
                <p className="text-red-600 font-light">
                  {errors.wannaBeExhibitor.message}
                </p>
              )}
            </div>
          </div>
          {/*  Este campo se va a eliminar revisar en la base de datos  */}
          {/* <div className='grid md:grid-cols-2 gap-6 mt-5'>
            <div>
              <p className='font-semibold text-black'>
                {translates.association}
              </p>
              <select
                {...register('alreadyVisited', {
                  onChange: (e) => setAlreadyVisited(e.target.value),
                })}
                defaultValue={alreadyVisited}
                className='mt-2 w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm text-black *:text-black uppercase'
              >
                <option value=''>{translates.select_option}</option>
                {options.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.alreadyVisited && (
                <p className='text-red-600 font-light'>
                  {errors.alreadyVisited.message}
                </p>
              )}
            </div>
          </div> */}
        </div>

        <PrivacyNoticeAcceptance
          register={register}
          errors={errors}
          translates={translates}
          currentLanguage={currentLanguage}
        />

        {/* Button para finalizar el registro */}
        <div className="flex justify-center mt-10">
          <button type="submit" className="button">
            {translates.finish}
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
                  Estamos procesando la información por favor espere...
                </span>
              </p>
            </div>
          </div>
        )}
      </form>
    </section>
  );
}
