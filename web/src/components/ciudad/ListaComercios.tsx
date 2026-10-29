import { motion } from 'motion/react'
import type { Categoria, Comercio } from '../../types'
import { Logo } from '../comun/Logo'

interface Props {
  comercios: Comercio[]
  categoriaDe: (c: Comercio) => Categoria | undefined
  seleccionado: Comercio | null
  onSeleccionar: (c: Comercio) => void
}

export function ListaComercios({ comercios, categoriaDe, seleccionado, onSeleccionar }: Props) {
  const ordenados = [...comercios].sort((a, b) => Number(!!b.destacado) - Number(!!a.destacado) || a.nombre.localeCompare(b.nombre))
  return (
    <motion.div
      initial={{ x: -360, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.6, type: 'spring', stiffness: 220, damping: 26 }}
      className="absolute top-24 bottom-28 left-4 z-20 hidden w-[320px] flex-col overflow-hidden rounded-[28px] bg-white/92 shadow-xl backdrop-blur lg:flex"
    >
      <p className="px-5 pt-4 pb-2 font-display text-lg font-semibold text-slate-700">
        {ordenados.length} {ordenados.length === 1 ? 'lugar' : 'lugares'} para visitar
      </p>
      <div className="scroll-suave flex-1 space-y-2 overflow-y-auto px-3 pb-3">
        {ordenados.length === 0 && (
          <div className="px-4 py-10 text-center text-slate-500">
            <div className="text-5xl">🔎</div>
            <p className="mt-3">Aún no hay lugares en esta categoría para esta ciudad.</p>
          </div>
        )}
        {ordenados.map((c, i) => {
          const cat = categoriaDe(c)
          const sel = seleccionado?.id === c.id
          return (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + Math.min(i, 12) * 0.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSeleccionar(c)}
              className="flex w-full items-center gap-3 rounded-2xl p-2 text-left transition-colors"
              style={sel ? { background: `${cat?.color ?? '#0f766e'}22`, boxShadow: `inset 0 0 0 2px ${cat?.color ?? '#0f766e'}` } : { background: '#fff' }}
            >
              <Logo comercio={c} categoria={cat} tamano={52} />
              <div className="min-w-0">
                <p className="truncate font-bold text-slate-800">
                  {c.destacado && '⭐ '}
                  {c.nombre}
                </p>
                <p className="truncate text-sm text-slate-500">{c.direccion}</p>
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
