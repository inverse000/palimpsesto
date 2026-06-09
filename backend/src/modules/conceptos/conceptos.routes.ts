import { Router } from 'express'
import { z } from 'zod'
import { validate } from '../../shared/validate.middleware'
import { conceptosController } from './conceptos.controller'

const router = Router()

const crearSchema = z.object({
  nombre: z.string().min(1).max(200),
  definicionInicial: z.string().min(1),
  analogia: z.string().max(500).optional(),
  nivelDominio: z.enum(['Exposicion', 'Comprension', 'Aplicacion', 'Dominio']).optional(),
})

const actualizarSchema = z.object({
  definicionActual: z.string().min(1).optional(),
  analogia: z.string().max(500).nullable().optional(),
  nivelDominio: z.enum(['Exposicion', 'Comprension', 'Aplicacion', 'Dominio']).optional(),
})

router.get('/', conceptosController.listar)
router.get('/:id', conceptosController.obtenerPorId)
router.post('/', validate(crearSchema), conceptosController.crear)
router.patch('/:id', validate(actualizarSchema), conceptosController.actualizar)
router.delete('/:id', conceptosController.eliminar)

export default router
