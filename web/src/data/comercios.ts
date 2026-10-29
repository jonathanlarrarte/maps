import type { Comercio } from '../types'

// DATOS DE EJEMPLO. Teléfonos, WhatsApp y webs son ficticios.
// En la Fase 2 estos registros vendrán del administrador (base de datos).

let n = 0
const m = (
  nombre: string,
  ciudadId: string,
  categoriaIds: string[],
  lat: number,
  lng: number,
  descripcion: string,
  direccion: string,
  extra: Partial<Comercio> = {},
): Comercio => {
  n += 1
  const sufijo = String(n).padStart(3, '0')
  return {
    id: `com-${sufijo}`,
    nombre,
    ciudadId,
    categoriaIds,
    lat,
    lng,
    descripcion,
    direccion,
    telefono: `601 555 0${sufijo}`,
    whatsapp: `57300555${sufijo.padStart(4, '0')}`,
    horario: 'Lunes a domingo, 10:00 a.m. – 9:00 p.m.',
    activo: true,
    ...extra,
  }
}

export const comercios: Comercio[] = [
  // ───────── Bogotá ─────────
  m('Centro Comercial Andino', 'bogota', ['compras'], 4.6667, -74.0527,
    'Moda, tecnología y restaurantes en el corazón de la Zona Rosa.', 'Carrera 11 # 82-71', { destacado: true, web: 'https://ejemplo.com/andino' }),
  m('Centro Comercial Unicentro', 'bogota', ['compras'], 4.7024, -74.0415,
    'Uno de los centros comerciales más tradicionales del norte de Bogotá.', 'Avenida 15 # 124-30', { web: 'https://ejemplo.com/unicentro' }),
  m('Centro Comercial Santafé', 'bogota', ['compras', 'diversion'], 4.7626, -74.0458,
    'Más de 400 tiendas, cine y zona de juegos para toda la familia.', 'Calle 185 # 45-03'),
  m('Parque Simón Bolívar', 'bogota', ['parques'], 4.6584, -74.0937,
    'El gran pulmón verde de la ciudad: lago, ciclorrutas y conciertos.', 'Calle 63 y Carrera 68', { horario: 'Todos los días, 6:00 a.m. – 6:00 p.m.' }),
  m('Parque de la 93', 'bogota', ['parques', 'comida'], 4.6766, -74.0484,
    'Parque rodeado de restaurantes, cafés y eventos al aire libre.', 'Calle 93A con Carrera 13'),
  m('Jardín Botánico de Bogotá', 'bogota', ['parques', 'cultura'], 4.6683, -74.0995,
    'Flora andina y de páramo en un recorrido lleno de color.', 'Avenida Calle 63 # 68-95', { horario: 'Martes a domingo, 8:00 a.m. – 5:00 p.m.' }),
  m('Museo del Oro', 'bogota', ['cultura'], 4.6019, -74.0721,
    'La colección de orfebrería prehispánica más grande del mundo.', 'Carrera 6 # 15-88', { destacado: true, horario: 'Martes a domingo, 9:00 a.m. – 6:00 p.m.' }),
  m('Cerro de Monserrate', 'bogota', ['cultura', 'parques'], 4.6058, -74.0565,
    'Sube en teleférico o funicular y mira toda Bogotá desde 3.152 m.', 'Carrera 2 Este # 21-48'),
  m('Sabor Andino Restaurante', 'bogota', ['comida'], 4.6555, -74.057,
    'Ajiaco, tamales y cocina colombiana de autor en la Zona G.', 'Calle 69 # 5-30', { destacado: true }),
  m('Café La Candelaria', 'bogota', ['comida'], 4.597, -74.071,
    'Café de origen y postres caseros en el centro histórico.', 'Calle 11 # 3-20'),
  m('Burger Zona T', 'bogota', ['comida'], 4.667, -74.053,
    'Hamburguesas artesanales y malteadas.', 'Carrera 13 # 82-40'),
  m('Hotel Plaza Bolívar', 'bogota', ['hoteles'], 4.598, -74.0755,
    'Hotel boutique a pasos de la Plaza de Bolívar.', 'Calle 10 # 7-12'),
  m('Hotel Usaquén Real', 'bogota', ['hoteles'], 4.6955, -74.031,
    'Habitaciones con encanto en el barrio colonial de Usaquén.', 'Carrera 6 # 119-24'),
  m('Salitre Mágico', 'bogota', ['diversion'], 4.664, -74.092,
    'Parque de diversiones con atracciones para todas las edades.', 'Calle 63 # 60-80'),
  m('Maloka', 'bogota', ['diversion', 'cultura'], 4.6548, -74.1038,
    'Centro interactivo de ciencia y tecnología con domo de cine.', 'Carrera 68D # 24A-51'),

  // ───────── Medellín ─────────
  m('Parque Explora', 'medellin', ['diversion', 'cultura'], 6.2706, -75.5659,
    'Museo interactivo de ciencia con el acuario de agua dulce más grande de Suramérica.', 'Carrera 52 # 73-75', { destacado: true }),
  m('Pueblito Paisa', 'medellin', ['cultura'], 6.2361, -75.5797,
    'Réplica de un pueblo antioqueño en la cima del Cerro Nutibara.', 'Calle 30A # 55-64'),
  m('Centro Comercial Santafé Medellín', 'medellin', ['compras'], 6.196, -75.574,
    'Compras, cine y gastronomía en El Poblado.', 'Carrera 43A # 7 Sur-170'),
  m('Centro Comercial El Tesoro', 'medellin', ['compras', 'diversion'], 6.1975, -75.559,
    'Centro comercial con parque de diversiones y vista a la ciudad.', 'Carrera 25A # 1A Sur-45'),
  m('Parque Arví', 'medellin', ['parques'], 6.28, -75.5, 
    'Reserva natural a la que se llega en metrocable.', 'Vereda Mazo, Santa Elena', { horario: 'Martes a domingo, 9:00 a.m. – 5:00 p.m.' }),
  m('Jardín Botánico de Medellín', 'medellin', ['parques'], 6.271, -75.564,
    'Orquideorama, mariposario y senderos gratuitos.', 'Calle 73 # 51D-14'),
  m('Bandeja Paisa La Montaña', 'medellin', ['comida'], 6.2085, -75.567,
    'La bandeja paisa más completa, con frijoles de la abuela.', 'Carrera 35 # 8A-12', { destacado: true }),
  m('Tinto & Arepa', 'medellin', ['comida'], 6.244, -75.569,
    'Desayunos paisas y café de Antioquia.', 'Calle 50 # 46-10'),
  m('Hotel Eterna Primavera', 'medellin', ['hoteles'], 6.21, -75.57,
    'Hotel con piscina en la terraza en El Poblado.', 'Calle 10 # 40-20'),

  // ───────── Cali ─────────
  m('Zoológico de Cali', 'cali', ['diversion', 'parques'], 3.4495, -76.555,
    'Uno de los mejores zoológicos de Latinoamérica.', 'Carrera 2A Oeste # 14-00', { destacado: true }),
  m('Cristo Rey', 'cali', ['cultura'], 3.436, -76.565,
    'Mirador con la estatua de 26 metros sobre los Farallones.', 'Cerro Los Cristales'),
  m('Centro Comercial Chipichape', 'cali', ['compras'], 3.476, -76.528,
    'Centro comercial al aire libre en el norte de Cali.', 'Calle 38N # 6N-35'),
  m('Unicentro Cali', 'cali', ['compras'], 3.374, -76.539,
    'Tiendas, cine y plazoleta de comidas en el sur de la ciudad.', 'Carrera 100 # 5-169'),
  m('Bulevar del Río', 'cali', ['parques'], 3.453, -76.533,
    'Paseo peatonal junto al río Cali, ideal para caminar.', 'Avenida Colombia'),
  m('Salsa y Sabor', 'cali', ['comida', 'diversion'], 3.448, -76.54,
    'Comida vallecaucana y clases de salsa los fines de semana.', 'Carrera 10 # 3-45, San Antonio'),
  m('Hotel Sultana del Valle', 'cali', ['hoteles'], 3.456, -76.535,
    'Hotel moderno cerca del Bulevar del Río.', 'Avenida 4N # 10-20'),

  // ───────── Barranquilla ─────────
  m('Gran Malecón del Río', 'barranquilla', ['parques', 'comida'], 10.9958, -74.7907,
    'Paseo a orillas del río Magdalena con restaurantes y miradores.', 'Vía 40 con Calle 72'),
  m('Centro Comercial Buenavista', 'barranquilla', ['compras'], 11.013, -74.827,
    'El centro comercial más grande de la ciudad.', 'Calle 98 # 52-115'),
  m('Museo del Caribe', 'barranquilla', ['cultura'], 10.985, -74.779,
    'Un recorrido por la cultura, la música y la naturaleza del Caribe.', 'Calle 36 # 46-66'),
  m('Zoológico de Barranquilla', 'barranquilla', ['diversion'], 10.999, -74.808,
    'Fauna del Caribe colombiano y programas de conservación.', 'Calle 77 # 68-40'),
  m('Arepa e\' Huevo Express', 'barranquilla', ['comida'], 10.993, -74.81,
    'Fritos costeños y jugos naturales.', 'Carrera 53 # 75-10'),

  // ───────── Cartagena ─────────
  m('Torre del Reloj', 'cartagena', ['cultura'], 10.4236, -75.5491,
    'La puerta principal de la Ciudad Amurallada.', 'Plaza de los Coches', { destacado: true }),
  m('Castillo San Felipe de Barajas', 'cartagena', ['cultura'], 10.4227, -75.5397,
    'La fortaleza española más grande de América.', 'Avenida Arévalo'),
  m('Centro Comercial Caribe Plaza', 'cartagena', ['compras'], 10.414, -75.532,
    'Compras y cine en el barrio Pie de la Popa.', 'Calle 29D # 22-108'),
  m('Playa de Bocagrande', 'cartagena', ['parques'], 10.399, -75.556,
    'Playa urbana con vista a los edificios de Bocagrande.', 'Avenida San Martín'),
  m('La Cevichería del Mar', 'cartagena', ['comida'], 10.425, -75.548,
    'Ceviches, arroz con coco y pescado frito.', 'Calle Stuart # 7-14'),
  m('Hotel Brisa Caribe', 'cartagena', ['hoteles'], 10.4, -75.553,
    'Hotel frente al mar con piscina y desayuno incluido.', 'Carrera 2 # 9-145, Bocagrande'),

  // ───────── Santa Marta ─────────
  m('El Rodadero', 'santa-marta', ['parques'], 11.205, -74.229,
    'Playa de aguas tranquilas con acuario y deportes náuticos.', 'Carrera 1 con Calle 7, El Rodadero'),
  m('Pescadería La Bahía', 'santa-marta', ['comida'], 11.244, -74.212,
    'Pescado fresco frente a la bahía más bonita de América.', 'Carrera 1 # 22-10'),
  m('Quinta de San Pedro Alejandrino', 'santa-marta', ['cultura', 'parques'], 11.2285, -74.1725,
    'Hacienda histórica donde murió Simón Bolívar, con jardín botánico.', 'Avenida del Libertador'),
]
