import React from "react";
import { Link } from "react-router-dom";
import RequireRole from "../RequireRole";

const DashboardActions: React.FC = () => {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <RequireRole roles={["admin", "instructor"]} fallback={null}>
        <Link
          to="/app/cursos/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
        >
          Crear curso
        </Link>
      </RequireRole>

      <Link
        to="/app/cursos"
        className="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
      >
        Explorar cursos
      </Link>
    </div>
  );
};

export default DashboardActions;
