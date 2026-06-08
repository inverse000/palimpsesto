import { useState } from 'react'
import type { ContenidoPostFuncionalidad, NivelAutonomia } from '@palimpsesto/shared'
import { Input } from '@/shared/components/ui/Input'
import { Textarea } from '@/shared/components/ui/Textarea'
import { Button } from '@/shared/components/ui/Button'

interface PostFuncionalidadFormProps {
  inicial?: Partial<ContenidoPostFuncionalidad>
  completado?: boolean
  onGuardar: (contenido: ContenidoPostFuncionalidad) => Promise<void>
  onCompletar: (contenido: ContenidoPostFuncionalidad) => Promise<void>
}

const NIVELES_AUTONOMIA: { value: NivelAutonomia; label: string; desc: string }[] = [
  { value: '100_IA', label: '100% IA', desc: 'La IA escribió todo' },
  { value: '75_IA',  label: '75% IA',  desc: 'La IA escribió la mayor parte' },
  { value: '50_IA',  label: '50% IA',  desc: 'Mitad y mitad' },
  { value: '25_IA',  label: '25% IA',  desc: 'Mayormente tú' },
  { value: '0_IA',   label: '0% IA',   desc: 'Completamente tú' },
]

const defaultValues: ContenidoPostFuncionalidad = {
  conceptosUtilizados: [],
  explicacionPropia: '',
  modeloMental: '',
  erroresEncontrados: '',
  queAprendi: '',
  posiblesTransferencias: '',
  nivelAutonomia: '50_IA',
  checklist: {
    explicoConPalabrasPropias: false,
    registreErrores: false,
    creeModeloMental: false,
    identifiqueTransferencias: false,
    detecteVacios: false,
  },
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-sm text-bronze-400 font-serif tracking-wide border-l-2 border-bronze-600 pl-3">
      {children}
    </label>
  )
}

export default function PostFuncionalidadForm({ inicial, completado, onGuardar, onCompletar }: PostFuncionalidadFormProps) {
  const [form, setForm] = useState<ContenidoPostFuncionalidad>({ ...defaultValues, ...inicial })
  const [conceptosInput, setConceptosInput] = useState((inicial?.conceptosUtilizados ?? []).join(', '))
  const [saving, setSaving] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const buildContenido = (): ContenidoPostFuncionalidad => ({
    ...form,
    conceptosUtilizados: conceptosInput.split(',').map((s) => s.trim()).filter(Boolean),
  })

  const handleGuardar = async () => {
    setSaving(true); setError(null)
    try { await onGuardar(buildContenido()) }
    catch (err) { setError((err as Error).message) }
    finally { setSaving(false) }
  }

  const handleCompletar = async () => {
    if (!form.explicacionPropia.trim()) {
      setError('La explicación propia es requerida para completar el ritual')
      return
    }
    setCompleting(true); setError(null)
    try { await onCompletar(buildContenido()) }
    catch (err) { setError((err as Error).message) }
    finally { setCompleting(false) }
  }

  const field = (key: keyof ContenidoPostFuncionalidad) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const toggleCheck = (key: keyof ContenidoPostFuncionalidad['checklist']) =>
    setForm((prev) => ({
      ...prev,
      checklist: { ...prev.checklist, [key]: !prev.checklist[key] },
    }))

  return (
    <div className="flex flex-col gap-6">
      {completado && (
        <div className="bg-emerald-900/20 border border-emerald-800/40 rounded-lg px-4 py-3">
          <p className="text-sm text-emerald-400 font-serif">✓ Ritual completado</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <SectionLabel>Conceptos utilizados</SectionLabel>
        <Input placeholder="JWT, useState, Prisma ORM... (separados por coma)" value={conceptosInput} onChange={(e) => setConceptosInput(e.target.value)} disabled={completado} />
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel>Explicación propia</SectionLabel>
        <Textarea placeholder="Explica con tus palabras cómo funciona lo que construiste. Como si se lo explicaras a alguien que no lo conoce." value={form.explicacionPropia} onChange={field('explicacionPropia')} rows={4} disabled={completado} />
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel>Modelo mental</SectionLabel>
        <Textarea placeholder="¿Qué analogía o imagen mental te ayuda a entender este concepto?" value={form.modeloMental} onChange={field('modeloMental')} rows={3} disabled={completado} />
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel>Errores encontrados</SectionLabel>
        <Textarea placeholder="¿Qué errores tuviste? ¿Cómo los resolviste?" value={form.erroresEncontrados} onChange={field('erroresEncontrados')} rows={3} disabled={completado} />
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel>¿Qué aprendí?</SectionLabel>
        <Textarea placeholder="El aprendizaje más importante de esta funcionalidad" value={form.queAprendi} onChange={field('queAprendi')} rows={2} disabled={completado} />
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel>Posibles transferencias</SectionLabel>
        <Textarea placeholder="¿Dónde más podrías aplicar esto? ¿Qué otros problemas resuelve?" value={form.posiblesTransferencias} onChange={field('posiblesTransferencias')} rows={2} disabled={completado} />
      </div>

      {/* Nivel de autonomía */}
      <div className="flex flex-col gap-3">
        <SectionLabel>Nivel de autonomía</SectionLabel>
        <div className="grid grid-cols-5 gap-2">
          {NIVELES_AUTONOMIA.map((n) => (
            <button
              key={n.value}
              type="button"
              disabled={completado}
              onClick={() => setForm((prev) => ({ ...prev, nivelAutonomia: n.value }))}
              className={[
                'flex flex-col items-center gap-1 px-2 py-3 rounded border text-center transition-all duration-150',
                form.nivelAutonomia === n.value
                  ? 'bg-bronze-900/40 border-bronze-600 text-bronze-300'
                  : 'bg-carbon-800 border-carbon-600 text-ivory-500 hover:border-carbon-500',
                completado ? 'cursor-default' : 'cursor-pointer',
              ].join(' ')}
            >
              <span className="text-xs font-mono font-bold">{n.label}</span>
              <span className="text-xs text-ivory-500 font-serif">{n.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="flex flex-col gap-3">
        <SectionLabel>Checklist de autoevaluación</SectionLabel>
        <div className="flex flex-col gap-2 bg-carbon-800 rounded-lg border border-carbon-600 px-4 py-3">
          {([
            ['explicoConPalabrasPropias', 'Expliqué el concepto con mis propias palabras'],
            ['registreErrores', 'Registré los errores encontrados'],
            ['creeModeloMental', 'Creé un modelo mental'],
            ['identifiqueTransferencias', 'Identifiqué posibles transferencias'],
            ['detecteVacios', 'Detecté vacíos de conocimiento restantes'],
          ] as [keyof ContenidoPostFuncionalidad['checklist'], string][]).map(([key, label]) => (
            <label key={key} className={['flex items-center gap-3 cursor-pointer', completado ? 'cursor-default' : ''].join(' ')}>
              <input
                type="checkbox"
                checked={form.checklist[key]}
                onChange={() => !completado && toggleCheck(key)}
                disabled={completado}
                className="accent-bronze-500 w-4 h-4"
              />
              <span className={['text-sm font-serif', form.checklist[key] ? 'text-ivory-300' : 'text-ivory-500'].join(' ')}>
                {label}
              </span>
            </label>
          ))}
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
