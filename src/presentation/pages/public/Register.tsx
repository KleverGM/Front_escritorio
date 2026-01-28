import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
export default function Register({ onRegister }: { onRegister: (u: string, e: string, p: string, f: string, l: string, t: string) => Promise<void> }) {
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        await onRegister(username, email, password, firstName, lastName, tipoUsuario);
        setSuccess('Registro exitoso. Redirigiendo a iniciar sesión...');
        // redirigir después de 2s
        timerRef.current = setTimeout(() => nav("/login", { replace: true }), 2000);
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
      <div className="min-h-screen bg-gray-50 flex items-center">
        <div className="mx-auto w-full max-w-2xl p-6">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center">Nos alegra conocerte</h2>
            <p className="text-sm text-gray-600 text-center mb-6">Necesitamos registrarte primero.</p>

            {err && (
              <div role="alert" aria-live="assertive" className="mb-4 rounded-md border border-rose-900/60 bg-rose-950/40 px-3 py-2 text-rose-200 text-sm">
                {err}
              </div>
            )}

            {success && (
              <div role="status" aria-live="polite" className="mb-4 rounded-md border border-emerald-700/60 bg-emerald-900/40 px-3 py-2 text-emerald-200 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm text-gray-700">Nombre</label>
                    <input
                      id="firstName"
                      name="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm text-gray-700">Apellido</label>
                    <input
                      id="lastName"
                      name="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="tipoUsuario" className="block text-sm text-gray-700">Tipo de usuario</label>
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
                  <label htmlFor="username" className="block text-sm text-gray-700">Usuario</label>
                  <input
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-gray-700">Correo electrónico</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm text-gray-700">Contraseña</label>
                  <input
                    id="password"
                    name="password"
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
                  {loading ? 'Registrando...' : 'Crear cuenta'}
                </button>
              </div>
            </form>

            

            <p className="mt-4 text-sm text-center text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">Iniciar sesión</Link>
            </p>
          </div>
        </div>
      </div>
    );
}