import { motion } from 'motion/react'
import { useState } from 'react'
import { ciudadPorDepartamento } from '../../data/ciudades'
import { INSET, MAP_H, MAP_W, deptos, proyectar, sanAndresDibujo, vecinosDibujo } from '../../lib/geo'
import type { Ciudad } from '../../types'
import { AdornosCielo, AdornosMar, AdornosTierra } from './Adornos'

const VB_COMPLETO = `0 0 ${MAP_W} ${MAP_H}`

function vbCiudad(c: Ciudad) {
  const [x, y] = proyectar(c.lng, c.lat, c.dptoCodigo)
  const w = MAP_W / 9
  const h = MAP_H / 9
  return `${x - w / 2} ${y - h / 2} ${w} ${h}`
}

interface Props {
  ciudades: Ciudad[]
  /** Comercios visibles por ciudad (ya filtrados por la categoría activa) */
  conteo: Record<string, number>
  colorPines: string
  /** Si se define, el mapa hace zoom hacia esa ciudad y luego llama a onZoomTerminado */
  zoomHacia: Ciudad | null
  /** Ciudad desde la que se vuelve (el mapa arranca acercado y se aleja) */
  vieneDe: Ciudad | null
  onElegirCiudad: (c: Ciudad) => void
  onZoomTerminado: () => void
}

const ETIQUETAS: { t: string; x: number; y: number; s: number; mar?: boolean; rot?: number }[] = [
  { t: 'Mar Caribe', x: 590, y: 200, s: 26, mar: true },
  { t: 'Océano Pacífico', x: 330, y: 560, s: 30, mar: true, rot: -12 },
  { t: 'VENEZUELA', x: 1190, y: 240, s: 20 },
  { t: 'BRASIL', x: 1270, y: 700, s: 20 },
  { t: 'PERÚ', x: 760, y: 862, s: 18 },
  { t: 'ECUADOR', x: 575, y: 735, s: 16 },
  { t: 'PANAMÁ', x: 470, y: 238, s: 15 },
]

export function MapaPais({ ciudades, conteo, colorPines, zoomHacia, vieneDe, onElegirCiudad, onZoomTerminado }: Props) {
  const [deptoActivo, setDeptoActivo] = useState<string | null>(null)
  const vbInicial = vieneDe ? vbCiudad(vieneDe) : VB_COMPLETO
  const vbDestino = zoomHacia ? vbCiudad(zoomHacia) : VB_COMPLETO

  const elegirDepto = (codigo: string) => {
    const c = ciudadPorDepartamento(codigo)
    if (!c) return
    setDeptoActivo(codigo)
    onElegirCiudad(c)
  }

  // Primero las ciudades sin comercios (quedan debajo), luego las que tienen
  const pines = [...ciudades].sort((a, b) => (conteo[a.id] ?? 0) - (conteo[b.id] ?? 0))

  return (
    <motion.svg
      className="h-full w-full"
      viewBox={vbInicial}
      initial={{ viewBox: vbInicial }}
      animate={{ viewBox: vbDestino }}
      transition={{ duration: zoomHacia ? 1.15 : 1.3, ease: [0.65, 0, 0.35, 1] }}
      onAnimationComplete={() => zoomHacia && onZoomTerminado()}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa interactivo de Colombia"
    >
      <defs>
        <radialGradient id="mar" cx="45%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#5fd0f3" />
          <stop offset="60%" stopColor="#2aa7dc" />
          <stop offset="100%" stopColor="#1678b8" />
        </radialGradient>
        <radialGradient id="brilloSol" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff7c2" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#facc15" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="brilloTierra" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
        </linearGradient>
      </defs>

      <rect x={-400} y={-400} width={MAP_W + 800} height={MAP_H + 800} fill="url(#mar)" />
      <AdornosMar />

      {/* Países vecinos */}
      <g>
        {vecinosDibujo.map((v) => (
          <path key={v.nombre} d={v.d} fill="#f1e7c6" stroke="#d9c995" strokeWidth={1.5} />
        ))}
      </g>

      {/* Agua poco profunda + playa alrededor de Colombia */}
      <g fill="none" strokeLinejoin="round">
        {deptos.map((d) => (
          <path key={d.codigo} d={d.d} stroke="#a5ecfa" strokeWidth={16} opacity={0.55} />
        ))}
        {deptos.map((d) => (
          <path key={d.codigo} d={d.d} stroke="#fff1bd" strokeWidth={6} />
        ))}
      </g>

      {/* Relieve 3D (sombra extruida bajo el país) */}
      <g transform="translate(0 9)">
        {deptos.map((d) => (
          <path key={d.codigo} d={d.d} fill="#2c7a4b" stroke="#2c7a4b" strokeWidth={2} />
        ))}
      </g>

      {/* Departamentos */}
      <g>
        {deptos.map((d, i) => (
          <g key={d.codigo} className="anim-entrada" style={{ animationDelay: vieneDe ? '0s' : `${0.15 + i * 0.035}s`, animationDuration: vieneDe ? '0s' : undefined }}>
            <path
              d={d.d}
              fill={d.color}
              stroke="#ffffff"
              strokeWidth={1.6}
              strokeLinejoin="round"
              className={`depto ${deptoActivo === d.codigo ? 'activo' : ''}`}
              onClick={() => elegirDepto(d.codigo)}
            >
              <title>{d.nombre}</title>
            </path>
          </g>
        ))}
        <g pointerEvents="none">
          {deptos.map((d) => (
            <path key={d.codigo} d={d.d} fill="url(#brilloTierra)" />
          ))}
        </g>
      </g>

      <AdornosTierra />

      {/* Recuadro de San Andrés */}
      <g className="cursor-pointer" onClick={() => elegirDepto('88')}>
        <rect x={INSET.x} y={INSET.y} width={INSET.w} height={INSET.h} rx={18} fill="#36b6e6" stroke="#ffffff" strokeWidth={3} strokeDasharray="8 6" />
        <path d={sanAndresDibujo.d} transform="translate(0 4)" fill="#2c7a4b" />
        <path d={sanAndresDibujo.d} fill="#ffd66e" stroke="#fff1bd" strokeWidth={3} />
        <text x={INSET.x + INSET.w / 2} y={INSET.y + INSET.h - 10} textAnchor="middle" fontSize={15} fontWeight={700} className="fill-white font-display">
          San Andrés
        </text>
      </g>

      {/* Nombres de mares y países */}
      <g pointerEvents="none">
        {ETIQUETAS.map((e) => (
          <text
            key={e.t}
            x={e.x}
            y={e.y}
            textAnchor="middle"
            fontSize={e.s}
            transform={e.rot ? `rotate(${e.rot} ${e.x} ${e.y})` : undefined}
            className="font-display"
            fill={e.mar ? '#ffffff' : '#b9a46a'}
            opacity={e.mar ? 0.85 : 1}
            fontStyle={e.mar ? 'italic' : undefined}
            fontWeight={600}
            letterSpacing={e.mar ? 2 : 4}
          >
            {e.t}
          </text>
        ))}
      </g>

      <AdornosCielo />

      {/* Capitales */}
      <g>
        {pines.map((c, i) => (
          <PinCiudad key={c.id} ciudad={c} cantidad={conteo[c.id] ?? 0} color={colorPines} indice={i} onClick={() => onElegirCiudad(c)} />
        ))}
      </g>
    </motion.svg>
  )
}

// Ciudades muy cercanas entre sí: su nombre va a un lado para que no se encimen
const LADO_ETIQUETA: Record<string, 'izq' | 'der'> = { barranquilla: 'izq', cartagena: 'izq', 'santa-marta': 'der' }

function PinCiudad({ ciudad, cantidad, color, indice, onClick }: { ciudad: Ciudad; cantidad: number; color: string; indice: number; onClick: () => void }) {
  const [x, y] = proyectar(ciudad.lng, ciudad.lat, ciudad.dptoCodigo)
  const conDatos = cantidad > 0
  const escala = conDatos ? (ciudad.esCapitalPais ? 1.25 : 1) : 0.62
  const relleno = conDatos ? (ciudad.esCapitalPais ? '#f59e0b' : color) : '#64748b'

  return (
    <g transform={`translate(${x} ${y})`} onClick={onClick} className="cursor-pointer" role="button" aria-label={`${ciudad.nombre}: ${cantidad} lugares`}>
      <circle r={26} fill="transparent" />
      {conDatos && <circle className="anim-pulso" r={10} fill={relleno} style={{ animationDelay: `${-(indice * 0.3) % 2}s` }} />}
      <g transform={`scale(${escala})`}>
        <g className={conDatos ? 'anim-rebote' : undefined} style={{ animationDelay: `${-(indice * 0.2) % 1.4}s` }}>
          <ellipse cx={0} cy={0} rx={7} ry={2.5} fill="#000" opacity={0.25} />
          <path d="M0 0 C -3 -7 -12 -12 -12 -21 A 12 12 0 1 1 12 -21 C 12 -12 3 -7 0 0 Z" fill={relleno} stroke="#ffffff" strokeWidth={2.5} />
          {ciudad.esCapitalPais ? (
            <path d="M0 -28 l2.4 4.9 5.4 0.8 -3.9 3.8 0.9 5.4 -4.8 -2.5 -4.8 2.5 0.9 -5.4 -3.9 -3.8 5.4 -0.8 z" fill="#ffffff" />
          ) : (
            <circle cy={-21} r={5} fill="#ffffff" />
          )}
        </g>
      </g>
      {conDatos && (
        <>
          <text
            x={LADO_ETIQUETA[ciudad.id] === 'izq' ? -15 : LADO_ETIQUETA[ciudad.id] === 'der' ? 15 : 0}
            y={LADO_ETIQUETA[ciudad.id] ? -14 : ciudad.esCapitalPais ? 20 : 17}
            textAnchor={LADO_ETIQUETA[ciudad.id] === 'izq' ? 'end' : LADO_ETIQUETA[ciudad.id] === 'der' ? 'start' : 'middle'}
            fontSize={ciudad.esCapitalPais ? 17 : 14}
            fontWeight={700}
            fill="#1f2937"
            className="texto-contorno font-display"
          >
            {ciudad.nombre}
          </text>
          <g transform={`translate(${12 * escala} ${-34 * escala})`}>
            <circle r={11} fill="#ef4444" stroke="#ffffff" strokeWidth={2.5} />
            <text y={4.5} textAnchor="middle" fontSize={12} fontWeight={800} fill="#ffffff" className="font-display">
              {cantidad}
            </text>
          </g>
        </>
      )}
    </g>
  )
}
