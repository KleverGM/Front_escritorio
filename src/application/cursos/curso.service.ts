import { authHttp } from "../../infrastructure/http/httpClients";
import type {
  Curso,
  CursoDetalle,
  CursoFormData,
  CursoFiltros,
  CursoEstadisticas,
  EstadisticasGlobales,
} from "../../domain/cursos/curso.types";

export const cursoService = {
  /**
   * Obtener todos los cursos con filtros opcionales
   */
  getAll: async (filtros?: CursoFiltros) => {
    const params: any = { page_size: 100 };
    if (filtros?.categoria) params.categoria = filtros.categoria;
    if (filtros?.nivel) params.nivel = filtros.nivel;
    if (filtros?.search) params.q = filtros.search;
    if (filtros?.activo !== undefined) params.activo = filtros.activo;
    if (filtros?.instructor_id) params.instructor_id = filtros.instructor_id;
    if (filtros?.ordering) params.ordering = filtros.ordering;

    const response = await authHttp.get<{ count: number; results: Curso[] }>(
      "/cursos/",
      { params },
    );
    return response.data;
  },

  /**
   * Obtener curso por ID con detalles completos
   */
  getById: async (id: number) => {
    const response = await authHttp.get<CursoDetalle>(`/cursos/${id}/`);
    return response.data;
  },

  /**
   * Crear nuevo curso
   */
  create: async (data: CursoFormData) => {
    const formData = new FormData();
    formData.append("titulo", data.titulo);
    formData.append("descripcion", data.descripcion);
    formData.append("categoria", data.categoria);
    formData.append("nivel", data.nivel);
    formData.append("precio", data.precio.toString());
    if (data.instructor_id) {
      formData.append("instructor_id", data.instructor_id.toString());
    }
    if (data.imagen) {
      formData.append("imagen", data.imagen);
    }

    const response = await authHttp.post<Curso>("/cursos/", formData);
    return response.data;
  },

  /**
   * Actualizar curso existente
   */
  update: async (id: number, data: Partial<CursoFormData>) => {
    const formData = new FormData();
    if (data.titulo) formData.append("titulo", data.titulo);
    if (data.descripcion) formData.append("descripcion", data.descripcion);
    if (data.categoria) formData.append("categoria", data.categoria);
    if (data.nivel) formData.append("nivel", data.nivel);
    if (data.precio !== undefined)
      formData.append("precio", data.precio.toString());
    if (data.instructor_id) {
      formData.append("instructor_id", data.instructor_id.toString());
    }
    if (data.imagen) {
      formData.append("imagen", data.imagen);
    }

    const response = await authHttp.patch<Curso>(`/cursos/${id}/`, formData);
    return response.data;
  },

  /**
   * Eliminar curso (desactivación lógica)
   */
  delete: async (id: number) => {
    await authHttp.delete(`/cursos/${id}/`);
  },

  /**
   * Activar curso
   */
  activar: async (id: number) => {
    const response = await authHttp.post<Curso>(`/cursos/${id}/activar/`);
    return response.data;
  },

  /**
   * Desactivar curso
   */
  desactivar: async (id: number) => {
    const response = await authHttp.post<Curso>(`/cursos/${id}/desactivar/`);
    return response.data;
  },

  /**
   * Obtener mis cursos (instructor)
   */
  getMisCursos: async () => {
    const response = await authHttp.get<Curso[]>("/cursos/mis_cursos/");
    return response.data;
  },

  /**
   * Obtener cursos en los que estoy inscrito (estudiante)
   */
  getCursosInscritos: async () => {
    const response = await authHttp.get<{ results?: any[] }>("/inscripciones/");
    const inscripciones = (response.data as any)?.results ?? response.data;
    const cursos = Array.isArray(inscripciones)
      ? inscripciones.map((i: any) => i.curso).filter(Boolean)
      : [];
    return cursos as Curso[];
  },

  /**
   * Obtener estadísticas de un curso
   */
  getEstadisticas: async (id: number) => {
    const response = await authHttp.get<CursoEstadisticas>(
      `/cursos/${id}/estadisticas/`,
    );
    return response.data;
  },

  /**
   * Obtener estadísticas globales de la plataforma
   */
  getEstadisticasGlobales: async () => {
    const response = await authHttp.get<EstadisticasGlobales>(
      "/cursos/estadisticas_globales/",
    );
    return response.data;
  },
};
