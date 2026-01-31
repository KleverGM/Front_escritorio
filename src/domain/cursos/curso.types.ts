export interface Instructor {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Curso {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  nivel: string;
  fecha_creacion: string;
  instructor: Instructor;
  precio: string;
  imagen: string | null;
  activo: boolean;
}

export interface CursoDetalle extends Curso {
  modulos: any[]; // Se define en modulos.types.ts
  total_estudiantes?: number;
  rating_promedio?: number;
  total_resenas?: number;
}

export interface CursoFormData {
  titulo: string;
  descripcion: string;
  categoria: string;
  nivel: string;
  precio: number;
  instructor_id?: number;
  imagen?: File | null;
}

export interface CursoFiltros {
  categoria?: string;
  nivel?: string;
  search?: string;
  activo?: boolean;
  instructor_id?: number;
  ordering?: string;
}

export interface CursoEstadisticas {
  total_estudiantes: number;
  total_inscripciones: number;
  tasa_completado: number;
  rating_promedio: number;
  total_resenas: number;
  ingresos_total: number;
  estudiantes_activos: number;
  progreso_promedio: number;
}

export interface EstadisticasGlobales {
  total_cursos: number;
  total_estudiantes: number;
  total_instructores: number;
  total_inscripciones: number;
  cursos_activos: number;
  nuevos_estudiantes_mes: number;
  ingresos_totales: number;
  cursos_populares: Array<{
    id: number;
    titulo: string;
    instructor: string;
    num_inscripciones: number;
    imagen: string | null;
  }>;
}

// Categorías y niveles disponibles
export const CATEGORIAS = [
  { value: "programacion", label: "Programación" },
  { value: "diseño", label: "Diseño" },
  { value: "marketing", label: "Marketing" },
  { value: "negocios", label: "Negocios" },
  { value: "idiomas", label: "Idiomas" },
  { value: "musica", label: "Música" },
  { value: "fotografia", label: "Fotografía" },
  { value: "otros", label: "Otros" },
] as const;

export const NIVELES = [
  { value: "principiante", label: "Principiante" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
] as const;
