import React from "react";

interface ActividadReciente {
  tipo: string;
  fecha: string;
  usuario: string;
  curso: string;
  calificacion?: number;
  descripcion: string;
}

interface ActividadRecienteListProps {
  actividades: ActividadReciente[];
}

const getActivityIcon = (tipo: string) => {
  switch (tipo) {
    case "inscripcion":
      return { icon: "👤", color: "bg-blue-100 text-blue-600" };
    case "resena":
      return { icon: "⭐", color: "bg-yellow-100 text-yellow-600" };
    case "completado":
      return { icon: "✅", color: "bg-green-100 text-green-600" };
    default:
      return { icon: "📌", color: "bg-gray-100 text-gray-600" };
  }
};

export default function ActividadRecienteList({
  actividades,
}: ActividadRecienteListProps) {
  if (actividades.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Actividad Reciente
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No hay actividad reciente
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Actividad Reciente
      </h2>
      <div className="space-y-3">
        {actividades.map((item, index) => {
          const { icon, color } = getActivityIcon(item.tipo);
          return (
            <div
              key={index}
              className="flex items-start gap-3 p-3 border-l-4 border-gray-200 dark:border-gray-800 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
            >
              <div className={`p-2 rounded-full ${color}`}>
                <span className="text-lg">{icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {item.descripcion}
                </p>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>👤 {item.usuario}</span>
                  <span>📚 {item.curso}</span>
                  {item.calificacion && <span>⭐ {item.calificacion}/5</span>}
                  <span className="ml-auto">
                    {new Date(item.fecha).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
