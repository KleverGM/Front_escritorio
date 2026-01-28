import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../application/auth/useAuth";

export default function PublicLayout() {
  const auth = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    auth.logout();
    nav("/", { replace: true });
    // force full reload to ensure no stale in-memory state remains
    try {
      window.location.reload();
    } catch {}
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <div className="font-extrabold text-brand">Cursos Online</div>
            <div className="text-xs text-slate-500">Área pública</div>
          </div>

          <nav className="flex gap-4 text-sm items-center">
            <Link to="/" className="text-slate-700 hover:text-slate-900">Inicio</Link>
            {!auth.isAuthenticated ? (
              <>
                <Link to="/register" className="text-brand hover:opacity-90">Registrarse</Link>
                <Link to="/login" className="text-brand hover:opacity-90">Iniciar sesión</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="text-brand hover:opacity-90">Cerrar sesión</button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 text-slate-600">
        <div className="max-w-6xl mx-auto px-6 py-4 text-sm">
          Cursos Online · React + Django REST · {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
