import client from '../client'
import type { ApiResponse, Funcionalidad } from '@palimpsesto/shared'
import type { CrearFuncionalidadDto, ActualizarFuncionalidadDto } from '@palimpsesto/shared'

export const funcionalidadesApi = {
  listarPorProyecto: async (proyectoId: string) => {
    const res = await client.get<ApiResponse<Funcionalidad[]>>(
      `/api/proyectos/${proyectoId}/funcionalidades`
    )
    return res.data.data
  },

  obtenerPorId: async (id: string) => {
    const res = await client.get<ApiResponse<Funcionalidad>>(`/api/funcionalidades/${id}`)
    return res.data.data
  },

  crear: async (proyectoId: string, dto: CrearFuncionalidadDto) => {
    const res = await client.post<ApiResponse<Funcionalidad>>(
      `/api/proyectos/${proyectoId}/funcionalidades`,
      dto
    )
    return res.data.data
  },

  actualizar: async (id: string, dto: ActualizarFuncionalidadDto) => {
    const res = await client.patch<ApiResponse<Funcionalidad>>(`/api/funcionalidades/${id}`, dto)
    return res.data.data
  },

  eliminar: async (id: string) => {
    await client.delete(`/api/funcionalidades/${id}`)
  },
}
