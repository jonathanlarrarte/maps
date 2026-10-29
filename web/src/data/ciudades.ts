import type { Ciudad } from '../types'

// Las 32 capitales departamentales + Bogotá D.C.
const c = (
  id: string,
  nombre: string,
  departamento: string,
  dptoCodigo: string,
  lat: number,
  lng: number,
  zoom = 13,
  esCapitalPais = false,
): Ciudad => ({ id, nombre, departamento, dptoCodigo, lat, lng, zoom, esCapitalPais, activa: true })

export const ciudades: Ciudad[] = [
  c('bogota', 'Bogotá', 'Bogotá D.C.', '11', 4.6533, -74.0836, 12, true),
  c('medellin', 'Medellín', 'Antioquia', '05', 6.2442, -75.5812, 12.5),
  c('cali', 'Cali', 'Valle del Cauca', '76', 3.4372, -76.5225, 12.5),
  c('barranquilla', 'Barranquilla', 'Atlántico', '08', 10.9878, -74.7889, 12.8),
  c('cartagena', 'Cartagena', 'Bolívar', '13', 10.4136, -75.5414, 13),
  c('santa-marta', 'Santa Marta', 'Magdalena', '47', 11.2408, -74.199, 12),
  c('leticia', 'Leticia', 'Amazonas', '91', -4.2153, -69.9406),
  c('arauca', 'Arauca', 'Arauca', '81', 7.0847, -70.7591),
  c('tunja', 'Tunja', 'Boyacá', '15', 5.5353, -73.3678),
  c('manizales', 'Manizales', 'Caldas', '17', 5.0703, -75.5138),
  c('florencia', 'Florencia', 'Caquetá', '18', 1.6144, -75.6062),
  c('yopal', 'Yopal', 'Casanare', '85', 5.3378, -72.3959),
  c('popayan', 'Popayán', 'Cauca', '19', 2.4448, -76.6147),
  c('valledupar', 'Valledupar', 'Cesar', '20', 10.4631, -73.2532),
  c('quibdo', 'Quibdó', 'Chocó', '27', 5.6947, -76.6611),
  c('monteria', 'Montería', 'Córdoba', '23', 8.7479, -75.8814),
  c('inirida', 'Inírida', 'Guainía', '94', 3.8653, -67.9239),
  c('san-jose-guaviare', 'San José del Guaviare', 'Guaviare', '95', 2.5729, -72.6459),
  c('neiva', 'Neiva', 'Huila', '41', 2.9273, -75.2819),
  c('riohacha', 'Riohacha', 'La Guajira', '44', 11.5444, -72.9072),
  c('villavicencio', 'Villavicencio', 'Meta', '50', 4.142, -73.6266),
  c('pasto', 'Pasto', 'Nariño', '52', 1.2136, -77.2811),
  c('cucuta', 'Cúcuta', 'Norte de Santander', '54', 7.8939, -72.5078),
  c('mocoa', 'Mocoa', 'Putumayo', '86', 1.1528, -76.6466),
  c('armenia', 'Armenia', 'Quindío', '63', 4.5339, -75.6811),
  c('pereira', 'Pereira', 'Risaralda', '66', 4.8133, -75.6961),
  c('san-andres', 'San Andrés', 'San Andrés y Providencia', '88', 12.5847, -81.7006),
  c('bucaramanga', 'Bucaramanga', 'Santander', '68', 7.1193, -73.1227),
  c('sincelejo', 'Sincelejo', 'Sucre', '70', 9.3047, -75.3978),
  c('ibague', 'Ibagué', 'Tolima', '73', 4.4389, -75.2322),
  c('mitu', 'Mitú', 'Vaupés', '97', 1.1983, -70.1733),
  c('puerto-carreno', 'Puerto Carreño', 'Vichada', '99', 6.189, -67.4859),
]

/** Cundinamarca no tiene capital propia en el mapa: al tocarla se abre Bogotá */
export const ciudadPorDepartamento = (dpto: string): Ciudad | undefined =>
  ciudades.find((ci) => ci.dptoCodigo === (dpto === '25' ? '11' : dpto))
