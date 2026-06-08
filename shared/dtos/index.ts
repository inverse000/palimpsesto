import type { EstadoProyecto, EstadoFuncionalidad, NivelDominio, TipoEvidencia, RitualContenido, ContenidoRecuperacion } from '../types'

// ─── Proyecto ─────────────────────────────────────────────────────────────────

export interface CrearProyectoDto {
  nombre: string
  descripcion?: string
  fechaInicio?: string
}

export interface ActualizarProyectoDto {
  nombre?: string
  descripcion?: string
  estado?: EstadoProyecto
  fechaInicio?: string
  fechaFinalizacion?: string
}

// ─── Funcionalidad ────────────────────────────────────────────────────────────

export interface CrearFuncionalidadDto {
  nombre: string
  descripcion?: string
}

export interface ActualizarFuncionalidadDto {
  nombre?: string
  descripcion?: string
  estado?: EstadoFuncionalidad
}

// ─── Ritual ───────────────────────────────────────────────────────────────────

export interface ActualizarRitualDto {
  contenido: RitualContenido
}

// ─── Concepto ─────────────────────────────────────────────────────────────────

export interface CrearConceptoDto {
  nombre: string
  definicionInicial: string
  analogia?: string
  nivelDominio?: NivelDominio
}

export interface ActualizarConceptoDto {
  definicionActual?: string
  analogia?: string
  nivelDominio?: NivelDominio
}

// ─── Evidencia ────────────────────────────────────────────────────────────────

export interface CrearEvidenciaDto {
  proyectoId: string
  funcionalidadId?: string
  tipo: TipoEvidencia
  contenido: string
  metadatos?: Record<string, unknown>
}

// ─── Revision ─────────────────────────────────────────────────────────────────

export interface CompletarRevisionDto {
  contenido: ContenidoRecuperacion
}
