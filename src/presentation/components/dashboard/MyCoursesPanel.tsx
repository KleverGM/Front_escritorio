import React from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../common";

type Course = {
  titulo?: string;
  title?: string;
  nombre?: string;
};

type MyCoursesPanelProps = {
  courses: Course[];
  userRole?: string | null;
};

const MyCoursesPanel: React.FC<MyCoursesPanelProps> = ({
  courses,
  userRole,
}) => {
  const hasCourses = Array.isArray(courses) && courses.length > 0;

  return (
    <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-900 dark:text-white">
          Mis cursos
        </h2>
        <Link
          to="/app/cursos"
          className="text-sm text-blue-600 hover:underline"
        >
          Ver todos
        </Link>
      </div>
      {hasCourses ? (
        <ul className="space-y-2">
          {courses.map((c, i) => (
            <li
              key={i}
              className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2"
            >
              <span className="inline-flex h-2 w-2 rounded-full bg-[#f8b31d]" />
              {c.titulo ?? c.title ?? c.nombre ?? `Curso ${i + 1}`}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon="📚"
          title="Sin cursos"
          description={
            userRole === "instructor"
              ? "Aún no has creado ningún curso"
              : "Aún no estás inscrito en cursos"
          }
        />
      )}
    </div>
  );
};

export default MyCoursesPanel;
