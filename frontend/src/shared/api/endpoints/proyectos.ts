import client from '../client'
import type { ApiResponse, Proyecto, ProyectoDetalle } from '@palimpsesto/shared'
import type { CrearProyectoDto, ActualizarProyectoDto } from '@palimpsesto/shared'

export const proyectosApi = {
  listar: async (page = 1, pageSize = 20) => {
    const res = await client.get<ApiResponse<Proyecto[]>>('/api/proyectos', {
      params: { page, pageSize },
    })
    return res.data
  },

  obtenerPorId: async (id: string) => {
    const res = await client.get<ApiResponse<ProyectoDetalle>>(`/api/proyectos/${id}`)
    return res.data.data
  },

  crear: async (dto: CrearProyectoDto) => {
    const res = await client.post<ApiResponse<Proyecto>>('/api/proyectos', dto)
    return res.data.data
  },

  actualizar: async (id: string, dto: ActualizarProyectoDto) => {
    const res = await client.patch<ApiResponse<Proyecto>>(`/api/proyectos/${id}`, dto)
    return res.data.data
  },

  eliminar: async (id: string) => {
    await client.delete(`/api/proyectos/${id}`)
  },
}
