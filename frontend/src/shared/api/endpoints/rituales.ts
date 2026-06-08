import client from '../client'
import type { ApiResponse, Ritual } from '@palimpsesto/shared'

export const ritualesApi = {
  listarPorProyecto: async (proyectoId: string) => {
    const res = await client.get<ApiResponse<Ritual[]>>(
      `/api/proyectos/${proyectoId}/rituales`
    )
    return res.data.data
  },

  obtenerPorId: async (id: string) => {
    const res = await client.get<ApiResponse<Ritual>>(`/api/rituales/${id}`)
    return res.data.data
  },

  listarPendientes: async () => {
    const res = await client.get<ApiResponse<Ritual[]>>('/api/rituales/pendientes')
    return res.data.data
  },

  actualizar: async (id: string, contenido: Record<string, unknown>) => {
    const res = await client.patch<ApiResponse<Ritual>>(`/api/rituales/${id}`, { contenido })
    return res.data.data
  },

  completar: async (id: string, contenido: Record<string, unknown>) => {
    const res = await client.post<ApiResponse<Ritual>>(`/api/rituales/${id}/completar`, { contenido })
    return res.data.data
  },
}
