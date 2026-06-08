import { create } from 'zustand'
import type { Ritual } from '@palimpsesto/shared'
import { ritualesApi } from '../api/endpoints/rituales'

interface RitualesState {
  ritualActual: Ritual | null
  pendientes: Ritual[]
  loading: boolean
  error: string | null

  obtenerPorId: (id: string) => Promise<void>
  listarPendientes: () => Promise<void>
  actualizar: (id: string, contenido: Record<string, unknown>) => Promise<void>
  completar: (id: string, contenido: Record<string, unknown>) => Promise<Ritual>
  clearError: () => void
}

export const useRitualesStore = create<RitualesState>((set) => ({
  ritualActual: null,
  pendientes: [],
  loading: false,
  error: null,

  obtenerPorId: async (id) => {
    set({ loading: true, error: null })
    try {
      const ritual = await ritualesApi.obtenerPorId(id)
      set({ ritualActual: ritual, loading: false })
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  listarPendientes: async () => {
    set({ loading: true, error: null })
    try {
      const items = await ritualesApi.listarPendientes()
      set({ pendientes: items, loading: false })
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  actualizar: async (id, contenido) => {
    set({ loading: true, error: null })
    try {
      const ritual = await ritualesApi.actualizar(id, contenido)
      set({ ritualActual: ritual, loading: false })
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
      throw err
    }
  },

  completar: async (id, contenido) => {
    set({ loading: true, error: null })
    try {
      const ritual = await ritualesApi.completar(id, contenido)
      set({ ritualActual: ritual, loading: false })
      return ritual
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
      throw err
    }
  },

  clearError: () => set({ error: null }),
}))
