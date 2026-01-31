import React from "react";
import type { Resena } from "../../../domain/resenas/resena.types";
import { RatingStars, Card } from "../common";

type ReviewCardProps = {
  resena: Resena;
  onMarkHelpful?: (id: string) => void;
  onEdit?: (resena: Resena) => void;
  onDelete?: (id: string) => void;
};

const ReviewCard: React.FC<ReviewCardProps> = ({
  resena,
  onMarkHelpful,
  onEdit,
  onDelete,
}) => {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-gray-900">
            {resena.nombre_usuario}
          </div>
          <div className="text-sm text-gray-500">
            {new Date(resena.fecha_creacion).toLocaleDateString()}
          </div>
          <RatingStars rating={resena.rating} readonly showNumber={false} />
        </div>
        <div className="flex items-center gap-3">
          {onMarkHelpful && (
            <button
              onClick={() => onMarkHelpful(resena.id)}
              className="text-sm text-blue-600 hover:underline"
            >
              Útil ({resena.util_count})
            </button>
          )}
          {onEdit && resena.es_mia && (
            <button
              onClick={() => onEdit(resena)}
              className="text-sm text-gray-600 hover:underline"
            >
              Editar
            </button>
          )}
          {onDelete && resena.es_mia && (
            <button
              onClick={() => onDelete(resena.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
      <div className="mt-2 font-medium text-gray-900">{resena.titulo}</div>
      <div className="text-gray-700 mt-1">{resena.comentario}</div>
    </Card>
  );
};

export default ReviewCard;
