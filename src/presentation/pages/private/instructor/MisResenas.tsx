import React, { useEffect, useState } from "react";
import { authHttp } from "../../../../infrastructure/http/httpClients";
import { LoadingSpinner, ErrorMessage, EmptyState } from "../../../components/common";

interface Resena {
  id: number;
  usuario: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  } | null;
  curso: {
    id: number;
    titulo: string;
  } | null;
  calificacion: number;
  comentario: string;
  fecha_creacion: string;
}

export default function MisResenas() {
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("todas");

  useEffect(() => {
    loadResenas();
  }, []);

  const loadResenas = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await authHttp.get("/resenas/mis_resenas/");
      const data = res.data?.results || res.data || [];
      setResenas(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error("Error cargando reseñas:", e);
      setError("No se pudieron cargar las reseñas");
    } finally {
      setLoading(false);
    }
  };

  const filteredResenas = resenas.filter((r) => {
    if (filter === "todas") return true;
    if (filter === "5") return r.calificacion === 5;
    if (filter === "4") return r.calificacion === 4;
    if (filter === "3") return r.calificacion === 3;
    if (filter === "baja") return r.calificacion <= 2;
    return true;
  });

  const promedioCalificacion =
    resenas.length > 0
      ? resenas.reduce((acc, r) => acc + r.calificacion, 0) / resenas.length
      : 0;

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Mis Reseñas</h1>
        <p className="text-gray-600 mt-1">
          Opiniones de estudiantes sobre tus cursos
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total de reseñas</p>
          <p className="text-2xl font-bold mt-1">{resenas.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Calificación promedio</p>
          <p className="text-2xl font-bold mt-1 flex items-center gap-2">
            {promedioCalificacion.toFixed(1)}
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">5 estrellas</p>
          <p className="text-2xl font-bold mt-1 text-green-600">
            {resenas.filter((r) => r.calificacion === 5).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Necesitan atención</p>
          <p className="text-2xl font-bold mt-1 text-red-600">
            {resenas.filter((r) => r.calificacion <= 2).length}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Filtrar por:</span>
          <button
            onClick={() => setFilter("todas")}
            className={`px-3 py-1 rounded text-sm ${
              filter === "todas"
                ? "bg-[#f8b31d] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter("5")}
            className={`px-3 py-1 rounded text-sm ${
              filter === "5"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            5★
          </button>
          <button
            onClick={() => setFilter("4")}
            className={`px-3 py-1 rounded text-sm ${
              filter === "4"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            4★
          </button>
          <button
            onClick={() => setFilter("3")}
            className={`px-3 py-1 rounded text-sm ${
              filter === "3"
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            3★
          </button>
          <button
            onClick={() => setFilter("baja")}
            className={`px-3 py-1 rounded text-sm ${
              filter === "baja"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            ≤2★
          </button>
        </div>
      </div>

      {/* Lista de reseñas */}
      {filteredResenas.length === 0 ? (
        <EmptyState
          title="No hay reseñas"
          message={
            filter === "todas"
              ? "Aún no tienes reseñas en tus cursos"
              : "No hay reseñas con este filtro"
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
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredResenas.map((resena) => (
            <div key={resena.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">
                    {resena.usuario?.first_name} {resena.usuario?.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Curso: {resena.curso?.titulo || "Sin título"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(resena.fecha_creacion).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
                        star <= resena.calificacion
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{resena.comentario}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
