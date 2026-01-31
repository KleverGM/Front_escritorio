import React from "react";

type DashboardWelcomeProps = {
  message: string | null;
};

const DashboardWelcome: React.FC<DashboardWelcomeProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="mb-4 rounded-xl border border-emerald-700/40 bg-emerald-500/10 px-4 py-3 text-emerald-800 text-sm dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200"
    >
      {message}
    </div>
  );
};

export default DashboardWelcome;
