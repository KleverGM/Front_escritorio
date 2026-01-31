export interface Notificacion {
  id: number;
  usuario_id: number;
  tipo:
    | "inscripcion"
    | "curso_completado"
    | "nueva_seccion"
    | "mensaje"
    | "sistema";
  titulo: string;
  mensaje: string;
  leido: boolean;
  fecha_creacion: string;
  datos_extra?: {
    curso_id?: number;
    inscripcion_id?: number;
    url?: string;
  };
}

export interface NotificacionFormData {
  usuario_id?: number;
  tipo: string;
  titulo: string;
  mensaje: string;
  datos_extra?: any;
}

export interface NotificacionFiltros {
  leido?: boolean;
  tipo?: string;
}
