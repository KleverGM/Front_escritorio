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
import { confirmAction } from "../../utils/notifications";

interface Notificacion {
  id: number;
  usuario_id: number | null;
  tipo: "mensaje_sistema" | "aviso" | "recordatorio" | "urgente";
  titulo: string;
  mensaje: string;
  leida: boolean;
  fecha_creacion: string;
  fecha_lectura?: string | null;
  emisor?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
}

export default function Notificaciones() {
  const { user } = useAuth();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<"todos" | "leidos" | "no_leidos">(
    "todos",
  );
  const [selectedNotif, setSelectedNotif] = useState<Notificacion | null>(null);
  const [noleidasCount, setNoleidasCount] = useState(0);

  const isAdmin = user?.rol === "admin";

  const loadNotificaciones = () => {
    setLoading(true);
    setError(null);
    let url = "/notificaciones/";
    if (filtro === "no_leidos") url = "/notificaciones/no_leidas/";

    authHttp
      .get(url)
      .then((res) => {
        const data = res.data?.results ?? res.data ?? [];
        const list = Array.isArray(data) ? data : [];
        if (filtro === "leidos") {
          setNotificaciones(list.filter((n) => n.leida));
        } else {
          setNotificaciones(list);
        }
        setNoleidasCount(list.filter((n) => !n.leida).length);
      })
      .catch((e) => {
        setError(e?.response?.data?.detail ?? "Error al cargar notificaciones");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNotificaciones();
  }, [filtro]);

  const markAsRead = async (id: number) => {
    try {
      await authHttp.post(`/notificaciones/${id}/marcar_leida/`);

      // Actualizar localmente
      setNotificaciones((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, leida: true, fecha_lectura: new Date().toISOString() }
            : n,
        ),
      );
      setNoleidasCount((prev) => Math.max(0, prev - 1));

      // Si estamos en el filtro "no_leidos", remover de la lista
      if (filtro === "no_leidos") {
        setNotificaciones((prev) => prev.filter((n) => n.id !== id));
      }

      // Cerrar el modal si está abierto
      if (selectedNotif?.id === id) {
        setSelectedNotif(null);
      }
    } catch (e: any) {
      console.error("Error al marcar como leída:", e);
    }
  };

  const deleteNotificacion = async (id: number) => {
    if (!confirmAction("¿Eliminar esta notificación?")) return;
    try {
      await authHttp.delete(`/notificaciones/${id}/`);
      setNotificaciones((prev) => prev.filter((n) => n.id !== id));
      const deleted = notificaciones.find((n) => n.id === id);
      if (deleted && !deleted.leida) {
        setNoleidasCount((prev) => Math.max(0, prev - 1));
      }
      if (selectedNotif?.id === id) setSelectedNotif(null);
    } catch (e: any) {
      alert(
        "Error al eliminar: " +
          (e?.response?.data?.detail ?? "Error desconocido"),
      );
    }
  };

  const noleidas = noleidasCount;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Notificaciones
          </h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">
            {noleidas > 0
              ? `${noleidas} sin leer`
              : "No hay notificaciones sin leer"}
          </p>
        </div>
        <RequireRole roles={["admin"]} fallback={null}>
          <Link
            to="/app/notificaciones/crear"
            className="px-4 py-2 bg-[#f8b31d] text-white rounded-lg hover:bg-[#e0a419] transition-colors font-medium"
          >
            + Nueva Notificación
          </Link>
        </RequireRole>
      </div>

      {/* Filtros */}
      <FilterButtons
        filter={filtro}
        onFilterChange={(newFilter) => setFiltro(newFilter)}
        unreadCount={noleidas}
      />

      {/* Loading y Error */}
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {/* Lista de notificaciones */}
      {!loading && !error && (
        <>
          {notificaciones.length === 0 ? (
            <EmptyState
              icon="🔔"
              title="No hay notificaciones"
              description={
                filtro === "leidos"
                  ? "No tienes notificaciones leídas"
                  : filtro === "no_leidos"
                    ? "No tienes notificaciones sin leer"
                    : "Aún no tienes notificaciones"
              }
            />
          ) : (
            <div className="space-y-3">
              {notificaciones.map((notif) => (
                <div
                  key={notif.id}
                  className={`border rounded-xl p-4 transition-all hover:shadow-md cursor-pointer ${
                    !notif.leida
                      ? "bg-blue-50 border-blue-200 dark:bg-slate-800 dark:border-slate-700"
                      : "bg-white dark:bg-slate-900 dark:border-slate-800"
                  }`}
                  onClick={() => {
                    setSelectedNotif(notif);
                    if (!notif.leida) markAsRead(notif.id);
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <TipoBadge tipo={notif.tipo} showIcon={false} />
                        {!notif.leida && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                        <span className="text-xs text-gray-500 dark:text-slate-400">
                          {formatRelativeDate(notif.fecha_creacion)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {notif.titulo}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-slate-300 line-clamp-2">
                        {notif.mensaje}
                      </p>
                      {notif.usuario_id === null && (
                        <span className="inline-block mt-2 text-xs text-gray-500 dark:text-slate-400 italic">
                          🌐 Global
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!notif.leida && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notif.id);
                          }}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Marcar leída
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotificacion(notif.id);
                        }}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal de detalle */}
      {selectedNotif && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedNotif(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TipoBadge tipo={selectedNotif.tipo} showIcon={false} />
                  {selectedNotif.usuario_id === null && (
                    <span className="text-xs text-gray-500 dark:text-slate-400">
                      🌐 Global
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedNotif(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedNotif.titulo}
              </h2>
              <div className="prose max-w-none mb-4">
                <p className="text-gray-700 dark:text-slate-300 whitespace-pre-wrap">
                  {selectedNotif.mensaje}
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-slate-800 pt-4 text-sm text-gray-600 dark:text-slate-400">
                <p>
                  📅 Creada:{" "}
                  {new Date(selectedNotif.fecha_creacion).toLocaleString()}
                </p>
                {selectedNotif.leida && selectedNotif.fecha_lectura && (
                  <p>
                    ✅ Leída:{" "}
                    {new Date(selectedNotif.fecha_lectura).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
