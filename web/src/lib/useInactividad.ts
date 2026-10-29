import { useEffect, useLayoutEffect, useRef } from 'react'

/** Llama a `alVencer` si nadie toca la pantalla durante `segundos` */
export function useInactividad(segundos: number, alVencer: () => void, activo = true) {
  const cb = useRef(alVencer)
  useLayoutEffect(() => {
    cb.current = alVencer
  })

  useEffect(() => {
    if (!activo || segundos <= 0) return
    let t = window.setTimeout(() => cb.current(), segundos * 1000)
    const reiniciar = () => {
      window.clearTimeout(t)
      t = window.setTimeout(() => cb.current(), segundos * 1000)
    }
    const eventos = ['pointerdown', 'pointermove', 'wheel', 'keydown', 'touchstart'] as const
    eventos.forEach((e) => window.addEventListener(e, reiniciar, { passive: true }))
    return () => {
      window.clearTimeout(t)
      eventos.forEach((e) => window.removeEventListener(e, reiniciar))
    }
  }, [segundos, activo])
}
