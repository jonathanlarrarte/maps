import type { Categoria, Comercio } from '../../types'

const iniciales = (nombre: string) =>
  nombre
    .replace(/^(centro comercial|hotel|parque|museo|el|la|los|las)\s+/i, '')
    .split(/\s+/)
    .filter((p) => p.length > 2 || /^[A-ZÁÉÍÓÚ]/.test(p))
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('')

/** Logo del comercio; si aún no tiene uno subido, genera un logo con sus iniciales */
export function Logo({ comercio, categoria, tamano = 64 }: { comercio: Comercio; categoria?: Categoria; tamano?: number }) {
  const color = categoria?.color ?? '#0f766e'
  if (comercio.logoUrl) {
    return (
      <img
        src={comercio.logoUrl}
        alt={`Logo de ${comercio.nombre}`}
        className="shrink-0 rounded-full border-4 border-white bg-white object-cover shadow-lg"
        style={{ width: tamano, height: tamano }}
      />
    )
  }
  return (
    <div
      className="relative grid shrink-0 place-items-center rounded-full border-4 border-white font-display font-bold text-white shadow-lg"
      style={{ width: tamano, height: tamano, background: `linear-gradient(135deg, ${color}, ${color}cc)`, fontSize: tamano * 0.36 }}
      aria-hidden
    >
      {iniciales(comercio.nombre) || categoria?.icono}
      <span className="absolute -right-1 -bottom-1 grid place-items-center rounded-full bg-white shadow" style={{ width: tamano * 0.4, height: tamano * 0.4, fontSize: tamano * 0.22 }}>
        {categoria?.icono}
      </span>
    </div>
  )
}
