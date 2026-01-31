import React, { useEffect, useState } from "react";

export type ReviewFormValues = {
  rating: number;
  titulo: string;
  comentario: string;
};

type ReviewFormProps = {
  initialValues?: ReviewFormValues;
  submitting?: boolean;
  submitLabel: string;
  onSubmit: (values: ReviewFormValues) => Promise<void> | void;
};

const ReviewForm: React.FC<ReviewFormProps> = ({
  initialValues,
  submitting = false,
  submitLabel,
  onSubmit,
}) => {
  const [rating, setRating] = useState(initialValues?.rating ?? 5);
  const [titulo, setTitulo] = useState(initialValues?.titulo ?? "");
  const [comentario, setComentario] = useState(initialValues?.comentario ?? "");

  useEffect(() => {
    if (!initialValues) return;
    setRating(initialValues.rating);
    setTitulo(initialValues.titulo);
    setComentario(initialValues.comentario);
  }, [initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      rating,
      titulo: titulo.trim(),
      comentario: comentario.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Calificación
        </label>
        <select
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value, 10))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} estrellas
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título
        </label>
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Ej: Excelente curso"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comentario
        </label>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          required
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 bg-[#f8b31d] text-white rounded-lg disabled:opacity-50"
      >
        {submitting ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
};

export default ReviewForm;
