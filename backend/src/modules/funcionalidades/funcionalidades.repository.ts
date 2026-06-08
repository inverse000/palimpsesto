import prisma from '../../shared/prisma.client'

export const funcionalidadesRepository = {
  findByProyecto: async (proyectoId: string) => {
    return prisma.funcionalidad.findMany({
      where: { proyectoId },
      orderBy: { fechaCreacion: 'asc' },
      include: {
        _count: { select: { rituales: true, evidencias: true } },
      },
    })
  },

  findById: async (id: string) => {
    return prisma.funcionalidad.findUnique({
      where: { id },
      include: {
        rituales: { orderBy: { fechaCreacion: 'asc' } },
        evidencias: { orderBy: { fecha: 'desc' } },
      },
    })
  },

  create: async (data: {
    proyectoId: string
    nombre: string
    descripcion?: string | null
  }) => {
    return prisma.funcionalidad.create({ data })
  },

  update: async (
    id: string,
    data: {
      nombre?: string
      descripcion?: string | null
      estado?: string
      fechaCompletado?: Date | null
    }
  ) => {
    return prisma.funcionalidad.update({ where: { id }, data })
  },

  delete: async (id: string) => {
    return prisma.funcionalidad.delete({ where: { id } })
  },
}
