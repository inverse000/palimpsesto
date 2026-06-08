import { Router } from 'express'
import { z } from 'zod'
import { validate } from '../../shared/validate.middleware'
import { funcionalidadesController } from './funcionalidades.controller'

// Router anidado bajo /api/proyectos/:proyectoId/funcionalidades
const routerAnidado = Router({ mergeParams: true })

const crearSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(200),
  descripcion: z.string().max(1000).optional(),
})

routerAnidado.get('/', funcionalidadesController.listarPorProyecto)
routerAnidado.post('/', validate(crearSchema), funcionalidadesController.crear)

// Router independiente para operaciones por id
const routerBase = Router()

const actualizarSchema = z.object({
  nombre: z.string().min(1).max(200).optional(),
  descripcion: z.string().max(1000).nullable().optional(),
  estado: z.enum(['Pendiente', 'EnDesarrollo', 'Completada']).optional(),
})

routerBase.get('/:id', funcionalidadesController.obtenerPorId)
routerBase.patch('/:id', validate(actualizarSchema), funcionalidadesController.actualizar)
routerBase.delete('/:id', funcionalidadesController.eliminar)

export { routerAnidado as funcionalidadesAnidadoRouter, routerBase as funcionalidadesRouter }
