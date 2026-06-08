import prisma from '../../shared/prisma.client'
import { AppError } from '../../shared/error.handler'
import { proyectosRepository } from './proyectos.repository'
import type { CrearProyectoDto, ActualizarProyectoDto } from '../../../../shared/dtos'

const INTERVALOS_REVISION = [1, 7, 21, 60, 120]

export const proyectosService = {
  listar: async (page?: number, pageSize?: number) => {
    return proyectosRepository.findAll(page, pageSize)
  },

  obtenerPorId: async (id: string) => {
    const proyecto = await proyectosRepository.findById(id)
    if (!proyecto) {
      throw new AppError(404, 'PROYECTO_NO_ENCONTRADO', `Proyecto con id "${id}" no encontrado`)
    }
    return proyecto
  },

  crear: async (dto: CrearProyectoDto) => {
    // Crear el proyecto
    const proyecto = await proyectosRepository.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion ?? null,
      fechaInicio: dto.fechaInicio ? new Date(dto.fechaInicio) : null,
    })

    // Generar automáticamente el Ritual Preproyecto
    await prisma.ritual.create({
      data: {
        proyectoId: proyecto.id,
        tipo: 'Preproyecto',
        contenido: JSON.stringify({
          queQuieroConstruir: '',
          comoCreoQueFunciona: '',
          conceptosEsperados: [],
          vacios: '',
          nivelConfianzaInicial: 5,
        }),
      },
    })

    return proyecto
  },

  actualizar: async (id: string, dto: ActualizarProyectoDto) => {
    // Verificar existencia
    const existente = await proyectosRepository.findById(id)
    if (!existente) {
      throw new AppError(404, 'PROYECTO_NO_ENCONTRADO', `Proyecto con id "${id}" no encontrado`)
    }

    const data: Parameters<typeof proyectosRepository.update>[1] = {}

    if (dto.nombre !== undefined) data.nombre = dto.nombre
    if (dto.descripcion !== undefined) data.descripcion = dto.descripcion ?? null
    if (dto.estado !== undefined) data.estado = dto.estado
    if (dto.fechaInicio !== undefined)
      data.fechaInicio = dto.fechaInicio ? new Date(dto.fechaInicio) : null
    if (dto.fechaFinalizacion !== undefined)
      data.fechaFinalizacion = dto.fechaFinalizacion ? new Date(dto.fechaFinalizacion) : null

    // Si se completa el proyecto, generar revisiones espaciadas
    if (dto.estado === 'Completado' && existente.estado !== 'Completado') {
      data.fechaFinalizacion = data.fechaFinalizacion ?? new Date()

      const fechaBase = data.fechaFinalizacion as Date
      const revisiones = INTERVALOS_REVISION.map((dias) => {
        const fecha = new Date(fechaBase)
        fecha.setDate(fecha.getDate() + dias)
        return {
          proyectoId: id,
          intervalo: dias,
          fechaProgramada: fecha,
          estado: 'Pendiente',
        }
      })

      await prisma.revision.createMany({ data: revisiones })
    }

    return proyectosRepository.update(id, data)
  },

  eliminar: async (id: string) => {
    const existente = await proyectosRepository.findById(id)
    if (!existente) {
      throw new AppError(404, 'PROYECTO_NO_ENCONTRADO', `Proyecto con id "${id}" no encontrado`)
    }
    return proyectosRepository.delete(id)
  },
}
