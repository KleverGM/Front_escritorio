import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authHttp } from "../../../../infrastructure/http/httpClients";
import {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  Modal,
} from "../../../components/common";

interface Usuario {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  perfil: string;
  is_active: boolean;
  fecha_creacion: string;
}

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | null>(null);
  const [deleting, setDeleting] = useState(false);

  const searchQuery = searchParams.get("q") || "";
  const filterPerfil = searchParams.get("perfil") || "";
  const filterActivo = searchParams.get("activo") || "";

  useEffect(() => {
    loadUsuarios();
  }, [searchQuery, filterPerfil, filterActivo]);

  const loadUsuarios = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = { page_size: 100 };
      if (searchQuery) params.search = searchQuery;
      if (filterPerfil) params.perfil = filterPerfil;
      if (filterActivo) params.is_active = filterActivo === "true";

      const res = await authHttp.get("/users/", { params });
      const data = res.data?.results || res.data || [];
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.error ||
          "Error al cargar usuarios",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("q", value);
    } else {
      newParams.delete("q");
    }
    setSearchParams(newParams);
  };

  const handleFilterPerfil = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("perfil", value);
    } else {
      newParams.delete("perfil");
    }
    setSearchParams(newParams);
  };

  const handleFilterActivo = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("activo", value);
    } else {
      newParams.delete("activo");
    }
    setSearchParams(newParams);
  };

  const getPerfilBadgeColor = (perfil: string) => {
    const colors: Record<string, string> = {
      administrador: "bg-red-100 text-red-800",
      admin: "bg-red-100 text-red-800",
      instructor: "bg-blue-100 text-blue-800",
      estudiante: "bg-green-100 text-green-800",
    };
    return colors[perfil.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const getPerfilLabel = (perfil: string) => {
    const labels: Record<string, string> = {
      administrador: "Administrador",
      admin: "Administrador",
      instructor: "Instructor",
      estudiante: "Estudiante",
    };
    return labels[perfil.toLowerCase()] || perfil;
  };

  const handleDeleteClick = (usuario: Usuario) => {
    setUsuarioToDelete(usuario);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!usuarioToDelete) return;

    setDeleting(true);
    try {
      await authHttp.delete(`/users/${usuarioToDelete.id}/`);
      setUsuarios(usuarios.filter((u) => u.id !== usuarioToDelete.id));
      setDeleteModalOpen(false);
      setUsuarioToDelete(null);
    } catch (err: any) {
      alert(
        err?.response?.data?.detail ||
          err?.response?.data?.error ||
          "Error al eliminar usuario",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Gestión de Usuarios
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Administra todos los usuarios de la plataforma
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/app/admin/usuarios/crear"
                className="px-4 py-2 bg-[#f8b31d] text-white rounded-lg hover:bg-[#e0a219] transition-colors"
              >
                + Crear Usuario
              </Link>
              <Link
                to="/app/admin"
                className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                ← Volver al Dashboard
              </Link>
            </div>
          </div>

          {/* Búsqueda y filtros */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Búsqueda */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Buscar
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Nombre, email, usuario..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
                />
              </div>

              {/* Filtro por perfil */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Perfil
                </label>
                <select
                  value={filterPerfil}
                  onChange={(e) => handleFilterPerfil(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
                >
                  <option value="">Todos los perfiles</option>
                  <option value="estudiante">Estudiantes</option>
                  <option value="instructor">Instructores</option>
                  <option value="administrador">Administradores</option>
                </select>
              </div>

              {/* Filtro por estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Estado
                </label>
                <select
                  value={filterActivo}
                  onChange={(e) => handleFilterActivo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="true">Activos</option>
                  <option value="false">Inactivos</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido */}
        {loading && <LoadingSpinner size="lg" />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && (
          <>
            {/* Contador */}
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              {usuarios.length} usuario{usuarios.length !== 1 ? "s" : ""}{" "}
              encontrado{usuarios.length !== 1 ? "s" : ""}
            </div>

            {usuarios.length === 0 ? (
              <EmptyState
                icon="👥"
                title="No se encontraron usuarios"
                description="Intenta cambiar los filtros de búsqueda"
              />
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Usuario
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Perfil
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Fecha de Registro
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {usuarios.map((usuario) => (
                        <tr key={usuario.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-[#f8b31d] to-[#f59e0b] flex items-center justify-center">
                                <span className="text-sm font-bold text-white">
                                  {(
                                    usuario.first_name?.[0] ||
                                    usuario.username?.[0] ||
                                    "U"
                                  ).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {usuario.first_name && usuario.last_name
                                    ? `${usuario.first_name} ${usuario.last_name}`
                                    : usuario.username}
                                </div>
                                <div className="text-sm text-gray-500">
                                  @{usuario.username}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {usuario.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerfilBadgeColor(
                                usuario.perfil,
                              )}`}
                            >
                              {getPerfilLabel(usuario.perfil)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                usuario.is_active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {usuario.is_active ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(
                              usuario.fecha_creacion,
                            ).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-3">
                              <Link
                                to={`/app/admin/usuarios/${usuario.id}`}
                                className="text-[#f8b31d] hover:text-[#e0a419] font-medium"
                              >
                                Editar
                              </Link>
                              <button
                                onClick={() => handleDeleteClick(usuario)}
                                className="text-red-600 hover:text-red-800 font-medium"
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => !deleting && setDeleteModalOpen(false)}
        title="Eliminar Usuario"
      >
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            ¿Estás seguro de que deseas eliminar al usuario{" "}
            <span className="font-semibold">
              {usuarioToDelete?.first_name && usuarioToDelete?.last_name
                ? `${usuarioToDelete.first_name} ${usuarioToDelete.last_name}`
                : usuarioToDelete?.username}
            </span>
            ?
          </p>
          <p className="text-sm text-red-600 mb-6">
            Esta acción no se puede deshacer. Se eliminarán todos los datos
            relacionados con este usuario.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
              {deleting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
