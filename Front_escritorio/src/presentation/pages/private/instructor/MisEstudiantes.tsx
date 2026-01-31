import React, { useEffect, useState } from "react";
import { authHttp } from "../../../../infrastructure/http/httpClients";
import {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from "../../../components/common";
import {
  EstudiantesStats,
  EstudiantesFilters,
  EstudiantesTable,
} from "../../../components/instructor";

interface Inscripcion {
  id: number;
  usuario: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  curso: {
    id: number;
    titulo: string;
  } | null;
  fecha_inscripcion: string;
  progreso: number;
  completado: boolean;
  estado: string;
}

interface Curso {
  id: number;
  titulo: string;
  total_inscripciones: number;
}

export default function MisEstudiantes() {
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCurso, setFilterCurso] = useState<string>("todos");
  const [filterEstado, setFilterEstado] = useState<string>("todos");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [inscripcionesRes, cursosRes] = await Promise.all([
        authHttp.get("/inscripciones/"),
        authHttp.get("/cursos/mis_cursos/"),
      ]);

      const inscripcionesData =
        inscripcionesRes.data?.results || inscripcionesRes.data || [];
      const cursosData = cursosRes.data?.results || cursosRes.data || [];

      setInscripciones(
        Array.isArray(inscripcionesData) ? inscripcionesData : [],
      );
      setCursos(Array.isArray(cursosData) ? cursosData : []);
    } catch (e: any) {
      console.error("Error cargando datos:", e);
      setError("No se pudieron cargar los estudiantes");
    } finally {
      setLoading(false);
    }
  };

  // Obtener cursos únicos
  const cursosUnicos = Array.from(
    new Set(inscripciones.map((i) => i.curso?.titulo).filter(Boolean)),
  ) as string[];

  // Función para obtener el conteo de inscripciones por curso
  const getCursoCount = (curso: string): number => {
    return inscripciones.filter((i) => i.curso?.titulo === curso).length;
  };

  // Filtrar inscripciones
  const filteredInscripciones = inscripciones.filter((i) => {
    const matchesSearch =
      searchQuery === "" ||
      i.usuario?.first_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      i.usuario?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.usuario?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.curso?.titulo?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCurso =
      filterCurso === "todos" || i.curso?.titulo === filterCurso;

    let matchesEstado = true;
    if (filterEstado === "active") {
      matchesEstado = !i.completado && i.progreso > 0;
    } else if (filterEstado === "completed") {
      matchesEstado = i.completado;
    } else if (filterEstado === "inactive") {
      matchesEstado = !i.completado && i.progreso === 0;
    }

    return matchesSearch && matchesCurso && matchesEstado;
  });

  // Ordenar por fecha de inscripción (más recientes primero)
  const sortedInscripciones = [...filteredInscripciones].sort(
    (a, b) =>
      new Date(b.fecha_inscripcion).getTime() -
      new Date(a.fecha_inscripcion).getTime(),
  );

  // Estadísticas
  const totalEstudiantes = new Set(inscripciones.map((i) => i.usuario?.id))
    .size;
  const completados = inscripciones.filter((i) => i.completado).length;
  const activos = inscripciones.filter(
    (i) => !i.completado && i.progreso > 0,
  ).length;
  const inactivos = inscripciones.filter(
    (i) => !i.completado && i.progreso === 0,
  ).length;
  const progresoPromedio =
    inscripciones.length > 0
      ? inscripciones.reduce((acc, i) => acc + (i.progreso || 0), 0) /
        inscripciones.length
      : 0;

  // Estudiantes nuevos del mes
  const fechaMesAtras = new Date();
  fechaMesAtras.setMonth(fechaMesAtras.getMonth() - 1);
  const nuevosEstudiantes = inscripciones.filter((i) => {
    const fecha = new Date(i.fecha_inscripcion);
    return fecha >= fechaMesAtras;
  }).length;

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mis Estudiantes</h1>
          <p className="text-gray-600 mt-1">
            Estudiantes inscritos en tus cursos
          </p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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

      {/* Estadísticas */}
      <EstudiantesStats
        totalEstudiantes={totalEstudiantes}
        activos={activos}
        completados={completados}
        inactivos={inactivos}
        progresoPromedio={progresoPromedio}
        nuevosEstudiantes={nuevosEstudiantes}
        totalInscripciones={inscripciones.length}
      />

      {/* Filtros */}
      <EstudiantesFilters
        searchQuery={searchQuery}
        filterCurso={filterCurso}
        filterEstado={filterEstado}
        cursosUnicos={cursosUnicos}
        inscripcionesCount={inscripciones.length}
        activosCount={activos}
        completadosCount={completados}
        inactivosCount={inactivos}
        onSearchChange={setSearchQuery}
        onCursoChange={setFilterCurso}
        onEstadoChange={setFilterEstado}
        onClearFilters={() => {
          setSearchQuery("");
          setFilterCurso("todos");
          setFilterEstado("todos");
        }}
        getCursoCount={getCursoCount}
      />

      {/* Tabla de estudiantes o estado vacío */}
      {sortedInscripciones.length === 0 ? (
        <EmptyState
          title="No hay estudiantes"
          message={
            searchQuery || filterCurso !== "todos" || filterEstado !== "todos"
              ? "No se encontraron resultados con los filtros aplicados"
              : "Aún no tienes estudiantes inscritos en tus cursos"
          }
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
        />
      ) : (
        <>
          {/* Información de resultados */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Mostrando{" "}
              <span className="font-semibold">
                {sortedInscripciones.length}
              </span>{" "}
              de <span className="font-semibold">{inscripciones.length}</span>{" "}
              inscripciones
            </p>
          </div>

          {/* Tabla */}
          <EstudiantesTable inscripciones={sortedInscripciones} />
        </>
      )}
    </div>
  );
}
