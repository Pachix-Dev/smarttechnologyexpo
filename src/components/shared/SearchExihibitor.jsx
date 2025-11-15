import { useState } from 'react'
import { directory } from '../../data/constans_directory_2025.js'

export function SearchExihibitor({ language }) {
  const [searchTerm, setSearchTerm] = useState(directory || [])

  const searchResults = (e) => {
    if (e === '') {
      setSearchTerm(directory)
      return
    }
    const results = directory.filter((item) =>
      item.name.toLowerCase().includes(e.toLowerCase())
    )
    setSearchTerm(results)
  }

  return (
    <div className='relative w-fit '>
      <input
        type='text'
        className='w-full h-12 px-4 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-red-600'
        placeholder='Search exhibitor'
        onChange={(e) => searchResults(e.target.value)}
      />
      {/* <a href='https://www.telcel.com/empresas' target='_blank'>
        <img
          src='/img/telcel_empresas_itm_2.webp'
          alt='Schneider'
          class='mt-5 w-96'
        />
      </a> */}
      {searchTerm.length > 0 &&
        searchTerm.map((item, index) => (
          <div
            key={index}
            className='grid xl:grid-cols-3 2xl:grid-cols-4 items-center gap-10 py-10 '
          >
            <div className='rounded-xl bg-white'>
              <img
                src={item.logo}
                alt={item.name}
                className='w-64 h-64 object-contain mx-auto'
              />
            </div>

            <div className='md:col-span-2'>
              <span className='-ms-2.5 font-bold'>{item.stand_number}</span>
              <h2 className='text-2xl font-bold'>{item.name}</h2>
              <p className='text-lg mt-2 text-justify'>
                {language === 'es' ? item.description : item.description_en}
              </p>
              <div className='mt-2 text-lg flex items-center gap-1'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='w-6 h-6'
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
                {item.address}
              </div>
            </div>

            <div>
              {/*<p className='font-bold text-lg'>{item.contact}</p>
              <p className='italic'>{item.position}</p>
              <p className='text-lg flex items-center gap-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  width='20'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3'
                  />
                </svg>
                {item.phone}
              </p>
              <a
                href={`mailto:${item.email}`}
                className='text-lg flex items-center gap-2 hover:text-red-600'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  width='20'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75'
                  />
                </svg>
                {item.email}
              </a>
              */}
              <a
                href={`${item.webpage}`}
                className='text-lg flex items-center gap-2 hover:text-red-600'
                target='_blank'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='size-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418'
                  />
                </svg>
                {item.webpage}
              </a>
              <div className='mt-2 flex gap-4'>
                {item?.facebook && (
                  <a
                    href={item.facebook}
                    target='_blank'
                    className='text-lg flex items-center gap-2 *:hover:fill-red-600'
                  >
                    <svg
                      role='img'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                      className='w-6 h-6 fill-white'
                    >
                      <title>Facebook</title>
                      <path d='M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z' />
                    </svg>
                  </a>
                )}
                {item?.instagram && (
                  <a
                    href={item.instagram}
                    target='_blank'
                    className='text-lg flex items-center gap-2 *:hover:fill-red-600'
                  >
                    <svg
                      role='img'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                      className='w-6 h-6 fill-white'
                    >
                      <title>Instagram</title>
                      <path d='M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077' />
                    </svg>
                  </a>
                )}
                {item?.linkedIn && (
                  <a
                    href={item.linkedIn}
                    target='_blank'
                    className='text-lg flex items-center gap-2 *:hover:fill-red-600'
                  >
                    <svg
                      role='img'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                      className='w-6 h-6 fill-white'
                    >
                      <title>LinkedIn</title>
                      <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                    </svg>
                  </a>
                )}
                {item?.x && (
                  <a
                    href={item.x}
                    target='_blank'
                    className='text-lg flex items-center gap-2 *:hover:fill-red-600'
                  >
                    <svg
                      role='img'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                      className='w-6 h-6 fill-white'
                    >
                      <title>X</title>
                      <path d='M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z' />
                    </svg>
                  </a>
                )}
                {item?.youtube && (
                  <a
                    href={item.youtube}
                    target='_blank'
                    className='text-lg flex items-center gap-2 *:hover:fill-red-600'
                  >
                    <svg
                      role='img'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                      className='w-6 h-6 fill-white'
                    >
                      <title>YouTube</title>
                      <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
