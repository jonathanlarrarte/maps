# Kiosco interactivo · Explora Colombia

Mapa de Colombia animado tipo juego para kioscos táctiles. Al tocar una capital, el mapa hace zoom y muestra los comercios de esa ciudad sobre un mapa de calles 3D. Cada comercio tiene su ficha con logo, datos y un QR para llevarse la información al celular.

## Estado: Fase 1 (prototipo visual) ✅

- Mapa de Colombia en SVG con relieve, entrada animada de departamentos y adornos animados: árboles y palmeras que se mecen, montañas nevadas, ballenas con chorro en el Pacífico, velero, lancha y delfines en el Caribe, guacamaya que baja a la selva, mico columpiándose, mariposas, pájaros, nubes, sol y rosa de los vientos.
- Las 32 capitales + Bogotá con pin y contador de comercios. San Andrés en un recuadro ampliado.
- Zoom animado del país a la ciudad y luego vuelo 3D al mapa de calles (MapLibre + OpenFreeMap, sin costo ni clave), recoloreado con tonos de juego.
- Filtro por categoría en ambas vistas: los pines y contadores del país también se filtran.
- Agrupación de marcadores (supercluster) para cientos de comercios.
- Ficha del comercio con QR seleccionable: **Cómo llegar** (Google Maps), **WhatsApp**, **Sitio web** y **Guardar contacto** (vCard).
- Lista lateral de lugares (destacados primero).
- Regreso automático al inicio tras 90 s sin uso (configurable).
- Responsive: pensado para pantalla horizontal y adaptable a vertical/tablet.

Los datos son **de ejemplo** (45 lugares en 6 ciudades; teléfonos y webs ficticios).

## Cómo correrlo

```bash
cd web
npm install
npm run dev        # desarrollo en http://localhost:5173
npm run build      # build de producción en web/dist
npm run preview    # sirve el build en http://localhost:4173
```

### Modo kiosco

- **Windows:** `chrome.exe --kiosk --noerrdialogs --disable-pinch --overscroll-history-navigation=0 http://URL-DEL-KIOSCO`
- **Android:** usar un navegador de kiosco (p. ej. Fully Kiosk Browser) apuntando a la URL.

## Estructura

```
web/src/
├── types.ts                 Modelo de datos (Ciudad, Categoria, Comercio, KioscoConfig)
├── data/                    Datos de ejemplo + dataService (único punto de acceso a datos)
├── lib/geo.ts               Proyección del mapa, colores por región, recuadro San Andrés
├── lib/qr.ts                Contenido de los QR (ruta, WhatsApp, web, vCard)
├── lib/useInactividad.ts    Regreso automático al inicio
├── components/pais/         Mapa de Colombia (MapaPais) y adornos animados (Adornos)
├── components/ciudad/       Mapa de calles, lista y ficha del comercio
└── components/comun/        Barra superior, barra de categorías, logo
```

`data/dataService.ts` es el único lugar que hay que cambiar para leer del backend en la Fase 2.

## Próximas fases

- **Fase 2 · Administrador:** backend (Node.js + PostgreSQL), login con roles (súper admin, editor por ciudad, solo lectura), CRUD de ciudades, categorías y subcategorías, comercios (con subida de logos y ubicación tocando el mapa), configuración del kiosco e importación masiva desde Excel/CSV.
- **Fase 3 · Operación:** registro de varios kioscos, estadísticas (lugares más vistos, QR escaneados), caché sin conexión, salvapantallas y despliegue en la nube.

## Créditos de datos

- Departamentos de Colombia: GeoJSON de [john-guerra](https://gist.github.com/john-guerra/43c7656821069d00dcbc) (base DANE), simplificado.
- Países vecinos: [Natural Earth](https://www.naturalearthdata.com/) vía `world-atlas`.
- Mapa de calles: © [OpenFreeMap](https://openfreemap.org) · © [OpenMapTiles](https://openmaptiles.org) · © colaboradores de [OpenStreetMap](https://www.openstreetmap.org/copyright).
