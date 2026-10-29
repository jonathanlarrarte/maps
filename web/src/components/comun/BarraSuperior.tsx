import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import type { Ciudad, KioscoConfig } from '../../types'

interface Props {
  config: KioscoConfig
  ciudad: Ciudad | null
  onVolver: () => void
}

function Reloj() {
  const [ahora, setAhora] = useState(() => new Date())
  useEffect(() => {
    const t = window.setInterval(() => setAhora(new Date()), 15000)
    return () => window.clearInterval(t)
  }, [])
  return (
    <div className="hidden rounded-full bg-white/90 px-5 py-2 text-right shadow-lg backdrop-blur sm:block">
      <p className="font-display text-2xl leading-none font-semibold text-slate-800">
        {ahora.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' })}
      </p>
      <p className="text-xs text-slate-500 capitalize">{ahora.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
    </div>
  )
}

export function BarraSuperior({ config, ciudad, onVolver }: Props) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-4">
      <div className="pointer-events-auto">
        {ciudad ? (
          <motion.button
            key="volver"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onVolver}
            className="flex items-center gap-3 rounded-full bg-white/95 py-2 pr-6 pl-2 shadow-lg backdrop-blur"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full text-white" style={{ background: config.colorPrimario }}>
              <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
            </span>
            <span className="text-left">
              <span className="block font-display text-2xl leading-tight font-bold text-slate-800">{ciudad.nombre}</span>
              <span className="block text-sm text-slate-500">Toca aquí para volver al mapa de Colombia</span>
            </span>
          </motion.button>
        ) : (
          <motion.div key="marca" initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-3 rounded-full bg-white/95 py-2 pr-6 pl-2 shadow-lg backdrop-blur">
            {config.logoUrl ? (
              <img src={config.logoUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
            ) : (
              <span className="grid h-12 w-12 place-items-center rounded-full text-2xl" style={{ background: config.colorPrimario }}>
                🇨🇴
              </span>
            )}
            <span>
              <span className="block font-display text-2xl leading-tight font-bold text-slate-800">{config.nombre}</span>
              <span className="block text-sm text-slate-500">{config.eslogan}</span>
            </span>
          </motion.div>
        )}
      </div>
      <div className="pointer-events-auto">
        <Reloj />
      </div>
    </div>
  )
}
