import prisma from '../../shared/prisma.client'

export const revisionesRepository = {
  findAll: async (estado?: string) => {
    return prisma.revision.findMany({
      where: estado ? { estado } : undefined,
      orderBy: { fechaProgramada: 'asc' },
      include: { proyecto: { select: { id: true, nombre: true } } },
    })
  },

  findPendientes: async () => {
    const now = new Date()
    return prisma.revision.findMany({
      where: { estado: 'Pendiente', fechaProgramada: { lte: now } },
      orderBy: { fechaProgramada: 'asc' },
      include: { proyecto: { select: { id: true, nombre: true } } },
    })
  },

  findProximas: async (dias = 7) => {
    const now = new Date()
    const limite = new Date(now)
    limite.setDate(limite.getDate() + dias)
    return prisma.revision.findMany({
      where: { estado: 'Pendiente', fechaProgramada: { gt: now, lte: limite } },
      orderBy: { fechaProgramada: 'asc' },
      include: { proyecto: { select: { id: true, nombre: true } } },
    })
  },

  findByProyecto: async (proyectoId: string) => {
    return prisma.revision.findMany({
      where: { proyectoId },
      orderBy: { fechaProgramada: 'asc' },
    })
  },

  findById: async (id: string) => {
    return prisma.revision.findUnique({
      where: { id },
      include: { proyecto: { select: { id: true, nombre: true } } },
    })
  },

  update: async (
    id: string,
    data: {
      estado?: string
      contenido?: string | null
      fechaRealizada?: Date | null
    }
  ) => {
    return prisma.revision.update({ where: { id }, data })
  },

  omitirVencidas: async () => {
    const limite = new Date()
    limite.setDate(limite.getDate() - 7)
    return prisma.revision.updateMany({
      where: { estado: 'Pendiente', fechaProgramada: { lt: limite } },
      data: { estado: 'Omitida' },
    })
  },
}
