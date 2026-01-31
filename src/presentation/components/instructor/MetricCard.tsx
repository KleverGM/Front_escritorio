import React from "react";
import { Card } from "../common";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  iconBgColor: string;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  iconBgColor,
}: MetricCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center`}
        >
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </Card>
  );
}
