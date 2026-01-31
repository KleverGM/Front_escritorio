import React from "react";
import { Link } from "react-router-dom";
import type { Curso } from "../../../domain/cursos/curso.types";
import { RatingStars } from "../../components/common";

interface CursoCardProps {
  curso: Curso;
  showInstructor?: boolean;
  showPrice?: boolean;
  actions?: React.ReactNode;
}

export default function CursoCard({
  curso,
  showInstructor = true,
  showPrice = true,
  actions,
}: CursoCardProps) {
  const imageUrl = curso.imagen || "/placeholder-course.jpg";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Imagen */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
        {curso.imagen ? (
          <img
            src={imageUrl}
            alt={curso.titulo}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-20 h-20 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        )}
        {!curso.activo && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Inactivo
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Categoría y Nivel */}
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
            {curso.categoria}
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {curso.nivel}
          </span>
        </div>

        {/* Título */}
        <Link to={`/app/cursos/${curso.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-[#f8b31d] mb-2 line-clamp-2">
            {curso.titulo}
          </h3>
        </Link>

        {/* Descripción */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {curso.descripcion}
        </p>

        {/* Instructor */}
        {showInstructor && curso.instructor && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-600">
                {curso.instructor.first_name?.charAt(0) ||
                  curso.instructor.username.charAt(0)}
              </span>
            </div>
            <span className="text-sm text-gray-600">
              {curso.instructor.first_name && curso.instructor.last_name
                ? `${curso.instructor.first_name} ${curso.instructor.last_name}`
                : curso.instructor.username}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          {showPrice && (
            <div className="text-lg font-bold text-gray-900">
              ${parseFloat(curso.precio).toFixed(2)}
            </div>
          )}
          {actions}
        </div>
      </div>
    </div>
  );
}
