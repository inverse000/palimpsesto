// ─── Enums ────────────────────────────────────────────────────────────────────

export type EstadoProyecto = 'Activo' | 'Pausado' | 'Completado' | 'Archivado'
export type EstadoFuncionalidad = 'Pendiente' | 'EnDesarrollo' | 'Completada'
export type TipoRitual =
  | 'Preproyecto'
  | 'PostFuncionalidad'
  | 'PostProyecto'
  | 'Recuperacion'
  | 'Revision'
export type NivelDominio = 'Exposicion' | 'Comprension' | 'Aplicacion' | 'Dominio'
export type EstadoRevision = 'Pendiente' | 'Completada' | 'Omitida'
export type TipoEvidencia = 'Texto' | 'Imagen' | 'Diagrama' | 'Explicacion' | 'Reflexion'
export type NivelAutonomia = '100_IA' | '75_IA' | '50_IA' | '25_IA' | '0_IA'

// ─── Proyecto ─────────────────────────────────────────────────────────────────

export interface Proyecto {
  id: string
  nombre: string
  descripcion: string | null
  estado: EstadoProyecto
  fechaCreacion: string
  fechaInicio: string | null
  fechaFinalizacion: string | null
  _count?: {
    funcionalidades: number
    rituales: number
    revisiones: number
  }
}

export interface ProyectoDetalle extends Proyecto {
  funcionalidades: Funcionalidad[]
  rituales: Ritual[]
  revisiones: Revision[]
  evidencias: Evidencia[]
}

// ─── Funcionalidad ────────────────────────────────────────────────────────────

export interface Funcionalidad {
  id: string
  proyectoId: string
  nombre: string
  descripcion: string | null
  estado: EstadoFuncionalidad
  fechaCreacion: string
  fechaCompletado: string | null
}

// ─── Ritual ───────────────────────────────────────────────────────────────────

export interface Ritual {
  id: string
  proyectoId: string
  funcionalidadId: string | null
  tipo: TipoRitual
  contenido: RitualContenido
  completado: boolean
  fechaCreacion: string
  fechaCompletado: string | null
}

// Contenido dinámico por tipo de ritual
export interface ContenidoPreproyecto {
  queQuieroConstruir: string
  comoCreoQueFunciona: string
  conceptosEsperados: string[]
  vacios: string
  nivelConfianzaInicial: number // 1-10
}

export interface ContenidoPostFuncionalidad {
  conceptosUtilizados: string[]
  explicacionPropia: string
  modeloMental: string
  erroresEncontrados: string
  queAprendi: string
  posiblesTransferencias: string
  nivelAutonomia: NivelAutonomia
  checklist: {
    explicoConPalabrasPropias: boolean
    registreErrores: boolean
    creeModeloMental: boolean
    identifiqueTransferencias: boolean
    detecteVacios: boolean
  }
}

export interface ContenidoPostProyecto {
  loQueCreiaSaber: string
  loQueRealmenteAprendi: string
  ideasEquivocadas: string
  vaciosRestantes: string
  proximosPasos: string
}

export interface ContenidoRecuperacion {
  recuperacionLibre: string
  conceptosRecordados: string[]
  conceptosOlvidados: string[]
  dificultades: string
  nivelConfianza: number // 1-10
}

export type RitualContenido =
  | ContenidoPreproyecto
  | ContenidoPostFuncionalidad
  | ContenidoPostProyecto
  | ContenidoRecuperacion
  | Record<string, unknown>

// ─── Concepto ─────────────────────────────────────────────────────────────────

export interface Concepto {
  id: string
  nombre: string
  definicionInicial: string
  definicionActual: string
  analogia: string | null
  nivelDominio: NivelDominio
  fechaUltimaRevision: string | null
  fechaCreacion: string
}

// ─── Revision ─────────────────────────────────────────────────────────────────

export interface Revision {
  id: string
  proyectoId: string
  intervalo: number
  fechaProgramada: string
  fechaRealizada: string | null
  estado: EstadoRevision
  contenido: ContenidoRecuperacion | null
  proyecto?: Pick<Proyecto, 'id' | 'nombre'>
}

// ─── Evidencia ────────────────────────────────────────────────────────────────

export interface Evidencia {
  id: string
  proyectoId: string
  funcionalidadId: string | null
  tipo: TipoEvidencia
  contenido: string
  metadatos: Record<string, unknown> | null
  fecha: string
}

// ─── API Response wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  meta?: {
    total?: number
    page?: number
    pageSize?: number
  }
}

export interface ApiError {
  error: {
    code: string
    message: string
    details?: unknown
  }
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardData {
  proyectosActivos: Proyecto[]
  revisionesPendientes: Revision[]
  ritualesPendientes: Ritual[]
  conceptosRecientes: Concepto[]
  stats: {
    totalProyectos: number
    totalConceptos: number
    nivelPromedioConceptos: number
  }
}
