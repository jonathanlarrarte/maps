import { geoContains } from 'd3-geo'
import type { Feature } from 'geojson'
import { motion } from 'motion/react'
import departamentosRaw from '../../assets/geo/colombia-departamentos.json'
import vecinosRaw from '../../assets/geo/vecinos.json'
import { INSET, MAP_H, MAP_W, projection } from '../../lib/geo'

// Todos los adornos se ubican con [lng, lat] reales y se proyectan al lienzo.
type LL = [number, number]

const ARBOLES_SELVA: LL[] = [
  [-72.5, -1.5], [-71.2, -1.8], [-70.5, -1], [-71, 0.3], [-73, -0.3], [-69.8, -3.2], [-70.2, 1.5],
  [-71.5, 1.2], [-68.5, 2.2], [-69.7, 0.8], [-72.6, 2.0], [-74.4, 0.6], [-69.7, -2.2], [-72.0, -0.7],
  // Chocó y Pacífico
  [-77.2, 6.2], [-76.95, 5.0], [-77.3, 7.3], [-78.3, 1.9], [-77.4, 2.7],
]
const PALMERAS: LL[] = [[-75.55, 10.25], [-75.0, 10.9], [-75.9, 9.4], [-73.0, 11.2], [-76.5, 8.7], [-74.25, 10.9]]
const CACTUS: LL[] = [[-71.9, 11.7], [-71.6, 12.1]]
const PASTO_LLANO: LL[] = [[-71.5, 5.2], [-70.2, 4.6], [-69, 5.5], [-71, 3.6], [-72.6, 4.0], [-68.4, 4.2], [-70.0, 3.3], [-69.5, 6.0]]
const MONTANAS: { ll: LL; s: number; nieve?: boolean }[] = [
  { ll: [-77.6, 1.0], s: 0.8 }, { ll: [-76.9, 1.9], s: 0.85 }, { ll: [-76.3, 2.8], s: 0.9 }, { ll: [-75.9, 3.9], s: 0.9 },
  { ll: [-75.32, 4.89], s: 1.15, nieve: true }, { ll: [-75.6, 5.9], s: 0.85 }, { ll: [-75.2, 6.8], s: 0.8 },
  { ll: [-74.6, 3.2], s: 0.85 }, { ll: [-73.9, 5.0], s: 0.9 }, { ll: [-73.2, 6.0], s: 0.9 },
  { ll: [-72.3, 6.45], s: 1.05, nieve: true }, { ll: [-72.7, 8.0], s: 0.8 }, { ll: [-76.6, 4.4], s: 0.75 },
  { ll: [-76.1, 5.6], s: 0.75 }, { ll: [-73.7, 10.85], s: 1.2, nieve: true },
]

const p = (ll: LL) => projection(ll) ?? [0, 0]

// Olas: malla de puntos que caen en el mar (se descarta todo punto sobre tierra)
const tierra = [
  ...(departamentosRaw as unknown as { features: Feature[] }).features,
  ...(vecinosRaw as unknown as { features: Feature[] }).features,
]
function puntosDeMar(): [number, number][] {
  const out: [number, number][] = []
  for (let y = 30; y < MAP_H; y += 70) {
    for (let x = 30; x < MAP_W; x += 95) {
      const jx = x + ((y * 7) % 40) - 20
      const jy = y + ((x * 3) % 30) - 15
      const ll = projection.invert?.([jx, jy])
      if (!ll) continue
      const enInset = jx > INSET.x - 10 && jx < INSET.x + INSET.w + 10 && jy > INSET.y - 10 && jy < INSET.y + INSET.h + 10
      if (enInset) continue
      if (!tierra.some((f) => geoContains(f, ll))) out.push([jx, jy])
    }
  }
  return out
}

/* ─────────── Piezas dibujadas ─────────── */

function Arbol({ x, y, i }: { x: number; y: number; i: number }) {
  const tonos = ['#1f7a3d', '#278c48', '#1c6e37']
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={1} rx={10} ry={3} fill="#0b3d1f" opacity={0.25} />
      <g className="anim-mecer" style={{ animationDelay: `${-(i * 0.37) % 3}s` }}>
        <rect x={-2} y={-13} width={4} height={14} rx={1.5} fill="#7a4a24" />
        <circle cx={0} cy={-21} r={10} fill={tonos[i % 3]} />
        <circle cx={-7} cy={-15} r={7} fill="#2fa152" />
        <circle cx={7} cy={-15} r={7} fill={tonos[(i + 1) % 3]} />
        <circle cx={-3} cy={-25} r={4} fill="#6fd08a" opacity={0.8} />
      </g>
    </g>
  )
}

function Palmera({ x, y, i }: { x: number; y: number; i: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={1} rx={9} ry={2.5} fill="#7a5a10" opacity={0.25} />
      <g className="anim-mecer-fuerte" style={{ animationDelay: `${-i * 0.6}s` }}>
        <path d="M0 0 Q 3 -12 1 -24" stroke="#9a6a35" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        <g transform="translate(1 -24)">
          <path d="M0 0 Q -10 -6 -16 2" stroke="#27a845" strokeWidth={3.5} fill="none" strokeLinecap="round" />
          <path d="M0 0 Q 10 -6 16 2" stroke="#27a845" strokeWidth={3.5} fill="none" strokeLinecap="round" />
          <path d="M0 0 Q -6 -12 -12 -10" stroke="#3cc05a" strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d="M0 0 Q 6 -12 12 -10" stroke="#3cc05a" strokeWidth={3} fill="none" strokeLinecap="round" />
          <circle cx={-1.5} cy={1.5} r={2} fill="#7a4a24" />
          <circle cx={1.5} cy={2} r={2} fill="#7a4a24" />
        </g>
      </g>
    </g>
  )
}

function Cactus({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="anim-mecer" style={{ animationDuration: '6s' }}>
        <rect x={-3} y={-18} width={6} height={18} rx={3} fill="#3f9b47" />
        <path d="M-3 -8 h-4 v-6" stroke="#3f9b47" strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M3 -11 h4 v-5" stroke="#3f9b47" strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
    </g>
  )
}

function Pasto({ x, y, i }: { x: number; y: number; i: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="anim-mecer-fuerte" style={{ animationDelay: `${-i * 0.45}s` }}>
        <path d="M-5 0 Q -6 -7 -9 -10 M0 0 Q 0 -8 1 -13 M5 0 Q 6 -7 9 -10" stroke="#6c9a1f" strokeWidth={2.2} fill="none" strokeLinecap="round" />
        {i % 2 === 0 && <circle cx={1} cy={-14} r={2.2} fill="#ff6b9a" />}
      </g>
    </g>
  )
}

function Montana({ x, y, s, nieve }: { x: number; y: number; s: number; nieve?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={1} rx={22} ry={4} fill="#3b4a1c" opacity={0.2} />
      <path d="M-22 0 L0 -32 L22 0 Z" fill="#a2865f" />
      <path d="M0 -32 L22 0 L4 0 Z" fill="#7d6545" />
      {nieve && <path d="M-7 -21.8 L0 -32 L7 -21.8 L3 -24 L0 -21 L-3 -24 Z" fill="#ffffff" />}
    </g>
  )
}

function Ballena({ x, y, i, s = 1 }: { x: number; y: number; i: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="anim-nadar" style={{ animationDelay: `${-i * 2.5}s` }}>
        {/* chorro de agua */}
        <g className="anim-chorro" style={{ animationDelay: `${-i * 1.7}s` }}>
          <path d="M8 -16 q -4 -10 -9 -12 M8 -16 q 0 -12 0 -15 M8 -16 q 4 -10 9 -12" stroke="#d9f6ff" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </g>
        <path d="M-26 -2 Q -22 -18 2 -18 Q 22 -18 26 -4 Q 22 4 0 4 Q -16 4 -26 -2 Z" fill="#2f5fa8" />
        <path d="M-18 0 Q 0 6 22 -2 Q 18 4 0 4 Q -12 4 -18 0 Z" fill="#a9c8ef" />
        <path d="M-25 -3 Q -34 -12 -40 -10 Q -36 -4 -38 2 Q -32 -2 -25 -1 Z" fill="#2f5fa8" />
        <circle cx={15} cy={-8} r={1.8} fill="#0b1d3a" />
        <path d="M10 -2 q 4 2 8 0" stroke="#0b1d3a" strokeWidth={1.2} fill="none" strokeLinecap="round" />
      </g>
      <path className="anim-ola" d="M-34 6 q 6 -4 12 0 t 12 0 t 12 0 t 12 0 t 12 0" stroke="#e8fbff" strokeWidth={2} fill="none" opacity={0.8} />
    </g>
  )
}

function Velero({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="anim-navegar">
        <g className="anim-flotar">
          <path d="M-18 0 L18 0 L12 8 L-12 8 Z" fill="#c2410c" />
          <rect x={-1} y={-30} width={2} height={30} fill="#5b3a1e" />
          <path d="M1 -28 L18 -3 L1 -3 Z" fill="#ffffff" />
          <path d="M-1 -24 L-14 -3 L-1 -3 Z" fill="#fde68a" />
          <path d="M1 -30 l7 2.5 l-7 2.5 z" fill="#e11d48" />
          <path d="M-22 10 q 5 -3 10 0 t 10 0 t 10 0 t 10 0" stroke="#ffffff" strokeWidth={1.8} fill="none" opacity={0.85} />
        </g>
      </g>
    </g>
  )
}

function Lancha({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="anim-lancha">
        <g className="anim-flotar" style={{ animationDuration: '1.4s' }}>
          <path d="M-14 0 L16 0 Q 14 7 8 7 L-12 7 Z" fill="#facc15" />
          <path d="M-6 0 L-2 -7 L8 -7 L10 0 Z" fill="#e0f2fe" stroke="#0369a1" strokeWidth={1} />
          <rect x={-14} y={-2} width={30} height={2} fill="#0369a1" />
          <path d="M-16 5 l-10 -2 M-16 7 l-12 2" stroke="#ffffff" strokeWidth={1.8} strokeLinecap="round" />
        </g>
      </g>
    </g>
  )
}

function Delfin({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="anim-saltar" style={{ animationDelay: `${delay}s` }}>
        <path d="M-12 0 Q -4 -10 10 -4 L14 -6 L12 -2 Q 4 4 -12 0 Z" fill="#5b8fd6" />
        <path d="M-2 -6 l3 -5 l2 5 z" fill="#5b8fd6" />
        <path d="M-12 0 l-5 -4 l1 6 z" fill="#5b8fd6" />
        <circle cx={7} cy={-4} r={0.9} fill="#0b1d3a" />
      </g>
      <g className="anim-salpicar" style={{ animationDelay: `${delay}s` }}>
        <circle cx={-6} cy={2} r={2} fill="#ffffff" />
        <circle cx={30} cy={2} r={2} fill="#ffffff" />
      </g>
    </g>
  )
}

function Nube({ y, escala, duracion, retraso }: { y: number; escala: number; duracion: number; retraso: number }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <g className="anim-nube" style={{ animationDuration: `${duracion}s`, animationDelay: `${retraso}s` }}>
        <g transform={`scale(${escala})`} opacity={0.88}>
          <ellipse cx={0} cy={6} rx={46} ry={10} fill="#000" opacity={0.06} />
          <circle cx={-22} cy={0} r={16} fill="#fff" />
          <circle cx={0} cy={-10} r={22} fill="#fff" />
          <circle cx={24} cy={-2} r={17} fill="#fff" />
          <rect x={-38} y={-2} width={78} height={16} rx={8} fill="#fff" />
        </g>
      </g>
    </g>
  )
}

function Pajaros({ y, retraso }: { y: number; retraso: number }) {
  const ave = (dx: number, dy: number, k: number) => (
    <g key={k} transform={`translate(${dx} ${dy})`}>
      <path className="anim-aletear" style={{ animationDelay: `${-k * 0.15}s` }} d="M-7 0 Q -3 -5 0 0 Q 3 -5 7 0" stroke="#1f2937" strokeWidth={2} fill="none" strokeLinecap="round" />
    </g>
  )
  return (
    <g transform={`translate(0 ${y})`}>
      <g className="anim-bandada" style={{ animationDelay: `${retraso}s` }}>
        <g className="anim-flotar" style={{ animationDuration: '3s' }}>
          {ave(0, 0, 0)}
          {ave(-16, 9, 1)}
          {ave(-16, -9, 2)}
          {ave(-31, 17, 3)}
          {ave(-30, -16, 4)}
        </g>
      </g>
    </g>
  )
}

/** Guacamaya que baja desde el cielo, se posa en un árbol de la selva y vuelve a volar */
function Guacamaya({ perchaX, perchaY }: { perchaX: number; perchaY: number }) {
  const inicioX = MAP_W + 60
  const finX = perchaX - 520
  return (
    <motion.g
      initial={{ x: inicioX, y: -60 }}
      animate={{
        x: [inicioX, perchaX + 120, perchaX, perchaX, perchaX - 120, finX],
        y: [-60, perchaY - 160, perchaY, perchaY, perchaY - 140, -80],
      }}
      transition={{ duration: 16, times: [0, 0.25, 0.38, 0.62, 0.75, 1], ease: 'easeInOut', repeat: Infinity, repeatDelay: 6 }}
    >
      <g transform="scale(1.1)">
        <path d="M-2 4 L-14 18 L-6 6 Z" fill="#2563eb" />
        <path d="M0 4 L-10 22 L-3 6 Z" fill="#facc15" />
        <ellipse cx={0} cy={0} rx={9} ry={6} fill="#ef4444" />
        <circle cx={8} cy={-4} r={5} fill="#ef4444" />
        <circle cx={9.5} cy={-5} r={1.2} fill="#111827" />
        <circle cx={9.2} cy={-5} r={2.4} fill="none" stroke="#fff" strokeWidth={0.8} />
        <path d="M12 -4 q 4 1 2 5 q -2 -2 -3 -3 z" fill="#1f2937" />
        <g className="anim-ala">
          <path d="M-2 -2 Q -6 -16 6 -18 Q 4 -8 4 -2 Z" fill="#2563eb" />
          <path d="M-1 -2 Q -3 -10 4 -12 Q 3 -6 3 -2 Z" fill="#facc15" />
        </g>
      </g>
    </motion.g>
  )
}

function Mico({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="anim-columpio">
        <path d="M0 0 Q 2 10 0 20" stroke="#4d7c0f" strokeWidth={1.6} fill="none" />
        <g transform="translate(0 26)">
          <path d="M3 4 q 9 3 7 -6" stroke="#7c4a1e" strokeWidth={2} fill="none" strokeLinecap="round" />
          <ellipse cx={0} cy={4} rx={5} ry={6} fill="#8b5a2b" />
          <circle cx={0} cy={-4} r={5} fill="#8b5a2b" />
          <ellipse cx={0} cy={-3} rx={3.5} ry={3} fill="#f1c99b" />
          <circle cx={-1.3} cy={-4} r={0.8} fill="#111" />
          <circle cx={1.3} cy={-4} r={0.8} fill="#111" />
          <path d="M-1 -1.8 q 1 1 2 0" stroke="#111" strokeWidth={0.6} fill="none" />
          <path d="M-3 -1 L-1 -6" stroke="#8b5a2b" strokeWidth={2.4} strokeLinecap="round" transform="translate(0 -6)" />
        </g>
      </g>
    </g>
  )
}

function Mariposa({ x, y, color, retraso }: { x: number; y: number; color: string; retraso: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="anim-revolotear" style={{ animationDelay: `${retraso}s` }}>
        <g className="anim-alas-mariposa">
          <ellipse cx={-3.5} cy={-2} rx={3.5} ry={4.5} fill={color} />
          <ellipse cx={3.5} cy={-2} rx={3.5} ry={4.5} fill={color} />
          <ellipse cx={-2.8} cy={3} rx={2.4} ry={3} fill={color} opacity={0.85} />
          <ellipse cx={2.8} cy={3} rx={2.4} ry={3} fill={color} opacity={0.85} />
        </g>
        <rect x={-0.7} y={-4} width={1.4} height={9} rx={0.7} fill="#1f2937" />
      </g>
    </g>
  )
}

function Sol({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="anim-girar">
        {Array.from({ length: 12 }, (_, k) => (
          <rect key={k} x={-3} y={-58} width={6} height={16} rx={3} fill="#fde047" transform={`rotate(${k * 30})`} />
        ))}
      </g>
      <circle r={36} fill="#facc15" />
      <circle r={36} fill="url(#brilloSol)" />
      <circle cx={-11} cy={-4} r={3} fill="#7c2d12" />
      <circle cx={11} cy={-4} r={3} fill="#7c2d12" />
      <path d="M-12 8 Q 0 18 12 8" stroke="#7c2d12" strokeWidth={3} fill="none" strokeLinecap="round" />
      <circle cx={-20} cy={6} r={4} fill="#fb923c" opacity={0.6} />
      <circle cx={20} cy={6} r={4} fill="#fb923c" opacity={0.6} />
    </g>
  )
}

function RosaDeLosVientos({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={0.9}>
      <circle r={44} fill="#ffffff" opacity={0.25} />
      <circle r={44} fill="none" stroke="#ffffff" strokeWidth={2} strokeDasharray="4 5" />
      <g className="anim-brujula">
        <path d="M0 -40 L8 0 L0 40 L-8 0 Z" fill="#fef3c7" />
        <path d="M0 -40 L8 0 L-8 0 Z" fill="#dc2626" />
        <path d="M-40 0 L0 -7 L40 0 L0 7 Z" fill="#fef3c7" opacity={0.85} />
      </g>
      <text y={-50} textAnchor="middle" className="fill-white font-display" fontSize={16} fontWeight={700}>N</text>
    </g>
  )
}

/* ─────────── Capas ─────────── */

/** Capa bajo el país: olas, ballenas, barcos y delfines */
// Se calcula una sola vez al cargar el módulo
const OLAS = puntosDeMar()

export function AdornosMar() {
  const olas = OLAS
  const [w1x, w1y] = p([-80.2, 5.0])
  const [w2x, w2y] = p([-79.6, 2.2])
  const [w3x, w3y] = p([-82.5, 7.2])
  const [lx, ly] = p([-76.1, 10.75])
  const [dx, dy] = p([-77.2, 10.0])
  return (
    <g>
      {olas.map(([x, y], i) => (
        <path
          key={i}
          className="anim-ola"
          style={{ animationDelay: `${-(i * 0.53) % 4}s` }}
          d={`M${x - 12} ${y} q 6 -5 12 0 t 12 0`}
          stroke="#ffffff"
          strokeWidth={2.2}
          fill="none"
          strokeLinecap="round"
          opacity={0.55}
        />
      ))}
      <Ballena x={w1x} y={w1y} i={0} />
      <Ballena x={w2x} y={w2y} i={1} />
      <Ballena x={w3x} y={w3y} i={2} s={0.75} />
      <Velero x={560} y={72} />
      <Lancha x={lx} y={ly} />
      <Delfin x={dx} y={dy} delay={0} />
      <Delfin x={dx + 22} y={dy + 10} delay={-0.35} />
    </g>
  )
}

/** Capa sobre el país: árboles, montañas, animales */
export function AdornosTierra() {
  const selva = ARBOLES_SELVA.map(p)
  return (
    <g pointerEvents="none">
      {PASTO_LLANO.map((ll, i) => {
        const [x, y] = p(ll)
        return <Pasto key={i} x={x} y={y} i={i} />
      })}
      {MONTANAS.map((m, i) => {
        const [x, y] = p(m.ll)
        return <Montana key={i} x={x} y={y} s={m.s} nieve={m.nieve} />
      })}
      {CACTUS.map((ll, i) => {
        const [x, y] = p(ll)
        return <Cactus key={i} x={x} y={y} />
      })}
      {PALMERAS.map((ll, i) => {
        const [x, y] = p(ll)
        return <Palmera key={i} x={x} y={y} i={i} />
      })}
      {selva.map(([x, y], i) => (
        <Arbol key={i} x={x} y={y} i={i} />
      ))}
      <Mico x={selva[2][0] + 6} y={selva[2][1] - 18} />
      <Mariposa x={p([-75.9, 4.3])[0]} y={p([-75.9, 4.3])[1]} color="#f472b6" retraso={0} />
      <Mariposa x={p([-74.9, 2.3])[0]} y={p([-74.9, 2.3])[1]} color="#38bdf8" retraso={-2} />
      <Mariposa x={p([-71.7, 0.6])[0]} y={p([-71.7, 0.6])[1]} color="#fbbf24" retraso={-4} />
    </g>
  )
}

/** Capa de cielo: sol, nubes, pájaros y la guacamaya */
export function AdornosCielo() {
  const [px, py] = p([-70.2, 1.5])
  return (
    <g pointerEvents="none">
      <Sol x={1500} y={90} />
      <RosaDeLosVientos x={150} y={790} />
      <Pajaros y={150} retraso={-5} />
      <Pajaros y={330} retraso={-22} />
      <Guacamaya perchaX={px + 2} perchaY={py - 34} />
      <Nube y={260} escala={1.1} duracion={95} retraso={-20} />
      <Nube y={420} escala={0.9} duracion={120} retraso={-75} />
      <Nube y={690} escala={1.2} duracion={105} retraso={-45} />
    </g>
  )
}
