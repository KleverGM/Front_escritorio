import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authHttp } from "../../../../infrastructure/http/httpClients";
import { cursoService } from "../../../../application/cursos/curso.service";
import {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  Modal,
} from "../../../components/common";

interface Curso {
  id: number;
  titulo: string;
  descripcion: string;
  instructor: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
  categoria: string;
  nivel: string;
  precio: string;
  imagen: string | null;
  activo: boolean;
  fecha_creacion: string;
}

export default function GestionCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const searchQuery = searchParams.get("q") || "";
  const filterCategoria = searchParams.get("categoria") || "";
  const filterNivel = searchParams.get("nivel") || "";
  const filterActivo = searchParams.get("activo") || "";

  useEffect(() => {
    loadCursos();
  }, [searchQuery, filterCategoria, filterNivel, filterActivo]);

  const loadCursos = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = { page_size: 100 };
      if (searchQuery) params.q = searchQuery;
      if (filterCategoria) params.categoria = filterCategoria;
      if (filterNivel) params.nivel = filterNivel;
      if (filterActivo) params.activo = filterActivo === "true";

      const res = await authHttp.get("/cursos/", { params });
      const data = res.data?.results || res.data || [];
      setCursos(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.error ||
          "Error al cargar cursos",
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

  const handleFilterCategoria = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("categoria", value);
    } else {
      newParams.delete("categoria");
    }
    setSearchParams(newParams);
  };

  const handleFilterNivel = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("nivel", value);
    } else {
      newParams.delete("nivel");
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

  const handleDeleteClick = (curso: Curso) => {
    setSelectedCurso(curso);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCurso) return;

    try {
      setDeleting(true);
      await cursoService.delete(selectedCurso.id);
      setShowDeleteModal(false);
      setSelectedCurso(null);
      await loadCursos();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Error al eliminar curso");
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
                Gestión de Cursos
              </h1>
              <p className="text-gray-600 mt-1">
                Administra todos los cursos de la plataforma
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/app/admin/cursos/crear"
                className="px-4 py-2 bg-[#f8b31d] text-white rounded-lg hover:bg-[#e0a219] transition-colors"
              >
                + Crear Curso
              </Link>
              <Link
                to="/app/admin"
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Volver al Dashboard
              </Link>
            </div>
          </div>

          {/* Búsqueda y filtros */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Búsqueda */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Título o descripción..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
                />
              </div>

              {/* Filtro por categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  value={filterCategoria}
                  onChange={(e) => handleFilterCategoria(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
                >
                  <option value="">Todas las categorías</option>
                  <option value="programacion">Programación</option>
                  <option value="diseño">Diseño</option>
                  <option value="marketing">Marketing</option>
                  <option value="negocios">Negocios</option>
                  <option value="idiomas">Idiomas</option>
                  <option value="musica">Música</option>
                  <option value="fotografia">Fotografía</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              {/* Filtro por nivel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nivel
                </label>
                <select
                  value={filterNivel}
                  onChange={(e) => handleFilterNivel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
                >
                  <option value="">Todos los niveles</option>
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>

              {/* Filtro por estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={filterActivo}
                  onChange={(e) => handleFilterActivo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
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
            <div className="mb-4 text-sm text-gray-600">
              {cursos.length} curso{cursos.length !== 1 ? "s" : ""} encontrado
              {cursos.length !== 1 ? "s" : ""}
            </div>

            {cursos.length === 0 ? (
              <EmptyState
                icon="📚"
                title="No se encontraron cursos"
                description="Intenta cambiar los filtros de búsqueda"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cursos.map((curso) => (
                  <div
                    key={curso.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Imagen */}
                    <div className="h-48 bg-gradient-to-br from-[#f8b31d] to-[#f59e0b] relative">
                      {curso.imagen ? (
                        <img
                          src={curso.imagen}
                          alt={curso.titulo}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-6xl">
                          📚
                        </div>
                      )}
                      {!curso.activo && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          Inactivo
                        </div>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                        {curso.titulo}
                      </h3>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {curso.descripcion}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">Instructor:</span>
                          <span className="font-medium text-gray-900">
                            {curso.instructor.first_name &&
                            curso.instructor.last_name
                              ? `${curso.instructor.first_name} ${curso.instructor.last_name}`
                              : curso.instructor.username}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {curso.categoria}
                          </span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                            {curso.nivel}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-[#f8b31d]">
                            ${curso.precio}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(curso.fecha_creacion).toLocaleDateString(
                              "es-ES",
                              {
                                year: "numeric",
                                month: "short",
                              },
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="space-y-2">
                        <Link
                          to={`/app/admin/cursos/${curso.id}/modulos`}
                          className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          📚 Gestionar Módulos
                        </Link>
                        <div className="flex gap-2">
                          <Link
                            to={`/app/admin/cursos/${curso.id}`}
                            className="flex-1 text-center px-4 py-2 bg-[#f8b31d] text-white rounded-lg hover:bg-[#e0a419] transition-colors font-medium"
                          >
                            Editar Curso
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(curso)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            title="Eliminar curso"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
            ¿Estás seguro de que deseas eliminar el curso "
            <strong>{selectedCurso?.titulo}</strong>"?
          </p>
          <p className="text-sm text-red-600">
            Esta acción no se puede deshacer y se eliminarán todos los módulos,
            secciones e inscripciones asociadas.
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
