import { useRegisterForm } from '../../store/register-form.js'
import { useEffect, useRef } from 'react'

export function Redirect({ homePath = '/' }) {
  const { complete_register, setCompleteRegister } = useRegisterForm()
  const hasAllowedAccess = useRef(false)

  useEffect(() => {
    if (hasAllowedAccess.current) {
      return
    }

    if (complete_register !== true) {
      window.location.replace(homePath)
      return
    }

    hasAllowedAccess.current = true
    setCompleteRegister(false)
  }, [complete_register, homePath, setCompleteRegister])

  return <></>
}
