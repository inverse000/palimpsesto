import { useState } from 'react'
import type { ContenidoRecuperacion } from '@palimpsesto/shared'
import { Input } from '@/shared/components/ui/Input'
import { Textarea } from '@/shared/components/ui/Textarea'
import { Button } from '@/shared/components/ui/Button'

interface RevisionFormProps {
  intervalo: number
  proyectoNombre: string
  completado?: boolean
  inicial?: Partial<ContenidoRecuperacion>
  onCompletar: (contenido: ContenidoRecuperacion) => Promise<void>
  onOmitir?: () => Promise<void>
}

const defaultValues: ContenidoRecuperacion = {
  recuperacionLibre: '',
  conceptosRecordados: [],
  conceptosOlvidados: [],
  dificultades: '',
  nivelConfianza: 5,
}

function SectionLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <label className="text-sm text-bronze-400 font-serif tracking-wide border-l-2 border-bronze-600 pl-3">
        {children}
      </label>
      {hint && <p className="text-xs text-ivory-500 font-serif pl-3 italic">{hint}</p>}
    </div>
  )
}

export default function RevisionForm({
  intervalo,
  proyectoNombre,
  completado,
  inicial,
  onCompletar,
  onOmitir,
}: RevisionFormProps) {
  const [form, setForm] = useState<ContenidoRecuperacion>({ ...defaultValues, ...inicial })
  const [recordadosInput, setRecordadosInput] = useState((inicial?.conceptosRecordados ?? []).join(', '))
  const [olvidadosInput, setOlvidadosInput] = useState((inicial?.conceptosOlvidados ?? []).join(', '))
  const [completing, setCompleting] = useState(false)
  const [omitting, setOmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const buildContenido = (): ContenidoRecuperacion => ({
    ...form,
    conceptosRecordados: recordadosInput.split(',').map((s) => s.trim()).filter(Boolean),
    conceptosOlvidados: olvidadosInput.split(',').map((s) => s.trim()).filter(Boolean),
  })

  const handleCompletar = async () => {
    if (!form.recuperacionLibre.trim()) {
      setError('La recuperación libre es requerida — escribe todo lo que recuerdes sin consultar notas')
      return
    }
    setCompleting(true); setError(null)
    try { await onCompletar(buildContenido()) }
    catch (err) { setError((err as Error).message) }
    finally { setCompleting(false) }
  }

  const handleOmitir = async () => {
    if (!onOmitir) return
    if (!confirm('¿Omitir esta revisión? Se marcará como omitida.')) return
    setOmitting(true)
    try { await onOmitir() }
    finally { setOmitting(false) }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Context banner */}
      <div className="bg-carbon-800 border border-carbon-700 rounded-lg px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-ivory-500 font-mono">Revisión +{intervalo} días</p>
          <p className="text-sm text-ivory-300 font-serif">{proyectoNombre}</p>
        </div>
        {completado && (
          <span className="text-xs text-emerald-400 font-mono">✓ Completada</span>
        )}
      </div>

      {completado && inicial?.recuperacionLibre && (
        <div className="bg-emerald-900/10 border border-emerald-800/30 rounded-lg px-4 py-3">
          <p className="text-xs text-emerald-500 font-mono mb-2">Registro completado</p>
          <p className="text-sm text-ivory-300 font-serif">{inicial.recuperacionLibre}</p>
        </div>
      )}

      {!completado && (
        <>
          <div className="flex flex-col gap-2">
            <SectionLabel hint="Sin consultar tus notas ni el código — escribe todo lo que recuerdes sobre este proyecto">
              Recuperación libre
            </SectionLabel>
            <Textarea
              placeholder="¿Qué construiste? ¿Cómo funcionaba? ¿Qué conceptos usaste? Escribe sin límites..."
              value={form.recuperacionLibre}
              onChange={(e) => setForm((p) => ({ ...p, recuperacionLibre: e.target.value }))}
              rows={5}
            />
          </div>

          <div className="flex flex-col gap-2">
            <SectionLabel>Conceptos que recuerdo bien</SectionLabel>
            <Input
              placeholder="JWT, middleware, hooks... (separados por coma)"
              value={recordadosInput}
              onChange={(e) => setRecordadosInput(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <SectionLabel>Conceptos que olvidé o confundí</SectionLabel>
            <Input
              placeholder="Conceptos que no recordabas o que confundiste (separados por coma)"
              value={olvidadosInput}
              onChange={(e) => setOlvidadosInput(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <SectionLabel>Dificultades al recordar</SectionLabel>
            <Textarea
              placeholder="¿Qué fue difícil de recordar? ¿Qué te costó más?"
              value={form.dificultades}
              onChange={(e) => setForm((p) => ({ ...p, dificultades: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="flex flex-col gap-2">
            <SectionLabel>Nivel de confianza actual</SectionLabel>
            <div className="flex items-center gap-4">
              <input
                type="range" min={1} max={10}
                value={form.nivelConfianza}
                onChange={(e) => setForm((p) => ({ ...p, nivelConfianza: parseInt(e.target.value) }))}
                className="flex-1 accent-amber-500"
              />
              <span className="font-mono text-bronze-400 text-lg w-8 text-center">{form.nivelConfianza}</span>
              <span className="text-xs text-ivory-500 font-serif">/10</span>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-900/10 border border-red-900/30 rounded px-3 py-2 font-serif">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-carbon-700">
            {onOmitir && (
              <Button variant="ghost" size="sm" onClick={handleOmitir} loading={omitting} className="text-xs text-carbon-500">
                Omitir revisión
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button variant="primary" onClick={handleCompletar} loading={completing}>
                Completar revisión
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
