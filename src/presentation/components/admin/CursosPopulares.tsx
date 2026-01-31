import React from "react";

interface CursoPopular {
  id: number;
  titulo: string;
  instructor: {
    id: number;
    nombre: string;
  };
  total_inscripciones: number;
  promedio_rating: number;
  publicado: boolean;
  imagen: string | null;
}

interface CursosPopularesProps {
  cursos: CursoPopular[];
}

export default function CursosPopulares({ cursos }: CursosPopularesProps) {
  if (cursos.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Cursos Más Populares
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No hay datos disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Cursos Más Populares
      </h2>
      <div className="space-y-4">
        {cursos.map((curso, index) => (
          <div
            key={curso.id}
            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="flex items-center gap-4 flex-1">
              <span className="text-2xl font-bold text-gray-400">
                #{index + 1}
              </span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {curso.titulo}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Instructor: {curso.instructor.nombre}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300">Estudiantes</p>
                <p className="font-bold text-gray-900 dark:text-gray-100">
                  {curso.total_inscripciones}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300">Rating</p>
                <p className="font-bold text-yellow-600">
                  {curso.promedio_rating.toFixed(1)} ⭐
                </p>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    curso.publicado
                      ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {curso.publicado ? "Publicado" : "Borrador"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
