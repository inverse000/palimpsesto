import { Router } from 'express'
import { z } from 'zod'
import { validate } from '../../shared/validate.middleware'
import { proyectosController } from './proyectos.controller'

const router = Router()

const crearSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(200),
  descripcion: z.string().max(1000).optional(),
  fechaInicio: z.string().optional(),
})

const actualizarSchema = z.object({
  nombre: z.string().min(1).max(200).optional(),
  descripcion: z.string().max(1000).nullable().optional(),
  estado: z.enum(['Activo', 'Pausado', 'Completado', 'Archivado']).optional(),
  fechaInicio: z.string().nullable().optional(),
  fechaFinalizacion: z.string().nullable().optional(),
})

router.get('/', proyectosController.listar)
router.get('/:id', proyectosController.obtenerPorId)
router.post('/', validate(crearSchema), proyectosController.crear)
router.patch('/:id', validate(actualizarSchema), proyectosController.actualizar)
router.delete('/:id', proyectosController.eliminar)

export default router
