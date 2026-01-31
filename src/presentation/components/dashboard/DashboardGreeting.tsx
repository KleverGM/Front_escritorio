import React from "react";

type DashboardGreetingProps = {
  name: string | null;
};

const DashboardGreeting: React.FC<DashboardGreetingProps> = ({ name }) => {
  if (!name) return null;

  return (
    <div className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
      Hola, {name}!
    </div>
  );
};

export default DashboardGreeting;
