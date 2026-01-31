import React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message?: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon = "📭",
  title,
  message,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        {typeof icon === "string" ? (
          <div className="text-6xl">{icon}</div>
        ) : (
          icon
        )}
      </div>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">{title}</p>
      {(message || description) && (
        <p className="text-gray-500 dark:text-gray-400">
          {message || description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
