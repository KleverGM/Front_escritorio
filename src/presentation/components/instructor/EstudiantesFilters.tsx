import React from "react";

interface EstudiantesFiltersProps {
  searchQuery: string;
  filterCurso: string;
  filterEstado: string;
  cursosUnicos: string[];
  inscripcionesCount: number;
  activosCount: number;
  completadosCount: number;
  inactivosCount: number;
  onSearchChange: (value: string) => void;
  onCursoChange: (value: string) => void;
  onEstadoChange: (value: string) => void;
  onClearFilters: () => void;
  getCursoCount: (curso: string) => number;
}

export default function EstudiantesFilters({
  searchQuery,
  filterCurso,
  filterEstado,
  cursosUnicos,
  inscripcionesCount,
  activosCount,
  completadosCount,
  inactivosCount,
  onSearchChange,
  onCursoChange,
  onEstadoChange,
  onClearFilters,
  getCursoCount,
}: EstudiantesFiltersProps) {
  const hasActiveFilters =
    searchQuery || filterCurso !== "todos" || filterEstado !== "todos";

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Búsqueda */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
            Buscar estudiante
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Nombre, email o curso..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
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
          </div>
        </div>

        {/* Filtro por curso */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
            Filtrar por curso
          </label>
          <select
            value={filterCurso}
            onChange={(e) => onCursoChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todos">
              Todos los cursos ({inscripcionesCount})
            </option>
            {cursosUnicos.map((curso) => (
              <option key={curso} value={curso}>
                {curso} ({getCursoCount(curso)})
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por estado */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
            Filtrar por estado
          </label>
          <select
            value={filterEstado}
            onChange={(e) => onEstadoChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todos">Todos ({inscripcionesCount})</option>
            <option value="active">Activos ({activosCount})</option>
            <option value="completed">Completados ({completadosCount})</option>
            <option value="inactive">Sin iniciar ({inactivosCount})</option>
          </select>
        </div>
      </div>

      {/* Chips de filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Filtros activos:
          </span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded-full text-sm">
              Búsqueda: {searchQuery}
              <button
                onClick={() => onSearchChange("")}
                className="hover:bg-blue-200 dark:hover:bg-blue-900/60 rounded-full p-0.5"
              >
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          )}

          {filterCurso !== "todos" && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 rounded-full text-sm">
              Curso: {filterCurso}
              <button
                onClick={() => onCursoChange("todos")}
                className="hover:bg-purple-200 dark:hover:bg-purple-900/60 rounded-full p-0.5"
              >
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          )}

          {filterEstado !== "todos" && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 rounded-full text-sm">
              Estado:{" "}
              {filterEstado === "active"
                ? "Activos"
                : filterEstado === "completed"
                  ? "Completados"
                  : "Sin iniciar"}
              <button
                onClick={() => onEstadoChange("todos")}
                className="hover:bg-green-200 dark:hover:bg-green-900/60 rounded-full p-0.5"
              >
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          )}

          <button
            onClick={onClearFilters}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white underline"
          >
            Limpiar todos
          </button>
        </div>
      )}
    </div>
  );
}
