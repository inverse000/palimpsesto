import { AppError } from '../../shared/error.handler'
import { conceptosRepository } from './conceptos.repository'
import type { CrearConceptoDto, ActualizarConceptoDto } from '../../../../shared/dtos'

const NIVELES_VALIDOS = ['Exposicion', 'Comprension', 'Aplicacion', 'Dominio']

export const conceptosService = {
  listar: async (nivelDominio?: string) => {
    if (nivelDominio && !NIVELES_VALIDOS.includes(nivelDominio)) {
      throw new AppError(400, 'NIVEL_INVALIDO', `Nivel "${nivelDominio}" no válido`)
    }
    return conceptosRepository.findAll(nivelDominio)
  },

  obtenerPorId: async (id: string) => {
    const concepto = await conceptosRepository.findById(id)
    if (!concepto) {
      throw new AppError(404, 'CONCEPTO_NO_ENCONTRADO', `Concepto "${id}" no encontrado`)
    }
    return concepto
  },

  crear: async (dto: CrearConceptoDto) => {
    const existente = await conceptosRepository.findByNombre(dto.nombre)
    if (existente) {
      throw new AppError(409, 'CONCEPTO_DUPLICADO', `Ya existe un concepto llamado "${dto.nombre}"`)
    }
    return conceptosRepository.create({
      nombre: dto.nombre,
      definicionInicial: dto.definicionInicial,
      analogia: dto.analogia ?? null,
      nivelDominio: dto.nivelDominio ?? 'Exposicion',
    })
  },

  // Usado internamente por rituales al completar PostFuncionalidad
  crearOActualizarDesdeRitual: async (nombres: string[]) => {
    for (const nombre of nombres) {
      const existente = await conceptosRepository.findByNombre(nombre)
      if (!existente) {
        await conceptosRepository.create({
          nombre,
          definicionInicial: 'Registrado automáticamente desde ritual',
          nivelDominio: 'Exposicion',
        })
      }
    }
  },

  actualizar: async (id: string, dto: ActualizarConceptoDto) => {
    const existente = await conceptosRepository.findById(id)
    if (!existente) {
      throw new AppError(404, 'CONCEPTO_NO_ENCONTRADO', `Concepto "${id}" no encontrado`)
    }
    if (dto.nivelDominio && !NIVELES_VALIDOS.includes(dto.nivelDominio)) {
      throw new AppError(400, 'NIVEL_INVALIDO', `Nivel "${dto.nivelDominio}" no válido`)
    }
    return conceptosRepository.update(id, {
      definicionActual: dto.definicionActual,
      analogia: dto.analogia,
      nivelDominio: dto.nivelDominio,
      fechaUltimaRevision: new Date(),
    })
  },

  eliminar: async (id: string) => {
    const existente = await conceptosRepository.findById(id)
    if (!existente) {
      throw new AppError(404, 'CONCEPTO_NO_ENCONTRADO', `Concepto "${id}" no encontrado`)
    }
    return conceptosRepository.delete(id)
  },
}
