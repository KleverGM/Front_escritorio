import React from "react";

interface CursoInfoCardProps {
  curso: {
    fecha_creacion?: string;
    total_modulos?: number;
    total_secciones?: number;
    total_estudiantes?: number;
  };
  activo: boolean;
  onToggleActivo: () => void;
  onEliminar: () => void;
  saving: boolean;
  userRole?: string;
}

export default function CursoInfoCard({
  curso,
  activo,
  onToggleActivo,
  onEliminar,
  saving,
  userRole = "admin",
}: CursoInfoCardProps) {
  const isInstructor = userRole === "instructor";
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Información del Curso
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500 dark:text-gray-400">
            Fecha de creación:
          </span>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {curso?.fecha_creacion
              ? new Date(curso.fecha_creacion).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "N/A"}
          </p>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">
            Total módulos:
          </span>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {curso?.total_modulos || 0}
          </p>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">
            Total secciones:
          </span>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {curso?.total_secciones || 0}
          </p>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">
            Total estudiantes:
          </span>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {curso?.total_estudiantes || 0}
          </p>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">
            Estado actual:
          </span>
          <p className="font-medium">
            <span
              className={`inline-block px-2 py-1 rounded text-xs ${
                activo
                  ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200"
                  : "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200"
              }`}
            >
              {activo ? "Activo" : "Inactivo"}
            </span>
          </p>
        </div>
      </div>

      {/* Botón para activar/desactivar */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex gap-3">
          <button
            onClick={onToggleActivo}
            disabled={saving}
            className={`flex-1 px-6 py-2 rounded-lg font-medium transition-colors ${
              activo
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-green-600 text-white hover:bg-green-700"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {saving
              ? "Procesando..."
              : activo
                ? "Desactivar Curso"
                : "Activar Curso"}
          </button>

          {!isInstructor && (
            <button
              onClick={onEliminar}
              disabled={saving}
              className="px-6 py-2 rounded-lg font-medium transition-colors bg-gray-800 text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Eliminar
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {activo
            ? "Los cursos inactivos no serán visibles para los estudiantes"
            : "Activar el curso lo hará visible para los estudiantes"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Solo puedes eliminar cursos sin estudiantes, módulos o reseñas.
        </p>
      </div>
    </div>
  );
}
