import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRevisionesStore } from '@/shared/stores/revisiones.store'
import { LoadingState, SkeletonCard } from '@/shared/components/feedback/LoadingState'
import { EmptyState } from '@/shared/components/feedback/EmptyState'
import Header from '@/shared/components/layout/Header'
import type { Revision } from '@palimpsesto/shared'

type Filtro = 'Pendiente' | 'Completada' | 'Omitida' | 'Todos'

const FILTROS: { value: Filtro; label: string }[] = [
  { value: 'Todos',      label: 'Todas' },
  { value: 'Pendiente',  label: 'Pendientes' },
  { value: 'Completada', label: 'Completadas' },
  { value: 'Omitida',    label: 'Omitidas' },
]

export default function RevisionesPage() {
  const { revisiones, loading, error, listar } = useRevisionesStore()
  const [filtro, setFiltro] = useState<Filtro>('Pendiente')
  const navigate = useNavigate()

  useEffect(() => { listar() }, [listar])

  const ahora = new Date()

  const revisionesFiltradas = revisiones.filter((r) =>
    filtro === 'Todos' ? true : r.estado === filtro
  )

  const pendientesVencidas = revisiones.filter(
    (r) => r.estado === 'Pendiente' && new Date(r.fechaProgramada) <= ahora
  )

  return (
    <div className="animate-fade-in">
      <Header
        title="Revisiones"
        subtitle="Sistema de repetición espaciada — 1 · 7 · 21 · 60 · 120 días"
      />

      {/* Alerta si hay pendientes vencidas */}
      {pendientesVencidas.length > 0 && filtro !== 'Pendiente' && (
        <div
          className="bg-amber-900/20 border border-amber-800/40 rounded-lg px-4 py-3 mb-6 flex items-center justify-between cursor-pointer hover:border-amber-700/60 transition-colors"
          onClick={() => setFiltro('Pendiente')}
        >
          <p className="text-sm text-amber-400 font-serif">
            {pendientesVencidas.length} revisión{pendientesVencidas.length > 1 ? 'es' : ''} pendiente{pendientesVencidas.length > 1 ? 's' : ''} de completar
          </p>
          <span className="text-xs text-amber-500 font-mono">Ver →</span>
        </div>
      )}

      {/* Filtros */}
      <div className="flex items-center gap-2 mb-6">
        {FILTROS.map((f) => {
          const count = f.value === 'Todos'
            ? revisiones.length
            : revisiones.filter((r) => r.estado === f.value).length
          return (
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
              {f.label} {count > 0 ? `(${count})` : ''}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {loading && revisiones.length === 0 ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
        </div>
      ) : error ? (
        <div className="py-20 text-center text-red-400 font-serif text-sm">{error}</div>
      ) : revisionesFiltradas.length === 0 ? (
        <EmptyState
          icon="◷"
          title={filtro === 'Pendiente' ? 'Sin revisiones pendientes' : `Sin revisiones en estado "${filtro}"`}
          description={filtro === 'Pendiente' ? 'Las revisiones se generan automáticamente al completar un proyecto.' : undefined}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {revisionesFiltradas.map((r) => (
            <RevisionRow
              key={r.id}
              revision={r}
              ahora={ahora}
              onClick={() => navigate(`/revisiones/${r.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function RevisionRow({
  revision: r,
  ahora,
  onClick,
}: {
  revision: Revision
  ahora: Date
  onClick: () => void
}) {
  const fecha = new Date(r.fechaProgramada)
  const vencida = r.estado === 'Pendiente' && fecha <= ahora
  const proxima = r.estado === 'Pendiente' && fecha > ahora

  return (
    <button
      onClick={onClick}
      className={[
        'w-full text-left flex items-center justify-between gap-4 px-5 py-4 rounded-lg border transition-all duration-150',
        vencida
          ? 'bg-amber-900/10 border-amber-800/40 hover:border-amber-700/60'
          : proxima
          ? 'bg-carbon-800 border-carbon-600 hover:border-carbon-500'
          : r.estado === 'Completada'
          ? 'bg-carbon-800/50 border-carbon-700/50 opacity-70'
          : 'bg-carbon-800/30 border-carbon-700/30 opacity-50',
      ].join(' ')}
    >
      <div className="flex items-center gap-4">
        {/* Intervalo */}
        <div className="text-center w-12 shrink-0">
          <p className={['font-display text-xl', vencida ? 'text-amber-400' : 'text-ivory-300'].join(' ')}>
            +{r.intervalo}
          </p>
          <p className="text-xs text-ivory-500 font-mono">días</p>
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-serif text-ivory-200">
            {(r as any).proyecto?.nombre ?? 'Proyecto'}
          </p>
          <p className="text-xs font-mono text-ivory-500">
            {fecha.toLocaleDateString('es-PE', { weekday: 'long', day: '2-digit', month: 'long' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <EstadoTag estado={r.estado} vencida={vencida} />
        {(vencida || proxima) && (
          <span className="text-xs font-mono text-ivory-500">Ver →</span>
        )}
      </div>
    </button>
  )
}

function EstadoTag({ estado, vencida }: { estado: string; vencida: boolean }) {
  if (estado === 'Completada') return <span className="text-xs font-mono text-emerald-400">✓ Completada</span>
  if (estado === 'Omitida') return <span className="text-xs font-mono text-carbon-500">Omitida</span>
  if (vencida) return <span className="text-xs font-mono text-amber-400 animate-pulse">● Pendiente</span>
  return <span className="text-xs font-mono text-ivory-500">Próxima</span>
}
