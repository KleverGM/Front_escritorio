import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authHttp } from "../../../infrastructure/http/httpClients";
import { useAuth } from "../../../application/auth/useAuth";
import RequireRole from "../../components/RequireRole";
import {
  FilterButtons,
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  TipoBadge,
} from "../../components/common";
import { formatRelativeDate } from "../../utils/dateFormatter";
import { showSuccessToast, confirmAction } from "../../utils/notifications";

type Aviso = {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: string;
  leido: boolean;
  fecha_creacion: string;
  usuario?: any;
};

export default function Avisos() {
  const { user } = useAuth() as { user: any | null };
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"todos" | "leidos" | "no_leidos">(
    "todos",
  );
  const [selectedAviso, setSelectedAviso] = useState<Aviso | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadAvisos = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    setError(null);

    try {
      const res = await authHttp.get("/avisos/", {
        params: {
          ordering: "-fecha_creacion",
        },
      });
      const data = res.data?.results ?? res.data ?? [];
      setAvisos(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "Error al cargar avisos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAvisos();
  }, []);

  const filteredAvisos = avisos.filter((aviso) => {
    if (filter === "leidos") return aviso.leido;
    if (filter === "no_leidos") return !aviso.leido;
    return true;
  });

  const markAsRead = async (aviso: Aviso) => {
    if (aviso.leido) return;

    try {
      await authHttp.patch(`/avisos/${aviso.id}/`, { leido: true });
      setAvisos((prev) =>
        prev.map((a) => (a.id === aviso.id ? { ...a, leido: true } : a)),
      );
    } catch (e) {
      console.error("Error al marcar como leído:", e);
    }
  };

  const deleteAviso = async (avisoId: number) => {
    if (!confirmAction("¿Estás seguro de eliminar este aviso?")) return;

    try {
      await authHttp.delete(`/avisos/${avisoId}/`);
      setAvisos((prev) => prev.filter((a) => a.id !== avisoId));
      setSelectedAviso(null);
      showSuccessToast("Aviso eliminado exitosamente");
    } catch (e: any) {
      alert(e?.response?.data?.detail ?? "Error al eliminar aviso");
    }
  };

  const handleAvisoClick = (aviso: Aviso) => {
    markAsRead(aviso);
    setSelectedAviso(aviso);
  };

  const unreadCount = avisos.filter((a) => !a.leido).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Avisos
              </h1>
              <p className="text-gray-600 dark:text-slate-400 mt-1">
                {unreadCount > 0 ? (
                  <span className="text-[#f8b31d] font-medium">
                    {unreadCount} sin leer
                  </span>
                ) : (
                  "No tienes avisos sin leer"
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => loadAvisos(true)}
                disabled={refreshing}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <svg
                  className={`w-5 h-5 text-gray-600 dark:text-slate-300 ${refreshing ? "animate-spin" : ""}`}
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

              <RequireRole roles={["admin", "instructor"]} fallback={null}>
                <Link
                  to="/app/avisos/crear"
                  className="px-4 py-2 bg-[#f8b31d] hover:bg-[#f59e0b] text-black font-medium rounded-lg transition-colors flex items-center gap-2"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Crear aviso
                </Link>
              </RequireRole>
            </div>
          </div>

          {/* Filtros */}
          <FilterButtons
            filter={filter}
            onFilterChange={(newFilter) => setFilter(newFilter)}
            unreadCount={unreadCount}
          />
        </div>

        {/* Contenido */}
        {loading && <LoadingSpinner />}

        {error && <ErrorMessage message={error} />}

        {!loading && !error && filteredAvisos.length === 0 && (
          <EmptyState
            icon="🔔"
            title={
              filter === "no_leidos"
                ? "No tienes avisos sin leer"
                : filter === "leidos"
                  ? "No tienes avisos leídos"
                  : "No tienes avisos"
            }
            description="Los avisos importantes aparecerán aquí"
          />
        )}

        {!loading && !error && filteredAvisos.length > 0 && (
          <div className="space-y-3">
            {filteredAvisos.map((aviso) => (
              <div
                key={aviso.id}
                onClick={() => handleAvisoClick(aviso)}
                className={`bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 ${
                  !aviso.leido
                    ? "border-[#f8b31d] bg-yellow-50 dark:bg-slate-800"
                    : "border-transparent"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <TipoBadge tipo={aviso.tipo} showIcon={true} />

                        {!aviso.leido && (
                          <span className="w-2 h-2 bg-[#f8b31d] rounded-full"></span>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {aviso.titulo}
                      </h3>

                      <p className="text-gray-700 dark:text-slate-300 line-clamp-2">
                        {aviso.mensaje}
                      </p>

                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {formatRelativeDate(aviso.fecha_creacion)}
                        </span>
                      </div>
                    </div>

                    <RequireRole
                      roles={["admin", "instructor"]}
                      fallback={null}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAviso(aviso.id);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Eliminar aviso"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </RequireRole>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de detalle */}
        {selectedAviso && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedAviso(null)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <TipoBadge tipo={selectedAviso.tipo} showIcon={true} />
                  <button
                    onClick={() => setSelectedAviso(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {selectedAviso.titulo}
                </h2>

                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedAviso.mensaje}
                  </p>
                </div>

                <div className="border-t pt-4 flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {formatRelativeDate(selectedAviso.fecha_creacion)}
                  </span>

                  {selectedAviso.leido && (
                    <span className="text-green-600 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Leído
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
