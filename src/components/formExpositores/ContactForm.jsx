import { useState } from 'react'
import { countrycodes } from '../../lib/countrycodes'
import { useZustandStore } from '../../store/form-store'

export function ContactForm() {
  const [selectedCountryCode, setSelectedCountryCode] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const [response, setResponse] = useState('')
  const [sendStatus, setSendStatus] = useState(false)

  const handleCountryCodeChange = (event) => {
    setSelectedCountryCode(event.target.value)
  }

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = Object.fromEntries(new window.FormData(event.target))

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
       body: JSON.stringify({ formData }),
    }

    try {
      setSendStatus(true)
      
      // Guardar datos en la base de datos
      const res = await fetch(
        'https://smarttechnologyexpo.mx/backend/landingPage.php',
        requestOptions
      )
      const data = await res.json()
      
      if (data.status) {
        // Enviar email de confirmación
        const statusEmail = await fetch(
          'https://hfmexico.mx/foro-electromovilidad/backend/email/send-email-ste-landing',
          requestOptions
        )
        const dataEmail = await statusEmail.json()
        
        if (dataEmail.status) {
          useZustandStore.setState({ zustandState: true })
          document.getElementById('form-contact')?.reset()
          setSelectedCountryCode('52')
          setPhoneNumber('')
          window.location.href = '/gracias-por-contactarnos'
        } else {
          setSendStatus(false)
          setResponse(
            'Lo sentimos en este momento no es posible enviar tu información...'
          )
        }
      } else {
        setSendStatus(false)
        setResponse(
          'Lo sentimos en este momento no es posible enviar tu información...'
        )
      }
    } catch (error) {
      console.log(error)
      setSendStatus(false)
      setResponse(
        'Lo sentimos en este momento no es posible enviar tu información...'
      )
    }
  }

  return (
    <>
      <form
        id='form-contact'
        className='mt-10 space-y-6 w-[95%] md:w-8/12 mx-auto bg-[#858C7E]/10 backdrop-blur rounded-2xl p-6 md:p-8 shadow-sm'
        onSubmit={handleSubmit}
        aria-labelledby='contact-form-title'
      >
        <div className='mb-2'>
          <h2 id='contact-form-title' className='text-xl md:text-2xl font-bold text-gray-900 mb-10'>
           Completa el formulario y nos pondremos en contacto contigo.
          </h2>
        </div>
        <div>
          <label
            htmlFor='sector'
            className='flex items-center gap-1 mb-1 text-sm font-semibold text-gray-800'
          >
            <span>Sector</span>
            <span className='text-[#9f2e26]' aria-hidden='true'>*</span>
          </label>
          <select
            id='sector'
            name='sector'
            className='bg-white/80 border border-[#858C7E]/40 text-gray-900 text-sm rounded-lg focus:ring-[#1F5E00] focus:border-[#1F5E00] block w-full p-3'
            required
            aria-required='true'
          >
            <option value='' defaultValue>
              Elige una opción
            </option>
            <option value='Máquinas y Herramientas / Metalworking'>
              Máquinas y Herramientas / Metalworking
            </option>
            <option value='Automatización, Robotización y Transmisión / Automation, Robotization & Motion'>
              Automatización, Robotización y Transmisión / Automation,
              Robotization & Motion
            </option>
            <option value='Logística Inteligente / Smart Logistics'>
              Logística Inteligente / Smart Logistics
            </option>
            <option value='Manufactura Digital y TIC / Digital Factory & ITC'>
              Manufactura Digital y TIC / Digital Factory & ITC
            </option>
            <option value='Soluciones de Energía / Power Solutions'>
              Soluciones de Energía / Power Solutions
            </option>
            <option value='Manufactura Aditiva / Additive Manufacture'>
              Manufactura Aditiva / Additive Manufacture
            </option>
            <option value='Gobierno / Government'>Gobierno / Government</option>
            <option value='Instituciones de investigación / Research institutions'>
              Instituciones de investigación / Research institutions
            </option>
            <option value='Startups'>Startups</option>
          </select>
        </div>
        <div>
          <label
            htmlFor='name'
            className='flex items-center gap-1 mb-1 text-sm font-semibold text-gray-800'
          >
            <span>Nombre</span>
            <span className='text-[#9f2e26]' aria-hidden='true'>*</span>
          </label>
          <input
            type='text'
            id='name'
            name='name'
            className='shadow-sm bg-white/80 border border-[#858C7E]/40 text-gray-900 text-sm rounded-lg focus:ring-[#1F5E00] focus:border-[#1F5E00] block w-full p-3'
            placeholder='John Doe'
            required
            autoComplete='name'
            aria-required='true'
          />
        </div>
        <div>
          <label
            htmlFor='email'
            className='flex items-center gap-1 mb-1 text-sm font-semibold text-gray-800'
          >
            <span>Email</span>
            <span className='text-[#9f2e26]' aria-hidden='true'>*</span>
          </label>
          <input
            type='email'
            id='email'
            name='email'
            className='shadow-sm bg-white/80 border border-[#858C7E]/40 text-gray-900 text-sm rounded-lg focus:ring-[#1F5E00] focus:border-[#1F5E00] block w-full p-3'
            placeholder='name@flowbite.com'
            required
            autoComplete='email'
            aria-required='true'
          />
        </div>
        <div>
          <label
            htmlFor='countrycodes'
            className='block mb-1 text-sm font-semibold text-gray-800'
          >
            Codigo de país + número de teléfono
          </label>
          <div className='w-full rounded-lg flex flex-col md:flex-row gap-3' role='group' aria-labelledby='countrycodes'>
            <div className='w-52'>
              <select
                className='block w-full mt-1 p-3 text-gray-700 border border-[#858C7E]/40 rounded-md focus:outline-none focus:ring-[#1F5E00] focus:border-[#1F5E00] bg-white/80'
                value={selectedCountryCode}
                onChange={handleCountryCodeChange}
                required
                id='countrycodes'
                name='countrycodes'
                aria-required='true'
              >
                <option value='52' defaultValue={52}>
                  MX 52
                </option>
                {countrycodes.map((country, index) => (
                  <option key={index} value={country.code}>
                    {`${country.iso} (${country.code})`}
                  </option>
                ))}
              </select>
            </div>
            <div className='w-full'>
              <input
                className='block w-full mt-1 p-3 text-gray-700 border border-[#858C7E]/40 rounded-md focus:outline-none focus:ring-[#1F5E00] focus:border-[#1F5E00] bg-white/80'
                type='number'
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder='Enter phone number'
                required
                id='phone'
                name='phone'
                autoComplete='phone'
                aria-required='true'
              />
            </div>
          </div>
        </div>
        <div className='sm:col-span-2'>
          <label
            htmlFor='message'
            className='flex items-center gap-1 mb-1 text-sm font-semibold text-gray-800'
          >
            <span>Mensaje</span>
            <span className='text-[#9f2e26]' aria-hidden='true'>*</span>
          </label>
          <textarea
            id='message'
            rows='6'
            name='message'
            className='block p-3 w-full text-sm text-gray-900 bg-white/80 rounded-lg shadow-sm border border-[#858C7E]/40 focus:ring-[#1F5E00] focus:border-[#1F5E00]'
            placeholder='Dejanos saber como podemos ayudarte...'
            required
            aria-required='true'
          ></textarea>
          <p className='mt-1 text-xs text-gray-600'>Sé específico para que podamos ayudarte mejor.</p>
        </div>
        {sendStatus ? (
          <span className='text-gray-800 flex items-center' aria-live='polite'>
            <svg
              className='animate-spin -ml-1 mr-3 h-5 w-5 text-[#9f2e26]'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>{' '}
            Enviando ...
          </span>
        ) : (
          <>
            {response === '' ? (
              <button
                type='submit'
                className='inline-flex items-center justify-center gap-2 text-white bg-[#1F5E00] hover:bg-[#288705] focus:ring-4 focus:outline-none 
                            focus:ring-[#1F5E00]/30 font-semibold rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center shadow-sm disabled:opacity-60 disabled:cursor-not-allowed'
                disabled={sendStatus}
                aria-disabled={sendStatus}
              >
                {sendStatus ? (
                  <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                ) : null}
                Enviar
              </button>
            ) : (
              <span className='text-gray-800 font-bold rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 mt-4 text-center'>
                {response}
              </span>
            )}
          </>
        )}
      </form>
    </>
  )
}
