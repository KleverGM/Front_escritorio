import { Link, useNavigate } from "react-router-dom";
import RequireRole from "../components/RequireRole";

export default function Sidebar({ onLogout }: { onLogout?: () => void }) {
  const nav = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    nav("/");
  };

  return (
    <aside className="border-r border-gray-200 bg-white p-4">
      <div className="mb-3">
        <div className="font-extrabold text-[#f59e0b]">Cursos Online</div>
        <div className="text-xs text-slate-500">Área privada</div>
      </div>

      <div className="grid gap-2">
        <RequireRole roles={["estudiante", "instructor"]} fallback={null}>
          <Link
            to="/app"
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-[#f8b31d]"
          >
            Dashboard
          </Link>
        </RequireRole>

        {/* Panel de Admin */}
        <RequireRole roles={["admin", "administrador"]} fallback={null}>
          <Link
            to="/app/admin"
            className="rounded-md border border-gray-200 bg-[#f8b31d] px-3 py-2 text-sm text-white font-semibold hover:bg-[#e0a419]"
          >
            📊 Panel de Admin
          </Link>

          {/* Gestión */}
          <div className="ml-2 grid gap-1 mt-1">
            <Link
              to="/app/admin/usuarios"
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-[#f8b31d] hover:bg-gray-50"
            >
              👥 Usuarios
            </Link>
            <Link
              to="/app/admin/cursos"
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-[#f8b31d] hover:bg-gray-50"
            >
              📚 Cursos
            </Link>
            <Link
              to="/app/admin/inscripciones"
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-[#f8b31d] hover:bg-gray-50"
            >
              ✅ Inscripciones
            </Link>
            <Link
              to="/app/admin/resenas"
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-[#f8b31d] hover:bg-gray-50"
            >
              ⭐ Reseñas
            </Link>
            <Link
              to="/app/admin/avisos"
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-[#f8b31d] hover:bg-gray-50"
            >
              📢 Avisos
            </Link>
            <Link
              to="/app/admin/estadisticas"
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-[#f8b31d] hover:bg-gray-50"
            >
              📈 Estadísticas
            </Link>
            <Link
              to="/app/admin/analytics"
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-[#f8b31d] hover:bg-gray-50"
            >
              📊 Analytics
            </Link>
          </div>
        </RequireRole>

        {/* Cursos */}
        <Link
          to="/app/cursos"
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-[#f8b31d]"
        >
          📖 Cursos
        </Link>

        <RequireRole roles={["estudiante"]} fallback={null}>
          <Link
            to="/app/cursos/mis-cursos"
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-[#f8b31d]"
          >
            🎓 Mis Cursos
          </Link>
        </RequireRole>

        {/* Avisos y Notificaciones */}
        <Link
          to="/app/avisos"
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-[#f8b31d]"
        >
          📋 Avisos
        </Link>

        <Link
          to="/app/notificaciones"
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-[#f8b31d]"
        >
          🔔 Notificaciones
        </Link>
      </div>
    </aside>
  );
}
