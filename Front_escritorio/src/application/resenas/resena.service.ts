import { authHttp } from "../../infrastructure/http/httpClients";
import type {
  Resena,
  ResenaEstadisticas,
  ResenaFormData,
} from "../../domain/resenas/resena.types";

export const resenaService = {
  /**
   * Obtener todas las reseñas (para admin)
   */
  getAll: async (params?: {
    curso_id?: number;
    page?: number;
    page_size?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.curso_id)
      queryParams.append("curso_id", params.curso_id.toString());
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.page_size)
      queryParams.append("page_size", params.page_size.toString());

    const url = `/resenas/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await authHttp.get<{ count: number; results: Resena[] }>(
      url,
    );
    return response.data;
  },

  /**
   * Obtener reseña por ID
   */
  getById: async (id: string) => {
    const response = await authHttp.get<Resena>(`/resenas/${id}/`);
    return response.data;
  },

  /**
   * Crear nueva reseña
   */
  create: async (data: ResenaFormData) => {
    const response = await authHttp.post<Resena>("/resenas/", data);
    return response.data;
  },

  /**
   * Actualizar reseña
   */
  update: async (id: string, data: Partial<ResenaFormData>) => {
    const response = await authHttp.patch<Resena>(`/resenas/${id}/`, data);
    return response.data;
  },

  /**
   * Eliminar reseña (solo admin o autor)
   */
  delete: async (id: string) => {
    await authHttp.delete(`/resenas/${id}/`);
  },

  /**
   * Marcar reseña como útil
   */
  marcarUtil: async (id: string) => {
    const response = await authHttp.post<{
      message: string;
      util_count: number;
    }>(`/resenas/${id}/marcar_util/`);
    return response.data;
  },

  /**
   * Responder a una reseña (solo instructores)
   */
  responder: async (id: string, texto: string) => {
    const response = await authHttp.post<Resena>(`/resenas/${id}/responder/`, {
      texto,
    });
    return response.data;
  },

  /**
   * Obtener mis reseñas
   */
  getMisResenas: async () => {
    const response = await authHttp.get<Resena[]>("/resenas/mis_resenas/");
    return response.data;
  },

  /**
   * Obtener estadísticas de reseñas de un curso
   */
  getEstadisticasCurso: async (cursoId: number) => {
    const response = await authHttp.get<ResenaEstadisticas>(
      `/resenas/estadisticas_curso/?curso_id=${cursoId}`,
    );
    return response.data;
  },
};
