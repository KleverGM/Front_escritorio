import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cursoService } from "../../../../application/cursos/curso.service";
import { useAuth } from "../../../../application/auth/useAuth";
import { CursoForm } from "../../../components/cursos";
import {
  LoadingSpinner,
  SuccessMessage,
  ErrorMessage,
} from "../../../components/common";
import type { CursoFormData } from "../../../../domain/cursos/curso.types";

export default function CrearCurso() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Determinar la ruta de retorno según el rol
  const userRole =
    user?.tipo_usuario || user?.perfil || user?.role || "estudiante";
  const backPath =
    userRole === "instructor" ? "/app/instructor/cursos" : "/app/admin/cursos";

  const handleSubmit = async (data: CursoFormData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await cursoService.create(data);
      setSuccess("Curso creado exitosamente");

      setTimeout(() => {
        navigate(backPath);
      }, 1500);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Error al crear el curso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(backPath)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 mb-2"
          >
            ← Volver a Gestión de Cursos
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Crear Nuevo Curso
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Complete el formulario para crear un nuevo curso
          </p>
        </div>

        {/* Mensajes */}
        {success && (
          <div className="mb-6">
            <SuccessMessage title={success} />
          </div>
        )}
        {error && <ErrorMessage message={error} className="mb-6" />}

        {/* Formulario */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <CursoForm
              onSubmit={handleSubmit}
              isAdmin={true}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
