import { Request, Response, NextFunction } from 'express'
import { conceptosService } from './conceptos.service'

export const conceptosController = {
  listar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nivel } = req.query
      const items = await conceptosService.listar(nivel as string | undefined)
      res.json({ data: items })
    } catch (err) {
      next(err)
    }
  },

  obtenerPorId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const concepto = await conceptosService.obtenerPorId(req.params.id)
      res.json({ data: concepto })
    } catch (err) {
      next(err)
    }
  },

  crear: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const concepto = await conceptosService.crear(req.body)
      res.status(201).json({ data: concepto })
    } catch (err) {
      next(err)
    }
  },

  actualizar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const concepto = await conceptosService.actualizar(req.params.id, req.body)
      res.json({ data: concepto })
    } catch (err) {
      next(err)
    }
  },

  eliminar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await conceptosService.eliminar(req.params.id)
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  },
}
