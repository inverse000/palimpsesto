import { Request, Response, NextFunction } from 'express'
import { revisionesService } from './revisiones.service'

export const revisionesController = {
  listar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { estado } = req.query
      const items = await revisionesService.listar(estado as string | undefined)
      res.json({ data: items })
    } catch (err) { next(err) }
  },

  listarPendientes: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await revisionesService.listarPendientes()
      res.json({ data: items })
    } catch (err) { next(err) }
  },

  obtenerPorId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const revision = await revisionesService.obtenerPorId(req.params.id)
      res.json({ data: revision })
    } catch (err) { next(err) }
  },

  completar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const revision = await revisionesService.completar(req.params.id, req.body)
      res.json({ data: revision })
    } catch (err) { next(err) }
  },

  omitir: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const revision = await revisionesService.omitir(req.params.id)
      res.json({ data: revision })
    } catch (err) { next(err) }
  },
}
