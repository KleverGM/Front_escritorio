import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authHttp } from "../../../../infrastructure/http/httpClients";
import { ErrorMessage } from "../../../components/common";

export default function CrearUsuario() {
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
      await authHttp.post("/users/", {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        perfil: tipoUsuario,
      });
      setSuccess("Usuario creado exitosamente. Redirigiendo...");
      timerRef.current = setTimeout(
        () => nav("/app/admin/usuarios", { replace: true }),
        2000,
      );
    } catch (e: any) {
      const data = e?.response?.data;
      if (data?.detail) setErr(data.detail);
      else if (data) setErr(JSON.stringify(data));
      else setErr("No se pudo crear el usuario");
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto w-full max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold">Crear Nuevo Usuario</h2>
            <p className="text-sm text-gray-600 mt-1">
              Como administrador, puedes crear usuarios con cualquier rol.
            </p>
          </div>

          {err && <ErrorMessage message={err} className="mb-4" />}

          {success && (
            <div
              role="status"
              className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm"
            >
              {success}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm text-gray-700"
                >
                  Nombre
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm text-gray-700"
                >
                  Apellido
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="tipoUsuario"
                className="block text-sm text-gray-700"
              >
                Tipo de usuario
              </label>
              <select
                id="tipoUsuario"
                name="tipoUsuario"
                value={tipoUsuario}
                onChange={(e) => setTipoUsuario(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
              >
                <option value="estudiante">Estudiante</option>
                <option value="instructor">Instructor</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm text-gray-700">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-gray-700">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-700">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md bg-white text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 mt-0.5"
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

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-[#f8b31d] text-white text-lg rounded-md font-medium hover:bg-[#e0a219] transition-colors disabled:opacity-50"
              >
                {loading ? "Creando..." : "Crear Usuario"}
              </button>
              <Link
                to="/app/admin/usuarios"
                className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
