import React, { useEffect, useState } from "react";
import { authHttp } from "../../../../infrastructure/http/httpClients";
import { resenaService } from "../../../../application/resenas/resena.service";
import {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from "../../../components/common";

interface Resena {
  id: number;
  usuario?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  } | null;
  curso?: {
    id: number;
    titulo: string;
  } | null;
  rating?: number;
  calificacion?: number;
  nombre_usuario?: string;
  titulo_curso?: string;
  comentario: string;
  fecha_creacion: string;
  respuestas?: Array<{
    usuario_id: number;
    texto: string;
    fecha: string;
  }>;
}

export default function MisResenas() {
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("todas");
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
  const [replyingId, setReplyingId] = useState<number | null>(null);

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

  const handleReply = async (resenaId: number) => {
    const texto = (replyDrafts[resenaId] || "").trim();
    if (!texto) return;
    try {
      setReplyingId(resenaId);
      await resenaService.responder(String(resenaId), texto);
      setReplyDrafts((prev) => ({ ...prev, [resenaId]: "" }));
      await loadResenas();
    } catch (e: any) {
      setError(e?.response?.data?.detail || "No se pudo responder la reseña");
    } finally {
      setReplyingId(null);
    }
  };

  const filteredResenas = resenas.filter((r) => {
    const rating = r.rating ?? r.calificacion ?? 0;
    if (filter === "todas") return true;
    if (filter === "5") return rating === 5;
    if (filter === "4") return rating === 4;
    if (filter === "3") return rating === 3;
    if (filter === "baja") return rating <= 2;
    return true;
  });

  const promedioCalificacion =
    resenas.length > 0
      ? resenas.reduce((acc, r) => acc + (r.rating ?? r.calificacion ?? 0), 0) /
        resenas.length
      : 0;

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Mis Reseñas
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Opiniones de estudiantes sobre tus cursos
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Total de reseñas
          </p>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-gray-100">
            {resenas.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Calificación promedio
          </p>
          <p className="text-2xl font-bold mt-1 flex items-center gap-2 text-gray-900 dark:text-gray-100">
            {promedioCalificacion.toFixed(1)}
            <svg
              className="w-5 h-5 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            5 estrellas
          </p>
          <p className="text-2xl font-bold mt-1 text-green-600">
            {
              resenas.filter((r) => (r.rating ?? r.calificacion ?? 0) === 5)
                .length
            }
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Necesitan atención
          </p>
          <p className="text-2xl font-bold mt-1 text-red-600">
            {
              resenas.filter((r) => (r.rating ?? r.calificacion ?? 0) <= 2)
                .length
            }
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-lg shadow mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Filtrar por:
          </span>
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
                    {resena.nombre_usuario ||
                      `${resena.usuario?.first_name ?? ""} ${resena.usuario?.last_name ?? ""}`.trim() ||
                      resena.usuario?.username ||
                      "Usuario"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Curso:{" "}
                    {resena.titulo_curso ||
                      resena.curso?.titulo ||
                      "Sin título"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(resena.fecha_creacion).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
                        star <= (resena.rating ?? resena.calificacion ?? 0)
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

              {resena.respuestas && resena.respuestas.length > 0 && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Respuestas del instructor
                  </p>
                  <div className="space-y-2">
                    {resena.respuestas.map((respuesta, idx) => (
                      <div
                        key={`${resena.id}-${idx}`}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                      >
                        <p className="text-sm text-gray-700">
                          {respuesta.texto}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(respuesta.fecha).toLocaleDateString(
                            "es-ES",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700">
                  Responder
                </label>
                <textarea
                  value={replyDrafts[resena.id] || ""}
                  onChange={(e) =>
                    setReplyDrafts((prev) => ({
                      ...prev,
                      [resena.id]: e.target.value,
                    }))
                  }
                  rows={3}
                  className="mt-2 w-full border border-gray-300 rounded-lg p-2 text-sm"
                  placeholder="Escribe una respuesta para el estudiante..."
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => handleReply(resena.id)}
                    disabled={replyingId === resena.id}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
                  >
                    {replyingId === resena.id ? "Enviando..." : "Responder"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
