import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { authHttp } from "../../../../infrastructure/http/httpClients";
import {
  LoadingSpinner,
  ErrorMessage,
  SuccessMessage,
} from "../../../components/common";

interface InscripcionData {
  id: number;
  usuario: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  curso: {
    id: number;
    titulo: string;
  };
  fecha_inscripcion: string;
  progreso: number;
  completado: boolean;
  fecha_completado: string | null;
}

export default function EditarInscripcion() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [inscripcion, setInscripcion] = useState<InscripcionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    progreso: 0,
    completado: false,
  });

  useEffect(() => {
    if (id) {
      loadInscripcion();
    }
  }, [id]);

  const loadInscripcion = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await authHttp.get(`/inscripciones/${id}/`);
      const data = res.data;
      setInscripcion(data);
      setFormData({
        progreso: data.progreso || 0,
        completado: data.completado || false,
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.error ||
          "Error al cargar inscripción",
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
      await authHttp.patch(`/inscripciones/${id}/`, formData);
      setSuccess(true);
      setTimeout(() => {
        navigate("/app/admin/inscripciones");
      }, 1500);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.error ||
          "Error al actualizar inscripción",
      );
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);

    try {
      await authHttp.delete(`/inscripciones/${id}/`);
      setTimeout(() => {
        navigate("/app/admin/inscripciones");
      }, 500);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.error ||
          "Error al eliminar inscripción",
      );
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? parseFloat(value)
            : value,
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
          title="Inscripción actualizada"
          message="Redirigiendo a la lista de inscripciones..."
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
                Editar Inscripción
              </h1>
              <p className="text-gray-600 mt-1">
                Modifica el progreso y estado de la inscripción
              </p>
            </div>
            <Link
              to="/app/admin/inscripciones"
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

        {/* Información de la inscripción */}
        {inscripcion && (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Información de la Inscripción
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f8b31d] to-[#f59e0b] flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {(
                        inscripcion.usuario.first_name?.[0] ||
                        inscripcion.usuario.username?.[0] ||
                        "U"
                      ).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {inscripcion.usuario.first_name &&
                      inscripcion.usuario.last_name
                        ? `${inscripcion.usuario.first_name} ${inscripcion.usuario.last_name}`
                        : inscripcion.usuario.username}
                    </div>
                    <div className="text-xs text-gray-500">
                      {inscripcion.usuario.email}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <strong>Curso:</strong> {inscripcion.curso.titulo}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <strong>Fecha de inscripción:</strong>{" "}
                    {new Date(inscripcion.fecha_inscripcion).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </div>
                  {inscripcion.fecha_completado && (
                    <div className="text-sm text-gray-600 mt-1">
                      <strong>Fecha de completado:</strong>{" "}
                      {new Date(
                        inscripcion.fecha_completado,
                      ).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Formulario */}
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="space-y-6">
                {/* Progreso */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Progreso del Curso (%)
                  </label>
                  <input
                    type="number"
                    name="progreso"
                    value={formData.progreso}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Ingresa un valor entre 0 y 100
                  </p>
                  {/* Barra de progreso visual */}
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-[#f8b31d] h-3 rounded-full transition-all"
                      style={{ width: `${formData.progreso}%` }}
                    />
                  </div>
                </div>

                {/* Estado completado */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="completado"
                    name="completado"
                    checked={formData.completado}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#f8b31d] border-gray-300 rounded focus:ring-[#f8b31d]"
                  />
                  <label
                    htmlFor="completado"
                    className="text-sm font-medium text-gray-700"
                  >
                    Curso completado
                  </label>
                </div>
                <p className="text-xs text-gray-500 -mt-4 ml-7">
                  Marca esta opción cuando el estudiante haya completado el
                  curso
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
                    to="/app/admin/inscripciones"
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
                  >
                    Cancelar
                  </Link>
                </div>
              </div>
            </form>

            {/* Sección de eliminar */}
            <div className="bg-red-50 rounded-lg border border-red-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Zona Peligrosa
              </h3>
              <p className="text-sm text-red-700 mb-4">
                Eliminar esta inscripción es una acción permanente y no se puede
                deshacer.
              </p>
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Eliminar Inscripción
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-red-900">
                    ¿Estás seguro de que deseas eliminar esta inscripción?
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleting}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                    >
                      {deleting ? "Eliminando..." : "Sí, eliminar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
