import { authHttp } from "../../infrastructure/http/httpClients";
import type {
  Aviso,
  AvisoFormData,
  AvisoFiltros,
} from "../../domain/avisos/aviso.types";

export const avisoService = {
  /**
   * Obtener todos los avisos
   */
  getAll: async (filtros?: AvisoFiltros) => {
    const params: any = { ordering: "-fecha_creacion" };
    if (filtros?.leido !== undefined) params.leido = filtros.leido;
    if (filtros?.tipo) params.tipo = filtros.tipo;

    const response = await authHttp.get<{ count: number; results: Aviso[] }>(
      "/avisos/",
      { params },
    );
    return response.data;
  },

  /**
   * Obtener aviso por ID
   */
  getById: async (id: number) => {
    const response = await authHttp.get<Aviso>(`/avisos/${id}/`);
    return response.data;
  },

  /**
   * Crear nuevo aviso
   */
  create: async (data: AvisoFormData) => {
    const response = await authHttp.post<Aviso>("/avisos/", data);
    return response.data;
  },

  /**
   * Actualizar aviso
   */
  update: async (id: number, data: Partial<AvisoFormData>) => {
    const response = await authHttp.patch<Aviso>(`/avisos/${id}/`, data);
    return response.data;
  },

  /**
   * Eliminar aviso
   */
  delete: async (id: number) => {
    await authHttp.delete(`/avisos/${id}/`);
  },

  /**
   * Marcar aviso como leído
   */
  marcarComoLeido: async (id: number) => {
    const response = await authHttp.patch<Aviso>(`/avisos/${id}/`, {
      leido: true,
    });
    return response.data;
  },

  /**
   * Marcar todos los avisos como leídos
   */
  marcarTodosLeidos: async () => {
    const res = await authHttp.get<{ count: number; results: Aviso[] }>(
      "/avisos/",
      { params: { leido: false, page_size: 1000 } },
    );
    const items = res.data?.results ?? [];
    await Promise.all(
      items.map((aviso) =>
        authHttp.patch(`/avisos/${aviso.id}/`, { leido: true }),
      ),
    );
    return { total: items.length };
  },

  /**
   * Obtener avisos no leídos
   */
  getNoLeidos: async () => {
    const response = await authHttp.get<Aviso[]>("/avisos/", {
      params: { leido: false },
    });
    return response.data;
  },
};
