import type { KioscoConfig } from '../types'

export const config: KioscoConfig = {
  nombre: 'Explora Colombia',
  eslogan: 'Toca una ciudad y descubre qué hay cerca',
  colorPrimario: '#0f766e',
  segundosInactividad: 90,
  // Estilo de calles gratuito y sin clave (OpenFreeMap). El kiosco lo recolorea con tonos "de juego".
  estiloMapaUrl: 'https://tiles.openfreemap.org/styles/liberty',
}
