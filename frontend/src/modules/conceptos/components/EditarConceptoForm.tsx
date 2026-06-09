import { useState } from 'react'
import type { Concepto, NivelDominio, ActualizarConceptoDto } from '@palimpsesto/shared'
import { Textarea } from '@/shared/components/ui/Textarea'
import { Button } from '@/shared/components/ui/Button'

interface EditarConceptoFormProps {
  concepto: Concepto
  onSubmit: (dto: ActualizarConceptoDto) => Promise<void>
  onCancel: () => void
}

const NIVELES: { value: NivelDominio; label: string; color: string }[] = [
  { value: 'Exposicion',  label: 'Exposición',   color: 'text-carbon-400' },
  { value: 'Comprension', label: 'Comprensión',  color: 'text-sky-400' },
  { value: 'Aplicacion',  label: 'Aplicación',   color: 'text-violet-400' },
  { value: 'Dominio',     label: 'Dominio',      color: 'text-bronze-400' },
]

export default function EditarConceptoForm({ concepto, onSubmit, onCancel }: EditarConceptoFormProps) {
  const [definicion, setDefinicion] = useState(concepto.definicionActual)
  const [analogia, setAnalogia] = useState(concepto.analogia ?? '')
  const [nivel, setNivel] = useState<NivelDominio>(concepto.nivelDominio as NivelDominio)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!definicion.trim()) { setError('La definición no puede estar vacía'); return }
    setLoading(true); setError(null)
    try {
      await onSubmit({
        definicionActual: definicion.trim(),
        analogia: analogia.trim() || null,
        nivelDominio: nivel,
      })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <Textarea
        label="Definición actual"
        value={definicion}
        onChange={(e) => setDefinicion(e.target.value)}
        rows={4}
        hint="Actualiza tu comprensión del concepto. La definición inicial se conserva como referencia histórica."
      />

      <Textarea
        label="Analogía"
        value={analogia}
        onChange={(e) => setAnalogia(e.target.value)}
        rows={2}
        hint="Opcional — imagen mental que facilita recordarlo"
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm text-ivory-400 font-serif">Nivel de dominio</label>
        <div className="grid grid-cols-2 gap-2">
          {NIVELES.map((n) => (
            <button
              key={n.value}
              type="button"
              onClick={() => setNivel(n.value)}
              className={[
                'px-3 py-2 rounded border text-left text-sm font-serif transition-all duration-150',
                nivel === n.value
                  ? 'bg-carbon-600 border-bronze-700/60 ' + n.color
                  : 'bg-carbon-800 border-carbon-600 text-ivory-500 hover:border-carbon-500',
              ].join(' ')}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-900/10 border border-red-900/30 rounded px-3 py-2 font-serif">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2 border-t border-carbon-700">
        <Button variant="ghost" onClick={onCancel} disabled={loading}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit} loading={loading}>Guardar cambios</Button>
      </div>
    </div>
  )
}
