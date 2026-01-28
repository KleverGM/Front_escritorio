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
            return <div className="mr-3 text-sm text-slate-700">{user.first_name ?? user.username}</div>;
          }
        } catch {
          return null;
        }
        return null;
      })()}
      <button
        onClick={async (e) => {
          e.preventDefault();
          const next = !notifOpen;
          setNotifOpen(next);
          if (next) {
            setNotifError(null);
            setNotifLoading(true);
            try {
              const res = await authHttp.get('/notificaciones/no_leidas/');
              const data = res.data?.results ?? res.data ?? [];
              setNotifications(Array.isArray(data) ? data : []);
            } catch (err: any) {
              setNotifError(err?.response?.data?.detail ?? 'Error al cargar notificaciones');
            } finally {
              setNotifLoading(false);
            }
          }
        }}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <span className="sr-only">Notificaciones</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {notifications.length > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">{notifications.length}</span>
        ) : null}
      </button>

      {notifOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">Notificaciones</div>
              <div>
                <button
                  className="text-xs text-gray-500 hover:underline"
                  onClick={async () => {
                    try {
                      await authHttp.post('/notificaciones/marcar_todas_leidas/');
                      setNotifications([]);
                    } catch (_) {}
                  }}
                >
                  Marcar todas leídas
                </button>
              </div>
            </div>
            {notifLoading && <div>Cargando...</div>}
            {notifError && <div className="text-red-600">{notifError}</div>}
            {!notifLoading && !notifError && (
              <ul className="space-y-2 max-h-72 overflow-auto">
                {notifications.length === 0 && <li className="text-gray-500">No hay notificaciones.</li>}
                {notifications.map((n: any) => (
                  <li key={n.id ?? n._id ?? n.pk} className="p-2 border rounded flex justify-between items-start">
                    <div>
                      <div className="font-medium">{n.titulo ?? n.message ?? 'Sin título'}</div>
                      <div className="text-sm text-gray-600">{n.mensaje ?? n.message ?? ''}</div>
                      <div className="text-xs text-gray-400 mt-1">{n.fecha_creacion ?? n.created_at ?? ''}</div>
                    </div>
                    <div className="pl-3">
                      <button className="text-xs text-blue-600" onClick={async () => {
                        try {
                          const id = n.id ?? n._id ?? n.pk;
                          await authHttp.post(`/notificaciones/${id}/marcar_leida/`);
                          setNotifications((s) => s.filter(x => (x.id ?? x._id ?? x.pk) !== id));
                        } catch (_) {}
                      }}>Marcar leída</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-2 text-right">
              <Link to="/app/notificaciones" className="text-sm text-gray-700 hover:underline">Ver todas</Link>
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
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">U</div>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3">
            <Link to="/app/profile" className="block py-2 px-2 text-sm text-gray-800 hover:bg-gray-50 rounded">Perfil</Link>
            <Link to="/app/purchases" className="block py-2 px-2 text-sm text-gray-800 hover:bg-gray-50 rounded">Mis compras</Link>
            <div className="border-t border-gray-100 my-2" />
            <button onClick={handleLogout} className="w-full text-left py-2 px-2 text-sm text-red-600 hover:bg-gray-50 rounded">Cerrar sesión</button>
          </div>
        </div>
      )}
    </div>
  );
}
