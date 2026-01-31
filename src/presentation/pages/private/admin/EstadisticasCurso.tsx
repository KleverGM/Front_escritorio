import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { cursoService } from "../../../../application/cursos/curso.service";
import type { CursoEstadisticas } from "../../../../domain/cursos/curso.types";
import {
  LoadingSpinner,
  ErrorMessage,
  Card,
  CardTitle,
  CardContent,
} from "../../../components/common";

export default function EstadisticasCurso() {
  const { id } = useParams<{ id: string }>();
  const cursoId = parseInt(id || "0");

  const [stats, setStats] = useState<CursoEstadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, [cursoId]);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cursoService.getEstadisticas(cursoId);
      setStats(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Error al cargar estadísticas");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <ErrorMessage
          message={error || "No se pudieron cargar las estadísticas"}
        />
        <Link
          to="/app/admin/cursos"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          ← Volver a cursos
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to={`/app/admin/cursos/${cursoId}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Volver al Curso
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Estadísticas del Curso
          </h1>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <p className="text-sm text-gray-600 mb-1">Total Estudiantes</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.total_estudiantes}
            </p>
            <p className="text-xs text-green-600 mt-1">
              {stats.estudiantes_activos} activos
            </p>
          </Card>

          <Card>
            <p className="text-sm text-gray-600 mb-1">Inscripciones</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.total_inscripciones}
            </p>
          </Card>

          <Card>
            <p className="text-sm text-gray-600 mb-1">Tasa de Completado</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.tasa_completado.toFixed(1)}%
            </p>
          </Card>

          <Card>
            <p className="text-sm text-gray-600 mb-1">Progreso Promedio</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.progreso_promedio.toFixed(1)}%
            </p>
          </Card>
        </div>

        {/* Calificaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardTitle>Calificación</CardTitle>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl font-bold text-gray-900">
                  {stats.rating_promedio.toFixed(1)}
                </span>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(stats.rating_promedio)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        } fill-current`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {stats.total_resenas} reseñas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardTitle>Ingresos</CardTitle>
            <CardContent>
              <p className="text-4xl font-bold text-green-600">
                ${stats.ingresos_total.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Total de ingresos generados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Acciones rápidas */}
        <Card>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to={`/app/admin/cursos/${cursoId}/modulos`}
                className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <h3 className="font-semibold text-blue-900 mb-1">
                  Gestionar Módulos
                </h3>
                <p className="text-sm text-blue-700">
                  Administrar contenido del curso
                </p>
              </Link>

              <Link
                to={`/app/admin/cursos/${cursoId}`}
                className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <h3 className="font-semibold text-green-900 mb-1">
                  Editar Curso
                </h3>
                <p className="text-sm text-green-700">
                  Modificar información básica
                </p>
              </Link>

              <Link
                to={`/app/admin/inscripciones?curso_id=${cursoId}`}
                className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <h3 className="font-semibold text-purple-900 mb-1">
                  Ver Inscripciones
                </h3>
                <p className="text-sm text-purple-700">
                  Lista de estudiantes inscritos
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
