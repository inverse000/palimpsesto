import { useState } from 'react'
import type { ContenidoPostProyecto } from '@palimpsesto/shared'
import { Textarea } from '@/shared/components/ui/Textarea'
import { Button } from '@/shared/components/ui/Button'

interface PostProyectoFormProps {
  inicial?: Partial<ContenidoPostProyecto>
  completado?: boolean
  onGuardar: (contenido: ContenidoPostProyecto) => Promise<void>
  onCompletar: (contenido: ContenidoPostProyecto) => Promise<void>
}

const defaultValues: ContenidoPostProyecto = {
  loQueCreiaSaber: '',
  loQueRealmenteAprendi: '',
  ideasEquivocadas: '',
  vaciosRestantes: '',
  proximosPasos: '',
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-sm text-bronze-400 font-serif tracking-wide border-l-2 border-bronze-600 pl-3">
      {children}
    </label>
  )
}

export default function PostProyectoForm({ inicial, completado, onGuardar, onCompletar }: PostProyectoFormProps) {
  const [form, setForm] = useState<ContenidoPostProyecto>({ ...defaultValues, ...inicial })
  const [saving, setSaving] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGuardar = async () => {
    setSaving(true); setError(null)
    try { await onGuardar(form) }
    catch (err) { setError((err as Error).message) }
    finally { setSaving(false) }
  }

  const handleCompletar = async () => {
    if (!form.loQueRealmenteAprendi.trim()) {
      setError('Debes registrar lo que realmente aprendiste')
      return
    }
    setCompleting(true); setError(null)
    try { await onCompletar(form) }
    catch (err) { setError((err as Error).message) }
    finally { setCompleting(false) }
  }

  const field = (key: keyof ContenidoPostProyecto) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))

  return (
    <div className="flex flex-col gap-6">
      {completado && (
        <div className="bg-emerald-900/20 border border-emerald-800/40 rounded-lg px-4 py-3">
          <p className="text-sm text-emerald-400 font-serif">✓ Ritual completado</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <SectionLabel>Lo que creía saber antes de empezar</SectionLabel>
        <Textarea placeholder="¿Qué suposiciones tenías que resultaron ser incorrectas o incompletas?" value={form.loQueCreiaSaber} onChange={field('loQueCreiaSaber')} rows={3} disabled={completado} />
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel>Lo que realmente aprendí</SectionLabel>
        <Textarea placeholder="El aprendizaje real, no el esperado" value={form.loQueRealmenteAprendi} onChange={field('loQueRealmenteAprendi')} rows={3} disabled={completado} />
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel>Ideas equivocadas que detecté</SectionLabel>
        <Textarea placeholder="¿Qué creencias o supuestos resultaron ser incorrectos?" value={form.ideasEquivocadas} onChange={field('ideasEquivocadas')} rows={3} disabled={completado} />
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel>Vacíos de conocimiento restantes</SectionLabel>
        <Textarea placeholder="¿Qué sigue sin estar claro? ¿Qué dejaste pendiente de entender?" value={form.vaciosRestantes} onChange={field('vaciosRestantes')} rows={2} disabled={completado} />
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel>Próximos pasos</SectionLabel>
        <Textarea placeholder="¿Qué estudiarás o construirás a continuación para seguir creciendo?" value={form.proximosPasos} onChange={field('proximosPasos')} rows={2} disabled={completado} />
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-900/10 border border-red-900/30 rounded px-3 py-2 font-serif">{error}</p>
      )}

      {!completado && (
        <div className="flex justify-end gap-2 pt-2 border-t border-carbon-700">
          <Button variant="ghost" onClick={handleGuardar} loading={saving}>Guardar borrador</Button>
          <Button variant="primary" onClick={handleCompletar} loading={completing}>Completar ritual</Button>
        </div>
      )}
    </div>
  )
}
