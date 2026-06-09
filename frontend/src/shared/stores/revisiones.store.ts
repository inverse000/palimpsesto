import { create } from 'zustand'
import type { Revision } from '@palimpsesto/shared'
import type { CompletarRevisionDto } from '@palimpsesto/shared'
import { revisionesApi } from '../api/endpoints/revisiones'

interface RevisionesState {
  revisiones: Revision[]
  revisionActual: Revision | null
  loading: boolean
  error: string | null

  listar: (estado?: string) => Promise<void>
  obtenerPorId: (id: string) => Promise<void>
  completar: (id: string, dto: CompletarRevisionDto) => Promise<void>
  omitir: (id: string) => Promise<void>
  clearError: () => void
}

export const useRevisionesStore = create<RevisionesState>((set) => ({
  revisiones: [],
  revisionActual: null,
  loading: false,
  error: null,

  listar: async (estado) => {
    set({ loading: true, error: null })
    try {
      const items = await revisionesApi.listar(estado)
      set({ revisiones: items, loading: false })
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  obtenerPorId: async (id) => {
    set({ loading: true, error: null })
    try {
      const revision = await revisionesApi.obtenerPorId(id)
      set({ revisionActual: revision, loading: false })
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  completar: async (id, dto) => {
    set({ loading: true, error: null })
    try {
      const actualizada = await revisionesApi.completar(id, dto)
      set((state) => ({
        revisiones: state.revisiones.map((r) => (r.id === id ? actualizada : r)),
        revisionActual: actualizada,
        loading: false,
      }))
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
      throw err
    }
  },

  omitir: async (id) => {
    set({ loading: true, error: null })
    try {
      const actualizada = await revisionesApi.omitir(id)
      set((state) => ({
        revisiones: state.revisiones.map((r) => (r.id === id ? actualizada : r)),
        loading: false,
      }))
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
      throw err
    }
  },

  clearError: () => set({ error: null }),
}))
