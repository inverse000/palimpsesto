type BadgeVariant = 'activo' | 'pausado' | 'completado' | 'archivado' | 'pendiente' | 'omitida' | 'bronze' | 'default'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  activo:     'bg-emerald-900/30 text-emerald-400 border-emerald-800/50',
  pausado:    'bg-amber-900/30 text-amber-400 border-amber-800/50',
  completado: 'bg-blue-900/30 text-blue-400 border-blue-800/50',
  archivado:  'bg-carbon-600/40 text-ivory-500 border-carbon-600/60',
  pendiente:  'bg-amber-900/20 text-amber-500 border-amber-800/30',
  omitida:    'bg-carbon-600/30 text-ivory-500 border-carbon-500/40',
  bronze:     'bg-bronze-900/30 text-bronze-400 border-bronze-700/50',
  default:    'bg-carbon-700/50 text-ivory-400 border-carbon-600/60',
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}

// Helper para mapear estado de proyecto a variant
export function estadoToVariant(estado: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    Activo: 'activo',
    Pausado: 'pausado',
    Completado: 'completado',
    Archivado: 'archivado',
    Pendiente: 'pendiente',
    Omitida: 'omitida',
  }
  return map[estado] ?? 'default'
}
