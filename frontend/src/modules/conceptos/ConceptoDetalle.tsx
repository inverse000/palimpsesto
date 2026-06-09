import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useConceptosStore } from '@/shared/stores/conceptos.store'
import { LoadingState } from '@/shared/components/feedback/LoadingState'
import Header from '@/shared/components/layout/Header'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'
import EditarConceptoForm from './components/EditarConceptoForm'
import type { NivelDominio, ActualizarConceptoDto } from '@palimpsesto/shared'

const nivelConfig: Record<NivelDominio, { label: string; color: string }> = {
  Exposicion:  { label: 'Exposición',   color: 'text-carbon-400' },
  Comprension: { label: 'Comprensión',  color: 'text-sky-400' },
  Aplicacion:  { label: 'Aplicación',   color: 'text-violet-400' },
  Dominio:     { label: 'Dominio',      color: 'text-bronze-400' },
}

export default function ConceptoDetalle() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { conceptoActual, loading, error, obtenerPorId, actualizar, eliminar } = useConceptosStore()
  const [modalEditar, setModalEditar] = useState(false)

  useEffect(() => {
    if (id) obtenerPorId(id)
  }, [id, obtenerPorId])

  if (loading) return <LoadingState message="Cargando concepto..." />
  if (error) return <div className="py-20 text-center text-red-400 font-serif">{error}</div>
  if (!conceptoActual) return null

  const c = conceptoActual
  const nivel = nivelConfig[c.nivelDominio as NivelDominio] ?? nivelConfig.Exposicion
  const evolucionado = c.definicionActual !== c.definicionInicial

  const handleActualizar = async (dto: ActualizarConceptoDto) => {
    await actualizar(c.id, dto)
    setModalEditar(false)
  }

  const handleEliminar = async () => {
    if (confirm(`¿Eliminar el concepto "${c.nombre}"? Esta acción no se puede deshacer.`)) {
      await eliminar(c.id)
      navigate('/conceptos')
    }
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => navigate('/conceptos')} className="text-xs text-ivory-500 hover:text-ivory-300 font-mono transition-colors">
          ← Conceptos
        </button>
        <span className="text-carbon-600 text-xs">/</span>
        <span className="text-xs text-ivory-400 font-mono">{c.nombre}</span>
      </div>

      <Header
        title={c.nombre}
        subtitle={`Nivel: ${nivel.label}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setModalEditar(true)}>
              Editar
            </Button>
            <Button variant="danger" size="sm" onClick={handleEliminar}>
              Eliminar
            </Button>
          </div>
        }
      />

      {/* Nivel visual */}
      <div className="flex items-center gap-2 mb-8">
        {(['Exposicion', 'Comprension', 'Aplicacion', 'Dominio'] as NivelDominio[]).map((n) => (
          <div
            key={n}
            className={[
              'flex-1 h-1.5 rounded-full transition-all',
              n === c.nivelDominio || isNivelAlcanzado(c.nivelDominio as NivelDominio, n)
                ? 'bg-bronze-600'
                : 'bg-carbon-600',
            ].join(' ')}
          />
        ))}
      </div>

      <div className="flex flex-col gap-6">
        {/* Definición actual */}
        <section className="bg-carbon-800 border border-carbon-600 rounded-lg p-5">
          <p className="text-xs text-bronze-500 font-mono uppercase tracking-widest mb-3">
            Definición actual
          </p>
          <p className="text-sm text-ivory-200 font-serif leading-relaxed">{c.definicionActual}</p>
          {c.analogia && (
            <p className="text-sm text-bronze-400 font-serif italic mt-3 pt-3 border-t border-carbon-700">
              "{c.analogia}"
            </p>
          )}
        </section>

        {/* Definición inicial — solo si evolucionó */}
        {evolucionado && (
          <section className="bg-carbon-800/50 border border-carbon-700 rounded-lg p-5">
            <p className="text-xs text-ivory-500 font-mono uppercase tracking-widest mb-3">
              Definición inicial — punto de partida
            </p>
            <p className="text-sm text-ivory-500 font-serif leading-relaxed italic">
              {c.definicionInicial}
            </p>
            <p className="text-xs text-emerald-600 font-mono mt-3">
              ↑ tu comprensión ha evolucionado desde el primer registro
            </p>
          </section>
        )}

        {!evolucionado && (
          <section className="bg-carbon-800/30 border border-carbon-700/50 rounded-lg p-5">
            <p className="text-xs text-ivory-500 font-mono uppercase tracking-widest mb-2">
              Definición inicial
            </p>
            <p className="text-xs text-carbon-500 font-serif italic">
              Igual a la definición actual — actualiza la definición conforme profundices tu comprensión.
            </p>
          </section>
        )}

        {/* Metadata */}
        <section className="flex flex-col gap-2">
          <MetaRow label="Registrado" value={new Date(c.fechaCreacion).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })} />
          {c.fechaUltimaRevision && (
            <MetaRow label="Última revisión" value={new Date(c.fechaUltimaRevision).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })} />
          )}
        </section>
      </div>

      <Modal open={modalEditar} onClose={() => setModalEditar(false)} title="Editar concepto" width="lg">
        <EditarConceptoForm
          concepto={c}
          onSubmit={handleActualizar}
          onCancel={() => setModalEditar(false)}
        />
      </Modal>
    </div>
  )
}

function isNivelAlcanzado(nivelActual: NivelDominio, nivelComparar: NivelDominio): boolean {
  const orden: NivelDominio[] = ['Exposicion', 'Comprension', 'Aplicacion', 'Dominio']
  return orden.indexOf(nivelActual) > orden.indexOf(nivelComparar)
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 text-xs font-mono">
      <span className="text-carbon-500 w-28">{label}</span>
      <span className="text-ivory-400">{value}</span>
    </div>
  )
}
