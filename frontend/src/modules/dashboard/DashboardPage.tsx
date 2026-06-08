import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { DashboardData } from '@palimpsesto/shared'
import { dashboardApi } from '@/shared/api/endpoints/dashboard'
import { LoadingState } from '@/shared/components/feedback/LoadingState'
import Header from '@/shared/components/layout/Header'
import { Badge, estadoToVariant } from '@/shared/components/ui/Badge'

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    dashboardApi.obtener()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingState message="Consultando el archivo..." />
  if (error) return (
    <div className="py-20 text-center text-red-400 font-serif">{error}</div>
  )
  if (!data) return null

  return (
    <div className="animate-fade-in">
      <Header
        title="Archivo"
        subtitle="Estado actual del sistema de conocimiento"
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <StatCard label="Proyectos" value={data.stats.totalProyectos} icon="◫" />
        <StatCard label="Conceptos registrados" value={data.stats.totalConceptos} icon="◉" />
        <StatCard
          label="Revisiones pendientes"
          value={data.revisionesPendientes.length}
          icon="◷"
          highlight={data.revisionesPendientes.length > 0}
        />
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Proyectos activos */}
        <section>
          <SectionTitle>Proyectos activos</SectionTitle>
          {data.proyectosActivos.length === 0 ? (
            <EmptySection message="No hay proyectos activos" />
          ) : (
            <div className="flex flex-col gap-2">
              {data.proyectosActivos.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/proyectos/${p.id}`)}
                  className="text-left w-full bg-carbon-800 hover:bg-carbon-700 border border-carbon-600 hover:border-carbon-500 rounded-lg px-4 py-3 transition-all duration-150 group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-serif text-ivory-200 text-sm group-hover:text-ivory-100 truncate">
                      {p.nombre}
                    </span>
                    <Badge variant={estadoToVariant(p.estado)}>{p.estado}</Badge>
                  </div>
                  {p._count && (
                    <p className="text-xs text-ivory-500 font-mono">
                      {p._count.funcionalidades} funcionalidades · {p._count.rituales} rituales
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Rituales pendientes */}
        <section>
          <SectionTitle>Rituales pendientes</SectionTitle>
          {data.ritualesPendientes.length === 0 ? (
            <EmptySection message="No hay rituales pendientes" />
          ) : (
            <div className="flex flex-col gap-2">
              {data.ritualesPendientes.slice(0, 6).map((r) => (
                <div
                  key={r.id}
                  className="bg-carbon-800 border border-carbon-600 rounded-lg px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-serif text-ivory-300 truncate">
                      {(r as any).proyecto?.nombre ?? 'Proyecto'}
                    </span>
                    <Badge variant="bronze">{r.tipo}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Revisiones pendientes */}
        <section>
          <SectionTitle>Revisiones pendientes</SectionTitle>
          {data.revisionesPendientes.length === 0 ? (
            <EmptySection message="Sin revisiones por ahora" />
          ) : (
            <div className="flex flex-col gap-2">
              {data.revisionesPendientes.map((r) => (
                <div
                  key={r.id}
                  className="bg-carbon-800 border border-amber-900/40 rounded-lg px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-serif text-ivory-300 truncate">
                      {r.proyecto?.nombre ?? 'Proyecto'}
                    </span>
                    <span className="text-xs font-mono text-amber-500">
                      +{r.intervalo}d
                    </span>
                  </div>
                  <p className="text-xs text-ivory-500 font-mono mt-0.5">
                    {new Date(r.fechaProgramada).toLocaleDateString('es-PE')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Conceptos recientes */}
        <section>
          <SectionTitle>Conceptos recientes</SectionTitle>
          {data.conceptosRecientes.length === 0 ? (
            <EmptySection message="No hay conceptos registrados aún" />
          ) : (
            <div className="flex flex-col gap-2">
              {data.conceptosRecientes.map((c) => (
                <div
                  key={c.id}
                  className="bg-carbon-800 border border-carbon-600 rounded-lg px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-serif text-ivory-200">{c.nombre}</span>
                    <NivelBadge nivel={c.nivelDominio} />
                  </div>
                  {c.analogia && (
                    <p className="text-xs text-ivory-500 font-serif italic truncate">
                      "{c.analogia}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, icon, highlight = false }: {
  label: string; value: number; icon: string; highlight?: boolean
}) {
  return (
    <div className={[
      'bg-carbon-800 border rounded-lg px-5 py-4',
      highlight ? 'border-amber-800/50' : 'border-carbon-600',
    ].join(' ')}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-ivory-500 font-mono uppercase tracking-wider">{label}</span>
        <span className="text-carbon-500 text-base">{icon}</span>
      </div>
      <p className={['font-display text-3xl', highlight ? 'text-amber-400' : 'text-ivory-100'].join(' ')}>
        {value}
      </p>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-ivory-400 text-sm uppercase tracking-widest mb-3 pb-2 border-b border-carbon-700">
      {children}
    </h2>
  )
}

function EmptySection({ message }: { message: string }) {
  return (
    <p className="text-xs text-carbon-500 font-serif italic py-4 text-center">{message}</p>
  )
}

function NivelBadge({ nivel }: { nivel: string }) {
  const map: Record<string, string> = {
    Exposicion: 'text-carbon-500 bg-carbon-700/50',
    Comprension: 'text-sky-500 bg-sky-900/20',
    Aplicacion: 'text-violet-400 bg-violet-900/20',
    Dominio: 'text-bronze-400 bg-bronze-900/20',
  }
  return (
    <span className={['text-xs font-mono px-1.5 py-0.5 rounded border border-transparent', map[nivel] ?? ''].join(' ')}>
      {nivel}
    </span>
  )
}
