import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { avisoService } from "../../../../application/avisos/aviso.service";
import type {
  Aviso,
  AvisoFiltros,
} from "../../../../domain/avisos/aviso.types";
import {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  SearchBar,
  Pagination,
  Card,
  CardContent,
  Modal,
} from "../../../components/common";

const TIPOS_AVISO_OPTIONS = [
  { value: "aviso", label: "Aviso" },
  { value: "mensaje_sistema", label: "Mensaje del Sistema" },
  { value: "recordatorio", label: "Recordatorio" },
  { value: "urgente", label: "Urgente" },
] as const;

export default function GestionAvisos() {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const [filtros, setFiltros] = useState<AvisoFiltros>({
    page: 1,
    search: "",
    tipo: undefined,
  });

  const [selectedAviso, setSelectedAviso] = useState<Aviso | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadAvisos();
  }, [filtros]);

  const loadAvisos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await avisoService.getAll(filtros);
      setAvisos(data.results || data);
      if (data.count) {
        setTotalPages(Math.ceil(data.count / 10));
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Error al cargar avisos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAviso) return;

    try {
      setDeleting(true);
      await avisoService.delete(selectedAviso.id);
      setShowDeleteModal(false);
      setSelectedAviso(null);
      await loadAvisos();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Error al eliminar aviso");
    } finally {
      setDeleting(false);
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "informacion":
        return "bg-blue-100 text-blue-700";
      case "advertencia":
        return "bg-yellow-100 text-yellow-700";
      case "urgente":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Gestión de Avisos
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Administra los avisos del sistema
            </p>
          </div>
          <Link
            to="/app/avisos/crear"
            className="px-4 py-2 bg-[#f8b31d] text-white rounded-lg hover:bg-[#e0a219]"
          >
            + Crear Aviso
          </Link>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <SearchBar
                  value={filtros.search || ""}
                  onChange={(value: string) =>
                    setFiltros({ ...filtros, search: value, page: 1 })
                  }
                  placeholder="Buscar por título o contenido..."
                />
              </div>
              <div>
                <select
                  value={filtros.tipo || ""}
                  onChange={(e) =>
                    setFiltros({
                      ...filtros,
                      tipo: e.target.value as any,
                      page: 1,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos los tipos</option>
                  {TIPOS_AVISO_OPTIONS.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {error && <ErrorMessage message={error} className="mb-6" />}

        {/* Loading */}
        {loading && <LoadingSpinner />}

        {/* Tabla de avisos */}
        {!loading && !error && (
          <>
            {avisos.length === 0 ? (
              <EmptyState
                icon="📢"
                title="No hay avisos"
                description="Crea el primer aviso para informar a los usuarios"
                action={
                  <Link
                    to="/app/avisos/crear"
                    className="px-4 py-2 bg-[#f8b31d] text-white rounded-lg hover:bg-[#e0a219]"
                  >
                    Crear Aviso
                  </Link>
                }
              />
            ) : (
              <>
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Título
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Tipo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Destinatarios
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Fecha
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                          {avisos.map((aviso) => (
                            <tr
                              key={aviso.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {aviso.titulo}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">
                                  {aviso.contenido}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${getTipoColor(
                                    aviso.tipo,
                                  )}`}
                                >
                                  {aviso.tipo}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                {aviso.para_todos
                                  ? "Todos"
                                  : `${aviso.usuarios?.length || 0} usuario(s)`}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                {new Date(
                                  aviso.fecha_creacion,
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-right text-sm">
                                <button
                                  onClick={() => {
                                    setSelectedAviso(aviso);
                                    setShowDeleteModal(true);
                                  }}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={filtros.page || 1}
                      totalPages={totalPages}
                      onPageChange={(page) => setFiltros({ ...filtros, page })}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedAviso(null);
        }}
        title="Confirmar eliminación"
      >
        <p className="text-gray-600 mb-6">
          ¿Está seguro de eliminar el aviso "{selectedAviso?.titulo}"? Esta
          acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedAviso(null);
            }}
            disabled={deleting}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
