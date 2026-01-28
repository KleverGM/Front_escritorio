import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Login({ onLogin }: { onLogin: (u: string, p: string) => Promise<void> }) {
  const nav = useNavigate();
  const location = useLocation() as any;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = location?.state?.from || "/app";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
      try {
      await onLogin(username, password);
      nav(from, { replace: true, state: { justLoggedIn: true } });
    } catch (e: any) {
      setErr(e?.response?.data?.detail ?? "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center">
      <div className="mx-auto w-full max-w-2xl p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center">Inicia sesión</h2>
          <p className="text-sm text-gray-600 text-center mb-6">Accede a tu cuenta</p>

          {err && (
            <div role="alert" aria-live="assertive" className="mb-4 rounded-md border border-rose-900/60 bg-rose-950/40 px-3 py-2 text-rose-200 text-sm">
              {err}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="username" className="block text-sm text-gray-700">Usuario</label>
                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-gray-700">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-[#f8b31d] border-2 border-black text-lg rounded-md font-medium"
              >
                {loading ? 'Ingresando...' : 'Iniciar sesión'}
              </button>
            </div>
          </form>

          
          <p className="mt-4 text-sm text-center text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
