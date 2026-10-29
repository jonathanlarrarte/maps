// Modelo de datos del kiosco.
// Estas mismas entidades serán las tablas de la base de datos en la Fase 2 (administrador).

export interface Categoria {
  id: string
  nombre: string
  /** Emoji o, más adelante, URL de un ícono subido desde el administrador */
  icono: string
  /** Color en hexadecimal usado en marcadores y botones */
  color: string
  orden: number
  /** Permite subcategorías (ej. Comida → Cafés). null = categoría principal */
  parentId: string | null
  activa: boolean
}

export interface Ciudad {
  id: string
  nombre: string
  departamento: string
  /** Código DANE del departamento (ej. "11" = Bogotá D.C.) */
  dptoCodigo: string
  lat: number
  lng: number
  /** Zoom con el que se abre la ciudad en el mapa de calles */
  zoom: number
  esCapitalPais?: boolean
  activa: boolean
}

export interface Comercio {
  id: string
  nombre: string
  ciudadId: string
  categoriaIds: string[]
  descripcion: string
  direccion: string
  telefono?: string
  /** Número con indicativo, solo dígitos (ej. 573001234567) */
  whatsapp?: string
  web?: string
  instagram?: string
  horario?: string
  lat: number
  lng: number
  logoUrl?: string
  destacado?: boolean
  activo: boolean
}

export interface KioscoConfig {
  nombre: string
  eslogan: string
  logoUrl?: string
  colorPrimario: string
  /** Segundos sin interacción antes de volver al mapa de Colombia */
  segundosInactividad: number
  /** Estilo del mapa de calles (MapLibre) */
  estiloMapaUrl: string
}

export interface DatosKiosco {
  config: KioscoConfig
  ciudades: Ciudad[]
  categorias: Categoria[]
  comercios: Comercio[]
}
