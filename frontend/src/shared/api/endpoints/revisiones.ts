import client from '../client'
import type { ApiResponse, Revision } from '@palimpsesto/shared'
import type { CompletarRevisionDto } from '@palimpsesto/shared'

export const revisionesApi = {
  listar: async (estado?: string) => {
    const res = await client.get<ApiResponse<Revision[]>>('/api/revisiones', {
      params: estado ? { estado } : undefined,
    })
    return res.data.data
  },

  listarPendientes: async () => {
    const res = await client.get<ApiResponse<Revision[]>>('/api/revisiones/pendientes')
    return res.data.data
  },

  obtenerPorId: async (id: string) => {
    const res = await client.get<ApiResponse<Revision>>(`/api/revisiones/${id}`)
    return res.data.data
  },

  completar: async (id: string, dto: CompletarRevisionDto) => {
    const res = await client.post<ApiResponse<Revision>>(`/api/revisiones/${id}/completar`, dto)
    return res.data.data
  },

  omitir: async (id: string) => {
    const res = await client.post<ApiResponse<Revision>>(`/api/revisiones/${id}/omitir`)
    return res.data.data
  },
}
