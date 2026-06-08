import { Router, Request, Response, NextFunction } from 'express'
import prisma from '../../shared/prisma.client'

const router = Router()

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const now = new Date()

    const [proyectosActivos, revisionesPendientes, ritualesPendientes, conceptosRecientes, totalProyectos, totalConceptos] =
      await Promise.all([
        prisma.proyecto.findMany({
          where: { estado: 'Activo' },
          orderBy: { fechaCreacion: 'desc' },
          take: 5,
          include: {
            _count: {
              select: { funcionalidades: true, rituales: true, revisiones: true },
            },
          },
        }),
        prisma.revision.findMany({
          where: { estado: 'Pendiente', fechaProgramada: { lte: now } },
          orderBy: { fechaProgramada: 'asc' },
          take: 10,
          include: { proyecto: { select: { id: true, nombre: true } } },
        }),
        prisma.ritual.findMany({
          where: { completado: false },
          orderBy: { fechaCreacion: 'desc' },
          take: 10,
          include: { proyecto: { select: { id: true, nombre: true } } },
        }),
        prisma.concepto.findMany({
          orderBy: { fechaCreacion: 'desc' },
          take: 5,
        }),
        prisma.proyecto.count(),
        prisma.concepto.count(),
      ])

    res.json({
      data: {
        proyectosActivos,
        revisionesPendientes,
        ritualesPendientes,
        conceptosRecientes,
        stats: {
          totalProyectos,
          totalConceptos,
          nivelPromedioConceptos: 0, // Se calculará en V5
        },
      },
    })
  } catch (err) {
    next(err)
  }
})

export default router
