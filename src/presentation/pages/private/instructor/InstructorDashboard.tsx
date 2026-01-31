import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authHttp } from "../../../../infrastructure/http/httpClients";
import { LoadingSpinner, ErrorMessage } from "../../../components/common";

interface DashboardStats {
  total_cursos: number;
  total_estudiantes: number;
  total_resenas: number;
  calificacion_promedio: number;
  cursos_activos: number;
  cursos_inactivos: number;
  nuevos_estudiantes_mes: number;
  resenas_pendientes: number;
}

export default function InstructorDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);

    try {
      // Cargar datos en paralelo
      const [cursosRes, inscripcionesRes, resenasRes] = await Promise.all([
        authHttp.get("/cursos/mis_cursos/"),
        authHttp.get("/inscripciones/"),
        authHttp.get("/resenas/mis_resenas/"),
      ]);

      const cursos = cursosRes.data?.results || cursosRes.data || [];
      const inscripciones =
        inscripcionesRes.data?.results || inscripcionesRes.data || [];
      const resenas = resenasRes.data?.results || resenasRes.data || [];

      // Calcular estadísticas
      const cursosActivos = cursos.filter((c: any) => c.activo).length;
      const cursosInactivos = cursos.filter((c: any) => !c.activo).length;

      const calificacionPromedio =
        resenas.length > 0
          ? resenas.reduce(
              (acc: number, r: any) => acc + (r.rating ?? r.calificacion ?? 0),
              0,
            ) / resenas.length
          : 0;

      // Estudiantes únicos
      const estudiantesUnicos = new Set(
        inscripciones.map((i: any) => i.usuario?.id || i.usuario),
      ).size;

      // Nuevos estudiantes del mes
      const fechaMesAtras = new Date();
      fechaMesAtras.setMonth(fechaMesAtras.getMonth() - 1);
      const nuevosEstudiantes = inscripciones.filter((i: any) => {
        const fecha = new Date(i.fecha_inscripcion || i.created_at);
        return fecha >= fechaMesAtras;
      }).length;

      setStats({
        total_cursos: cursos.length,
        total_estudiantes: estudiantesUnicos,
        total_resenas: resenas.length,
        calificacion_promedio: Math.round(calificacionPromedio * 10) / 10,
        cursos_activos: cursosActivos,
        cursos_inactivos: cursosInactivos,
        nuevos_estudiantes_mes: nuevosEstudiantes,
        resenas_pendientes: 0, // Por si se implementa responder reseñas
      });
    } catch (e: any) {
      console.error("Error cargando estadísticas:", e);
      setError("No se pudieron cargar las estadísticas");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard de Instructor
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Gestiona tus cursos y revisa estadísticas
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Mis Cursos
              </p>
              <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-gray-100">
                {stats.total_cursos}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats.cursos_activos} activos • {stats.cursos_inactivos}{" "}
                inactivos
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full">
              <svg
                className="w-8 h-8 text-blue-600 dark:text-blue-300"
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

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Estudiantes
              </p>
              <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-gray-100">
                {stats.total_estudiantes}
              </p>
              <p className="text-xs text-green-600 mt-1">
                +{stats.nuevos_estudiantes_mes} este mes
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-full">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-300"
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
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Calificación
              </p>
              <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-gray-100">
                {stats.calificacion_promedio.toFixed(1)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats.total_resenas} reseñas
              </p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/40 p-3 rounded-full">
              <svg
                className="w-8 h-8 text-yellow-600 dark:text-yellow-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Reseñas
              </p>
              <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-gray-100">
                {stats.total_resenas}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Total de opiniones
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/40 p-3 rounded-full">
              <svg
                className="w-8 h-8 text-purple-600 dark:text-purple-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/app/instructor/cursos"
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#f8b31d] p-3 rounded-full">
              <svg
                className="w-6 h-6 text-white"
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
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                Gestionar Cursos
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Crear, editar y administrar
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/app/instructor/estudiantes"
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="bg-green-500 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-white"
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
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                Mis Estudiantes
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Ver inscritos y progreso
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/app/instructor/resenas"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Reseñas</h3>
              <p className="text-sm text-gray-600">
                Ver opiniones de estudiantes
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
