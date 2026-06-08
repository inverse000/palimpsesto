import prisma from '../../shared/prisma.client'

export const ritualesRepository = {
  findByProyecto: async (proyectoId: string) => {
    return prisma.ritual.findMany({
      where: { proyectoId },
      orderBy: { fechaCreacion: 'asc' },
    })
  },

  findById: async (id: string) => {
    return prisma.ritual.findUnique({ where: { id } })
  },

  findPendientes: async () => {
    return prisma.ritual.findMany({
      where: { completado: false },
      orderBy: { fechaCreacion: 'desc' },
      include: {
        proyecto: { select: { id: true, nombre: true, estado: true } },
        funcionalidad: { select: { id: true, nombre: true } },
      },
    })
  },

  update: async (
    id: string,
    data: { contenido?: string; completado?: boolean; fechaCompletado?: Date | null }
  ) => {
    return prisma.ritual.update({ where: { id }, data })
  },
}
