import type { Categoria } from '../types'

export const categorias: Categoria[] = [
  { id: 'comida', nombre: 'Comida', icono: '🍔', color: '#f97316', orden: 1, parentId: null, activa: true },
  { id: 'compras', nombre: 'Centros comerciales', icono: '🛍️', color: '#8b5cf6', orden: 2, parentId: null, activa: true },
  { id: 'parques', nombre: 'Parques', icono: '🌳', color: '#16a34a', orden: 3, parentId: null, activa: true },
  { id: 'hoteles', nombre: 'Hoteles', icono: '🏨', color: '#0284c7', orden: 4, parentId: null, activa: true },
  { id: 'cultura', nombre: 'Cultura', icono: '🎭', color: '#e11d48', orden: 5, parentId: null, activa: true },
  { id: 'diversion', nombre: 'Diversión', icono: '🎡', color: '#d97706', orden: 6, parentId: null, activa: true },
]
