import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authHttp } from "../../../../infrastructure/http/httpClients";
import { inscripcionService } from "../../../../application/inscripciones/inscripcion.service";
import {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  Modal,
} from "../../../components/common";

interface Inscripcion {
  id: number;
  usuario: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  curso: {
    id: number;
    titulo: string;
    instructor: {
      first_name: string;
      last_name: string;
      username: string;
    };
  };
  fecha_inscripcion: string;
  progreso: number;
  completado: boolean;
  fecha_completado: string | null;
}

export default function GestionInscripciones() {
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedInscripcion, setSelectedInscripcion] =
    useState<Inscripcion | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filterCompletado = searchParams.get("completado") || "";

  useEffect(() => {
    loadInscripciones();
  }, [filterCompletado]);

  const loadInscripciones = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = { page_size: 100 };
      if (filterCompletado) params.completado = filterCompletado === "true";

      const res = await authHttp.get("/inscripciones/", { params });

      const data = res.data?.results || res.data || [];

      // Convertir progreso a número para evitar errores
      const inscripcionesNormalizadas = Array.isArray(data)
        ? data.map((ins: any) => ({
            ...ins,
            progreso:
              typeof ins.progreso === "string"
                ? parseFloat(ins.progreso)
                : ins.progreso || 0,
          }))
        : [];

      setInscripciones(inscripcionesNormalizadas);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.error ||
          "Error al cargar inscripciones",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilterCompletado = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("completado", value);
    } else {
      newParams.delete("completado");
    }
    setSearchParams(newParams);
  };

  const getProgresoColor = (progreso: number) => {
    if (progreso === 0) return "bg-gray-200";
    if (progreso < 30) return "bg-red-500";
    if (progreso < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleDeleteClick = (inscripcion: Inscripcion) => {
    setSelectedInscripcion(inscripcion);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedInscripcion) return;

    try {
      setDeleting(true);
      await inscripcionService.delete(selectedInscripcion.id);
      setShowDeleteModal(false);
      setSelectedInscripcion(null);
      await loadInscripciones();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Error al eliminar inscripción");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestión de Inscripciones
              </h1>
              <p className="text-gray-600 mt-1">
                Administra todas las inscripciones de los estudiantes
              </p>
              <p className="text-sm text-gray-500 mt-1">
                💡 Las inscripciones se crean cuando un estudiante se inscribe
                en un curso
              </p>
            </div>
            <Link
              to="/app/admin"
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Volver al Dashboard
            </Link>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Filtro por estado de completado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={filterCompletado}
                  onChange={(e) => handleFilterCompletado(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
                >
                  <option value="">Todas las inscripciones</option>
                  <option value="false">En progreso</option>
                  <option value="true">Completadas</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={loadInscripciones}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  🔄 Actualizar
                </button>
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
            <div className="mb-4 text-sm text-gray-600">
              {inscripciones.length} inscripción
              {inscripciones.length !== 1 ? "es" : ""} encontrada
              {inscripciones.length !== 1 ? "s" : ""}
            </div>

            {inscripciones.length === 0 ? (
              <EmptyState
                icon="🎓"
                title="No se encontraron inscripciones"
                description="Aún no hay estudiantes inscritos en cursos"
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estudiante
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Curso
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Instructor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progreso
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha Inscripción
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {inscripciones.map((inscripcion) => {
                        // Validar que existan los datos necesarios
                        if (!inscripcion.usuario || !inscripcion.curso) {
                          return null;
                        }

                        return (
                          <tr key={inscripcion.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-[#f8b31d] to-[#f59e0b] flex items-center justify-center">
                                  <span className="text-sm font-bold text-white">
                                    {(
                                      inscripcion.usuario?.first_name?.[0] ||
                                      inscripcion.usuario?.username?.[0] ||
                                      "U"
                                    ).toUpperCase()}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {inscripcion.usuario?.first_name &&
                                    inscripcion.usuario?.last_name
                                      ? `${inscripcion.usuario.first_name} ${inscripcion.usuario.last_name}`
                                      : inscripcion.usuario?.username ||
                                        "Usuario"}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {inscripcion.usuario?.email || ""}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                {inscripcion.curso?.titulo || "Curso"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {inscripcion.curso?.instructor?.first_name &&
                                inscripcion.curso?.instructor?.last_name
                                  ? `${inscripcion.curso.instructor.first_name} ${inscripcion.curso.instructor.last_name}`
                                  : inscripcion.curso?.instructor?.username ||
                                    "Instructor"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="w-full">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-medium text-gray-700">
                                    {(inscripcion.progreso || 0).toFixed(0)}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all ${getProgresoColor(inscripcion.progreso || 0)}`}
                                    style={{
                                      width: `${inscripcion.progreso || 0}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  inscripcion.completado
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {inscripcion.completado
                                  ? "Completado"
                                  : "En progreso"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(
                                inscripcion.fecha_inscripcion,
                              ).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex gap-2 justify-end">
                                <Link
                                  to={`/app/admin/inscripciones/${inscripcion.id}`}
                                  className="text-[#f8b31d] hover:text-[#e0a419] font-medium"
                                >
                                  Editar
                                </Link>
                                <button
                                  onClick={() => handleDeleteClick(inscripcion)}
                                  className="text-red-600 hover:text-red-800 font-medium"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
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
        isOpen={showDeleteModal}
        onClose={() => !deleting && setShowDeleteModal(false)}
        title="Confirmar eliminación"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            ¿Estás seguro de que deseas eliminar la inscripción de{" "}
            <strong>
              {selectedInscripcion?.usuario?.first_name}{" "}
              {selectedInscripcion?.usuario?.last_name}
            </strong>{" "}
            al curso "<strong>{selectedInscripcion?.curso?.titulo}</strong>"?
          </p>
          <p className="text-sm text-red-600">
            Esta acción no se puede deshacer. Se perderá todo el progreso del
            estudiante en este curso.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowDeleteModal(false)}
              disabled={deleting}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {deleting && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {deleting ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
