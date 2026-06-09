import { AppError } from '../../shared/error.handler'
import { revisionesRepository } from './revisiones.repository'
import type { CompletarRevisionDto } from '../../../../shared/dtos'

export const revisionesService = {
  listar: async (estado?: string) => {
    const revisiones = await revisionesRepository.findAll(estado)
    return revisiones.map(parseRevision)
  },

  listarPendientes: async () => {
    const revisiones = await revisionesRepository.findPendientes()
    return revisiones.map(parseRevision)
  },

  listarProximas: async () => {
    const revisiones = await revisionesRepository.findProximas(7)
    return revisiones.map(parseRevision)
  },

  obtenerPorId: async (id: string) => {
    const revision = await revisionesRepository.findById(id)
    if (!revision) {
      throw new AppError(404, 'REVISION_NO_ENCONTRADA', `Revisión "${id}" no encontrada`)
    }
    return parseRevision(revision)
  },

  completar: async (id: string, dto: CompletarRevisionDto) => {
    const revision = await revisionesRepository.findById(id)
    if (!revision) {
      throw new AppError(404, 'REVISION_NO_ENCONTRADA', `Revisión "${id}" no encontrada`)
    }
    if (revision.estado === 'Completada') {
      throw new AppError(400, 'REVISION_YA_COMPLETADA', 'Esta revisión ya fue completada')
    }
    const updated = await revisionesRepository.update(id, {
      estado: 'Completada',
      contenido: JSON.stringify(dto.contenido),
      fechaRealizada: new Date(),
    })
    return parseRevision({ ...updated, proyecto: revision.proyecto })
  },

  omitir: async (id: string) => {
    const revision = await revisionesRepository.findById(id)
    if (!revision) {
      throw new AppError(404, 'REVISION_NO_ENCONTRADA', `Revisión "${id}" no encontrada`)
    }
    const updated = await revisionesRepository.update(id, { estado: 'Omitida' })
    return parseRevision({ ...updated, proyecto: revision.proyecto })
  },
}

function parseRevision(r: { contenido?: string | null; [key: string]: unknown }) {
  return {
    ...r,
    contenido: r.contenido ? tryParse(r.contenido as string) : null,
  }
}

function tryParse(s: string) {
  try { return JSON.parse(s) } catch { return null }
}
