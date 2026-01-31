import React from "react";

interface SuccessMessageProps {
  title: string;
  message?: string;
  icon?: string;
}

export default function SuccessMessage({
  title,
  message,
  icon = "✅",
}: SuccessMessageProps) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">{icon}</div>
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
          {title}
        </h2>
        {message && (
          <p className="text-green-700 dark:text-green-300">{message}</p>
        )}
      </div>
    </div>
  );
}
