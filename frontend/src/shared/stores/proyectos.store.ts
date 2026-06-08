import { create } from 'zustand'
import type { Proyecto, ProyectoDetalle } from '@palimpsesto/shared'
import { proyectosApi } from '../api/endpoints/proyectos'
import type { CrearProyectoDto, ActualizarProyectoDto } from '@palimpsesto/shared'

interface ProyectosState {
  proyectos: Proyecto[]
  proyectoActual: ProyectoDetalle | null
  total: number
  loading: boolean
  error: string | null

  listar: (page?: number) => Promise<void>
  obtenerPorId: (id: string) => Promise<void>
  crear: (dto: CrearProyectoDto) => Promise<Proyecto>
  actualizar: (id: string, dto: ActualizarProyectoDto) => Promise<void>
  eliminar: (id: string) => Promise<void>
  clearError: () => void
}

export const useProyectosStore = create<ProyectosState>((set, get) => ({
  proyectos: [],
  proyectoActual: null,
  total: 0,
  loading: false,
  error: null,

  listar: async (page = 1) => {
    set({ loading: true, error: null })
    try {
      const result = await proyectosApi.listar(page)
      set({ proyectos: result.data, total: result.meta?.total ?? 0, loading: false })
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  obtenerPorId: async (id) => {
    set({ loading: true, error: null })
    try {
      const proyecto = await proyectosApi.obtenerPorId(id)
      set({ proyectoActual: proyecto, loading: false })
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  crear: async (dto) => {
    set({ loading: true, error: null })
    try {
      const nuevo = await proyectosApi.crear(dto)
      set((state) => ({
        proyectos: [nuevo, ...state.proyectos],
        total: state.total + 1,
        loading: false,
      }))
      return nuevo
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
      throw err
    }
  },

  actualizar: async (id, dto) => {
    set({ loading: true, error: null })
    try {
      const actualizado = await proyectosApi.actualizar(id, dto)
      set((state) => ({
        proyectos: state.proyectos.map((p) => (p.id === id ? actualizado : p)),
        proyectoActual:
          state.proyectoActual?.id === id
            ? { ...state.proyectoActual, ...actualizado }
            : state.proyectoActual,
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
      await proyectosApi.eliminar(id)
      set((state) => ({
        proyectos: state.proyectos.filter((p) => p.id !== id),
        total: state.total - 1,
        loading: false,
      }))
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
      throw err
    }
  },

  clearError: () => set({ error: null }),
}))
