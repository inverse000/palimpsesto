import { Router } from 'express'
import { z } from 'zod'
import { validate } from '../../shared/validate.middleware'
import { revisionesController } from './revisiones.controller'

const router = Router()

const completarSchema = z.object({
  contenido: z.object({
    recuperacionLibre: z.string(),
    conceptosRecordados: z.array(z.string()),
    conceptosOlvidados: z.array(z.string()),
    dificultades: z.string(),
    nivelConfianza: z.number().min(1).max(10),
  }),
})

router.get('/', revisionesController.listar)
router.get('/pendientes', revisionesController.listarPendientes)
router.get('/:id', revisionesController.obtenerPorId)
router.post('/:id/completar', validate(completarSchema), revisionesController.completar)
router.post('/:id/omitir', revisionesController.omitir)

export default router
