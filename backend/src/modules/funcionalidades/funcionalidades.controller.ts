import { Request, Response, NextFunction } from 'express'
import { funcionalidadesService } from './funcionalidades.service'

export const funcionalidadesController = {
  listarPorProyecto: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await funcionalidadesService.listarPorProyecto(req.params.proyectoId)
      res.json({ data: items })
    } catch (err) {
      next(err)
    }
  },

  obtenerPorId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const func = await funcionalidadesService.obtenerPorId(req.params.id)
      res.json({ data: func })
    } catch (err) {
      next(err)
    }
  },

  crear: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const func = await funcionalidadesService.crear(req.params.proyectoId, req.body)
      res.status(201).json({ data: func })
    } catch (err) {
      next(err)
    }
  },

  actualizar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const func = await funcionalidadesService.actualizar(req.params.id, req.body)
      res.json({ data: func })
    } catch (err) {
      next(err)
    }
  },

  eliminar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await funcionalidadesService.eliminar(req.params.id)
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  },
}
