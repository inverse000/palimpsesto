import prisma from '../../shared/prisma.client'

export const proyectosRepository = {
  findAll: async (page = 1, pageSize = 20) => {
    const skip = (page - 1) * pageSize
    const [items, total] = await Promise.all([
      prisma.proyecto.findMany({
        skip,
        take: pageSize,
        orderBy: { fechaCreacion: 'desc' },
        include: {
          _count: {
            select: {
              funcionalidades: true,
              rituales: true,
              revisiones: true,
            },
          },
        },
      }),
      prisma.proyecto.count(),
    ])
    return { items, total }
  },

  findById: async (id: string) => {
    return prisma.proyecto.findUnique({
      where: { id },
      include: {
        funcionalidades: { orderBy: { fechaCreacion: 'asc' } },
        rituales: { orderBy: { fechaCreacion: 'asc' } },
        revisiones: { orderBy: { fechaProgramada: 'asc' } },
        evidencias: { orderBy: { fecha: 'desc' } },
      },
    })
  },

  findActivos: async () => {
    return prisma.proyecto.findMany({
      where: { estado: 'Activo' },
      orderBy: { fechaCreacion: 'desc' },
      include: {
        _count: {
          select: { funcionalidades: true, rituales: true, revisiones: true },
        },
      },
    })
  },

  create: async (data: {
    nombre: string
    descripcion?: string | null
    fechaInicio?: Date | null
  }) => {
    return prisma.proyecto.create({ data })
  },

  update: async (
    id: string,
    data: {
      nombre?: string
      descripcion?: string | null
      estado?: string
      fechaInicio?: Date | null
      fechaFinalizacion?: Date | null
    }
  ) => {
    return prisma.proyecto.update({ where: { id }, data })
  },

  delete: async (id: string) => {
    return prisma.proyecto.delete({ where: { id } })
  },
}
