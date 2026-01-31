import { Link, useNavigate } from "react-router-dom";
import RequireRole from "../components/RequireRole";

export default function Sidebar({ onLogout }: { onLogout?: () => void }) {
  const nav = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    nav("/");
  };

  return (
    <aside className="border-r border-gray-200 bg-white p-4 dark:bg-slate-900 dark:border-slate-700">
      <div className="mb-3">
        <div className="font-extrabold text-[#f59e0b]">Cursos Online</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Área privada
        </div>
      </div>

      <div className="grid gap-2">
        {/* Dashboard solo para estudiantes */}
        <RequireRole roles={["estudiante"]} fallback={null}>
          <Link
            to="/app"
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-[#f8b31d] dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
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
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-[#f8b31d] hover:bg-gray-50 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              👥 Usuarios
            </Link>
            <Link
              to="/app/admin/cursos"
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-[#f8b31d] hover:bg-gray-50 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              📚 Cursos
            </Link>
            <Link
              to="/app/admin/inscripciones"
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-[#f8b31d] hover:bg-gray-50 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              ✅ Inscripciones
            </Link>
            <Link
              to="/app/admin/resenas"
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-[#f8b31d] hover:bg-gray-50 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              ⭐ Reseñas
            </Link>
            <Link
              to="/app/admin/avisos"
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-[#f8b31d] hover:bg-gray-50 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              📢 Avisos
            </Link>
            <Link
              to="/app/admin/estadisticas"
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-[#f8b31d] hover:bg-gray-50 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              📈 Estadísticas
            </Link>
            <Link
              to="/app/admin/analytics"
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-[#f8b31d] hover:bg-gray-50 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              📊 Analytics
            </Link>
          </div>
        </RequireRole>

        {/* Panel de Instructor */}
        <RequireRole roles={["instructor"]} fallback={null}>
          <Link
            to="/app/instructor"
            className="rounded-md border border-gray-200 bg-[#f8b31d] px-3 py-2 text-sm text-white font-semibold hover:bg-[#e0a419]"
          >
            🎓 Panel de Instructor
          </Link>

          {/* Opciones de instructor */}
          <div className="ml-2 grid gap-1 mt-1">
            <Link
              to="/app/instructor/cursos"
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-[#f8b31d] hover:bg-gray-50 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              📚 Mis Cursos
            </Link>
            <Link
              to="/app/instructor/estudiantes"
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-[#f8b31d] hover:bg-gray-50 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              👥 Mis Estudiantes
            </Link>
            <Link
              to="/app/instructor/resenas"
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-[#f8b31d] hover:bg-gray-50 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              ⭐ Mis Reseñas
            </Link>
          </div>
        </RequireRole>

        {/* Cursos - Solo para estudiantes */}
        <RequireRole roles={["estudiante"]} fallback={null}>
          <Link
            to="/app/cursos"
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-[#f8b31d] dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
          >
            📖 Cursos
          </Link>
        </RequireRole>

        <RequireRole roles={["estudiante"]} fallback={null}>
          <Link
            to="/app/cursos/mis-cursos"
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-[#f8b31d] dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
          >
            🎓 Mis Cursos
          </Link>
        </RequireRole>

        <RequireRole roles={["estudiante"]} fallback={null}>
          <Link
            to="/app/progreso-secciones"
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-[#f8b31d] dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
          >
            📈 Progreso por sección
          </Link>
        </RequireRole>

        {/* Avisos y Notificaciones */}
        <Link
          to="/app/avisos"
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-[#f8b31d] dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
        >
          📋 Avisos
        </Link>

        <Link
          to="/app/notificaciones"
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-[#f8b31d] dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
        >
          🔔 Notificaciones
        </Link>
      </div>
    </aside>
  );
}
