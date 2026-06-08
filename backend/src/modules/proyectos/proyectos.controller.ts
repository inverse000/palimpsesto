import { Request, Response, NextFunction } from 'express'
import { proyectosService } from './proyectos.service'

export const proyectosController = {
  listar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const pageSize = parseInt(req.query.pageSize as string) || 20
      const result = await proyectosService.listar(page, pageSize)
      res.json({
        data: result.items,
        meta: { total: result.total, page, pageSize },
      })
    } catch (err) {
      next(err)
    }
  },

  obtenerPorId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const proyecto = await proyectosService.obtenerPorId(req.params.id)
      res.json({ data: proyecto })
    } catch (err) {
      next(err)
    }
  },

  crear: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const proyecto = await proyectosService.crear(req.body)
      res.status(201).json({ data: proyecto })
    } catch (err) {
      next(err)
    }
  },

  actualizar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const proyecto = await proyectosService.actualizar(req.params.id, req.body)
      res.json({ data: proyecto })
    } catch (err) {
      next(err)
    }
  },

  eliminar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await proyectosService.eliminar(req.params.id)
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  },
}
