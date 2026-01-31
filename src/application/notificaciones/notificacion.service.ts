import { authHttp } from "../../infrastructure/http/httpClients";
import type {
  Notificacion,
  NotificacionFormData,
  NotificacionFiltros,
} from "../../domain/notificaciones/notificacion.types";

export const notificacionService = {
  /**
   * Obtener todas las notificaciones
   */
  getAll: async (filtros?: NotificacionFiltros) => {
    const params: any = { ordering: "-fecha_creacion" };
    if (filtros?.leido !== undefined) params.leido = filtros.leido;
    if (filtros?.tipo) params.tipo = filtros.tipo;

    const response = await authHttp.get<{
      count: number;
      results: Notificacion[];
    }>("/notificaciones/", { params });
    return response.data;
  },

  /**
   * Obtener notificación por ID
   */
  getById: async (id: number) => {
    const response = await authHttp.get<Notificacion>(`/notificaciones/${id}/`);
    return response.data;
  },

  /**
   * Crear nueva notificación (admin)
   */
  create: async (data: NotificacionFormData) => {
    const response = await authHttp.post<Notificacion>(
      "/notificaciones/",
      data,
    );
    return response.data;
  },

  /**
   * Marcar notificación como leída
   */
  marcarComoLeida: async (id: number) => {
    const response = await authHttp.post<Notificacion>(
      `/notificaciones/${id}/marcar_leida/`,
    );
    return response.data;
  },

  /**
   * Marcar todas las notificaciones como leídas
   */
  marcarTodasLeidas: async () => {
    const response = await authHttp.post(
      "/notificaciones/marcar_todas_leidas/",
    );
    return response.data;
  },

  /**
   * Eliminar notificación
   */
  delete: async (id: number) => {
    await authHttp.delete(`/notificaciones/${id}/`);
  },

  /**
   * Obtener notificaciones no leídas
   */
  getNoLeidas: async () => {
    const response = await authHttp.get<Notificacion[]>("/notificaciones/", {
      params: { leida: false },
    });
    return response.data;
  },

  /**
   * Contar notificaciones no leídas
   */
  contarNoLeidas: async () => {
    const response = await authHttp.get<{ no_leidas: number }>(
      "/notificaciones/contador/",
    );
    return response.data.no_leidas;
  },
};
