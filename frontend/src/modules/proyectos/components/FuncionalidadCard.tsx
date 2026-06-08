import { useNavigate } from 'react-router-dom'
import type { Funcionalidad, Ritual } from '@palimpsesto/shared'
import { Button } from '@/shared/components/ui/Button'

interface FuncionalidadCardProps {
  funcionalidad: Funcionalidad
  ritual?: Ritual
  onCambiarEstado: (id: string, estado: 'Pendiente' | 'EnDesarrollo' | 'Completada') => Promise<void>
  onEliminar: (id: string) => Promise<void>
}

const estadoColors: Record<string, string> = {
  Pendiente:    'text-ivory-500 border-carbon-600',
  EnDesarrollo: 'text-amber-400 border-amber-800/50',
  Completada:   'text-emerald-400 border-emerald-800/50',
}

export default function FuncionalidadCard({
  funcionalidad: f,
  ritual,
  onCambiarEstado,
  onEliminar,
}: FuncionalidadCardProps) {
  const navigate = useNavigate()

  const siguienteEstado = () => {
    if (f.estado === 'Pendiente') return 'EnDesarrollo'
    if (f.estado === 'EnDesarrollo') return 'Completada'
    return null
  }

  const next = siguienteEstado()

  return (
    <div className={[
      'bg-carbon-800 border rounded-lg px-4 py-3 flex flex-col gap-3 transition-all',
      estadoColors[f.estado] ?? 'border-carbon-600',
    ].join(' ')}>

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-serif text-ivory-200 truncate">{f.nombre}</p>
          {f.descripcion && (
            <p className="text-xs text-ivory-500 font-serif mt-0.5 line-clamp-1">{f.descripcion}</p>
          )}
        </div>
        <span className={['text-xs font-mono px-2 py-0.5 rounded border shrink-0', estadoColors[f.estado]].join(' ')}>
          {f.estado}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Avanzar estado */}
        {next && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => onCambiarEstado(f.id, next)}
          >
            → {next === 'EnDesarrollo' ? 'Iniciar' : 'Completar'}
          </Button>
        )}

        {/* Ir al ritual PostFuncionalidad */}
        {ritual && (
          <Button
            variant={ritual.completado ? 'ghost' : 'secondary'}
            size="sm"
            className="text-xs"
            onClick={() => navigate(`/rituales/${ritual.id}`)}
          >
            {ritual.completado ? '✓ Ritual completado' : '◈ Completar ritual'}
          </Button>
        )}

        {/* Eliminar */}
        {f.estado === 'Pendiente' && (
          <Button
            variant="danger"
            size="sm"
            className="text-xs ml-auto"
            onClick={() => onEliminar(f.id)}
          >
            Eliminar
          </Button>
        )}
      </div>
    </div>
  )
}
