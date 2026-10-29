import { geoMercator, geoPath, type GeoProjection } from 'd3-geo'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import departamentosRaw from '../assets/geo/colombia-departamentos.json'
import vecinosRaw from '../assets/geo/vecinos.json'

/** Lienzo lógico del mapa del país (16:9, pantalla horizontal) */
export const MAP_W = 1600
export const MAP_H = 900

type DeptProps = { DPTO: string; NOMBRE_DPT: string }
type DeptFeature = Feature<Geometry, DeptProps>

const departamentos = departamentosRaw as unknown as FeatureCollection<Geometry, DeptProps>
const vecinos = vecinosRaw as unknown as FeatureCollection<Geometry, { name: string }>

const SAN_ANDRES = '88'
const continentales = departamentos.features.filter((f) => f.properties.DPTO !== SAN_ANDRES)
const sanAndres = departamentos.features.find((f) => f.properties.DPTO === SAN_ANDRES)!

// Proyección principal: Colombia continental centrada, dejando mar a la izquierda (Pacífico) y arriba (Caribe)
export const projection: GeoProjection = geoMercator().fitExtent(
  [
    [560, 46],
    [1150, 846],
  ],
  { type: 'FeatureCollection', features: continentales },
)
export const path = geoPath(projection)

// Recuadro ampliado de San Andrés (en el mapa real la isla mide pocos píxeles)
export const INSET = { x: 300, y: 70, w: 150, h: 130 }
export const insetProjection: GeoProjection = geoMercator().fitExtent(
  [
    [INSET.x + 45, INSET.y + 22],
    [INSET.x + INSET.w - 45, INSET.y + INSET.h - 30],
  ],
  sanAndres,
)
export const insetPath = geoPath(insetProjection)

/** Proyecta [lng, lat] a coordenadas del lienzo. San Andrés usa el recuadro ampliado. */
export function proyectar(lng: number, lat: number, dpto?: string): [number, number] {
  const p = dpto === SAN_ANDRES ? insetProjection([lng, lat]) : projection([lng, lat])
  return p ?? [0, 0]
}

export type Region = 'caribe' | 'andina' | 'pacifica' | 'orinoquia' | 'amazonia'

const REGION: Record<string, Region> = {
  '08': 'caribe', '13': 'caribe', '20': 'caribe', '23': 'caribe', '44': 'caribe', '47': 'caribe', '70': 'caribe', '88': 'caribe',
  '05': 'andina', '11': 'andina', '15': 'andina', '17': 'andina', '25': 'andina', '41': 'andina', '54': 'andina', '63': 'andina', '66': 'andina', '68': 'andina', '73': 'andina',
  '19': 'pacifica', '27': 'pacifica', '52': 'pacifica', '76': 'pacifica',
  '50': 'orinoquia', '81': 'orinoquia', '85': 'orinoquia', '99': 'orinoquia',
  '18': 'amazonia', '86': 'amazonia', '91': 'amazonia', '94': 'amazonia', '95': 'amazonia', '97': 'amazonia',
}

// Paleta "de juego": cada región tiene sus tonos y los departamentos alternan entre ellos
const PALETA: Record<Region, string[]> = {
  caribe: ['#ffd66e', '#ffc94d', '#ffe08f'],
  andina: ['#a7dc6c', '#93d05a', '#b9e57f'],
  pacifica: ['#5ccf94', '#4bc287', '#72d9a4'],
  orinoquia: ['#e3e46f', '#d4da5c', '#ecec88'],
  amazonia: ['#3fb565', '#34a85a', '#4cc172'],
}

export interface DeptoDibujo {
  codigo: string
  nombre: string
  d: string
  color: string
  centro: [number, number]
  region: Region
}

const titulo = (s: string) =>
  s.toLowerCase().replace(/(^|\s)\S/g, (l) => l.toUpperCase()).replace('Santafe De Bogota D.c', 'Bogotá D.C.')

export const deptos: DeptoDibujo[] = continentales.map((f: DeptFeature, i) => {
  const region = REGION[f.properties.DPTO] ?? 'andina'
  const tonos = PALETA[region]
  return {
    codigo: f.properties.DPTO,
    nombre: titulo(f.properties.NOMBRE_DPT),
    d: path(f) ?? '',
    color: tonos[i % tonos.length],
    centro: path.centroid(f) as [number, number],
    region,
  }
})

export const sanAndresDibujo = { codigo: SAN_ANDRES, d: insetPath(sanAndres) ?? '' }

export const vecinosDibujo = vecinos.features.map((f) => ({ nombre: f.properties.name, d: path(f) ?? '' }))
