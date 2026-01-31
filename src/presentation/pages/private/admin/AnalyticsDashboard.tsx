import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { analyticsService } from "../../../../application/analytics/analytics.service";
import type { EstadisticasActividad } from "../../../../domain/analytics/analytics.types";
import {
  LoadingSpinner,
  ErrorMessage,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/common";

export default function AnalyticsDashboard() {
  const [estadisticas, setEstadisticas] =
    useState<EstadisticasActividad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState<"dia" | "semana" | "mes">("semana");

  useEffect(() => {
    loadEstadisticas();
  }, [periodo]);

  const loadEstadisticas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getEstadisticasActividad();
      setEstadisticas(data);
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Dashboard de Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Análisis de actividad y comportamiento de usuarios
            </p>
          </div>

          {/* Selector de período */}
          <div className="flex gap-2">
            <button
              onClick={() => setPeriodo("dia")}
              className={`px-4 py-2 rounded-lg ${
                periodo === "dia"
                  ? "bg-[#f8b31d] text-white"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              Día
            </button>
            <button
              onClick={() => setPeriodo("semana")}
              className={`px-4 py-2 rounded-lg ${
                periodo === "semana"
                  ? "bg-[#f8b31d] text-white"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setPeriodo("mes")}
              className={`px-4 py-2 rounded-lg ${
                periodo === "mes"
                  ? "bg-[#f8b31d] text-white"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              Mes
            </button>
          </div>
        </div>

        {estadisticas && (
          <>
            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    Total de Eventos
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    {estadisticas.total_eventos || estadisticas.eventos_mes}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    Eventos Hoy
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    {estadisticas.eventos_hoy}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    Eventos Semana
                  </div>
                  <div className="text-3xl font-bold text-purple-600">
                    {estadisticas.eventos_semana}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    Usuarios Activos
                  </div>
                  <div className="text-3xl font-bold text-yellow-600">
                    {estadisticas.usuarios_activos}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cursos más vistos */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Cursos Más Visitados</CardTitle>
              </CardHeader>
              <CardContent>
                {estadisticas.cursos_mas_visitados &&
                estadisticas.cursos_mas_visitados.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            #
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            Curso
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            Visitas
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {estadisticas.cursos_mas_visitados.map(
                          (curso, index) => (
                            <tr
                              key={curso.curso_id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                {index + 1}
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {curso.titulo}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                {curso.visitas}
                              </td>
                              <td className="px-6 py-4 text-right text-sm">
                                <Link
                                  to={`/app/admin/cursos/${curso.curso_id}`}
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800"
                                >
                                  Ver detalles
                                </Link>
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-600 dark:text-gray-300 py-8">
                    No hay datos de cursos para este período
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Eventos por tipo */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                {estadisticas.eventos_por_tipo ? (
                  <div className="space-y-4">
                    {Object.entries(estadisticas.eventos_por_tipo).map(
                      ([tipo, cantidad]) => {
                        const cantidadNum = Number(cantidad);
                        const totalEventos =
                          estadisticas.total_eventos ||
                          estadisticas.eventos_mes;
                        const porcentaje = (cantidadNum / totalEventos) * 100;
                        const tipoLabel =
                          {
                            page_view: "Visitas a Páginas",
                            video_play: "Videos Reproducidos",
                            seccion_completada: "Secciones Completadas",
                            click: "Clics",
                          }[tipo] || tipo;

                        return (
                          <div key={tipo}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                {tipoLabel}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {cantidadNum} ({porcentaje.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${porcentaje}%` }}
                              />
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 py-8">
                    No hay datos de eventos para este período
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
