import { useEffect, useState, useRef } from 'react'

export function Numbers({ number, duration }) {
  const [display, setDisplay] = useState('0')
  const [active, setActive] = useState(false)
  const ref = useRef(null)

  const formatWithCommas = (val) =>
    val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  // Intersection Observer — arranca cuando es visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  // Animación con requestAnimationFrame + easing ease-out
  useEffect(() => {
    if (!active) return

    const end = parseInt(number)
    const suffix = number.replace(/^\d+/, '') // e.g. "" o lo que venga después
    const durationMs = parseFloat(duration) * 1000
    const startTime = performance.now()

    const easeOut = (t) => 1 - Math.pow(1 - t, 3) // cubic ease-out

    let raf
    const animate = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / durationMs, 1)
      const easedProgress = easeOut(progress)
      const current = Math.round(easedProgress * end)

      setDisplay(formatWithCommas(current) + suffix)

      if (progress < 1) {
        raf = requestAnimationFrame(animate)
      }
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [active, number, duration])

  return (
    <>
      <span ref={ref} style={{ position: 'absolute', pointerEvents: 'none' }} />
      {display}
    </>
  )
}