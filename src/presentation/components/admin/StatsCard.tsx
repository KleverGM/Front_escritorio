import React from "react";

interface StatsCardProps {
  title: string;
  mainValue: number;
  subtitle?: string;
  icon: string;
  iconColor: string;
  link?: string;
  linkText?: string;
}

export default function StatsCard({
  title,
  mainValue,
  subtitle,
  icon,
  iconColor,
  link,
  linkText = "Ver detalles",
}: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 dark:text-gray-300 text-sm font-medium">
          {title}
        </h3>
        <span className={`text-2xl ${iconColor}`}>{icon}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {mainValue}
      </p>
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {subtitle}
        </p>
      )}
      {link && (
        <a
          href={link}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {linkText} →
        </a>
      )}
    </div>
  );
}
