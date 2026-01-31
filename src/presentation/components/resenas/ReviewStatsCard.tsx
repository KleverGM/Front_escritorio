import React from "react";
import type { ResenaEstadisticas } from "../../../domain/resenas/resena.types";
import { RatingStars, Card } from "../common";

type ReviewStatsCardProps = {
  stats: ResenaEstadisticas;
};

const ReviewStatsCard: React.FC<ReviewStatsCardProps> = ({ stats }) => {
  return (
    <Card className="mb-6">
      <div className="flex items-center gap-6">
        <div className="text-4xl font-bold text-gray-900">
          {stats.rating_promedio.toFixed(1)}
        </div>
        <div>
          <RatingStars rating={stats.rating_promedio} readonly />
          <div className="text-sm text-gray-600">
            {stats.total_resenas} reseñas
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ReviewStatsCard;
