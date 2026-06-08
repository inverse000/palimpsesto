import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Palimpsesto...')

  // Proyecto de ejemplo
  const proyecto = await prisma.proyecto.create({
    data: {
      nombre: 'Proyecto de Ejemplo',
      descripcion: 'Proyecto inicial para explorar Palimpsesto. Puedes eliminarlo cuando quieras.',
      estado: 'Activo',
      fechaInicio: new Date(),
    },
  })

  // Ritual Preproyecto vacío
  await prisma.ritual.create({
    data: {
      proyectoId: proyecto.id,
      tipo: 'Preproyecto',
      contenido: JSON.stringify({
        queQuieroConstruir: '',
        comoCreoQueFunciona: '',
        conceptosEsperados: [],
        vacios: '',
        nivelConfianzaInicial: 5,
      }),
    },
  })

  // Concepto de ejemplo
  await prisma.concepto.create({
    data: {
      nombre: 'Repetición Espaciada',
      definicionInicial: 'Técnica de memorización que distribuye las revisiones en intervalos crecientes.',
      definicionActual: 'Técnica de memorización que distribuye las revisiones en intervalos crecientes.',
      analogia: 'Como regar una planta: muy seguido al principio, luego cada vez con más tiempo entre riegos.',
      nivelDominio: 'Comprension',
    },
  })

  console.log('✅ Seed completado')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
