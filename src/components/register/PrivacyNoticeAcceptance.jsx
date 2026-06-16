const PRIVACY_NOTICE_URL = 'https://igeco.mx/aviso-de-privacidad/'

export function PrivacyNoticeAcceptance({
  register,
  errors,
  translates,
  currentLanguage,
}) {
  const isEnglish = currentLanguage === 'en'
  const privacyLabel =
    translates?.privacy_policy || (isEnglish ? 'Privacy Policy' : 'Aviso de privacidad')
  const requiredMessage = isEnglish
    ? 'You must accept the privacy policy to complete your registration'
    : 'Debe aceptar el aviso de privacidad para completar su registro'

  return (
    <div className="rounded-lg shadow-lg p-8 mt-10">
      <p className="text-lg font-semibold text-black">{privacyLabel}</p>
      <hr className="my-4 border-t border-gray-200" />

      <label
        htmlFor="privacyNoticeAccepted"
        className="flex items-start gap-3 text-sm text-black"
      >
        <input
          id="privacyNoticeAccepted"
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-gray-300 text-green-700 focus:ring-green-700"
          aria-invalid={errors.privacyNoticeAccepted ? 'true' : 'false'}
          aria-describedby={
            errors.privacyNoticeAccepted ? 'privacyNoticeAccepted-error' : undefined
          }
          {...register('privacyNoticeAccepted', {
            required: requiredMessage,
          })}
        />
        <span>
          {isEnglish ? 'I have read and accept the ' : 'He leido y acepto el '}
          <a
            href={PRIVACY_NOTICE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-green-700 underline"
          >
            {privacyLabel}
          </a>
          .
        </span>
      </label>

      {errors.privacyNoticeAccepted && (
        <p
          id="privacyNoticeAccepted-error"
          className="mt-3 text-red-600 font-light"
        >
          {errors.privacyNoticeAccepted.message}
        </p>
      )}
    </div>
  )
}
