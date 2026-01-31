import React from "react";

interface EstudiantesStatsProps {
  totalEstudiantes: number;
  activos: number;
  completados: number;
  inactivos: number;
  progresoPromedio: number;
  nuevosEstudiantes: number;
  totalInscripciones: number;
}

export default function EstudiantesStats({
  totalEstudiantes,
  activos,
  completados,
  inactivos,
  progresoPromedio,
  nuevosEstudiantes,
  totalInscripciones,
}: EstudiantesStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total estudiantes */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Total estudiantes
            </p>
            <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-gray-100">
              {totalEstudiantes}
            </p>
            <p className="text-xs text-green-600 mt-1">
              +{nuevosEstudiantes} este mes
            </p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full">
            <svg
              className="w-8 h-8 text-blue-600 dark:text-blue-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Estudiantes activos */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Estudiantes activos
            </p>
            <p className="text-3xl font-bold mt-1 text-green-600">{activos}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              En progreso
            </p>
          </div>
          <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-full">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Completados */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Completados
            </p>
            <p className="text-3xl font-bold mt-1 text-purple-600">
              {completados}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {totalInscripciones > 0
                ? ((completados / totalInscripciones) * 100).toFixed(1)
                : 0}
              % del total
            </p>
          </div>
          <div className="bg-purple-100 dark:bg-purple-900/40 p-3 rounded-full">
            <svg
              className="w-8 h-8 text-purple-600 dark:text-purple-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Progreso promedio */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Progreso promedio
            </p>
            <p className="text-3xl font-bold mt-1 text-blue-600">
              {progresoPromedio.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {inactivos} sin iniciar
            </p>
          </div>
          <div className="bg-orange-100 dark:bg-orange-900/40 p-3 rounded-full">
            <svg
              className="w-8 h-8 text-orange-600 dark:text-orange-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
