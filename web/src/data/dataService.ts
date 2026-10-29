import type { DatosKiosco } from '../types'
import { categorias } from './categorias'
import { ciudades } from './ciudades'
import { comercios } from './comercios'
import { config } from './config'

/**
 * Punto único de acceso a los datos del kiosco.
 * Hoy devuelve los datos de ejemplo; en la Fase 2 hará `fetch('/api/kiosco')`
 * contra el backend del administrador, sin cambiar el resto de la app.
 */
export async function cargarDatosKiosco(): Promise<DatosKiosco> {
  return {
    config,
    ciudades: ciudades.filter((c) => c.activa),
    categorias: categorias.filter((c) => c.activa).sort((a, b) => a.orden - b.orden),
    comercios: comercios.filter((c) => c.activo),
  }
}
