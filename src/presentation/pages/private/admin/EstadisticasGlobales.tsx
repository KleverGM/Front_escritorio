import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cursoService } from "../../../../application/cursos/curso.service";
import type { EstadisticasGlobales } from "../../../../domain/cursos/curso.types";
import {
  LoadingSpinner,
  ErrorMessage,
  Card,
  CardTitle,
  CardContent,
} from "../../../components/common";

export default function EstadisticasGlobales() {
  const [stats, setStats] = useState<EstadisticasGlobales | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cursoService.getEstadisticasGlobales();
      setStats(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Error al cargar estadísticas");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
        <ErrorMessage
          message={error || "No se pudieron cargar las estadísticas"}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/app/admin"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            ← Volver al Panel de Admin
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Estadísticas Globales
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Vista general de la plataforma
              </p>
            </div>
            <button
              onClick={loadStats}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Actualizar
            </button>
          </div>
        </div>

        {/* Tarjetas de estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  Total Cursos
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.total_cursos}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {stats.cursos_activos} activos
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-300"
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
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  Estudiantes
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.total_estudiantes}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +{stats.nuevos_estudiantes_mes} este mes
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-300"
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
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  Instructores
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.total_instructores}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600 dark:text-purple-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  Inscripciones
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.total_inscripciones}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-600 dark:text-yellow-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Ingresos */}
        <Card className="mb-6">
          <CardTitle>Ingresos Totales</CardTitle>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">
              ${stats.ingresos_totales?.toLocaleString() || "0.00"}
            </p>
          </CardContent>
        </Card>

        {/* Cursos populares */}
        <Card>
          <CardTitle>Cursos Más Populares</CardTitle>
          <CardContent>
            {stats.cursos_populares && stats.cursos_populares.length > 0 ? (
              <div className="space-y-4">
                {stats.cursos_populares.map((curso, index) => (
                  <div
                    key={curso.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-gray-400">
                        #{index + 1}
                      </span>
                      <div>
                        <Link
                          to={`/app/admin/cursos/${curso.id}`}
                          className="font-semibold text-gray-900 dark:text-gray-100 hover:text-[#f8b31d]"
                        >
                          {curso.titulo}
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {curso.num_inscripciones} inscripciones •{" "}
                          {curso.instructor}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {curso.imagen ? (
                        <img
                          src={
                            curso.imagen.startsWith("http")
                              ? curso.imagen
                              : `https://cursos-online-api.desarrollo-software.xyz${curso.imagen}`
                          }
                          alt={curso.titulo}
                          className="w-16 h-16 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextElementSibling?.classList.remove(
                              "hidden",
                            );
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-16 h-16 rounded-lg bg-gradient-to-br from-[#f8b31d] to-yellow-600 flex items-center justify-center ${curso.imagen ? "hidden" : ""}`}
                      >
                        <svg
                          className="w-8 h-8 text-white"
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                No hay datos de cursos populares
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
