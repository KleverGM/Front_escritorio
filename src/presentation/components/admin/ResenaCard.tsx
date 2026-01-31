import React from "react";
import type { Resena } from "../../../domain/resenas/resena.types";

interface ResenaCardProps {
  resena: Resena;
  onDelete: (id: string) => void;
  footer?: React.ReactNode;
}

export default function ResenaCard({
  resena,
  onDelete,
  footer,
}: ResenaCardProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600 bg-green-100";
    if (rating >= 3.5) return "text-lime-600 bg-lime-100";
    if (rating >= 2.5) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays === 0) return "Hoy";
    if (diffInDays === 1) return "Ayer";
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;
    if (diffInDays < 365) return `Hace ${Math.floor(diffInDays / 30)} meses`;

    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar esta reseña de ${resena.nombre_usuario}?`,
      )
    ) {
      onDelete(resena.id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Avatar */}
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-blue-700 dark:text-blue-300 font-bold text-lg">
              {resena.nombre_usuario.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Usuario y curso */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
              {resena.nombre_usuario}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
              {resena.titulo_curso}
            </p>
          </div>
        </div>

        {/* Rating Badge */}
        <div
          className={`px-3 py-1.5 rounded-full flex items-center gap-1 ${getRatingColor(resena.rating)}`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="font-bold">{resena.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Título de la reseña */}
      {resena.titulo && (
        <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {resena.titulo}
        </h5>
      )}

      {/* Comentario */}
      <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
        {resena.comentario}
      </p>

      {/* Tags */}
      {resena.tags && resena.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {resena.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Respuestas del instructor */}
      {resena.respuestas && resena.respuestas.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Respuestas del instructor:
          </p>
          <div className="space-y-2">
            {resena.respuestas.map((respuesta, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border-l-4 border-[#f8b31d]"
              >
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {respuesta.texto}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatDate(respuesta.fecha)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {footer && <div className="mt-4">{footer}</div>}

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
          {/* Fecha */}
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{formatDate(resena.fecha_creacion)}</span>
          </div>

          {/* Útiles */}
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
            <span>{resena.util_count} útiles</span>
          </div>

          {/* Verificado */}
          {resena.verificado_compra && (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs">Compra verificada</span>
            </div>
          )}
        </div>

        {/* Botón eliminar */}
        <button
          onClick={handleDelete}
          className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          title="Eliminar reseña"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span className="text-sm font-medium">Eliminar</span>
        </button>
      </div>
    </div>
  );
}
