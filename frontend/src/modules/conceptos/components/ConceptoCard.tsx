import type { Concepto, NivelDominio } from '@palimpsesto/shared'

interface ConceptoCardProps {
  concepto: Concepto
  onClick: () => void
}

const nivelConfig: Record<NivelDominio, { label: string; color: string; bg: string }> = {
  Exposicion:  { label: 'Exposición',   color: 'text-carbon-400',  bg: 'bg-carbon-700/50' },
  Comprension: { label: 'Comprensión',  color: 'text-sky-400',     bg: 'bg-sky-900/20' },
  Aplicacion:  { label: 'Aplicación',   color: 'text-violet-400',  bg: 'bg-violet-900/20' },
  Dominio:     { label: 'Dominio',      color: 'text-bronze-400',  bg: 'bg-bronze-900/20' },
}

export default function ConceptoCard({ concepto, onClick }: ConceptoCardProps) {
  const nivel = nivelConfig[concepto.nivelDominio as NivelDominio] ?? nivelConfig.Exposicion

  const evolucionado = concepto.definicionActual !== concepto.definicionInicial

  return (
    <button
      onClick={onClick}
      className="text-left w-full bg-carbon-800 hover:bg-carbon-700 border border-carbon-600 hover:border-carbon-500 rounded-lg p-4 transition-all duration-150 group flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-ivory-200 group-hover:text-ivory-100 text-sm transition-colors">
          {concepto.nombre}
        </h3>
        <span className={['text-xs font-mono px-2 py-0.5 rounded shrink-0', nivel.color, nivel.bg].join(' ')}>
          {nivel.label}
        </span>
      </div>

      <p className="text-xs text-ivory-500 font-serif line-clamp-2">
        {concepto.definicionActual}
      </p>

      {concepto.analogia && (
        <p className="text-xs text-bronze-500 font-serif italic line-clamp-1">
          "{concepto.analogia}"
        </p>
      )}

      <div className="flex items-center gap-3 text-xs font-mono text-carbon-500">
        {evolucionado && (
          <span className="text-emerald-600">↑ definición evolucionada</span>
        )}
        {concepto.fechaUltimaRevision && (
          <span>
            revisado {new Date(concepto.fechaUltimaRevision).toLocaleDateString('es-PE')}
          </span>
        )}
      </div>
    </button>
  )
}
