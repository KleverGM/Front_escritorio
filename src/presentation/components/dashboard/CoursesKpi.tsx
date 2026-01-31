import React from "react";

type CoursesKpiProps = {
  label: string;
  count: number;
};

const CoursesKpi: React.FC<CoursesKpiProps> = ({ label, count }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm rounded-xl p-5">
      <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
        {label}
      </div>
      <div className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
        {count}
      </div>
    </div>
  );
};

export default CoursesKpi;
