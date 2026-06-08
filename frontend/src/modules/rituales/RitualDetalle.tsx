import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRitualesStore } from '@/shared/stores/rituales.store'
import { useProyectosStore } from '@/shared/stores/proyectos.store'
import { LoadingState } from '@/shared/components/feedback/LoadingState'
import Header from '@/shared/components/layout/Header'
import PreproyectoForm from './forms/PreproyectoForm'
import PostFuncionalidadForm from './forms/PostFuncionalidadForm'
import PostProyectoForm from './forms/PostProyectoForm'
import type {
  ContenidoPreproyecto,
  ContenidoPostFuncionalidad,
  ContenidoPostProyecto,
} from '@palimpsesto/shared'

export default function RitualDetalle() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { ritualActual, loading, error, obtenerPorId, actualizar, completar } = useRitualesStore()
  const { obtenerPorId: obtenerProyecto } = useProyectosStore()

  useEffect(() => {
    if (id) obtenerPorId(id)
  }, [id, obtenerPorId])

  if (loading) return <LoadingState message="Cargando ritual..." />
  if (error) return <div className="py-20 text-center text-red-400 font-serif">{error}</div>
  if (!ritualActual) return null

  const r = ritualActual
  const contenido = r.contenido as Record<string, unknown>

  const handleGuardar = async (c: Record<string, unknown>) => {
    await actualizar(r.id, c)
  }

  const handleCompletar = async (c: Record<string, unknown>) => {
    await completar(r.id, c)
    // Refrescar el proyecto si está en el store
    await obtenerPorId(r.id)
    if (r.proyectoId) obtenerProyecto(r.proyectoId)
  }

  const tipoLabel: Record<string, string> = {
    Preproyecto: 'Ritual Preproyecto',
    PostFuncionalidad: 'Ritual Post Funcionalidad',
    PostProyecto: 'Ritual Post Proyecto',
    Recuperacion: 'Ritual de Recuperación',
    Revision: 'Ritual de Revisión',
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate(`/proyectos/${r.proyectoId}`)}
          className="text-xs text-ivory-500 hover:text-ivory-300 font-mono transition-colors"
        >
          ← Proyecto
        </button>
        <span className="text-carbon-600 text-xs">/</span>
        <span className="text-xs text-ivory-400 font-mono">{tipoLabel[r.tipo] ?? r.tipo}</span>
      </div>

      <Header
        title={tipoLabel[r.tipo] ?? r.tipo}
        subtitle={r.completado ? 'Completado' : 'Pendiente de completar'}
      />

      {r.tipo === 'Preproyecto' && (
        <PreproyectoForm
          inicial={contenido as Partial<ContenidoPreproyecto>}
          completado={r.completado}
          onGuardar={handleGuardar}
          onCompletar={handleCompletar}
        />
      )}

      {r.tipo === 'PostFuncionalidad' && (
        <PostFuncionalidadForm
          inicial={contenido as Partial<ContenidoPostFuncionalidad>}
          completado={r.completado}
          onGuardar={handleGuardar}
          onCompletar={handleCompletar}
        />
      )}

      {r.tipo === 'PostProyecto' && (
        <PostProyectoForm
          inicial={contenido as Partial<ContenidoPostProyecto>}
          completado={r.completado}
          onGuardar={handleGuardar}
          onCompletar={handleCompletar}
        />
      )}

      {(r.tipo === 'Recuperacion' || r.tipo === 'Revision') && (
        <div className="bg-carbon-800 border border-carbon-600 rounded-lg px-6 py-8 text-center">
          <p className="text-ivory-500 font-serif italic">
            El formulario de {tipoLabel[r.tipo]} estará disponible en la Iteración 3.
          </p>
        </div>
      )}
    </div>
  )
}
