import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ErrorMessage } from "../../components/common";

export default function Login({
  onLogin,
}: {
  onLogin: (u: string, p: string) => Promise<string | null>;
}) {
  const nav = useNavigate();
  const location = useLocation() as any;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = location?.state?.from || "/app";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const perfil = await onLogin(email, password);

      // Redirigir según el rol del usuario
      let destination = from;
      if (perfil === "admin" || perfil === "administrador") {
        destination = "/app/admin";
      } else if (perfil === "instructor") {
        destination = "/app/instructor";
      } else {
        destination = from !== "/app" ? from : "/app";
      }

      nav(destination, { replace: true, state: { justLoggedIn: true } });
    } catch (e: any) {
      setErr(e?.response?.data?.detail ?? "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center">
      <div className="mx-auto w-full max-w-2xl p-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-slate-800">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white">
            Inicia sesión
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-6">
            Accede a tu cuenta
          </p>

          {err && <ErrorMessage message={err} className="mb-4" />}

          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm text-slate-700 dark:text-slate-300"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm text-slate-700 dark:text-slate-300"
                >
                  Contraseña
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-white text-sm dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white"
                  >
                    {showPassword ? (
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
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-[#f8b31d] border-2 border-black text-lg rounded-lg font-medium hover:shadow-md disabled:opacity-50"
              >
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </button>
            </div>
          </form>

          <p className="mt-4 text-sm text-center text-slate-600 dark:text-slate-400">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
