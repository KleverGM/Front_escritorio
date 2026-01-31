import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { cursoService } from "../../../../application/cursos/curso.service";
import type { CursoDetalle } from "../../../../domain/cursos/curso.types";
import {
  LoadingSpinner,
  ErrorMessage,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  RatingStars,
  Tabs,
} from "../../../components/common";
import { ModuloCard } from "../../../components/modulos";

export default function DetalleCursoAdmin() {
  const { id } = useParams<{ id: string }>();
  const cursoId = parseInt(id || "0");
  const navigate = useNavigate();

  const [curso, setCurso] = useState<CursoDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("informacion");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadCurso();
  }, [cursoId]);

  const loadCurso = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cursoService.getById(cursoId);
      setCurso(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Error al cargar curso");
    } finally {
      setLoading(false);
    }
  };

  const handleActivar = async () => {
    if (!confirm("¿Está seguro de activar este curso?")) return;

    try {
      setActionLoading(true);
      await cursoService.activar(cursoId);
      await loadCurso();
      alert("Curso activado exitosamente");
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Error al activar curso");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDesactivar = async () => {
    if (!confirm("¿Está seguro de desactivar este curso?")) return;

    try {
      setActionLoading(true);
      await cursoService.desactivar(cursoId);
      await loadCurso();
      alert("Curso desactivado exitosamente");
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Error al desactivar curso");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (
      !confirm(
        "¿Está seguro de eliminar este curso? Esta acción no se puede deshacer.",
      )
    )
      return;

    try {
      setActionLoading(true);
      await cursoService.delete(cursoId);
      alert("Curso eliminado exitosamente");
      navigate("/app/admin/cursos");
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Error al eliminar curso");
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !curso) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
        <ErrorMessage message={error || "Curso no encontrado"} />
        <button
          onClick={() => navigate("/app/admin/cursos")}
          className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800"
        >
          ← Volver a Gestión de Cursos
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/app/admin/cursos")}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 mb-2"
          >
            ← Volver a Gestión de Cursos
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {curso.titulo}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    curso.activo
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {curso.activo ? "Activo" : "Inactivo"}
                </span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                  {curso.categoria}
                </span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                  {curso.nivel}
                </span>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-2">
              <Link
                to={`/app/admin/cursos/${cursoId}/editar`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Editar
              </Link>
              {curso.activo ? (
                <button
                  onClick={handleDesactivar}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                >
                  Desactivar
                </button>
              ) : (
                <button
                  onClick={handleActivar}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Activar
                </button>
              )}
              <button
                onClick={handleEliminar}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          tabs={[
            { id: "informacion", label: "Información" },
            {
              id: "modulos",
              label: "Módulos",
              count: curso.modulos?.length || 0,
            },
            { id: "estadisticas", label: "Estadísticas" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Contenido de tabs */}
        <div className="mt-6">
          {activeTab === "informacion" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Información del Curso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {curso.imagen && (
                      <img
                        src={curso.imagen}
                        alt={curso.titulo}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                          Descripción
                        </label>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                          {curso.descripcion}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Categoría
                          </label>
                          <p className="text-gray-900 dark:text-gray-100 mt-1">
                            {curso.categoria}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Nivel
                          </label>
                          <p className="text-gray-900 dark:text-gray-100 mt-1">
                            {curso.nivel}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Precio
                          </label>
                          <p className="text-gray-900 dark:text-gray-100 mt-1">
                            ${parseFloat(curso.precio).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Fecha de creación
                          </label>
                          <p className="text-gray-900 dark:text-gray-100 mt-1">
                            {new Date(
                              curso.fecha_creacion,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                {/* Instructor */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-blue-700">
                          {curso.instructor.first_name?.charAt(0) ||
                            curso.instructor.username.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {curso.instructor.first_name}{" "}
                          {curso.instructor.last_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          @{curso.instructor.username}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rating */}
                <Card>
                  <CardHeader>
                    <CardTitle>Valoración</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {curso.rating_promedio?.toFixed(1) || "N/A"}
                      </div>
                      <RatingStars
                        rating={curso.rating_promedio || 0}
                        readonly
                        size="lg"
                        showNumber={false}
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        {curso.total_resenas || 0} reseña
                        {curso.total_resenas !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "modulos" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Módulos del Curso ({curso.modulos?.length || 0})
                </h2>
                <Link
                  to={`/app/admin/cursos/${cursoId}/modulos`}
                  className="px-4 py-2 bg-[#f8b31d] text-white rounded-lg hover:bg-[#e0a219]"
                >
                  Gestionar Módulos
                </Link>
              </div>

              {curso.modulos && curso.modulos.length > 0 ? (
                <div className="space-y-4">
                  {curso.modulos.map((modulo: any) => (
                    <ModuloCard
                      key={modulo.id}
                      modulo={modulo}
                      cursoId={cursoId}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent>
                    <p className="text-center text-gray-600 py-8">
                      Este curso aún no tiene módulos
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === "estadisticas" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Estadísticas del Curso
                </h2>
                <Link
                  to={`/app/admin/estadisticas/curso/${cursoId}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Ver estadísticas detalladas →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {curso.total_estudiantes || 0}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Estudiantes totales
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {curso.modulos?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Módulos</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        {curso.total_resenas || 0}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Reseñas</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600">
                        ${parseFloat(curso.precio).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Precio</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
