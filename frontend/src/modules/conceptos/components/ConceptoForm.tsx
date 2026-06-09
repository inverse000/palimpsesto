import { useState, FormEvent } from 'react'
import type { CrearConceptoDto, NivelDominio } from '@palimpsesto/shared'
import { Input } from '@/shared/components/ui/Input'
import { Textarea } from '@/shared/components/ui/Textarea'
import { Button } from '@/shared/components/ui/Button'

interface ConceptoFormProps {
  onSubmit: (dto: CrearConceptoDto) => Promise<void>
  onCancel: () => void
}

const NIVELES: { value: NivelDominio; label: string }[] = [
  { value: 'Exposicion',  label: 'Exposición — lo he visto pero no lo entiendo aún' },
  { value: 'Comprension', label: 'Comprensión — entiendo qué hace y por qué' },
  { value: 'Aplicacion',  label: 'Aplicación — puedo usarlo en proyectos reales' },
  { value: 'Dominio',     label: 'Dominio — puedo enseñarlo y adaptarlo' },
]

export default function ConceptoForm({ onSubmit, onCancel }: ConceptoFormProps) {
  const [nombre, setNombre] = useState('')
  const [definicion, setDefinicion] = useState('')
  const [analogia, setAnalogia] = useState('')
  const [nivel, setNivel] = useState<NivelDominio>('Exposicion')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) { setError('El nombre es requerido'); return }
    if (!definicion.trim()) { setError('La definición inicial es requerida'); return }
    setLoading(true); setError(null)
    try {
      await onSubmit({
        nombre: nombre.trim(),
        definicionInicial: definicion.trim(),
        analogia: analogia.trim() || undefined,
        nivelDominio: nivel,
      })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="Nombre del concepto"
        placeholder="Ej: Middleware, JWT, Closure, ORM..."
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        autoFocus
      />

      <Textarea
        label="Definición inicial"
        placeholder="Con tus propias palabras, ¿qué es este concepto? Esta definición quedará registrada como punto de partida."
        value={definicion}
        onChange={(e) => setDefinicion(e.target.value)}
        rows={3}
        hint="Esta definición no se modifica — representa tu comprensión en el momento del primer registro"
      />

      <Textarea
        label="Analogía (opcional)"
        placeholder="¿Qué imagen mental o comparación te ayuda a recordarlo?"
        value={analogia}
        onChange={(e) => setAnalogia(e.target.value)}
        rows={2}
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm text-ivory-400 font-serif">Nivel de dominio actual</label>
        <div className="flex flex-col gap-1.5">
          {NIVELES.map((n) => (
            <label key={n.value} className="flex items-start gap-3 cursor-pointer group">
              <input
                type="radio"
                name="nivel"
                value={n.value}
                checked={nivel === n.value}
                onChange={() => setNivel(n.value)}
                className="mt-0.5 accent-bronze-500"
              />
              <span className={['text-sm font-serif transition-colors',
                nivel === n.value ? 'text-ivory-200' : 'text-ivory-500 group-hover:text-ivory-400'
              ].join(' ')}>
                {n.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-900/10 border border-red-900/30 rounded px-3 py-2 font-serif">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2 border-t border-carbon-700">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>Cancelar</Button>
        <Button type="submit" variant="primary" loading={loading}>Registrar concepto</Button>
      </div>
    </form>
  )
}
