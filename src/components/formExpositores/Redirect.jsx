import { useZustandStore } from '../../store/form-store'
import { useEffect } from 'react'

export function Redirect() {
  const { zustandState } = useZustandStore()

  useEffect(() => {
    if (zustandState !== true) {
      window.location.href = '/expositor-smarttechnologyexpo'
    }
  }, [zustandState])

  return <></>
}
