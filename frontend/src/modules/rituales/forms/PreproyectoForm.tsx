import { useState } from 'react'
import type { ContenidoPreproyecto } from '@palimpsesto/shared'
import { Input } from '@/shared/components/ui/Input'
import { Textarea } from '@/shared/components/ui/Textarea'
import { Button } from '@/shared/components/ui/Button'

interface PreproyectoFormProps {
  inicial?: Partial<ContenidoPreproyecto>
  completado?: boolean
  onGuardar: (contenido: ContenidoPreproyecto) => Promise<void>
  onCompletar: (contenido: ContenidoPreproyecto) => Promise<void>
}

const defaultValues: ContenidoPreproyecto = {
  queQuieroConstruir: '',
  comoCreoQueFunciona: '',
  conceptosEsperados: [],
  vacios: '',
  nivelConfianzaInicial: 5,
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-sm text-bronze-400 font-serif tracking-wide border-l-2 border-bronze-600 pl-3">
      {children}
    </label>
  )
}

export default function PreproyectoForm({ inicial, completado, onGuardar, onCompletar }: PreproyectoFormProps) {
  const [form, setForm] = useState<ContenidoPreproyecto>({ ...defaultValues, ...inicial })
  const [conceptosInput, setConceptosInput] = useState((inicial?.conceptosEsperados ?? []).join(', '))
  const [saving, setSaving] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const buildContenido = (): ContenidoPreproyecto => ({
    ...form,
    conceptosEsperados: conceptosInput.split(',').map((s) => s.trim()).filter(Boolean),
  })

  const handleGuardar = async () => {
    setSaving(true)
    setError(null)
    try { await onGuardar(buildContenido()) }
    catch (err) { setError((err as Error).message) }
    finally { setSaving(false) }
  }

  const handleCompletar = async () => {
    if (!form.queQuieroConstruir.trim()) {
      setError('Debes responder al menos qué quieres construir')
      return
    }
    setCompleting(true)
    setError(null)
    try { await onCompletar(buildContenido()) }
    catch (err) { setError((err as Error).message) }
    finally { setCompleting(false) }
  }

  const field = (key: keyof ContenidoPreproyecto) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))

  return (
    <div className="flex flex-col gap-6">
      {completado && (
        <div className="bg-emerald-900/20 border border-emerald-800/40 rounded-lg px-4 py-3">
          <p className="text-sm text-emerald-400 font-serif">✓ Ritual completado</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <SectionLabel>¿Qué quiero construir?</SectionLabel>
        <Textarea placeholder="Describe con tus propias palabras qué vas a construir" value={form.queQuieroConstruir} onChange={field('queQuieroConstruir')} rows={3} disabled={completado} />
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel>¿Cómo creo que funciona?</SectionLabel>
        <Textarea placeholder="Tu hipótesis técnica antes de investigar" value={form.comoCreoQueFunciona} onChange={field('comoCreoQueFunciona')} rows={3} disabled={completado} />
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel>Conceptos que creo que usaré</SectionLabel>
        <Input placeholder="JWT, middleware, React hooks... (separados por coma)" value={conceptosInput} onChange={(e) => setConceptosInput(e.target.value)} hint="Separa los conceptos con comas" disabled={completado} />
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel>¿Qué no entiendo aún?</SectionLabel>
        <Textarea placeholder="Vacíos de conocimiento que detectas antes de empezar" value={form.vacios} onChange={field('vacios')} rows={2} disabled={completado} />
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel>Nivel de confianza inicial</SectionLabel>
        <div className="flex items-center gap-4">
          <input type="range" min={1} max={10} value={form.nivelConfianzaInicial}
            onChange={(e) => setForm((prev) => ({ ...prev, nivelConfianzaInicial: parseInt(e.target.value) }))}
            disabled={completado} className="flex-1 accent-amber-500" />
          <span className="font-mono text-bronze-400 text-lg w-8 text-center">{form.nivelConfianzaInicial}</span>
          <span className="text-xs text-ivory-500 font-serif">/10</span>
        </div>
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
