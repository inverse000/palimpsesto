import prisma from '../../shared/prisma.client'
import { AppError } from '../../shared/error.handler'
import { ritualesRepository } from './rituales.repository'

export const ritualesService = {
  listarPorProyecto: async (proyectoId: string) => {
    const proyecto = await prisma.proyecto.findUnique({ where: { id: proyectoId } })
    if (!proyecto) {
      throw new AppError(404, 'PROYECTO_NO_ENCONTRADO', `Proyecto "${proyectoId}" no encontrado`)
    }
    const rituales = await ritualesRepository.findByProyecto(proyectoId)
    // Parsear contenido JSON
    return rituales.map((r) => ({
      ...r,
      contenido: parseContenido(r.contenido),
    }))
  },

  obtenerPorId: async (id: string) => {
    const ritual = await ritualesRepository.findById(id)
    if (!ritual) {
      throw new AppError(404, 'RITUAL_NO_ENCONTRADO', `Ritual "${id}" no encontrado`)
    }
    return { ...ritual, contenido: parseContenido(ritual.contenido) }
  },

  listarPendientes: async () => {
    const rituales = await ritualesRepository.findPendientes()
    return rituales.map((r) => ({
      ...r,
      contenido: parseContenido(r.contenido),
    }))
  },

  actualizar: async (id: string, contenido: Record<string, unknown>) => {
    const ritual = await ritualesRepository.findById(id)
    if (!ritual) {
      throw new AppError(404, 'RITUAL_NO_ENCONTRADO', `Ritual "${id}" no encontrado`)
    }
    if (ritual.completado) {
      throw new AppError(400, 'RITUAL_YA_COMPLETADO', 'Este ritual ya fue completado y no puede modificarse')
    }
    const updated = await ritualesRepository.update(id, {
      contenido: JSON.stringify(contenido),
    })
    return { ...updated, contenido: parseContenido(updated.contenido) }
  },

  completar: async (id: string, contenido: Record<string, unknown>) => {
    const ritual = await ritualesRepository.findById(id)
    if (!ritual) {
      throw new AppError(404, 'RITUAL_NO_ENCONTRADO', `Ritual "${id}" no encontrado`)
    }
    if (ritual.completado) {
      throw new AppError(400, 'RITUAL_YA_COMPLETADO', 'Este ritual ya fue completado')
    }

    // Si es PostProyecto, verificar que existe el ritual Preproyecto completado
    if (ritual.tipo === 'PostProyecto') {
      const preproyecto = await prisma.ritual.findFirst({
        where: { proyectoId: ritual.proyectoId, tipo: 'Preproyecto', completado: true },
      })
      if (!preproyecto) {
        throw new AppError(400, 'PREPROYECTO_PENDIENTE', 'Debes completar el ritual Preproyecto antes del PostProyecto')
      }
    }

    const updated = await ritualesRepository.update(id, {
      contenido: JSON.stringify(contenido),
      completado: true,
      fechaCompletado: new Date(),
    })

    // Si es PostFuncionalidad completado, marcar la funcionalidad como Completada
    if (ritual.tipo === 'PostFuncionalidad' && ritual.funcionalidadId) {
      await prisma.funcionalidad.update({
        where: { id: ritual.funcionalidadId },
        data: { estado: 'Completada', fechaCompletado: new Date() },
      })
    }

    return { ...updated, contenido: parseContenido(updated.contenido) }
  },
}

function parseContenido(contenido: string): Record<string, unknown> {
  try {
    return JSON.parse(contenido)
  } catch {
    return {}
  }
}
