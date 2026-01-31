import React from "react";

interface ResenaFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  ratingFilter: number | null;
  onRatingFilterChange: (rating: number | null) => void;
  cursoFilter: string;
  onCursoFilterChange: (curso: string) => void;
  cursos: Array<{ id: number; titulo: string }>;
}

export default function ResenaFilters({
  searchQuery,
  onSearchChange,
  ratingFilter,
  onRatingFilterChange,
  cursoFilter,
  onCursoFilterChange,
  cursos,
}: ResenaFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Filtros de Búsqueda
      </h3>

      {/* Buscador */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por comentario, usuario o curso..."
            className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Filtro de calificación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Calificación
          </label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => onRatingFilterChange(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                ratingFilter === null
                  ? "bg-[#f8b31d] text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Todas
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => onRatingFilterChange(rating)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  ratingFilter === rating
                    ? "bg-[#f8b31d] text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {rating} ⭐
              </button>
            ))}
          </div>
        </div>

        {/* Filtro de curso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Curso
          </label>
          <select
            value={cursoFilter}
            onChange={(e) => onCursoFilterChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
          >
            <option value="">Todos los cursos</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id.toString()}>
                {curso.titulo}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
