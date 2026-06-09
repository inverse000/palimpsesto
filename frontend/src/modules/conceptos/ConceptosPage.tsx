import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConceptosStore } from '@/shared/stores/conceptos.store'
import { LoadingState, SkeletonCard } from '@/shared/components/feedback/LoadingState'
import { EmptyState } from '@/shared/components/feedback/EmptyState'
import Header from '@/shared/components/layout/Header'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'
import ConceptoCard from './components/ConceptoCard'
import ConceptoForm from './components/ConceptoForm'
import type { CrearConceptoDto, NivelDominio } from '@palimpsesto/shared'

type FiltroNivel = 'Todos' | NivelDominio

const FILTROS: { value: FiltroNivel; label: string }[] = [
  { value: 'Todos',       label: 'Todos' },
  { value: 'Exposicion',  label: 'Exposición' },
  { value: 'Comprension', label: 'Comprensión' },
  { value: 'Aplicacion',  label: 'Aplicación' },
  { value: 'Dominio',     label: 'Dominio' },
]

export default function ConceptosPage() {
  const { conceptos, loading, error, listar, crear } = useConceptosStore()
  const [filtro, setFiltro] = useState<FiltroNivel>('Todos')
  const [modalOpen, setModalOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { listar() }, [listar])

  const handleCrear = async (dto: CrearConceptoDto) => {
    await crear(dto)
    setModalOpen(false)
  }

  const conceptosFiltrados = filtro === 'Todos'
    ? conceptos
    : conceptos.filter((c) => c.nivelDominio === filtro)

  // Conteo por nivel
  const conteos = conceptos.reduce<Record<string, number>>((acc, c) => {
    acc[c.nivelDominio] = (acc[c.nivelDominio] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="animate-fade-in">
      <Header
        title="Conceptos"
        subtitle="Mapa de conocimiento técnico — cada definición registra cómo evoluciona tu comprensión"
        actions={
          <Button onClick={() => setModalOpen(true)}>+ Nuevo concepto</Button>
        }
      />

      {/* Stats por nivel */}
      {conceptos.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-8">
          {FILTROS.slice(1).map((f) => (
            <div key={f.value} className="bg-carbon-800 border border-carbon-600 rounded-lg px-4 py-3 text-center">
              <p className="text-xs text-ivory-500 font-mono mb-1">{f.label}</p>
              <p className="font-display text-2xl text-ivory-100">{conteos[f.value] ?? 0}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filtros */}
      <div className="flex items-center gap-2 mb-6">
        {FILTROS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFiltro(f.value)}
            className={[
              'px-3 py-1.5 rounded text-xs font-mono transition-all duration-150',
              filtro === f.value
                ? 'bg-bronze-900/40 text-bronze-400 border border-bronze-700/50'
                : 'text-ivory-500 hover:text-ivory-300 border border-carbon-700 hover:border-carbon-600',
            ].join(' ')}
          >
            {f.label}
            {f.value !== 'Todos' && conteos[f.value]
              ? ` (${conteos[f.value]})`
              : ''}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && conceptos.length === 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => <SkeletonCard key={n} />)}
        </div>
      ) : error ? (
        <div className="py-20 text-center text-red-400 font-serif text-sm">{error}</div>
      ) : conceptosFiltrados.length === 0 ? (
        <EmptyState
          icon="◉"
          title={filtro === 'Todos' ? 'Ningún concepto registrado aún' : `Sin conceptos en nivel "${filtro}"`}
          description={filtro === 'Todos' ? 'Registra los conceptos técnicos que vayas aprendiendo en tus proyectos.' : undefined}
          action={filtro === 'Todos' ? { label: '+ Nuevo concepto', onClick: () => setModalOpen(true) } : undefined}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {conceptosFiltrados.map((c) => (
            <ConceptoCard
              key={c.id}
              concepto={c}
              onClick={() => navigate(`/conceptos/${c.id}`)}
            />
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo concepto" width="lg">
        <ConceptoForm onSubmit={handleCrear} onCancel={() => setModalOpen(false)} />
      </Modal>
    </div>
  )
}
