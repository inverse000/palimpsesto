import prisma from '../../shared/prisma.client'

export const conceptosRepository = {
  findAll: async (nivelDominio?: string) => {
    return prisma.concepto.findMany({
      where: nivelDominio ? { nivelDominio } : undefined,
      orderBy: [{ nivelDominio: 'asc' }, { fechaCreacion: 'desc' }],
    })
  },

  findById: async (id: string) => {
    return prisma.concepto.findUnique({ where: { id } })
  },

  findByNombre: async (nombre: string) => {
    return prisma.concepto.findUnique({ where: { nombre } })
  },

  findRecientes: async (take = 5) => {
    return prisma.concepto.findMany({
      orderBy: { fechaCreacion: 'desc' },
      take,
    })
  },

  create: async (data: {
    nombre: string
    definicionInicial: string
    analogia?: string | null
    nivelDominio?: string
  }) => {
    return prisma.concepto.create({
      data: {
        nombre: data.nombre,
        definicionInicial: data.definicionInicial,
        definicionActual: data.definicionInicial, // igual al inicio
        analogia: data.analogia ?? null,
        nivelDominio: data.nivelDominio ?? 'Exposicion',
      },
    })
  },

  update: async (
    id: string,
    data: {
      definicionActual?: string
      analogia?: string | null
      nivelDominio?: string
      fechaUltimaRevision?: Date | null
    }
  ) => {
    return prisma.concepto.update({ where: { id }, data })
  },

  delete: async (id: string) => {
    return prisma.concepto.delete({ where: { id } })
  },
}
