import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProyectosStore } from '@/shared/stores/proyectos.store'
import { funcionalidadesApi } from '@/shared/api/endpoints/funcionalidades'
import { LoadingState } from '@/shared/components/feedback/LoadingState'
import { EmptyState } from '@/shared/components/feedback/EmptyState'
import Header from '@/shared/components/layout/Header'
import { Button } from '@/shared/components/ui/Button'
import { Badge, estadoToVariant } from '@/shared/components/ui/Badge'
import { Modal } from '@/shared/components/ui/Modal'
import FuncionalidadForm from './components/FuncionalidadForm'
import type { Ritual, Funcionalidad, CrearFuncionalidadDto } from '@palimpsesto/shared'

export default function ProyectoDetalle() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { proyectoActual, loading, error, obtenerPorId, actualizar } = useProyectosStore()
  const [modalFuncionalidad, setModalFuncionalidad] = useState(false)
  const [creandoFunc, setCreandoFunc] = useState(false)

  useEffect(() => {
    if (id) obtenerPorId(id)
  }, [id, obtenerPorId])

  if (loading) return <LoadingState message="Cargando proyecto..." />
  if (error) return <div className="py-20 text-center text-red-400 font-serif">{error}</div>
  if (!proyectoActual) return null

  const p = proyectoActual
  const ritualesPendientes = p.rituales.filter((r) => !r.completado)

  const handleCompletar = async () => {
    if (confirm('¿Marcar como completado? Se generarán las 5 revisiones espaciadas.')) {
      await actualizar(p.id, { estado: 'Completado' })
      await obtenerPorId(p.id)
    }
  }

  const handleCrearFuncionalidad = async (dto: CrearFuncionalidadDto) => {
    setCreandoFunc(true)
    try {
      await funcionalidadesApi.crear(p.id, dto)
      await obtenerPorId(p.id)
      setModalFuncionalidad(false)
    } finally {
      setCreandoFunc(false)
    }
  }

  const handleCambiarEstadoFunc = async (funcId: string, estado: string) => {
    await funcionalidadesApi.actualizar(funcId, { estado: estado as any })
    await obtenerPorId(p.id)
  }

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => navigate('/proyectos')} className="text-xs text-ivory-500 hover:text-ivory-300 font-mono transition-colors">
          ← Proyectos
        </button>
        <span className="text-carbon-600 text-xs">/</span>
        <span className="text-xs text-ivory-400 font-mono truncate max-w-xs">{p.nombre}</span>
      </div>

      <Header
        title={p.nombre}
        subtitle={p.descripcion ?? undefined}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant={estadoToVariant(p.estado)}>{p.estado}</Badge>
            {p.estado === 'Activo' && (
              <Button variant="secondary" size="sm" onClick={handleCompletar}>
                Completar proyecto
              </Button>
            )}
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <MetaCard label="Funcionalidades" value={p.funcionalidades.length} />
        <MetaCard label="Rituales pendientes" value={ritualesPendientes.length} highlight={ritualesPendientes.length > 0} />
        <MetaCard label="Revisiones" value={p.revisiones.length} />
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Rituales */}
        <section>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-carbon-700">
            <SectionTitle>Rituales</SectionTitle>
          </div>
          <div className="flex flex-col gap-2">
            {p.rituales.length === 0 ? (
              <EmptySection message="Sin rituales" />
            ) : (
              p.rituales.map((r) => (
                <RitualRow key={r.id} ritual={r} onClick={() => navigate(`/rituales/${r.id}`)} />
              ))
            )}
          </div>
        </section>

        {/* Funcionalidades */}
        <section>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-carbon-700">
            <SectionTitle>Funcionalidades</SectionTitle>
            {p.estado === 'Activo' && (
              <Button variant="ghost" size="sm" onClick={() => setModalFuncionalidad(true)} className="text-xs">
                + Agregar
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {p.funcionalidades.length === 0 ? (
              <EmptyState
                icon="◫"
                title="Sin funcionalidades aún"
                description="Agrega la primera funcionalidad para comenzar el ciclo de aprendizaje"
                action={p.estado === 'Activo' ? { label: '+ Agregar funcionalidad', onClick: () => setModalFuncionalidad(true) } : undefined}
              />
            ) : (
              p.funcionalidades.map((f) => (
                <FuncionalidadRow
                  key={f.id}
                  funcionalidad={f}
                  onCambiarEstado={p.estado === 'Activo' ? handleCambiarEstadoFunc : undefined}
                  onVerRitual={() => {
                    const ritual = p.rituales.find(
                      (r) => r.tipo === 'PostFuncionalidad' && (r as any).funcionalidadId === f.id
                    )
                    if (ritual) navigate(`/rituales/${ritual.id}`)
                  }}
                />
              ))
            )}
          </div>
        </section>

        {/* Revisiones espaciadas */}
        {p.revisiones.length > 0 && (
          <section className="col-span-2">
            <SectionTitle>Revisiones espaciadas</SectionTitle>
            <div className="grid grid-cols-5 gap-2 mt-3">
              {p.revisiones.map((r) => (
                <div
                  key={r.id}
                  className={[
                    'rounded-lg px-3 py-3 border text-center',
                    r.estado === 'Completada' ? 'bg-emerald-900/10 border-emerald-800/30' :
                    r.estado === 'Omitida' ? 'bg-carbon-700/30 border-carbon-600/30' :
                    'bg-amber-900/10 border-amber-800/30',
                  ].join(' ')}
                >
                  <p className="text-xs font-mono text-ivory-500 mb-1">+{r.intervalo}d</p>
                  <p className="text-xs font-mono text-ivory-400">
                    {new Date(r.fechaProgramada).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
                  </p>
                  <p className={['text-xs font-mono mt-1',
                    r.estado === 'Completada' ? 'text-emerald-400' :
                    r.estado === 'Omitida' ? 'text-carbon-500' : 'text-amber-500'
                  ].join(' ')}>
                    {r.estado}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Modal funcionalidad */}
      <Modal open={modalFuncionalidad} onClose={() => setModalFuncionalidad(false)} title="Nueva funcionalidad">
        <FuncionalidadForm
          onSubmit={handleCrearFuncionalidad}
          onCancel={() => setModalFuncionalidad(false)}
        />
      </Modal>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetaCard({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={['bg-carbon-800 border rounded-lg px-4 py-3', highlight ? 'border-amber-800/40' : 'border-carbon-600'].join(' ')}>
      <p className="text-xs text-ivory-500 font-mono uppercase tracking-wider mb-1">{label}</p>
      <p className={['font-display text-2xl', highlight ? 'text-amber-400' : 'text-ivory-100'].join(' ')}>{value}</p>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-ivory-400 text-sm uppercase tracking-widest">{children}</h2>
  )
}

function EmptySection({ message }: { message: string }) {
  return <p className="text-xs text-carbon-500 font-serif italic py-3">{message}</p>
}

function RitualRow({ ritual, onClick }: { ritual: Ritual; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex items-center justify-between gap-2 px-3 py-2.5 rounded border w-full text-left transition-all duration-150',
        ritual.completado
          ? 'bg-carbon-800/50 border-carbon-700/50 opacity-70'
          : 'bg-carbon-800 border-carbon-600 hover:border-bronze-700/50 hover:bg-carbon-700',
      ].join(' ')}
    >
      <div className="flex items-center gap-2">
        <span className={['text-xs', ritual.completado ? 'text-emerald-500' : 'text-amber-500'].join(' ')}>
          {ritual.completado ? '✓' : '○'}
        </span>
        <span className="text-sm font-serif text-ivory-300">{ritual.tipo}</span>
      </div>
      <div className="flex items-center gap-2">
        {ritual.completado && ritual.fechaCompletado && (
          <span className="text-xs font-mono text-ivory-500">
            {new Date(ritual.fechaCompletado).toLocaleDateString('es-PE')}
          </span>
        )}
        {!ritual.completado && (
          <span className="text-xs text-bronze-500 font-mono">Completar →</span>
        )}
      </div>
    </button>
  )
}

function FuncionalidadRow({
  funcionalidad,
  onCambiarEstado,
  onVerRitual,
}: {
  funcionalidad: Funcionalidad
  onCambiarEstado?: (id: string, estado: string) => void
  onVerRitual: () => void
}) {
  const estadoColors: Record<string, string> = {
    Pendiente: 'text-ivory-500',
    EnDesarrollo: 'text-amber-400',
    Completada: 'text-emerald-400',
  }
  const siguienteEstado: Record<string, string> = {
    Pendiente: 'EnDesarrollo',
    EnDesarrollo: 'Completada',
  }

  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2.5 bg-carbon-800 border border-carbon-600 rounded group">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-serif text-ivory-300 truncate">{funcionalidad.nombre}</p>
        {funcionalidad.descripcion && (
          <p className="text-xs text-ivory-500 truncate font-serif">{funcionalidad.descripcion}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={['text-xs font-mono', estadoColors[funcionalidad.estado] ?? 'text-ivory-500'].join(' ')}>
          {funcionalidad.estado}
        </span>
        {onCambiarEstado && funcionalidad.estado !== 'Completada' && (
          <button
            onClick={() => onCambiarEstado(funcionalidad.id, siguienteEstado[funcionalidad.estado])}
            className="text-xs text-bronze-500 hover:text-bronze-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity"
          >
            → {siguienteEstado[funcionalidad.estado]}
          </button>
        )}
        <button
          onClick={onVerRitual}
          className="text-xs text-ivory-500 hover:text-bronze-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity"
          title="Ver ritual PostFuncionalidad"
        >
          ◈
        </button>
      </div>
    </div>
  )
}
