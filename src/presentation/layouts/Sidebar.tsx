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
        <Link to="/app" className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-[#f8b31d]">
          Dashboard
        </Link>
        <Link to="/app/cursos" className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-[#f8b31d]">
          Cursos
        </Link>
        <RequireRole roles={["admin"]} fallback={null}>
          <Link to="/app/notificaciones" className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-[#f8b31d]">
            Notificaciones
          </Link>
        </RequireRole>
      </div>
    </aside>
  );
}
