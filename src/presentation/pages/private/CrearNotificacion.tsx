import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authHttp } from "../../../infrastructure/http/httpClients";
import RequireRole from "../../components/RequireRole";
import { UserSearchDropdown, SuccessMessage } from "../../components/common";
import type { Usuario } from "../../components/common";

export default function CrearNotificacion() {
  const nav = useNavigate();
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [isGlobal, setIsGlobal] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [titulo, setTitulo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("mensaje_sistema");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSelectUser = (user: Usuario) => {
    setSelectedUser(user);
    setUsuarioId(user.id);
  };

  const handleClearUser = () => {
    setSelectedUser(null);
    setUsuarioId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim() || !mensaje.trim()) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (!isGlobal && !usuarioId) {
      setError("Selecciona un usuario o marca como global");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const payload = {
        usuario_id: isGlobal ? null : usuarioId,
        tipo,
        titulo: titulo.trim(),
        mensaje: mensaje.trim(),
      };

      await authHttp.post("/notificaciones/", payload);
      setSuccess(true);
      setTimeout(() => {
        nav("/app/notificaciones");
      }, 1500);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ??
          err?.response?.data?.mensaje ??
          "Error al crear notificación",
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <RequireRole
        roles={["admin"]}
        fallback={<div className="p-6">No autorizado</div>}
      >
        <SuccessMessage
          title="¡Notificación creada!"
          message="Redirigiendo..."
        />
      </RequireRole>
    );
  }

  return (
    <RequireRole
      roles={["admin"]}
      fallback={<div className="p-6">No autorizado</div>}
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Crear Notificación
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Envía notificaciones a usuarios específicos o a todos
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6"
        >
          {/* Tipo de envío */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Tipo de envío
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={isGlobal}
                  onChange={() => {
                    setIsGlobal(true);
                    setUsuarioId(null);
                    setSelectedUser(null);
                  }}
                  className="w-4 h-4 text-[#f8b31d]"
                />
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  🌐 Global (todos los usuarios)
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!isGlobal}
                  onChange={() => setIsGlobal(false)}
                  className="w-4 h-4 text-[#f8b31d]"
                />
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  👤 Usuario específico
                </span>
              </label>
            </div>
          </div>

          {/* Búsqueda de usuario */}
          {!isGlobal && (
            <UserSearchDropdown
              onSelectUser={handleSelectUser}
              selectedUser={selectedUser}
              onClearUser={handleClearUser}
              disabled={isGlobal}
            />
          )}

          {/* Tipo de notificación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Tipo *
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
            >
              <option value="mensaje_sistema">📢 Mensaje del Sistema</option>
              <option value="aviso">ℹ️ Aviso</option>
              <option value="recordatorio">⏰ Recordatorio</option>
              <option value="urgente">⚠️ Urgente</option>
            </select>
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título de la notificación"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
              maxLength={200}
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {titulo.length}/200
            </div>
          </div>

          {/* Mensaje */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Mensaje *
            </label>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Contenido de la notificación..."
              rows={6}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent resize-none"
              maxLength={1000}
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {mensaje.length}/1000
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#f8b31d] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#e0a419] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Enviando..." : "📤 Enviar Notificación"}
            </button>
            <button
              type="button"
              onClick={() => nav("/app/notificaciones")}
              className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </RequireRole>
  );
}
