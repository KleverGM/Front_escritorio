export interface Inscripcion {
  id: number;
  usuario: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  curso: {
    id: number;
    titulo: string;
    instructor: {
      first_name: string;
      last_name: string;
      username: string;
    };
  };
  fecha_inscripcion: string;
  progreso: number;
  completado: boolean;
  fecha_completado: string | null;
}

export interface InscripcionDetalle extends Inscripcion {
  secciones_completadas?: number;
  total_secciones?: number;
  tiempo_total_minutos?: number;
}

export interface InscripcionFormData {
  curso_id: number;
  usuario_id: number;
}

export interface InscripcionFiltros {
  curso_id?: number;
  usuario_id?: number;
  completado?: boolean;
}

export interface ProgresoSeccion {
  id: number;
  seccion_id: number;
  completado: boolean;
  fecha_completado: string | null;
  tiempo_visto: number; // segundos
}
