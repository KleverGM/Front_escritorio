import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage } from "../../components/common";
export default function Register({
  onRegister,
}: {
  onRegister: (
    u: string,
    e: string,
    p: string,
    f: string,
    l: string,
    t: string,
  ) => Promise<void>;
}) {
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("estudiante");
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await onRegister(
        username,
        email,
        password,
        firstName,
        lastName,
        tipoUsuario,
      );
      setSuccess("Registro exitoso. Redirigiendo a iniciar sesión...");
      // redirigir después de 2s
      timerRef.current = setTimeout(
        () => nav("/login", { replace: true }),
        2000,
      );
    } catch (e: any) {
      const data = e?.response?.data;
      if (data?.detail) setErr(data.detail);
      else if (data) setErr(JSON.stringify(data));
      else setErr("No se pudo registrar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center">
      <div className="mx-auto w-full max-w-2xl p-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-slate-800">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white">
            Nos alegra conocerte
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-6">
            Regístrate para comenzar tu aprendizaje.
          </p>

          {err && <ErrorMessage message={err} className="mb-4" />}

          {success && (
            <div
              role="status"
              aria-live="polite"
              className="mb-4 rounded-md border border-emerald-700/60 bg-emerald-900/40 px-3 py-2 text-emerald-200 text-sm"
            >
              {success}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm text-slate-700 dark:text-slate-300"
                  >
                    Nombre
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm text-slate-700 dark:text-slate-300"
                  >
                    Apellido
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm text-slate-700 dark:text-slate-300"
                >
                  Usuario
                </label>
                <input
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm text-slate-700 dark:text-slate-300"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    name="password"
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
                {loading ? "Registrando..." : "Crear cuenta"}
              </button>
            </div>
          </form>

          <p className="mt-4 text-sm text-center text-slate-600 dark:text-slate-400">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
