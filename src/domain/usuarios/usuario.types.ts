export interface Usuario {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  perfil: "estudiante" | "instructor" | "administrador";
  is_active: boolean;
  fecha_creacion: string;
}

export interface UsuarioDetalle extends Usuario {
  total_cursos_creados?: number;
  total_inscripciones?: number;
  cursos_completados?: number;
}

export interface UsuarioFormData {
  username: string;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  perfil: "estudiante" | "instructor" | "administrador";
  is_active?: boolean;
}

export interface CambiarPasswordData {
  old_password?: string;
  new_password: string;
  confirm_password?: string;
}

export interface UsuarioFiltros {
  perfil?: string;
  is_active?: boolean;
  search?: string;
}

export interface UsuarioEstadisticasCurso {
  id: number;
  titulo: string;
  imagen?: string | null;
}

export interface UsuarioEstadisticas {
  total_cursos_inscritos: number;
  cursos_completados: number;
  progreso_promedio: number;
  total_tiempo_estudiado: number;
  cursos_recientes: UsuarioEstadisticasCurso[];
}

export const PERFILES = [
  { value: "estudiante", label: "Estudiante" },
  { value: "instructor", label: "Instructor" },
  { value: "administrador", label: "Administrador" },
] as const;
