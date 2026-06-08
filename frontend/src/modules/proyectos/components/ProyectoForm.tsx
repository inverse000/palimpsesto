import { useState, FormEvent } from 'react'
import type { CrearProyectoDto } from '@palimpsesto/shared'
import { Input } from '@/shared/components/ui/Input'
import { Textarea } from '@/shared/components/ui/Textarea'
import { Button } from '@/shared/components/ui/Button'

interface ProyectoFormProps {
  onSubmit: (dto: CrearProyectoDto) => Promise<void>
  onCancel: () => void
}

export default function ProyectoForm({ onSubmit, onCancel }: ProyectoFormProps) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!nombre.trim()) errors.nombre = 'El nombre es requerido'
    if (nombre.length > 200) errors.nombre = 'Máximo 200 caracteres'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setError(null)
    try {
      await onSubmit({
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        fechaInicio: fechaInicio || undefined,
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
        label="Nombre del proyecto"
        placeholder="Ej: API de autenticación con JWT"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        error={fieldErrors.nombre}
        autoFocus
      />

      <Textarea
        label="Descripción (opcional)"
        placeholder="¿Qué vas a construir? ¿Cuál es el contexto?"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        rows={3}
      />

      <Input
        label="Fecha de inicio (opcional)"
        type="date"
        value={fechaInicio}
        onChange={(e) => setFechaInicio(e.target.value)}
      />

      {error && (
        <p className="text-sm text-red-400 font-serif bg-red-900/10 border border-red-900/30 rounded px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2 border-t border-carbon-700">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          Crear proyecto
        </Button>
      </div>
    </form>
  )
}
