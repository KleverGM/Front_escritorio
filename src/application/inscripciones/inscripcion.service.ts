import { authHttp } from "../../infrastructure/http/httpClients";
import type {
  Inscripcion,
  InscripcionDetalle,
  InscripcionFormData,
  InscripcionFiltros,
  ProgresoSeccion,
} from "../../domain/inscripciones/inscripcion.types";

export const inscripcionService = {
  /**
   * Obtener todas las inscripciones (admin)
   */
  getAll: async (filtros?: InscripcionFiltros) => {
    const params: any = { page_size: 100 };
    if (filtros?.curso_id) params.curso_id = filtros.curso_id;
    if (filtros?.usuario_id) params.usuario_id = filtros.usuario_id;
    if (filtros?.completado !== undefined)
      params.completado = filtros.completado;

    const response = await authHttp.get<{
      count: number;
      results: Inscripcion[];
    }>("/inscripciones/", { params });
    return response.data;
  },

  /**
   * Obtener inscripción por ID
   */
  getById: async (id: number) => {
    const response = await authHttp.get<InscripcionDetalle>(
      `/inscripciones/${id}/`,
    );
    return response.data;
  },

  /**
   * Crear nueva inscripción
   */
  create: async (data: InscripcionFormData) => {
    const response = await authHttp.post<Inscripcion>("/inscripciones/", data);
    return response.data;
  },

  /**
   * Inscribirse en un curso (estudiante)
   */
  inscribirse: async (cursoId: number) => {
    const response = await authHttp.post<Inscripcion>(
      `/cursos/${cursoId}/inscribirse/`,
    );
    return response.data;
  },

  /**
   * Actualizar inscripción
   */
  update: async (id: number, data: Partial<Inscripcion>) => {
    const response = await authHttp.patch<Inscripcion>(
      `/inscripciones/${id}/`,
      data,
    );
    return response.data;
  },

  /**
   * Eliminar inscripción (admin)
   */
  delete: async (id: number) => {
    await authHttp.delete(`/inscripciones/${id}/`);
  },

  /**
   * Obtener mis inscripciones (estudiante)
   */
  getMisInscripciones: async () => {
    try {
      const response = await authHttp.get<Inscripcion[]>(
        "/inscripciones/mis_inscripciones/",
      );
      return response.data;
    } catch (err: any) {
      // If the backend doesn't implement the legacy `mis_inscripciones` endpoint,
      // fallback to the generic `/inscripciones/` which normally returns paginated data.
      if (err?.response?.status === 404) {
        const fallback = await authHttp.get<any>("/inscripciones/");
        // support either paginated {count, results} or a direct list
        if (Array.isArray(fallback.data)) return fallback.data as Inscripcion[];
        if (fallback.data && Array.isArray(fallback.data.results)) return fallback.data.results as Inscripcion[];
        return [];
      }
      throw err;
    }
  },

  /**
   * Marcar sección como completada
   */
  marcarSeccionCompletada: async (seccionId: number) => {
    const response = await authHttp.post<ProgresoSeccion>(
      `/secciones/${seccionId}/marcar_completada/`,
    );
    return response.data;
  },

  /**
   * Obtener progreso de un curso
   */
  getProgreso: async (inscripcionId: number) => {
    const response = await authHttp.get<{
      progreso: number;
      secciones_completadas: number;
      total_secciones: number;
    }>(`/inscripciones/${inscripcionId}/progreso/`);
    return response.data;
  },
};
