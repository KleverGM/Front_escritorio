import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../application/auth/useAuth";
import { authHttp } from "../../infrastructure/http/httpClients";

export default function Header({ onLogout }: { onLogout?: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const ref = useRef<HTMLDivElement | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      setIsDark(true);
    } else if (stored === "light") {
      setIsDark(false);
    } else if (window.matchMedia) {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
        setNotifOpen(false);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const handleLogout = () => {
    if (onLogout) onLogout();
    nav("/");
    try {
      window.location.reload();
    } catch {}
  };

  return (
    <div className="relative flex items-center gap-3" ref={ref}>
      {/* Debug: show current user while investigating token issues */}
      {(() => {
        try {
          const { user } = useAuth() as { user: any | null };
          if (user) {
            return (
              <div className="mr-3 text-sm text-slate-700">
                {user.first_name ?? user.username}
              </div>
            );
          }
        } catch {
          return null;
        }
        return null;
      })()}
      <button
        onClick={() => setIsDark((prev) => !prev)}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
        aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      >
        {isDark ? (
          <svg
            className="h-6 w-6 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364-1.414 1.414M7.05 16.95l-1.414 1.414M16.95 16.95l1.414 1.414M7.05 7.05 5.636 5.636M12 8a4 4 0 100 8 4 4 0 000-8z"
            />
          </svg>
        ) : (
          <svg
            className="h-6 w-6 text-slate-600 dark:text-slate-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
            />
          </svg>
        )}
      </button>

      <button
        onClick={async (e) => {
          e.preventDefault();
          const next = !notifOpen;
          setNotifOpen(next);
          if (next) {
            setNotifError(null);
            setNotifLoading(true);
            try {
              const res = await authHttp.get("/notificaciones/no_leidas/");
              const data = res.data?.results ?? res.data ?? [];
              setNotifications(Array.isArray(data) ? data : []);
            } catch (err: any) {
              setNotifError(
                err?.response?.data?.detail ?? "Error al cargar notificaciones",
              );
            } finally {
              setNotifLoading(false);
            }
          }
        }}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
      >
        <span className="sr-only">Notificaciones</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-600 dark:text-slate-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {notifications.length > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {notifications.length}
          </span>
        ) : null}
      </button>

      {notifOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 dark:bg-slate-900 dark:border-slate-700">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-slate-900 dark:text-slate-100">
                Notificaciones
              </div>
              <div>
                <button
                  className="text-xs text-gray-500 hover:underline dark:text-slate-400"
                  onClick={async () => {
                    try {
                      await authHttp.post(
                        "/notificaciones/marcar_todas_leidas/",
                      );
                      setNotifications([]);
                    } catch (_) {}
                  }}
                >
                  Marcar todas leídas
                </button>
              </div>
            </div>
            {notifLoading && (
              <div className="text-slate-700 dark:text-slate-300">
                Cargando...
              </div>
            )}
            {notifError && <div className="text-red-600">{notifError}</div>}
            {!notifLoading && !notifError && (
              <ul className="space-y-2 max-h-72 overflow-auto">
                {notifications.length === 0 && (
                  <li className="text-gray-500 dark:text-slate-400">
                    No hay notificaciones.
                  </li>
                )}
                {notifications.map((n: any) => (
                  <li
                    key={n.id ?? n._id ?? n.pk}
                    className="p-2 border rounded flex justify-between items-start dark:border-slate-700"
                  >
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {n.titulo ?? n.message ?? "Sin título"}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-slate-300">
                        {n.mensaje ?? n.message ?? ""}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {n.fecha_creacion ?? n.created_at ?? ""}
                      </div>
                    </div>
                    <div className="pl-3">
                      <button
                        className="text-xs text-blue-600"
                        onClick={async () => {
                          try {
                            const id = n.id ?? n._id ?? n.pk;
                            await authHttp.post(
                              `/notificaciones/${id}/marcar_leida/`,
                            );
                            setNotifications((s) =>
                              s.filter((x) => (x.id ?? x._id ?? x.pk) !== id),
                            );
                          } catch (_) {}
                        }}
                      >
                        Marcar leída
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-2 text-right">
              <Link
                to="/app/notificaciones"
                className="text-sm text-gray-700 hover:underline dark:text-slate-300"
              >
                Ver todas
              </Link>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-3 rounded-full hover:opacity-90"
      >
        <span className="sr-only">Abrir menú de usuario</span>
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-700 dark:bg-slate-700 dark:text-slate-100">
          U
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 dark:bg-slate-900 dark:border-slate-700">
          <div className="p-3">
            <Link
              to="/app/profile"
              className="block py-2 px-2 text-sm text-gray-800 hover:bg-gray-50 rounded dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Perfil
            </Link>
            <Link
              to="/app/purchases"
              className="block py-2 px-2 text-sm text-gray-800 hover:bg-gray-50 rounded dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Mis compras
            </Link>
            <div className="border-t border-gray-100 my-2" />
            <button
              onClick={handleLogout}
              className="w-full text-left py-2 px-2 text-sm text-red-600 hover:bg-gray-50 rounded dark:hover:bg-slate-800"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
