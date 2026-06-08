import { Request, Response, NextFunction } from 'express'
import { ritualesService } from './rituales.service'

export const ritualesController = {
  listarPorProyecto: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await ritualesService.listarPorProyecto(req.params.proyectoId)
      res.json({ data: items })
    } catch (err) {
      next(err)
    }
  },

  listarPendientes: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await ritualesService.listarPendientes()
      res.json({ data: items })
    } catch (err) {
      next(err)
    }
  },

  obtenerPorId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ritual = await ritualesService.obtenerPorId(req.params.id)
      res.json({ data: ritual })
    } catch (err) {
      next(err)
    }
  },

  actualizar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ritual = await ritualesService.actualizar(req.params.id, req.body.contenido)
      res.json({ data: ritual })
    } catch (err) {
      next(err)
    }
  },

  completar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ritual = await ritualesService.completar(req.params.id, req.body.contenido)
      res.json({ data: ritual })
    } catch (err) {
      next(err)
    }
  },
}
