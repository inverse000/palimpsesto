import { useEffect, useState } from 'react'
import { useProyectosStore } from '@/shared/stores/proyectos.store'
import { LoadingState, SkeletonCard } from '@/shared/components/feedback/LoadingState'
import { EmptyState } from '@/shared/components/feedback/EmptyState'
import Header from '@/shared/components/layout/Header'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'
import ProyectoCard from './components/ProyectoCard'
import ProyectoForm from './components/ProyectoForm'
import type { EstadoProyecto, CrearProyectoDto } from '@palimpsesto/shared'

const ESTADOS: EstadoProyecto[] = ['Activo', 'Pausado', 'Completado', 'Archivado']

export default function ProyectosPage() {
  const { proyectos, loading, error, listar, crear, actualizar } = useProyectosStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [filtro, setFiltro] = useState<EstadoProyecto | 'Todos'>('Todos')

  useEffect(() => { listar() }, [listar])

  const handleCrear = async (dto: CrearProyectoDto) => {
    await crear(dto)
    setModalOpen(false)
  }

  const handleArchivar = async (id: string) => {
    if (confirm('¿Archivar este proyecto?')) {
      await actualizar(id, { estado: 'Archivado' })
    }
  }

  const proyectosFiltrados = filtro === 'Todos'
    ? proyectos
    : proyectos.filter((p) => p.estado === filtro)

  return (
    <div className="animate-fade-in">
      <Header
        title="Proyectos"
        subtitle="Cada proyecto es un ciclo de construcción y aprendizaje"
        actions={
          <Button onClick={() => setModalOpen(true)}>
            + Nuevo proyecto
          </Button>
        }
      />

      {/* Filtros */}
      <div className="flex items-center gap-2 mb-6">
        {(['Todos', ...ESTADOS] as const).map((estado) => (
          <button
            key={estado}
            onClick={() => setFiltro(estado)}
            className={[
              'px-3 py-1.5 rounded text-xs font-mono transition-all duration-150',
              filtro === estado
                ? 'bg-bronze-900/40 text-bronze-400 border border-bronze-700/50'
                : 'text-ivory-500 hover:text-ivory-300 border border-carbon-700 hover:border-carbon-600',
            ].join(' ')}
          >
            {estado}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && proyectos.length === 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => <SkeletonCard key={n} />)}
        </div>
      ) : error ? (
        <div className="py-20 text-center text-red-400 font-serif text-sm">{error}</div>
      ) : proyectosFiltrados.length === 0 ? (
        <EmptyState
          icon="◫"
          title={filtro === 'Todos' ? 'Ningún proyecto registrado aún' : `No hay proyectos en estado "${filtro}"`}
          description={filtro === 'Todos' ? 'Crea tu primer proyecto para comenzar a construir tu bitácora de expertise.' : undefined}
          action={filtro === 'Todos' ? { label: '+ Nuevo proyecto', onClick: () => setModalOpen(true) } : undefined}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {proyectosFiltrados.map((p) => (
            <ProyectoCard
              key={p.id}
              proyecto={p}
              onArchivar={handleArchivar}
            />
          ))}
        </div>
      )}

      {/* Modal crear */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nuevo proyecto"
      >
        <ProyectoForm
          onSubmit={handleCrear}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  )
}
