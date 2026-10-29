import { Map as MapaML, Marker, NavigationControl, setWorkerUrl } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
// MapLibre 6 procesa las teselas en un worker aparte; se le indica a Vite que lo incluya en el build
import urlWorker from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Supercluster, { type ClusterProperties } from 'supercluster'
import type { Categoria, Ciudad, Comercio } from '../../types'

interface Props {
  ciudad: Ciudad
  /** Comercios ya filtrados por categoría (de todas las ciudades, por si el usuario se desplaza) */
  comercios: Comercio[]
  categoriaDe: (c: Comercio) => Categoria | undefined
  seleccionado: Comercio | null
  onSeleccionar: (c: Comercio | null) => void
  estiloUrl: string
  /** Ancho en px del panel de detalle, para centrar el comercio en el área visible */
  anchoPanel: number
}

setWorkerUrl(urlWorker)

type Props_ = { id: string }

/** Recolorea el estilo de calles con tonos "de juego" y oculta los POI genéricos */
function aplicarEstiloDeJuego(map: MapaML) {
  type P = Parameters<MapaML['setPaintProperty']>
  const pintar = (capa: string, prop: P[1], valor: P[2]) => {
    if (map.getLayer(capa)) map.setPaintProperty(capa, prop, valor)
  }
  pintar('background', 'background-color', '#f6eed8')
  pintar('landuse_residential', 'fill-color', '#efe2c0')
  pintar('park', 'fill-color', '#8be38a')
  pintar('park', 'fill-opacity', 0.9)
  pintar('landcover_wood', 'fill-color', '#6fcf72')
  pintar('landcover_grass', 'fill-color', '#a6e69a')
  pintar('landuse_pitch', 'fill-color', '#7ad97f')
  pintar('water', 'fill-color', '#56c6f2')
  pintar('waterway_river', 'line-color', '#56c6f2')
  pintar('waterway_other', 'line-color', '#56c6f2')
  pintar('landcover_sand', 'fill-color', '#ffe39a')
  pintar('building', 'fill-color', '#f7cfa0')
  pintar('building-3d', 'fill-extrusion-color', '#ffd6a5')
  pintar('building-3d', 'fill-extrusion-opacity', 0.92)
  // Algunos edificios de OpenStreetMap traen alturas erróneas; se limitan a 150 m
  pintar('building-3d', 'fill-extrusion-height', ['min', ['coalesce', ['get', 'render_height'], 0], 150])
  for (const capa of map.getStyle().layers ?? []) {
    if (capa.id.startsWith('poi_')) map.setLayoutProperty(capa.id, 'visibility', 'none')
    if (capa.type !== 'line' || !capa.id.match(/^(road|bridge)_/)) continue
    if (capa.id.endsWith('_casing')) pintar(capa.id, 'line-color', '#e3bf8c')
    else if (capa.id.includes('motorway') || capa.id.includes('trunk')) pintar(capa.id, 'line-color', '#ffd166')
    else if (!capa.id.includes('rail') && !capa.id.includes('path')) pintar(capa.id, 'line-color', '#ffffff')
  }
}

function crearMarcadorComercio(c: Comercio, cat: Categoria | undefined): HTMLElement {
  // MapLibre posiciona el elemento raíz con transform; la animación va en el hijo
  const raiz = document.createElement('div')
  const el = document.createElement('div')
  el.className = 'marcador'
  el.style.setProperty('--color', cat?.color ?? '#0f766e')
  el.style.position = 'relative'

  const burbuja = document.createElement('div')
  burbuja.className = 'burbuja'
  if (c.logoUrl) {
    const img = document.createElement('img')
    img.src = c.logoUrl
    img.alt = ''
    burbuja.appendChild(img)
  } else {
    burbuja.textContent = cat?.icono ?? '📍'
  }
  el.appendChild(burbuja)

  if (c.destacado) {
    const estrella = document.createElement('span')
    estrella.className = 'estrella'
    estrella.textContent = '⭐'
    el.appendChild(estrella)
  }

  const punta = document.createElement('div')
  punta.className = 'punta'
  el.appendChild(punta)

  const etiqueta = document.createElement('div')
  etiqueta.className = 'etiqueta'
  etiqueta.textContent = c.nombre // textContent: los datos del admin nunca se interpretan como HTML
  el.appendChild(etiqueta)

  raiz.appendChild(el)
  return raiz
}

function crearMarcadorGrupo(cantidad: number): HTMLElement {
  const raiz = document.createElement('div')
  const el = document.createElement('div')
  const lado = Math.round(46 + Math.min(cantidad, 60) * 0.6)
  el.className = 'grupo'
  el.style.width = `${lado}px`
  el.style.height = `${lado}px`
  el.textContent = String(cantidad)
  raiz.appendChild(el)
  return raiz
}

export function MapaCiudad({ ciudad, comercios, categoriaDe, seleccionado, onSeleccionar, estiloUrl, anchoPanel }: Props) {
  const contenedor = useRef<HTMLDivElement>(null)
  const mapa = useRef<MapaML | null>(null)
  const marcadores = useRef(new Map<string, Marker>())
  const indice = useRef<Supercluster<Props_> | null>(null)
  const porId = useRef(new Map<string, Comercio>())
  const [listo, setListo] = useState(false)
  const [error, setError] = useState(false)

  // Referencias a lo último recibido, para usarlas dentro de los eventos del mapa
  const onSeleccionarRef = useRef(onSeleccionar)
  const categoriaDeRef = useRef(categoriaDe)
  const seleccionadoRef = useRef(seleccionado)
  useLayoutEffect(() => {
    onSeleccionarRef.current = onSeleccionar
    categoriaDeRef.current = categoriaDe
    seleccionadoRef.current = seleccionado
  })

  /** Pinta solo los marcadores y grupos visibles en pantalla (rápido aunque haya cientos de comercios) */
  const dibujar = useCallback(() => {
    const map = mapa.current
    const idx = indice.current
    if (!map || !idx) return
    const b = map.getBounds()
    const zoom = Math.floor(map.getZoom())
    const visibles = idx.getClusters([b.getWest() - 0.01, b.getSouth() - 0.01, b.getEast() + 0.01, b.getNorth() + 0.01], zoom)
    const vigentes = new Set<string>()

    for (const f of visibles) {
      const [lng, lat] = f.geometry.coordinates
      const p = f.properties as ClusterProperties & Partial<Props_>
      const clave = p.cluster ? `g-${p.cluster_id}-${p.point_count}` : `c-${p.id}`
      vigentes.add(clave)
      if (marcadores.current.has(clave)) continue

      let el: HTMLElement
      if (p.cluster) {
        el = crearMarcadorGrupo(p.point_count)
        el.addEventListener('click', (e) => {
          e.stopPropagation()
          const z = idx.getClusterExpansionZoom(p.cluster_id)
          map.easeTo({ center: [lng, lat], zoom: Math.min(z + 0.3, 18), duration: 700 })
        })
      } else {
        const c = porId.current.get(p.id!)!
        el = crearMarcadorComercio(c, categoriaDeRef.current(c))
        if (seleccionadoRef.current?.id === c.id) el.firstElementChild?.classList.add('seleccionado')
        el.addEventListener('click', (e) => {
          e.stopPropagation()
          onSeleccionarRef.current(c)
        })
      }
      const m = new Marker({ element: el, anchor: p.cluster ? 'center' : 'bottom' }).setLngLat([lng, lat]).addTo(map)
      marcadores.current.set(clave, m)
    }

    for (const [clave, m] of marcadores.current) {
      if (!vigentes.has(clave)) {
        m.remove()
        marcadores.current.delete(clave)
      }
    }
  }, [])

  // Crear el mapa una sola vez por ciudad
  useEffect(() => {
    if (!contenedor.current) return
    const map = new MapaML({
      container: contenedor.current,
      style: estiloUrl,
      center: [ciudad.lng, ciudad.lat],
      zoom: ciudad.zoom - 3,
      pitch: 0,
      maxPitch: 65,
      attributionControl: { compact: true },
    })
    mapa.current = map
    map.dragRotate.disable()
    map.touchZoomRotate.disableRotation()
    map.addControl(new NavigationControl({ showCompass: false }), 'bottom-right')

    let zoomPrevio = -1
    let cargado = false
    // Si el estilo no carga en 15 s (sin internet), avisamos en pantalla
    const vigilante = window.setTimeout(() => !cargado && setError(true), 15000)
    map.on('load', () => {
      cargado = true
      window.clearTimeout(vigilante)
      aplicarEstiloDeJuego(map)
      setListo(true)
      map.flyTo({ center: [ciudad.lng, ciudad.lat], zoom: ciudad.zoom, pitch: 50, bearing: -12, duration: 2600, essential: true })
    })
    map.on('zoom', () => {
      const z = Math.floor(map.getZoom())
      if (z !== zoomPrevio) {
        zoomPrevio = z
        dibujar()
      }
    })
    map.on('moveend', dibujar)
    map.on('click', () => onSeleccionarRef.current(null))

    const marcadoresActuales = marcadores.current
    return () => {
      window.clearTimeout(vigilante)
      marcadoresActuales.forEach((m) => m.remove())
      marcadoresActuales.clear()
      map.remove()
      mapa.current = null
    }
  }, [ciudad, estiloUrl, dibujar])

  // Reconstruir el índice de agrupación cuando cambia el filtro
  useEffect(() => {
    porId.current = new Map(comercios.map((c) => [c.id, c]))
    const idx = new Supercluster<Props_>({ radius: 70, maxZoom: 15 })
    idx.load(
      comercios.map((c) => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [c.lng, c.lat] },
        properties: { id: c.id },
      })),
    )
    indice.current = idx
    marcadores.current.forEach((m) => m.remove())
    marcadores.current.clear()
    dibujar()
  }, [comercios, dibujar])

  // Resaltar y centrar el comercio seleccionado
  useEffect(() => {
    marcadores.current.forEach((m, clave) => {
      m.getElement().firstElementChild?.classList.toggle('seleccionado', clave === `c-${seleccionado?.id}`)
    })
    const map = mapa.current
    if (!map || !seleccionado) return
    map.flyTo({
      center: [seleccionado.lng, seleccionado.lat],
      zoom: Math.max(map.getZoom(), 16),
      pitch: 55,
      offset: [-anchoPanel / 2, 60],
      duration: 1400,
      essential: true,
    })
  }, [seleccionado, anchoPanel])

  return (
    <div className="relative h-full w-full">
      <div ref={contenedor} className="h-full w-full" />
      {!listo && !error && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-[#f6eed8]/60">
          <div className="animate-bounce text-6xl">📍</div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 grid place-items-center bg-[#f6eed8] p-8 text-center">
          <div>
            <div className="text-6xl">📡</div>
            <p className="mt-4 font-display text-2xl text-slate-700">No pudimos cargar el mapa de calles.</p>
            <p className="text-slate-500">Revisa la conexión a internet del kiosco.</p>
          </div>
        </div>
      )}
    </div>
  )
}
