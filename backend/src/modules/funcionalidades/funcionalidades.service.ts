import prisma from '../../shared/prisma.client'
import { AppError } from '../../shared/error.handler'
import { funcionalidadesRepository } from './funcionalidades.repository'
import type { CrearFuncionalidadDto, ActualizarFuncionalidadDto } from '../../../../shared/dtos'

export const funcionalidadesService = {
  listarPorProyecto: async (proyectoId: string) => {
    // Verificar que el proyecto existe
    const proyecto = await prisma.proyecto.findUnique({ where: { id: proyectoId } })
    if (!proyecto) {
      throw new AppError(404, 'PROYECTO_NO_ENCONTRADO', `Proyecto "${proyectoId}" no encontrado`)
    }
    return funcionalidadesRepository.findByProyecto(proyectoId)
  },

  obtenerPorId: async (id: string) => {
    const func = await funcionalidadesRepository.findById(id)
    if (!func) {
      throw new AppError(404, 'FUNCIONALIDAD_NO_ENCONTRADA', `Funcionalidad "${id}" no encontrada`)
    }
    return func
  },

  crear: async (proyectoId: string, dto: CrearFuncionalidadDto) => {
    // Verificar que el proyecto existe y está activo
    const proyecto = await prisma.proyecto.findUnique({ where: { id: proyectoId } })
    if (!proyecto) {
      throw new AppError(404, 'PROYECTO_NO_ENCONTRADO', `Proyecto "${proyectoId}" no encontrado`)
    }
    if (proyecto.estado === 'Archivado') {
      throw new AppError(400, 'PROYECTO_ARCHIVADO', 'No se pueden agregar funcionalidades a un proyecto archivado')
    }

    // Crear la funcionalidad
    const funcionalidad = await funcionalidadesRepository.create({
      proyectoId,
      nombre: dto.nombre,
      descripcion: dto.descripcion ?? null,
    })

    // Generar automáticamente el Ritual PostFuncionalidad
    await prisma.ritual.create({
      data: {
        proyectoId,
        funcionalidadId: funcionalidad.id,
        tipo: 'PostFuncionalidad',
        contenido: JSON.stringify({
          conceptosUtilizados: [],
          explicacionPropia: '',
          modeloMental: '',
          erroresEncontrados: '',
          queAprendi: '',
          posiblesTransferencias: '',
          nivelAutonomia: '50_IA',
          checklist: {
            explicoConPalabrasPropias: false,
            registreErrores: false,
            creeModeloMental: false,
            identifiqueTransferencias: false,
            detecteVacios: false,
          },
        }),
      },
    })

    return funcionalidad
  },

  actualizar: async (id: string, dto: ActualizarFuncionalidadDto) => {
    const existente = await funcionalidadesRepository.findById(id)
    if (!existente) {
      throw new AppError(404, 'FUNCIONALIDAD_NO_ENCONTRADA', `Funcionalidad "${id}" no encontrada`)
    }

    const data: Parameters<typeof funcionalidadesRepository.update>[1] = {}
    if (dto.nombre !== undefined) data.nombre = dto.nombre
    if (dto.descripcion !== undefined) data.descripcion = dto.descripcion ?? null
    if (dto.estado !== undefined) {
      data.estado = dto.estado
      if (dto.estado === 'Completada' && existente.estado !== 'Completada') {
        data.fechaCompletado = new Date()
      }
    }

    return funcionalidadesRepository.update(id, data)
  },

  eliminar: async (id: string) => {
    const existente = await funcionalidadesRepository.findById(id)
    if (!existente) {
      throw new AppError(404, 'FUNCIONALIDAD_NO_ENCONTRADA', `Funcionalidad "${id}" no encontrada`)
    }
    return funcionalidadesRepository.delete(id)
  },
}
