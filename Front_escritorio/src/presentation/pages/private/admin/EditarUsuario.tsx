import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { authHttp } from "../../../../infrastructure/http/httpClients";
import {
  LoadingSpinner,
  ErrorMessage,
  SuccessMessage,
} from "../../../components/common";

interface UsuarioData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  perfil: string;
  is_active: boolean;
  fecha_creacion: string;
}

export default function EditarUsuario() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<UsuarioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    perfil: "",
    is_active: true,
  });

  useEffect(() => {
    if (id) {
      loadUsuario();
    }
  }, [id]);

  const loadUsuario = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await authHttp.get(`/users/${id}/`);
      const data = res.data;
      setUsuario(data);
      setFormData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        perfil: data.perfil || "",
        is_active: data.is_active ?? true,
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.error ||
          "Error al cargar usuario",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await authHttp.patch(`/users/${id}/`, formData);
      setSuccess(true);
      setTimeout(() => {
        navigate("/app/admin/usuarios");
      }, 1500);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.error ||
          "Error al actualizar usuario",
      );
      setSaving(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center overflow-x-hidden">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center overflow-x-hidden">
        <SuccessMessage
          title="Usuario actualizado"
          message="Redirigiendo a la lista de usuarios..."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 overflow-x-hidden">
      <div className="max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Editar Usuario
              </h1>
              <p className="text-gray-600 mt-1">
                Modifica la información del usuario
              </p>
            </div>
            <Link
              to="/app/admin/usuarios"
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Volver
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Información del usuario */}
        {usuario && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f8b31d] to-[#f59e0b] flex items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {(
                    usuario.first_name?.[0] ||
                    usuario.username?.[0] ||
                    "U"
                  ).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  @{usuario.username}
                </div>
                <div className="text-sm text-gray-500">
                  Usuario desde{" "}
                  {new Date(usuario.fecha_creacion).toLocaleDateString(
                    "es-ES",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded p-3">
              <strong>Nota:</strong> El nombre de usuario (@{usuario.username})
              no se puede modificar.
            </div>
          </div>
        )}

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
                placeholder="Ingresa el nombre"
              />
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
                placeholder="Ingresa el apellido"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
                placeholder="usuario@ejemplo.com"
              />
            </div>

            {/* Perfil */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Perfil / Rol <span className="text-red-500">*</span>
              </label>
              <select
                name="perfil"
                value={formData.perfil}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
              >
                <option value="">Selecciona un perfil</option>
                <option value="estudiante">Estudiante</option>
                <option value="instructor">Instructor</option>
                <option value="administrador">Administrador</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Define el rol y permisos del usuario en la plataforma
              </p>
            </div>

            {/* Estado activo */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#f8b31d] border-gray-300 rounded focus:ring-[#f8b31d]"
              />
              <label
                htmlFor="is_active"
                className="text-sm font-medium text-gray-700"
              >
                Usuario activo
              </label>
            </div>
            <p className="text-xs text-gray-500 -mt-4 ml-7">
              Los usuarios inactivos no pueden iniciar sesión en la plataforma
            </p>

            {/* Botones */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2 bg-[#f8b31d] text-white rounded-lg hover:bg-[#e0a419] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
              <Link
                to="/app/admin/usuarios"
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                Cancelar
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
