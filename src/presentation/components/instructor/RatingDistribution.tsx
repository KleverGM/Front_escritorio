import React from "react";
import { Card } from "../common";

interface RatingDistributionProps {
  distribucion: Record<string, number>;
  totalResenas: number;
}

export default function RatingDistribution({
  distribucion,
  totalResenas,
}: RatingDistributionProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Distribución de Calificaciones
      </h3>
      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribucion[star.toString()] || 0;
          const percentage =
            totalResenas > 0 ? (count / totalResenas) * 100 : 0;

          return (
            <div key={star} className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 w-12">
                {star} ⭐
              </span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-yellow-400 h-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300 w-16 text-right">
                {count} ({percentage.toFixed(0)}%)
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
