import { AnimatePresence, motion } from 'motion/react'
import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react'
import { FichaComercio } from './components/ciudad/FichaComercio'
import { ListaComercios } from './components/ciudad/ListaComercios'
import { BarraCategorias } from './components/comun/BarraCategorias'
import { BarraSuperior } from './components/comun/BarraSuperior'
import { MapaPais } from './components/pais/MapaPais'
import { cargarDatosKiosco } from './data/dataService'
import { useInactividad } from './lib/useInactividad'
import type { Ciudad, Comercio, DatosKiosco } from './types'

// El mapa de calles (MapLibre) pesa ~1 MB: se descarga aparte para que el mapa del país aparezca de inmediato
const MapaCiudad = lazy(() => import('./components/ciudad/MapaCiudad').then((m) => ({ default: m.MapaCiudad })))
const precargarMapaCiudad = () => import('./components/ciudad/MapaCiudad')

type Vista = 'pais' | 'zoom' | 'ciudad'

const contar = (lista: Comercio[], clave: (c: Comercio) => string[]) => {
  const out: Record<string, number> = {}
  for (const c of lista) for (const k of clave(c)) out[k] = (out[k] ?? 0) + 1
  return out
}

function useAnchoPanel() {
  const calc = () => (window.innerWidth >= 640 ? 440 : 0)
  const [ancho, setAncho] = useState(calc)
  useEffect(() => {
    const f = () => setAncho(calc())
    window.addEventListener('resize', f)
    return () => window.removeEventListener('resize', f)
  }, [])
  return ancho
}

export default function App() {
  const [datos, setDatos] = useState<DatosKiosco | null>(null)
  const [vista, setVista] = useState<Vista>('pais')
  const [ciudad, setCiudad] = useState<Ciudad | null>(null)
  const [vieneDe, setVieneDe] = useState<Ciudad | null>(null)
  const [categoriaId, setCategoriaId] = useState<string | null>(null)
  const [seleccionado, setSeleccionado] = useState<Comercio | null>(null)
  const anchoPanel = useAnchoPanel()

  useEffect(() => {
    cargarDatosKiosco().then(setDatos)
    // Precarga en segundo plano para que el primer zoom a una ciudad sea instantáneo
    const t = window.setTimeout(precargarMapaCiudad, 2500)
    return () => window.clearTimeout(t)
  }, [])

  const filtrados = useMemo(() => {
    if (!datos) return []
    return categoriaId ? datos.comercios.filter((c) => c.categoriaIds.includes(categoriaId)) : datos.comercios
  }, [datos, categoriaId])

  const enCiudad = useMemo(() => (ciudad ? filtrados.filter((c) => c.ciudadId === ciudad.id) : []), [filtrados, ciudad])

  const conteoCiudades = useMemo(() => contar(filtrados, (c) => [c.ciudadId]), [filtrados])

  // Conteo por categoría según el contexto: todo el país o la ciudad abierta
  const base = useMemo(() => {
    if (!datos) return []
    return vista === 'ciudad' && ciudad ? datos.comercios.filter((c) => c.ciudadId === ciudad.id) : datos.comercios
  }, [datos, vista, ciudad])
  const conteoCategorias = useMemo(() => contar(base, (c) => c.categoriaIds), [base])

  const categoriaDe = useCallback(
    (c: Comercio) => {
      if (!datos) return undefined
      const id = categoriaId && c.categoriaIds.includes(categoriaId) ? categoriaId : c.categoriaIds[0]
      return datos.categorias.find((k) => k.id === id)
    },
    [datos, categoriaId],
  )

  const elegirCiudad = (c: Ciudad) => {
    if (vista !== 'pais') return
    setCiudad(c)
    setVista('zoom')
  }

  const volverAlPais = useCallback(() => {
    setSeleccionado(null)
    setVieneDe(ciudad)
    setCiudad(null)
    setVista('pais')
  }, [ciudad])

  const cambiarCategoria = (id: string | null) => {
    setCategoriaId(id)
    if (seleccionado && id && !seleccionado.categoriaIds.includes(id)) setSeleccionado(null)
  }

  // Si nadie usa el kiosco, vuelve al inicio para el siguiente visitante
  useInactividad(
    datos?.config.segundosInactividad ?? 90,
    () => {
      setCategoriaId(null)
      if (vista === 'ciudad') volverAlPais()
    },
    !!datos,
  )

  if (!datos) {
    return <div className="grid h-full place-items-center font-display text-3xl text-white">Cargando…</div>
  }

  const colorPines = (categoriaId && datos.categorias.find((c) => c.id === categoriaId)?.color) || datos.config.colorPrimario

  return (
    <main className="relative h-full w-full overflow-hidden bg-[#2aa7dc]">
      <AnimatePresence>
        {vista !== 'ciudad' && (
          <motion.div key="pais" className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <MapaPais
              ciudades={datos.ciudades}
              conteo={conteoCiudades}
              colorPines={colorPines}
              zoomHacia={vista === 'zoom' ? ciudad : null}
              vieneDe={vieneDe}
              onElegirCiudad={elegirCiudad}
              onZoomTerminado={() => setVista('ciudad')}
            />
          </motion.div>
        )}

        {vista === 'ciudad' && ciudad && (
          <motion.div key={`ciudad-${ciudad.id}`} className="absolute inset-0" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <Suspense fallback={<div className="h-full w-full bg-[#f6eed8]" />}>
              <MapaCiudad
                ciudad={ciudad}
                comercios={filtrados}
                categoriaDe={categoriaDe}
                seleccionado={seleccionado}
                onSeleccionar={setSeleccionado}
                estiloUrl={datos.config.estiloMapaUrl}
                anchoPanel={anchoPanel}
              />
            </Suspense>
            <ListaComercios comercios={enCiudad} categoriaDe={categoriaDe} seleccionado={seleccionado} onSeleccionar={setSeleccionado} />
          </motion.div>
        )}
      </AnimatePresence>

      <BarraSuperior config={datos.config} ciudad={vista === 'ciudad' ? ciudad : null} onVolver={volverAlPais} />

      {vista === 'pais' && <PistaInicio />}

      <AnimatePresence>
        {vista === 'ciudad' && seleccionado && (
          <FichaComercio
            key={seleccionado.id}
            comercio={seleccionado}
            ciudad={datos.ciudades.find((c) => c.id === seleccionado.ciudadId)}
            categorias={datos.categorias}
            nombreKiosco={datos.config.nombre}
            onCerrar={() => setSeleccionado(null)}
          />
        )}
      </AnimatePresence>

      <BarraCategorias
        categorias={datos.categorias}
        activa={categoriaId}
        conteo={conteoCategorias}
        total={base.length}
        onCambiar={cambiarCategoria}
      />
    </main>
  )
}

function PistaInicio() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6 }}
      className="pointer-events-none absolute right-6 bottom-28 z-20 hidden max-w-xs rounded-3xl bg-white/95 p-5 shadow-xl md:block"
    >
      <div className="flex items-center gap-3">
        <motion.span className="text-5xl" animate={{ y: [0, -8, 0], rotate: [0, -8, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          👆
        </motion.span>
        <p className="font-display text-xl leading-snug font-semibold text-slate-700">Toca una ciudad para descubrir qué hay cerca</p>
      </div>
      <p className="mt-2 text-sm text-slate-500">Usa los botones de abajo para ver solo comida, parques, hoteles…</p>
    </motion.div>
  )
}
