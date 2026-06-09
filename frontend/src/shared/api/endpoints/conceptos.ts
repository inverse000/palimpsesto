import client from '../client'
import type { ApiResponse, Concepto } from '@palimpsesto/shared'
import type { CrearConceptoDto, ActualizarConceptoDto } from '@palimpsesto/shared'

export const conceptosApi = {
  listar: async (nivel?: string) => {
    const res = await client.get<ApiResponse<Concepto[]>>('/api/conceptos', {
      params: nivel ? { nivel } : undefined,
    })
    return res.data.data
  },

  obtenerPorId: async (id: string) => {
    const res = await client.get<ApiResponse<Concepto>>(`/api/conceptos/${id}`)
    return res.data.data
  },

  crear: async (dto: CrearConceptoDto) => {
    const res = await client.post<ApiResponse<Concepto>>('/api/conceptos', dto)
    return res.data.data
  },

  actualizar: async (id: string, dto: ActualizarConceptoDto) => {
    const res = await client.patch<ApiResponse<Concepto>>(`/api/conceptos/${id}`, dto)
    return res.data.data
  },

  eliminar: async (id: string) => {
    await client.delete(`/api/conceptos/${id}`)
  },
}
