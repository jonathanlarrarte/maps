import { motion } from 'motion/react'
import type { Categoria } from '../../types'

interface Props {
  categorias: Categoria[]
  activa: string | null
  /** Cantidad de comercios por categoría en el contexto actual (país o ciudad) */
  conteo: Record<string, number>
  total: number
  onCambiar: (id: string | null) => void
}

export function BarraCategorias({ categorias, activa, conteo, total, onCambiar }: Props) {
  const botones = [{ id: null, nombre: 'Todo', icono: '✨', color: '#0f766e' }, ...categorias]
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center px-3">
      <div className="scroll-suave pointer-events-auto flex max-w-full gap-2 overflow-x-auto rounded-full bg-white/90 p-2 shadow-xl backdrop-blur">
        {botones.map((c) => {
          const sel = activa === c.id
          const n = c.id === null ? total : (conteo[c.id] ?? 0)
          return (
            <motion.button
              key={c.id ?? 'todo'}
              whileTap={{ scale: 0.92 }}
              onClick={() => onCambiar(c.id)}
              className="relative flex h-16 shrink-0 items-center gap-2 rounded-full pr-5 pl-2 font-display text-lg font-semibold transition-colors"
              style={sel ? { background: c.color, color: '#fff' } : { color: '#334155' }}
              aria-pressed={sel}
            >
              <span className="grid h-12 w-12 place-items-center rounded-full text-2xl" style={{ background: sel ? 'rgba(255,255,255,.25)' : `${c.color}1f` }}>
                {c.icono}
              </span>
              <span className="whitespace-nowrap">{c.nombre}</span>
              <span className="rounded-full px-2 text-sm font-bold" style={sel ? { background: 'rgba(255,255,255,.3)' } : { background: '#f1f5f9', color: '#64748b' }}>
                {n}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
