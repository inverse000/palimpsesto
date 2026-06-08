import { useState, FormEvent } from 'react'
import type { CrearFuncionalidadDto } from '@palimpsesto/shared'
import { Input } from '@/shared/components/ui/Input'
import { Textarea } from '@/shared/components/ui/Textarea'
import { Button } from '@/shared/components/ui/Button'

interface FuncionalidadFormProps {
  onSubmit: (dto: CrearFuncionalidadDto) => Promise<void>
  onCancel: () => void
}

export default function FuncionalidadForm({ onSubmit, onCancel }: FuncionalidadFormProps) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) { setError('El nombre es requerido'); return }
    setLoading(true); setError(null)
    try {
      await onSubmit({ nombre: nombre.trim(), descripcion: descripcion.trim() || undefined })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nombre de la funcionalidad"
        placeholder="Ej: Autenticación con JWT"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        autoFocus
      />
      <Textarea
        label="Descripción (opcional)"
        placeholder="¿Qué hace esta funcionalidad?"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        rows={2}
      />
      {error && (
        <p className="text-sm text-red-400 bg-red-900/10 border border-red-900/30 rounded px-3 py-2 font-serif">{error}</p>
      )}
      <div className="flex justify-end gap-2 pt-2 border-t border-carbon-700">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>Cancelar</Button>
        <Button type="submit" variant="primary" loading={loading}>Agregar funcionalidad</Button>
      </div>
    </form>
  )
}
