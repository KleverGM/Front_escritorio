import React from "react";
import { Card } from "../common";

interface StatsDetailCardProps {
  title: string;
  items: Array<{
    label: string;
    value: string | number;
    color?: string;
  }>;
}

export default function StatsDetailCard({
  title,
  items,
}: StatsDetailCardProps) {
  return (
    <Card className="p-6">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">
        {title}
      </h3>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">
              {item.label}:
            </span>
            <span className={`font-semibold ${item.color || ""}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
