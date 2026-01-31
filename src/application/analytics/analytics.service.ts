import { authHttp } from "../../infrastructure/http/httpClients";
import type {
  EventoAnalytics,
  EventoFormData,
  EstadisticasActividad,
} from "../../domain/analytics/analytics.types";

export const analyticsService = {
  /**
   * Registrar un evento de analytics
   */
  registrarEvento: async (data: EventoFormData) => {
    const response = await authHttp.post<EventoAnalytics>(
      "/analytics/eventos/",
      data,
    );
    return response.data;
  },

  /**
   * Obtener estadísticas de actividad
   */
  getEstadisticasActividad: async () => {
    const response = await authHttp.get<EstadisticasActividad>(
      "/analytics/eventos/estadisticas/",
    );
    return response.data;
  },

  /**
   * Obtener eventos por usuario
   */
  getEventosPorUsuario: async (usuarioId: number, params?: any) => {
    const response = await authHttp.get<EventoAnalytics[]>(
      `/analytics/eventos/`,
      {
        params: { usuario_id: usuarioId, ...params },
      },
    );
    return response.data;
  },

  /**
   * Obtener eventos por curso
   */
  getEventosPorCurso: async (cursoId: number, params?: any) => {
    const response = await authHttp.get<EventoAnalytics[]>(
      `/analytics/eventos/`,
      {
        params: { curso_id: cursoId, ...params },
      },
    );
    return response.data;
  },

  /**
   * Track de visualización de página
   */
  trackPageView: async (pagina: string, datos?: any) => {
    return analyticsService.registrarEvento({
      tipo_evento: "page_view",
      datos_extra: { pagina, ...datos },
    });
  },

  /**
   * Track de reproducción de video
   */
  trackVideoPlay: async (seccionId: number, cursoId: number, datos?: any) => {
    return analyticsService.registrarEvento({
      tipo_evento: "video_play",
      seccion_id: seccionId,
      curso_id: cursoId,
      datos_extra: datos,
    });
  },

  /**
   * Track de completado de sección
   */
  trackSeccionCompletada: async (
    seccionId: number,
    cursoId: number,
    datos?: any,
  ) => {
    return analyticsService.registrarEvento({
      tipo_evento: "seccion_completada",
      seccion_id: seccionId,
      curso_id: cursoId,
      datos_extra: datos,
    });
  },
};
