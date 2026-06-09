import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRevisionesStore } from '@/shared/stores/revisiones.store'
import { LoadingState } from '@/shared/components/feedback/LoadingState'
import Header from '@/shared/components/layout/Header'
import RevisionForm from './RevisionForm'
import type { ContenidoRecuperacion, CompletarRevisionDto } from '@palimpsesto/shared'

export default function RevisionDetalle() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { revisionActual, loading, error, obtenerPorId, completar, omitir } = useRevisionesStore()

  useEffect(() => {
    if (id) obtenerPorId(id)
  }, [id, obtenerPorId])

  if (loading) return <LoadingState message="Cargando revisión..." />
  if (error) return <div className="py-20 text-center text-red-400 font-serif">{error}</div>
  if (!revisionActual) return null

  const r = revisionActual
  const proyecto = (r as any).proyecto

  const handleCompletar = async (contenido: ContenidoRecuperacion) => {
    const dto: CompletarRevisionDto = { contenido }
    await completar(r.id, dto)
  }

  const handleOmitir = async () => {
    await omitir(r.id)
    navigate('/revisiones')
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate('/revisiones')}
          className="text-xs text-ivory-500 hover:text-ivory-300 font-mono transition-colors"
        >
          ← Revisiones
        </button>
        <span className="text-carbon-600 text-xs">/</span>
        <span className="text-xs text-ivory-400 font-mono">
          {proyecto?.nombre ?? 'Proyecto'} +{r.intervalo}d
        </span>
      </div>

      <Header
        title={`Revisión +${r.intervalo} días`}
        subtitle={proyecto?.nombre}
      />

      <RevisionForm
        intervalo={r.intervalo}
        proyectoNombre={proyecto?.nombre ?? ''}
        completado={r.estado === 'Completada'}
        inicial={r.contenido as Partial<ContenidoRecuperacion> | undefined}
        onCompletar={handleCompletar}
        onOmitir={r.estado === 'Pendiente' ? handleOmitir : undefined}
      />
    </div>
  )
}
