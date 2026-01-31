import React from "react";

interface ProgressBarProps {
  progress: number;
  height?: "sm" | "md" | "lg";
  showPercentage?: boolean;
  color?: "blue" | "green" | "yellow" | "red";
  className?: string;
}

export default function ProgressBar({
  progress,
  height = "md",
  showPercentage = true,
  color = "blue",
  className = "",
}: ProgressBarProps) {
  const heightClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const colorClasses = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    yellow: "bg-yellow-600",
    red: "bg-red-600",
  };

  const percentage = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full ${className}`}>
      {showPercentage && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Progreso</span>
          <span className="text-sm font-medium text-gray-700">
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
      <div
        className={`w-full bg-gray-200 rounded-full ${heightClasses[height]} overflow-hidden`}
      >
        <div
          className={`${colorClasses[color]} ${heightClasses[height]} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
