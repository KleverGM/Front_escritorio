import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authHttp } from "../../../../infrastructure/http/httpClients";
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
  categoria: string;
  nivel: string;
  duracion_horas: number;
  precio: number;
  imagen_url: string | null;
  activo: boolean;
  total_inscripciones?: number;
  calificacion_promedio?: number;
  total_resenas?: number;
  fecha_creacion: string;
}

export default function GestionMisCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggleModalOpen, setToggleModalOpen] = useState(false);
  const [cursoToToggle, setCursoToToggle] = useState<Curso | null>(null);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    loadCursos();
  }, []);

  const loadCursos = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await authHttp.get("/cursos/mis_cursos/");
      const data = res.data?.results || res.data || [];
      setCursos(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error("Error cargando cursos:", e);
      setError("No se pudieron cargar los cursos");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async () => {
    if (!cursoToToggle) return;

    setToggling(true);
    try {
      const endpoint = cursoToToggle.activo
        ? `/cursos/${cursoToToggle.id}/desactivar/`
        : `/cursos/${cursoToToggle.id}/activar/`;

      await authHttp.post(endpoint);
      await loadCursos();
      setToggleModalOpen(false);
      setCursoToToggle(null);
    } catch (e: any) {
      console.error("Error cambiando estado:", e);
      alert("No se pudo cambiar el estado del curso");
    } finally {
      setToggling(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  // Ordenar: activos primero, luego inactivos
  const cursosOrdenados = [...cursos].sort((a, b) => {
    if (a.activo === b.activo) return 0;
    return a.activo ? -1 : 1;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Mis Cursos
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Administra y edita tus cursos
          </p>
        </div>
        <Link
          to="/app/instructor/cursos/crear"
          className="px-4 py-2 bg-[#f8b31d] text-white rounded-lg hover:bg-[#e0a219] transition-colors"
        >
          + Crear Curso
        </Link>
      </div>

      {cursosOrdenados.length === 0 ? (
        <EmptyState
          title="No tienes cursos"
          message="Crea tu primer curso para empezar a enseñar"
          icon={
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursosOrdenados.map((curso) => (
            <div
              key={curso.id}
              className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow ${
                !curso.activo ? "opacity-60" : ""
              }`}
            >
              {/* Imagen del curso */}
              <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-t-lg overflow-hidden relative">
                {curso.imagen_url ? (
                  <img
                    src={curso.imagen_url}
                    alt={curso.titulo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg
                      className="w-16 h-16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                {!curso.activo && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    Inactivo
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 dark:text-gray-100">
                  {curso.titulo}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {curso.descripcion}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>
                      {curso.calificacion_promedio
                        ? curso.calificacion_promedio.toFixed(1)
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <span>{curso.total_inscripciones || 0}</span>
                  </div>
                  <span className="text-[#f8b31d] font-semibold">
                    ${curso.precio}
                  </span>
                </div>

                {/* Acciones */}
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={`/app/instructor/cursos/${curso.id}/estadisticas`}
                    className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors text-center text-sm"
                  >
                    📊 Stats
                  </Link>
                  <Link
                    to={`/app/instructor/cursos/${curso.id}/modulos`}
                    className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-center text-sm"
                  >
                    📚 Módulos
                  </Link>
                  <Link
                    to={`/app/instructor/cursos/${curso.id}/editar`}
                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-center text-sm"
                  >
                    ✏️ Editar
                  </Link>
                  <button
                    onClick={() => {
                      setCursoToToggle(curso);
                      setToggleModalOpen(true);
                    }}
                    className={`px-3 py-2 rounded transition-colors text-sm ${
                      curso.activo
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {curso.activo ? "Desactivar" : "Activar"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmación */}
      <Modal
        isOpen={toggleModalOpen}
        onClose={() => {
          setToggleModalOpen(false);
          setCursoToToggle(null);
        }}
        title={`${cursoToToggle?.activo ? "Desactivar" : "Activar"} curso`}
      >
        <p className="mb-4">
          ¿Estás seguro de que deseas{" "}
          {cursoToToggle?.activo ? "desactivar" : "activar"} el curso "
          {cursoToToggle?.titulo}"?
        </p>
        {cursoToToggle?.activo && (
          <p className="text-sm text-gray-600 mb-4">
            El curso no será visible para los estudiantes hasta que lo actives
            nuevamente.
          </p>
        )}
        <div className="flex gap-2">
          <button
            onClick={handleToggleActive}
            disabled={toggling}
            className={`flex-1 px-4 py-2 rounded text-white transition-colors ${
              cursoToToggle?.activo
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            } disabled:opacity-50`}
          >
            {toggling
              ? "Procesando..."
              : cursoToToggle?.activo
                ? "Sí, desactivar"
                : "Sí, activar"}
          </button>
          <button
            onClick={() => {
              setToggleModalOpen(false);
              setCursoToToggle(null);
            }}
            className="flex-1 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
}
