import { authHttp } from "../../infrastructure/http/httpClients";
import type {
  Modulo,
  Seccion,
  ModuloFormData,
  SeccionFormData,
} from "../../domain/modulos/modulo.types";

export const moduloService = {
  /**
   * Obtener todos los módulos de un curso
   */
  getByCursoId: async (cursoId: number) => {
    const response = await authHttp.get<Modulo[]>(`/modulos/`, {
      params: { curso: cursoId },
    });
    return response.data;
  },

  /**
   * Obtener módulo por ID
   */
  getById: async (id: number) => {
    const response = await authHttp.get<Modulo>(`/modulos/${id}/`);
    return response.data;
  },

  /**
   * Crear nuevo módulo
   */
  create: async (data: ModuloFormData) => {
    const response = await authHttp.post<Modulo>("/modulos/", data);
    return response.data;
  },

  /**
   * Actualizar módulo
   */
  update: async (id: number, data: Partial<ModuloFormData>) => {
    const response = await authHttp.patch<Modulo>(`/modulos/${id}/`, data);
    return response.data;
  },

  /**
   * Eliminar módulo
   */
  delete: async (id: number) => {
    await authHttp.delete(`/modulos/${id}/`);
  },

  // Nota: no hay endpoint de reordenamiento en el backend.
};

export const seccionService = {
  /**
   * Obtener todas las secciones de un módulo
   */
  getByModuloId: async (moduloId: number) => {
    const response = await authHttp.get<Seccion[]>(`/secciones/`, {
      params: { modulo: moduloId },
    });
    return response.data;
  },

  /**
   * Obtener sección por ID
   */
  getById: async (id: number) => {
    const response = await authHttp.get<Seccion>(`/secciones/${id}/`);
    return response.data;
  },

  /**
   * Crear nueva sección
   */
  create: async (data: SeccionFormData) => {
    const formData = new FormData();
    formData.append("titulo", data.titulo);
    formData.append("contenido", data.contenido);
    formData.append("orden", data.orden.toString());
    formData.append("modulo", data.modulo.toString());
    formData.append("duracion_minutos", data.duracion_minutos.toString());

    if (data.video_url) formData.append("video_url", data.video_url);
    if (data.video_file) formData.append("video_file", data.video_file);
    if (data.archivo) formData.append("archivo", data.archivo);
    if (data.es_preview !== undefined)
      formData.append("es_preview", data.es_preview.toString());

    const response = await authHttp.post<Seccion>("/secciones/", formData);
    return response.data;
  },

  /**
   * Actualizar sección
   */
  update: async (id: number, data: Partial<SeccionFormData>) => {
    const formData = new FormData();
    if (data.titulo) formData.append("titulo", data.titulo);
    if (data.contenido) formData.append("contenido", data.contenido);
    if (data.orden !== undefined)
      formData.append("orden", data.orden.toString());
    if (data.duracion_minutos !== undefined)
      formData.append("duracion_minutos", data.duracion_minutos.toString());
    if (data.video_url) formData.append("video_url", data.video_url);
    if (data.video_file) formData.append("video_file", data.video_file);
    if (data.archivo) formData.append("archivo", data.archivo);
    if (data.es_preview !== undefined)
      formData.append("es_preview", data.es_preview.toString());

    const response = await authHttp.patch<Seccion>(
      `/secciones/${id}/`,
      formData,
    );
    return response.data;
  },

  /**
   * Eliminar sección
   */
  delete: async (id: number) => {
    await authHttp.delete(`/secciones/${id}/`);
  },

  // Nota: no hay endpoint de reordenamiento en el backend.
};
