import { authHttp } from "../../infrastructure/http/httpClients";
import type {
  Usuario,
  UsuarioDetalle,
  UsuarioFormData,
  CambiarPasswordData,
  UsuarioFiltros,
  UsuarioEstadisticas,
} from "../../domain/usuarios/usuario.types";

export const usuarioService = {
  /**
   * Obtener todos los usuarios (admin)
   */
  getAll: async (filtros?: UsuarioFiltros) => {
    const params: any = { page_size: 100 };
    if (filtros?.perfil) params.perfil = filtros.perfil;
    if (filtros?.is_active !== undefined) params.is_active = filtros.is_active;
    if (filtros?.search) params.search = filtros.search;

    const response = await authHttp.get<{ count: number; results: Usuario[] }>(
      "/users/",
      { params },
    );
    return response.data;
  },

  /**
   * Obtener usuario por ID
   */
  getById: async (id: number) => {
    const response = await authHttp.get<UsuarioDetalle>(`/users/${id}/`);
    return response.data;
  },

  /**
   * Obtener perfil del usuario actual
   */
  getProfile: async () => {
    const response = await authHttp.get<UsuarioDetalle>("/users/perfil/");
    return response.data;
  },

  /**
   * Obtener estadísticas del usuario actual
   */
  getEstadisticas: async () => {
    const response = await authHttp.get<UsuarioEstadisticas>(
      "/users/estadisticas/",
    );
    return response.data;
  },

  /**
   * Crear nuevo usuario (admin)
   */
  create: async (data: UsuarioFormData) => {
    const response = await authHttp.post<Usuario>("/users/", data);
    return response.data;
  },

  /**
   * Actualizar usuario
   */
  update: async (id: number, data: Partial<UsuarioFormData>) => {
    const response = await authHttp.patch<Usuario>(`/users/${id}/`, data);
    return response.data;
  },

  /**
   * Actualizar perfil del usuario actual
   */
  updateProfile: async (data: Partial<UsuarioFormData>) => {
    const response = await authHttp.patch<UsuarioDetalle>(
      "/users/perfil/",
      data,
    );
    return response.data;
  },

  /**
   * Eliminar usuario (admin)
   */
  delete: async (id: number) => {
    await authHttp.delete(`/users/${id}/`);
  },

  /**
   * Cambiar contraseña
   */
  cambiarPassword: async (id: number, data: CambiarPasswordData) => {
    const response = await authHttp.post(`/users/${id}/cambiar_password/`, {
      new_password: data.new_password,
    });
    return response.data;
  },

  /**
   * Cambiar mi contraseña
   */
  cambiarMiPassword: async (data: CambiarPasswordData) => {
    const profile = await authHttp.get<UsuarioDetalle>("/users/perfil/");
    const userId = (profile.data as any)?.id;
    const response = await authHttp.post(`/users/${userId}/cambiar_password/`, {
      current_password: data.old_password,
      new_password: data.new_password,
    });
    return response.data;
  },

  /**
   * Obtener instructores (para selección)
   */
  getInstructores: async () => {
    const response = await authHttp.get<Usuario[]>("/users/", {
      params: { perfil: "instructor", page_size: 1000 },
    });
    return response.data;
  },
};
