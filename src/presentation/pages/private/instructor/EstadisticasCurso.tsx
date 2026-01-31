import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { authHttp } from "../../../../infrastructure/http/httpClients";
import { LoadingSpinner, ErrorMessage } from "../../../components/common";
import {
  MetricCard,
  RatingDistribution,
  StatsDetailCard,
} from "../../../components/instructor";

interface Estadisticas {
  total_estudiantes: number;
  estudiantes_activos: number;
  estudiantes_completados: number;
  promedio_progreso: number;
  rating_promedio: number;
  total_resenas: number;
  distribucion_ratings: Record<string, number>;
  nuevos_estudiantes_semana: number;
  nuevas_resenas_semana: number;
  completados_semana: number;
  ingresos_totales: number;
}

interface Curso {
  id: number;
  titulo: string;
  precio: string;
}

export default function EstadisticasCurso() {
  const { id } = useParams<{ id: string }>();
  const cursoId = parseInt(id || "0");

  const [curso, setCurso] = useState<Curso | null>(null);
  const [stats, setStats] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [cursoId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [cursoRes, statsRes] = await Promise.all([
        authHttp.get(`/cursos/${cursoId}/`),
        authHttp.get(`/cursos/${cursoId}/estadisticas/`),
      ]);

      setCurso(cursoRes.data);
      setStats(statsRes.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.error || "Error al cargar las estadísticas",
      );
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

  if (error || !stats || !curso) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
        <ErrorMessage message={error || "No se encontraron datos"} />
        <Link
          to="/app/instructor/cursos"
          className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Volver a Mis Cursos
        </Link>
      </div>
    );
  }

  const tasaCompletado =
    stats.total_estudiantes > 0
      ? (
          (stats.estudiantes_completados / stats.total_estudiantes) *
          100
        ).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/app/instructor/cursos"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            ← Volver a Mis Cursos
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {curso.titulo}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Estadísticas y métricas del curso
          </p>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <MetricCard
            title="Total Estudiantes"
            value={stats.total_estudiantes}
            subtitle={`+${stats.nuevos_estudiantes_semana} esta semana`}
            icon="👥"
            iconBgColor="bg-blue-100"
          />
          <MetricCard
            title="Progreso Promedio"
            value={`${stats.promedio_progreso}%`}
            subtitle={`${stats.estudiantes_activos} activos`}
            icon="📊"
            iconBgColor="bg-green-100"
          />
          <MetricCard
            title="Rating Promedio"
            value={`${stats.rating_promedio.toFixed(1)} ⭐`}
            subtitle={`${stats.total_resenas} reseñas`}
            icon="⭐"
            iconBgColor="bg-yellow-100"
          />
          <MetricCard
            title="Ingresos Totales"
            value={`$${stats.ingresos_totales.toFixed(2)}`}
            subtitle={`$${curso.precio} por estudiante`}
            icon="💰"
            iconBgColor="bg-purple-100"
          />
        </div>

        {/* Segunda fila de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatsDetailCard
            title="Completación del Curso"
            items={[
              {
                label: `${tasaCompletado}% completado`,
                value: `${stats.estudiantes_completados} de ${stats.total_estudiantes}`,
              },
              {
                label: "Esta semana",
                value: `+${stats.completados_semana}`,
                color: "text-green-600",
              },
            ]}
          />

          <StatsDetailCard
            title="Estado de Estudiantes"
            items={[
              { label: "Activos", value: stats.estudiantes_activos },
              { label: "Completados", value: stats.estudiantes_completados },
              {
                label: "Sin empezar",
                value:
                  stats.total_estudiantes -
                  stats.estudiantes_activos -
                  stats.estudiantes_completados,
              },
            ]}
          />

          <StatsDetailCard
            title="Actividad Reciente (7 días)"
            items={[
              {
                label: "Nuevos estudiantes",
                value: `+${stats.nuevos_estudiantes_semana}`,
                color: "text-green-600",
              },
              {
                label: "Nuevas reseñas",
                value: `+${stats.nuevas_resenas_semana}`,
                color: "text-blue-600",
              },
              {
                label: "Completados",
                value: `+${stats.completados_semana}`,
                color: "text-purple-600",
              },
            ]}
          />
        </div>

        {/* Distribución de ratings */}
        <RatingDistribution
          distribucion={stats.distribucion_ratings}
          totalResenas={stats.total_resenas}
        />

        {/* Acciones rápidas */}
        <div className="mt-6 flex gap-4">
          <Link
            to={`/app/instructor/cursos/${cursoId}/modulos`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            📚 Gestionar Módulos
          </Link>
          <Link
            to={`/app/instructor/cursos/${cursoId}/editar`}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            ✏️ Editar Curso
          </Link>
          <Link
            to="/app/instructor/estudiantes"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            👥 Ver Estudiantes
          </Link>
        </div>
      </div>
    </div>
  );
}
