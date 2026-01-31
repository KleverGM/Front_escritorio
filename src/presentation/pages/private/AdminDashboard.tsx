import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authHttp } from "../../../infrastructure/http/httpClients";
import { LoadingSpinner, ErrorMessage } from "../../components/common";

interface DashboardStats {
  usuarios: {
    total: number;
    activos: number;
    por_perfil: Array<{ perfil: string; total: number }>;
    nuevos_mes: number;
  };
  cursos: {
    total: number;
    activos: number;
    publicados: number;
  };
  inscripciones: {
    total: number;
    completadas: number;
    progreso_promedio: number;
    nuevas_mes: number;
  };
  resenas: {
    total: number;
    promedio_calificacion: number;
  };
  avisos: {
    total: number;
    leidos: number;
    no_leidos: number;
  };
  notificaciones: {
    total: number;
    no_leidas: number;
  };
}

interface CursoPopular {
  id: number;
  titulo: string;
  instructor: {
    id: number;
    nombre: string;
  };
  total_inscripciones: number;
  promedio_rating: number;
  publicado: boolean;
  imagen: string | null;
}

interface ActividadReciente {
  tipo: string;
  fecha: string;
  usuario: string;
  curso: string;
  calificacion?: number;
  descripcion: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [cursosPopulares, setCursosPopulares] = useState<CursoPopular[]>([]);
  const [actividad, setActividad] = useState<ActividadReciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      // Usar solo los endpoints que ya existen
      const [
        cursosRes,
        usersRes,
        inscripcionesRes,
        avisosRes,
        resenasRes,
        notificacionesRes,
      ] = await Promise.all([
        authHttp.get("/cursos/"),
        authHttp.get("/users/"),
        authHttp.get("/inscripciones/"),
        authHttp.get("/avisos/"),
        authHttp.get("/resenas/").catch(() => ({ data: [] })),
        authHttp.get("/notificaciones/").catch(() => ({ data: [] })),
      ]);

      // Calcular estadísticas manualmente con los datos que tenemos
      const cursos = cursosRes.data?.results || cursosRes.data || [];
      const usuarios = usersRes.data?.results || usersRes.data || [];
      const inscripciones =
        inscripcionesRes.data?.results || inscripcionesRes.data || [];
      const avisos = avisosRes.data?.results || avisosRes.data || [];
      const resenas = resenasRes.data?.results || resenasRes.data || [];
      const notificaciones =
        notificacionesRes.data?.results || notificacionesRes.data || [];

      // Agrupar usuarios por perfil
      const usuariosPorPerfil: Record<string, number> = {};
      usuarios.forEach((u: any) => {
        const perfil = u.perfil || "estudiante";
        usuariosPorPerfil[perfil] = (usuariosPorPerfil[perfil] || 0) + 1;
      });

      const statsData: DashboardStats = {
        usuarios: {
          total: usuarios.length,
          activos: usuarios.filter((u: any) => u.is_active).length,
          por_perfil: Object.entries(usuariosPorPerfil).map(
            ([perfil, total]) => ({
              perfil,
              total,
            }),
          ),
          nuevos_mes: usuarios.filter((u: any) => {
            const fecha = new Date(u.fecha_creacion);
            const hace30Dias = new Date();
            hace30Dias.setDate(hace30Dias.getDate() - 30);
            return fecha >= hace30Dias;
          }).length,
        },
        cursos: {
          total: cursos.length,
          activos: cursos.filter((c: any) => c.activo || c.is_active).length,
          publicados: cursos.filter((c: any) => c.publicado).length,
        },
        inscripciones: {
          total: inscripciones.length,
          completadas: inscripciones.filter((i: any) => i.completado).length,
          progreso_promedio:
            inscripciones.length > 0
              ? inscripciones.reduce((acc: number, i: any) => {
                  const progreso =
                    typeof i.progreso === "string"
                      ? parseFloat(i.progreso)
                      : i.progreso || 0;
                  return acc + progreso;
                }, 0) / inscripciones.length
              : 0,
          nuevas_mes: inscripciones.filter((i: any) => {
            const fecha = new Date(i.fecha_inscripcion);
            const hace30Dias = new Date();
            hace30Dias.setDate(hace30Dias.getDate() - 30);
            return fecha >= hace30Dias;
          }).length,
        },
        resenas: {
          total: resenas.length,
          promedio_calificacion:
            resenas.length > 0
              ? resenas.reduce(
                  (acc: number, r: any) => acc + (r.rating || 0),
                  0,
                ) / resenas.length
              : 0,
        },
        avisos: {
          total: avisos.length,
          leidos: avisos.filter((a: any) => a.leido).length,
          no_leidos: avisos.filter((a: any) => !a.leido).length,
        },
        notificaciones: {
          total: notificaciones.length,
          no_leidas: notificaciones.filter((n: any) => !n.leida).length,
        },
      };

      setStats(statsData);

      // Cursos populares: ordenar por número de inscripciones
      const cursosConInscripciones = cursos.map((curso: any) => {
        // Las inscripciones vienen con curso como objeto, necesitamos comparar con curso.id
        const totalInscripciones = inscripciones.filter((i: any) => {
          const cursoId = i.curso?.id || i.curso_id || i.curso;
          return cursoId === curso.id;
        }).length;

        return {
          ...curso,
          total_inscripciones: totalInscripciones,
          promedio_rating: 0,
        };
      });

      cursosConInscripciones.sort(
        (a: any, b: any) => b.total_inscripciones - a.total_inscripciones,
      );
      setCursosPopulares(cursosConInscripciones.slice(0, 10));

      // Actividad reciente: últimas inscripciones
      const actividadReciente = inscripciones
        .sort(
          (a: any, b: any) =>
            new Date(b.fecha_inscripcion).getTime() -
            new Date(a.fecha_inscripcion).getTime(),
        )
        .slice(0, 20)
        .map((i: any) => {
          // La inscripción ya viene con el objeto curso completo del serializer
          const cursoData = i.curso;

          // La inscripción ya viene con el objeto usuario completo del serializer
          const usuarioData = i.usuario;

          let nombreUsuario = "Usuario";
          if (usuarioData) {
            const nombreCompleto =
              `${usuarioData.first_name || ""} ${usuarioData.last_name || ""}`.trim();
            nombreUsuario =
              nombreCompleto ||
              usuarioData.username ||
              usuarioData.email ||
              "Usuario";
          }

          const tituloCurso = cursoData?.titulo || "un curso";

          return {
            tipo: "inscripcion",
            fecha: i.fecha_inscripcion,
            usuario: nombreUsuario,
            curso: tituloCurso,
            descripcion: `Se inscribió en ${tituloCurso}`,
          };
        });

      setActividad(actividadReciente);
    } catch (e: any) {
      setError(
        e?.response?.data?.error ||
          e?.response?.data?.detail ||
          "Error al cargar estadísticas",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (error) return <ErrorMessage message={error} />;
  if (!stats) return null;

  const getPerfilLabel = (perfil: string) => {
    const labels: Record<string, string> = {
      estudiante: "Estudiantes",
      instructor: "Instructores",
      administrador: "Administradores",
    };
    return labels[perfil] || perfil;
  };

  const getPerfilColor = (perfil: string) => {
    const colors: Record<string, string> = {
      estudiante: "bg-blue-100 text-blue-800",
      instructor: "bg-green-100 text-green-800",
      administrador: "bg-purple-100 text-purple-800",
    };
    return colors[perfil] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de Administración
          </h1>
          <p className="text-gray-600 mt-2">
            Vista general de la plataforma de cursos
          </p>
        </div>

        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Usuarios */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
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
              <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                +{stats.usuarios.nuevos_mes} este mes
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.usuarios.total}
            </h3>
            <p className="text-sm text-gray-600">Total de usuarios</p>
            <div className="mt-3 text-xs text-gray-500">
              {stats.usuarios.activos} activos
            </div>
          </div>

          {/* Cursos */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
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
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.cursos.total}
            </h3>
            <p className="text-sm text-gray-600">Total de cursos</p>
            <div className="mt-3 text-xs text-gray-500">
              {stats.cursos.publicados} publicados
            </div>
          </div>

          {/* Inscripciones */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
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
              <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                +{stats.inscripciones.nuevas_mes} este mes
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.inscripciones.total}
            </h3>
            <p className="text-sm text-gray-600">Inscripciones totales</p>
            <div className="mt-3 text-xs text-gray-500">
              {stats.inscripciones.completadas} completadas
            </div>
          </div>

          {/* Reseñas */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.resenas.promedio_calificacion.toFixed(1)}
            </h3>
            <p className="text-sm text-gray-600">Calificación promedio</p>
            <div className="mt-3 text-xs text-gray-500">
              {stats.resenas.total} reseñas
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Distribución de Usuarios */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Distribución de Usuarios
            </h2>
            <div className="space-y-3">
              {stats.usuarios.por_perfil.map((item) => (
                <div
                  key={item.perfil}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getPerfilColor(item.perfil)}`}
                    >
                      {getPerfilLabel(item.perfil)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {item.total}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({((item.total / stats.usuarios.total) * 100).toFixed(1)}
                      %)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progreso General */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Métricas de Progreso
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">
                    Progreso promedio de cursos
                  </span>
                  <span className="font-semibold text-gray-900">
                    {stats.inscripciones.progreso_promedio.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#f8b31d] h-2 rounded-full transition-all"
                    style={{
                      width: `${stats.inscripciones.progreso_promedio}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Tasa de completación</span>
                  <span className="font-semibold text-gray-900">
                    {(
                      (stats.inscripciones.completadas /
                        stats.inscripciones.total) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${(stats.inscripciones.completadas / stats.inscripciones.total) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 mb-1">Avisos</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {stats.avisos.no_leidos}
                  </p>
                  <p className="text-xs text-blue-600">sin leer</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600 mb-1">Notificaciones</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {stats.notificaciones.no_leidas}
                  </p>
                  <p className="text-xs text-purple-600">sin leer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cursos Populares */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Cursos Más Populares
          </h2>
          <div className="space-y-3">
            {cursosPopulares.slice(0, 5).map((curso, index) => (
              <div
                key={curso.id}
                className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-[#f8b31d] rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {curso.titulo}
                  </p>
                  <p className="text-sm text-gray-500">
                    {curso.instructor.nombre}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">
                      {curso.total_inscripciones}
                    </p>
                    <p className="text-xs text-gray-500">Inscripciones</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold text-gray-900">
                      {curso.promedio_rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Actividad Reciente
          </h2>
          <div className="space-y-3">
            {actividad.slice(0, 10).map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.tipo === "inscripcion"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {item.tipo === "inscripcion" ? (
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{item.descripcion}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.usuario} •{" "}
                    {new Date(item.fecha).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {item.calificacion && (
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                    <svg
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-yellow-900">
                      {item.calificacion}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Enlaces Rápidos - Gestión */}
        <div className="mt-8 mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Accesos Rápidos
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <Link
            to="/app/admin/usuarios"
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition border border-gray-200 text-center"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-blue-600"
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
            <p className="text-sm font-medium text-gray-900">
              Gestionar Usuarios
            </p>
          </Link>

          <Link
            to="/app/admin/cursos"
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition border border-gray-200 text-center"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-purple-600"
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
            <p className="text-sm font-medium text-gray-900">
              Gestionar Cursos
            </p>
          </Link>

          <Link
            to="/app/admin/cursos/crear"
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition border border-gray-200 text-center"
          >
            <div className="w-12 h-12 bg-[#f8b31d] bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-[#f8b31d]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900">Crear Curso</p>
          </Link>

          <Link
            to="/app/admin/inscripciones"
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition border border-gray-200 text-center"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-green-600"
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
            <p className="text-sm font-medium text-gray-900">
              Gestionar Inscripciones
            </p>
          </Link>

          <Link
            to="/app/admin/resenas"
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition border border-gray-200 text-center"
          >
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900">Moderar Reseñas</p>
          </Link>

          <Link
            to="/app/admin/avisos"
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition border border-gray-200 text-center"
          >
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900">
              Gestionar Avisos
            </p>
          </Link>

          <Link
            to="/app/admin/estadisticas"
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition border border-gray-200 text-center"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900">Estadísticas</p>
          </Link>

          <Link
            to="/app/admin/analytics"
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition border border-gray-200 text-center"
          >
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-pink-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900">Analytics</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
