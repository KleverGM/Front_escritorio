import React from "react";

interface QuickLink {
  title: string;
  description: string;
  icon: string;
  link: string;
  color: string;
}

const quickLinks: QuickLink[] = [
  {
    title: "Usuarios",
    description: "Gestionar usuarios del sistema",
    icon: "👥",
    link: "/app/admin/usuarios",
    color: "bg-blue-500",
  },
  {
    title: "Cursos",
    description: "Administrar cursos",
    icon: "📚",
    link: "/app/admin/cursos",
    color: "bg-green-500",
  },
  {
    title: "Inscripciones",
    description: "Ver inscripciones",
    icon: "📝",
    link: "/app/admin/inscripciones",
    color: "bg-purple-500",
  },
  {
    title: "Reseñas",
    description: "Moderar reseñas",
    icon: "⭐",
    link: "/app/admin/resenas",
    color: "bg-yellow-500",
  },
  {
    title: "Avisos",
    description: "Gestionar avisos",
    icon: "📢",
    link: "/app/admin/avisos",
    color: "bg-red-500",
  },
  {
    title: "Estadísticas",
    description: "Ver estadísticas globales",
    icon: "📊",
    link: "/app/admin/estadisticas",
    color: "bg-indigo-500",
  },
];

export default function QuickLinks() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Acciones Rápidas
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map((link) => (
          <a
            key={link.link}
            href={link.link}
            className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all"
          >
            <div className={`p-3 rounded-lg ${link.color} text-white text-2xl`}>
              {link.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {link.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {link.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
