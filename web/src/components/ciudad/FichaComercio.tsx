import { motion } from 'motion/react'
import { QRCodeSVG } from 'qrcode.react'
import { useMemo, useState, type ReactNode } from 'react'
import { opcionesQR, type TipoQR } from '../../lib/qr'
import type { Categoria, Ciudad, Comercio } from '../../types'
import { Logo } from '../comun/Logo'

interface Props {
  comercio: Comercio
  ciudad?: Ciudad
  categorias: Categoria[]
  nombreKiosco: string
  onCerrar: () => void
}

function Dato({ icono, children }: { icono: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-2.5">
      <span className="text-2xl leading-none">{icono}</span>
      <div className="min-w-0 text-[15px] leading-snug text-slate-700">{children}</div>
    </div>
  )
}

export function FichaComercio({ comercio, ciudad, categorias, nombreKiosco, onCerrar }: Props) {
  const cats = categorias.filter((c) => comercio.categoriaIds.includes(c.id))
  const principal = cats[0]
  const color = principal?.color ?? '#0f766e'
  const opciones = useMemo(() => opcionesQR(comercio, ciudad, nombreKiosco), [comercio, ciudad, nombreKiosco])
  const [tipo, setTipo] = useState<TipoQR>('ubicacion')
  const qr = opciones.find((o) => o.tipo === tipo) ?? opciones[0]!

  return (
    <motion.aside
      key={comercio.id}
      initial={{ x: 480, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 480, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className="scroll-suave absolute top-24 right-4 bottom-28 z-30 flex w-[calc(100%-2rem)] flex-col overflow-y-auto rounded-[28px] bg-white shadow-2xl sm:w-[420px]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Cabecera de color */}
      <div className="relative h-28 shrink-0" style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}>
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '18px 18px' }} />
        <button
          onClick={onCerrar}
          className="absolute top-3 right-3 grid h-12 w-12 place-items-center rounded-full bg-white/90 text-slate-700 shadow active:scale-95"
          aria-label="Cerrar"
        >
          <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <div className="absolute -bottom-10 left-5">
          <Logo comercio={comercio} categoria={principal} tamano={88} />
        </div>
      </div>

      <div className="flex flex-col gap-3 px-5 pt-12 pb-5">
        <div>
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <span key={c.id} className="rounded-full px-3 py-1 text-sm font-bold text-white" style={{ background: c.color }}>
                {c.icono} {c.nombre}
              </span>
            ))}
            {comercio.destacado && <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700">⭐ Destacado</span>}
          </div>
          <h2 className="mt-2 font-display text-[28px] leading-tight font-bold text-slate-800">{comercio.nombre}</h2>
          {ciudad && <p className="text-slate-500">{ciudad.nombre}, {ciudad.departamento}</p>}
        </div>

        <p className="text-[16px] leading-relaxed text-slate-600">{comercio.descripcion}</p>

        <div className="grid gap-1.5">
          <Dato icono="📍">{comercio.direccion}</Dato>
          {comercio.horario && <Dato icono="🕒">{comercio.horario}</Dato>}
          {comercio.telefono && (
            <Dato icono="📞">
              <span className="font-display text-xl font-semibold tracking-wide text-slate-800">{comercio.telefono}</span>
            </Dato>
          )}
          {comercio.web && <Dato icono="🌐"><span className="break-all">{comercio.web.replace(/^https?:\/\//, '')}</span></Dato>}
        </div>

          {/* QR para llevarse la información */}
        <div className="rounded-3xl border-2 border-dashed p-4" style={{ borderColor: `${color}66`, background: `${color}0d` }}>
          <p className="text-center font-display text-lg font-semibold text-slate-700">📱 Llévatelo en tu celular</p>
          <div className="mt-3 flex items-center gap-3">
            <motion.div key={qr.tipo} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="shrink-0 rounded-2xl bg-white p-2.5 shadow-md">
              <QRCodeSVG value={qr.valor} size={168} level="M" marginSize={1} fgColor="#0f172a" />
            </motion.div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              {opciones.map((o) => (
                <button
                  key={o.tipo}
                  onClick={() => setTipo(o.tipo)}
                  className="min-h-11 rounded-full px-3 text-left text-sm font-bold transition active:scale-95"
                  style={o.tipo === qr.tipo ? { background: color, color: '#fff' } : { background: '#fff', color: '#334155', boxShadow: 'inset 0 0 0 2px #e2e8f0' }}
                >
                  {o.icono} {o.etiqueta}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-2 text-center text-sm text-slate-500">{qr.ayuda}. Escanéalo con la cámara.</p>
        </div>
      </div>
    </motion.aside>
  )
}
