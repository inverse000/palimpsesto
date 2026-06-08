import { Router } from 'express'
import { z } from 'zod'
import { validate } from '../../shared/validate.middleware'
import { ritualesController } from './rituales.controller'

// Anidado: /api/proyectos/:proyectoId/rituales
const routerAnidado = Router({ mergeParams: true })
routerAnidado.get('/', ritualesController.listarPorProyecto)

// Base: /api/rituales
const routerBase = Router()

const contenidoSchema = z.object({
  contenido: z.record(z.unknown()),
})

routerBase.get('/pendientes', ritualesController.listarPendientes)
routerBase.get('/:id', ritualesController.obtenerPorId)
routerBase.patch('/:id', validate(contenidoSchema), ritualesController.actualizar)
routerBase.post('/:id/completar', validate(contenidoSchema), ritualesController.completar)

export { routerAnidado as ritualesAnidadoRouter, routerBase as ritualesRouter }
