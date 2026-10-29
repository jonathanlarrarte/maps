import type { Ciudad, Comercio } from '../types'

export type TipoQR = 'ubicacion' | 'whatsapp' | 'web' | 'contacto'

export interface OpcionQR {
  tipo: TipoQR
  etiqueta: string
  icono: string
  valor: string
  ayuda: string
}

// En vCard hay que escapar \ , ; y saltos de línea
const vc = (s: string) => s.replace(/\\/g, '\\\\').replace(/([,;])/g, '\\$1').replace(/\r?\n/g, '\\n')

export function opcionesQR(c: Comercio, ciudad: Ciudad | undefined, nombreKiosco: string): OpcionQR[] {
  const out: OpcionQR[] = [
    {
      tipo: 'ubicacion',
      etiqueta: 'Cómo llegar',
      icono: '🧭',
      valor: `https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`,
      ayuda: 'Abre la ruta en el mapa de tu celular',
    },
  ]
  if (c.whatsapp) {
    const texto = encodeURIComponent(`Hola, vi ${c.nombre} en el kiosco ${nombreKiosco} y quiero más información.`)
    out.push({
      tipo: 'whatsapp',
      etiqueta: 'WhatsApp',
      icono: '💬',
      valor: `https://wa.me/${c.whatsapp.replace(/\D/g, '')}?text=${texto}`,
      ayuda: 'Escríbeles directo por WhatsApp',
    })
  }
  if (c.web) {
    out.push({ tipo: 'web', etiqueta: 'Sitio web', icono: '🌐', valor: c.web, ayuda: 'Visita su página web' })
  }
  if (c.telefono || c.whatsapp) {
    const lineas = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:;${vc(c.nombre)};;;`,
      `FN:${vc(c.nombre)}`,
      `ORG:${vc(c.nombre)}`,
      c.telefono && `TEL;TYPE=WORK,VOICE:${c.telefono}`,
      c.whatsapp && `TEL;TYPE=CELL:+${c.whatsapp}`,
      `ADR;TYPE=WORK:;;${vc(c.direccion)};${vc(ciudad?.nombre ?? '')};;;Colombia`,
      c.web && `URL:${c.web}`,
      'END:VCARD',
    ].filter(Boolean)
    out.push({ tipo: 'contacto', etiqueta: 'Guardar contacto', icono: '📇', valor: lineas.join('\n'), ayuda: 'Guarda el teléfono en tus contactos' })
  }
  return out
}
