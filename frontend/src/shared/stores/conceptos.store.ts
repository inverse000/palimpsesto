import { create } from 'zustand'
import type { Concepto } from '@palimpsesto/shared'
import type { CrearConceptoDto, ActualizarConceptoDto } from '@palimpsesto/shared'
import { conceptosApi } from '../api/endpoints/conceptos'

interface ConceptosState {
  conceptos: Concepto[]
  conceptoActual: Concepto | null
  loading: boolean
  error: string | null

  listar: (nivel?: string) => Promise<void>
  obtenerPorId: (id: string) => Promise<void>
  crear: (dto: CrearConceptoDto) => Promise<Concepto>
  actualizar: (id: string, dto: ActualizarConceptoDto) => Promise<void>
  eliminar: (id: string) => Promise<void>
  clearError: () => void
}

export const useConceptosStore = create<ConceptosState>((set) => ({
  conceptos: [],
  conceptoActual: null,
  loading: false,
  error: null,

  listar: async (nivel) => {
    set({ loading: true, error: null })
    try {
      const items = await conceptosApi.listar(nivel)
      set({ conceptos: items, loading: false })
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  obtenerPorId: async (id) => {
    set({ loading: true, error: null })
    try {
      const concepto = await conceptosApi.obtenerPorId(id)
      set({ conceptoActual: concepto, loading: false })
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  crear: async (dto) => {
    set({ loading: true, error: null })
    try {
      const nuevo = await conceptosApi.crear(dto)
      set((state) => ({ conceptos: [nuevo, ...state.conceptos], loading: false }))
      return nuevo
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
      throw err
    }
  },

  actualizar: async (id, dto) => {
    set({ loading: true, error: null })
    try {
      const actualizado = await conceptosApi.actualizar(id, dto)
      set((state) => ({
        conceptos: state.conceptos.map((c) => (c.id === id ? actualizado : c)),
        conceptoActual: state.conceptoActual?.id === id ? actualizado : state.conceptoActual,
        loading: false,
      }))
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
      throw err
    }
  },

  eliminar: async (id) => {
    set({ loading: true, error: null })
    try {
      await conceptosApi.eliminar(id)
      set((state) => ({
        conceptos: state.conceptos.filter((c) => c.id !== id),
        loading: false,
      }))
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
      throw err
    }
  },

  clearError: () => set({ error: null }),
}))
