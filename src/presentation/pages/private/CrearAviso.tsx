import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authHttp } from "../../../infrastructure/http/httpClients";
import { useAuth } from "../../../application/auth/useAuth";
import RequireRole from "../../components/RequireRole";
import { UserSearchDropdown, SuccessMessage } from "../../components/common";
import type { Usuario } from "../../components/common";

export default function CrearAviso() {
  const navigate = useNavigate();
  const { user } = useAuth() as { user: any | null };

  const [formData, setFormData] = useState({
    titulo: "",
    mensaje: "",
    tipo: "aviso",
    usuario_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [success, setSuccess] = useState(false);
  const [allowedUserIds, setAllowedUserIds] = useState<number[] | null>(null);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const isAdmin =
    user?.perfil?.toLowerCase() === "administrador" ||
    user?.perfil?.toLowerCase() === "admin";
  const isInstructor = user?.perfil?.toLowerCase() === "instructor";

  useEffect(() => {
    if (!isInstructor) return;
    let mounted = true;
    const loadStudents = async () => {
      setLoadingStudents(true);
      try {
        const res = await authHttp.get("/inscripciones/");
        const data = res.data?.results ?? res.data ?? [];
        const ids = Array.isArray(data)
          ? Array.from(
              new Set(
                data
                  .map((i: any) => i.usuario?.id ?? i.usuario)
                  .filter((v: any) => Number.isFinite(v)),
              ),
            )
          : [];
        if (mounted) setAllowedUserIds(ids);
      } catch {
        if (mounted) setAllowedUserIds([]);
      } finally {
        if (mounted) setLoadingStudents(false);
      }
    };

    loadStudents();
    return () => {
      mounted = false;
    };
  }, [isInstructor]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectUser = (user: Usuario) => {
    setSelectedUser(user);
    setFormData({ ...formData, usuario_id: String(user.id) });
  };

  const handleClearUser = () => {
    setSelectedUser(null);
    setFormData({ ...formData, usuario_id: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: any = {
        titulo: formData.titulo.trim(),
        mensaje: formData.mensaje.trim(),
        descripcion: formData.mensaje.trim(),
        tipo: formData.tipo,
      };

      if (formData.usuario_id) {
        const parsedId = parseInt(formData.usuario_id, 10);
        if (!Number.isFinite(parsedId)) {
          setError("Usuario destinatario inválido");
          return;
        }
        payload.usuario_id = parsedId;
      }

      await authHttp.post("/avisos/", payload);

      navigate("/app/avisos");
    } catch (err: any) {
      const errorData = err?.response?.data;
      if (typeof errorData === "object" && errorData !== null) {
        const firstError = Object.values(errorData)[0];
        setError(
          Array.isArray(firstError) ? firstError[0] : String(firstError),
        );
      } else {
        setError(errorData?.detail || err?.message || "Error al crear aviso");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireRole
      roles={["admin", "administrador", "instructor"]}
      fallback={
        <div className="p-8 text-center">
          <p className="text-red-600">No tienes permisos para crear avisos</p>
        </div>
      }
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/app/avisos")}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4"
            >
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver a avisos
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Crear Aviso
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Envía un aviso a un usuario específico
            </p>
          </div>

          {/* Información de ayuda */}
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 flex items-start gap-3">
            <svg
              className="w-6 h-6 text-blue-600 dark:text-blue-300 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">
                Información importante
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                {isAdmin
                  ? "Como administrador, puedes enviar avisos a cualquier usuario."
                  : "Como instructor, solo puedes enviar avisos a estudiantes inscritos en tus cursos."}
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-600 dark:text-red-300 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Buscar usuario */}
              <UserSearchDropdown
                onSelectUser={handleSelectUser}
                selectedUser={selectedUser}
                onClearUser={handleClearUser}
                label="Usuario destinatario *"
                disabled={loadingStudents}
                allowedUserIds={
                  isInstructor ? (allowedUserIds ?? []) : undefined
                }
              />
              {isInstructor &&
                !loadingStudents &&
                allowedUserIds?.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No tienes estudiantes inscritos para enviar avisos.
                  </p>
                )}

              {/* Tipo de aviso */}
              <div>
                <label
                  htmlFor="tipo"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                >
                  Tipo de aviso *
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                  className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
                >
                  <option value="aviso">Aviso</option>
                  <option value="mensaje_sistema">Mensaje del sistema</option>
                  <option value="recordatorio">Recordatorio</option>
                  <option value="urgente">Urgente</option>
                </select>
                <label
                  htmlFor="titulo"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                >
                  Título *
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  placeholder="Ej: Actualización importante del curso"
                  className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
                />
                <label
                  htmlFor="mensaje"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                >
                  Mensaje *
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Escribe el contenido del aviso..."
                  className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent resize-none"
                />
                <p className="mt-1 text-sm text-gray-500">
                  {formData.mensaje.length} caracteres
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading || !formData.usuario_id}
                  className="flex-1 px-6 py-3 bg-[#f8b31d] hover:bg-[#f59e0b] text-black font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
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
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      Enviar aviso
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/app/avisos")}
                  disabled={loading}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </RequireRole>
  );
}
