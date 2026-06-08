import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRitualesStore } from '@/shared/stores/rituales.store'
import { useProyectosStore } from '@/shared/stores/proyectos.store'
import { LoadingState } from '@/shared/components/feedback/LoadingState'
import PreproyectoForm from './forms/PreproyectoForm'
import PostFuncionalidadForm from './forms/PostFuncionalidadForm'
import type { ContenidoPreproyecto, ContenidoPostFuncionalidad, RitualContenido } from '@palimpsesto/shared'

export default function RitualPage() {
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
  const proyectoId = r.proyectoId

  const handleGuardar = async (contenido: RitualContenido) => {
    if (id) await actualizar(id, contenido)
  }

  const handleCompletar = async (contenido: RitualContenido) => {
    if (id) {
      await completar(id, contenido)
      // Refrescar el proyecto para actualizar rituales pendientes
      await obtenerProyecto(proyectoId)
      navigate(`/proyectos/${proyectoId}`)
    }
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate(`/proyectos/${proyectoId}`)}
          className="text-xs text-ivory-500 hover:text-ivory-300 font-mono transition-colors"
        >
          ← Proyecto
        </button>
        <span className="text-carbon-600 text-xs">/</span>
        <span className="text-xs text-ivory-400 font-mono">{r.tipo}</span>
      </div>

      {r.tipo === 'Preproyecto' && (
        <PreproyectoForm
          ritual={r}
          onGuardar={(c) => handleGuardar(c as RitualContenido)}
          onCompletar={(c) => handleCompletar(c as RitualContenido)}
          readOnly={r.completado}
        />
      )}

      {r.tipo === 'PostFuncionalidad' && (
        <PostFuncionalidadForm
          ritual={r}
          funcionalidadNombre={(r as any).funcionalidad?.nombre}
          onGuardar={(c) => handleGuardar(c as RitualContenido)}
          onCompletar={(c) => handleCompletar(c as RitualContenido)}
          readOnly={r.completado}
        />
      )}

      {r.tipo !== 'Preproyecto' && r.tipo !== 'PostFuncionalidad' && (
        <div className="bg-carbon-800 border border-carbon-600 rounded-lg px-6 py-8 text-center">
          <p className="font-display text-ivory-400 text-base mb-2">
            Ritual tipo "{r.tipo}"
          </p>
          <p className="text-sm text-ivory-500 font-serif">
            Este formulario estará disponible en la siguiente iteración.
          </p>
        </div>
      )}
    </div>
  )
}
