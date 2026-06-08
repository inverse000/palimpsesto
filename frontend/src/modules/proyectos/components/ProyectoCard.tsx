import { useNavigate } from 'react-router-dom'
import type { Proyecto } from '@palimpsesto/shared'
import { Badge, estadoToVariant } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'

interface ProyectoCardProps {
  proyecto: Proyecto
  onArchivar?: (id: string) => void
}

export default function ProyectoCard({ proyecto, onArchivar }: ProyectoCardProps) {
  const navigate = useNavigate()

  const fechaCreacion = new Date(proyecto.fechaCreacion).toLocaleDateString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  return (
    <div className="bg-carbon-800 border border-carbon-600 hover:border-carbon-500 rounded-lg p-5 transition-all duration-150 group flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3
            className="font-display text-ivory-200 group-hover:text-ivory-100 text-base cursor-pointer truncate transition-colors"
            onClick={() => navigate(`/proyectos/${proyecto.id}`)}
          >
            {proyecto.nombre}
          </h3>
          {proyecto.descripcion && (
            <p className="text-xs text-ivory-500 font-serif mt-1 line-clamp-2">
              {proyecto.descripcion}
            </p>
          )}
        </div>
        <Badge variant={estadoToVariant(proyecto.estado)} className="shrink-0">
          {proyecto.estado}
        </Badge>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs font-mono text-ivory-500">
        <span>Creado {fechaCreacion}</span>
        {proyecto._count && (
          <>
            <span className="text-carbon-600">·</span>
            <span>{proyecto._count.funcionalidades} funcionalidades</span>
            <span className="text-carbon-600">·</span>
            <span>{proyecto._count.rituales} rituales</span>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-carbon-700">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/proyectos/${proyecto.id}`)}
          className="text-xs"
        >
          Ver proyecto →
        </Button>
        {proyecto.estado === 'Activo' && onArchivar && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onArchivar(proyecto.id)}
            className="text-xs ml-auto"
          >
            Archivar
          </Button>
        )}
      </div>
    </div>
  )
}
