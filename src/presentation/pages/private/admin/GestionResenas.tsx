import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authHttp } from "../../../../infrastructure/http/httpClients";
import { LoadingSpinner, ErrorMessage } from "../../../components/common";
import ResenaFilters from "../../../components/admin/ResenaFilters";
import ResenaStats from "../../../components/admin/ResenaStats";
import ResenaCard from "../../../components/admin/ResenaCard";

interface Respuesta {
  usuario_id: number;
  texto: string;
  fecha: string;
}

interface Resena {
  id: string;
  curso_id: number;
  usuario_id: number;
  rating: number;
  titulo: string;
  comentario: string;
  fecha_creacion: string;
  fecha_modificacion?: string;
  verificado_compra: boolean;
  util_count: number;
  usuarios_util: number[];
  respuestas: Respuesta[];
  imagenes: string[];
  tags: string[];
  nombre_usuario: string;
  titulo_curso: string;
  es_mia: boolean;
}

export default function GestionResenas() {
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Estados de filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [cursoFilter, setCursoFilter] = useState("");

  // Cursos disponibles (para el filtro)
  const [cursos, setCursos] = useState<Array<{ id: number; titulo: string }>>(
    [],
  );

  useEffect(() => {
    loadResenas();
    loadCursos();
  }, []);

  const loadResenas = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await authHttp.get("/resenas/?page_size=1000");
      setResenas(res.data.results || []);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.error ||
          "Error al cargar las reseñas",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadCursos = async () => {
    try {
      const res = await authHttp.get("/cursos/");
      setCursos(res.data.results || res.data);
    } catch (err) {
      console.error("Error cargando cursos:", err);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    setError(null);

    try {
      await authHttp.delete(`/resenas/${id}/`);
      setResenas((prev) => prev.filter((r) => r.id !== id));
      alert("Reseña eliminada exitosamente");
    } catch (err: any) {
      const mensaje =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        "Error al eliminar la reseña";
      setError(mensaje);
      alert(mensaje);
    } finally {
      setDeleting(false);
    }
  };

  // Filtrado local
  const filteredResenas = resenas.filter((resena) => {
    // Filtro de búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        resena.comentario.toLowerCase().includes(query) ||
        resena.nombre_usuario.toLowerCase().includes(query) ||
        resena.titulo_curso.toLowerCase().includes(query) ||
        (resena.titulo && resena.titulo.toLowerCase().includes(query));

      if (!matchesSearch) return false;
    }

    // Filtro de calificación
    if (ratingFilter !== null && resena.rating !== ratingFilter) {
      return false;
    }

    // Filtro de curso
    if (cursoFilter && resena.curso_id !== parseInt(cursoFilter)) {
      return false;
    }

    return true;
  });

  // Calcular estadísticas
  const calcularEstadisticas = () => {
    const total = filteredResenas.length;
    if (total === 0) {
      return {
        total_resenas: 0,
        rating_promedio: 0,
        distribucion: { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 },
      };
    }

    const suma = filteredResenas.reduce((acc, r) => acc + r.rating, 0);
    const promedio = suma / total;

    const distribucion: any = { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };
    filteredResenas.forEach((r) => {
      const key = Math.floor(r.rating).toString();
      if (key in distribucion) {
        distribucion[key]++;
      }
    });

    return {
      total_resenas: total,
      rating_promedio: promedio,
      distribucion,
    };
  };

  const stats = calcularEstadisticas();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/app/admin"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Volver al Panel de Admin
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Moderación de Reseñas
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona y modera las reseñas de todos los cursos
              </p>
            </div>
            <button
              onClick={loadResenas}
              disabled={loading || deleting}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg
                className={`w-5 h-5 ${loading || deleting ? "animate-spin" : ""}`}
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

        {/* Error Message */}
        {error && <ErrorMessage message={error} className="mb-6" />}

        {/* Estadísticas */}
        {filteredResenas.length > 0 && (
          <ResenaStats
            totalResenas={stats.total_resenas}
            promedioRating={stats.rating_promedio}
            distribucion={stats.distribucion}
          />
        )}

        {/* Filtros */}
        <ResenaFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          ratingFilter={ratingFilter}
          onRatingFilterChange={setRatingFilter}
          cursoFilter={cursoFilter}
          onCursoFilterChange={setCursoFilter}
          cursos={cursos}
        />

        {/* Lista de reseñas */}
        {filteredResenas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron reseñas
            </h3>
            <p className="text-gray-600">
              {searchQuery || ratingFilter || cursoFilter
                ? "Intenta ajustar los filtros de búsqueda"
                : "No hay reseñas disponibles en este momento"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Mostrando {filteredResenas.length} de {resenas.length} reseñas
            </p>
            {filteredResenas.map((resena) => (
              <ResenaCard
                key={resena.id}
                resena={resena}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
