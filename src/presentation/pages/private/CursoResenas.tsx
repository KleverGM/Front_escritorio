import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { resenaService } from "../../../application/resenas/resena.service";
import { inscripcionService } from "../../../application/inscripciones/inscripcion.service";
import type {
  Resena,
  ResenaEstadisticas,
} from "../../../domain/resenas/resena.types";
import { LoadingSpinner, ErrorMessage } from "../../components/common";
import {
  ReviewForm,
  ReviewStatsCard,
  ReviewCard,
  ReviewEditModal,
} from "../../components/resenas";
import Modal from "../../components/common/Modal";

export default function CursoResenas() {
  const { id } = useParams<{ id: string }>();
  const cursoId = parseInt(id || "0");

  const [resenas, setResenas] = useState<Resena[]>([]);
  const [stats, setStats] = useState<ResenaEstadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canReview, setCanReview] = useState(false);

  const [rating, setRating] = useState(5);
  const [titulo, setTitulo] = useState("");
  const [comentario, setComentario] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState<Resena | null>(null);
  const [editing, setEditing] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Resena | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, [cursoId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [resenasRes, statsRes, inscripciones] = await Promise.all([
        resenaService.getAll({ curso_id: cursoId, page_size: 1000 }),
        resenaService.getEstadisticasCurso(cursoId),
        inscripcionService.getMisInscripciones(),
      ]);

      const list = resenasRes?.results ?? [];
      setResenas(list);
      setStats(statsRes);

      const enrolled = inscripciones.some((i) => i.curso?.id === cursoId);
      const alreadyReviewed = list.some((r) => r.es_mia);
      setCanReview(enrolled && !alreadyReviewed);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Error al cargar reseñas");
    } finally {
      setLoading(false);
    }
  };

  const myReview = useMemo(() => resenas.find((r) => r.es_mia), [resenas]);

  const validateReview = (values: {
    rating: number;
    titulo: string;
    comentario: string;
  }) => {
    if (!values.comentario.trim() || values.comentario.trim().length < 10) {
      setError("El comentario debe tener al menos 10 caracteres");
      return false;
    }
    if (values.titulo.trim().length > 200) {
      setError("El título no puede superar 200 caracteres");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!canReview) return;

    const values = {
      rating,
      titulo,
      comentario,
    };

    if (!validateReview(values)) return;

    try {
      setSubmitting(true);
      await resenaService.create({
        curso_id: cursoId,
        rating,
        titulo: titulo.trim() || "Reseña",
        comentario: comentario.trim(),
      });
      setTitulo("");
      setComentario("");
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "No se pudo crear la reseña");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (values: {
    rating: number;
    titulo: string;
    comentario: string;
  }) => {
    if (!editingReview) return;
    if (!validateReview(values)) return;
    try {
      setEditing(true);
      await resenaService.update(editingReview.id, {
        rating: values.rating,
        titulo: values.titulo || "Reseña",
        comentario: values.comentario,
      });
      setEditingReview(null);
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "No se pudo editar la reseña");
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true);
      await resenaService.delete(id);
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "No se pudo eliminar la reseña");
    } finally {
      setDeleting(false);
      setReviewToDelete(null);
    }
  };

  const handleMarkHelpful = async (id: string) => {
    try {
      await resenaService.marcarUtil(id);
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "No se pudo marcar como útil");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link
            to={`/app/cursos/${cursoId}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Volver al curso
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            Reseñas
          </h1>
        </div>

        {error && <ErrorMessage message={error} className="mb-6" />}

        {stats && <ReviewStatsCard stats={stats} />}

        {canReview && (
          <div className="mb-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Escribe tu reseña
              </h2>
              <ReviewForm
                initialValues={{ rating, titulo, comentario }}
                submitting={submitting}
                submitLabel="Publicar reseña"
                onSubmit={async (values) => {
                  setRating(values.rating);
                  setTitulo(values.titulo);
                  setComentario(values.comentario);
                  await handleSubmit();
                }}
              />
            </div>
          </div>
        )}

        <div className="space-y-4">
          {resenas.map((resena) => (
            <ReviewCard
              key={resena.id}
              resena={resena}
              onMarkHelpful={handleMarkHelpful}
              onEdit={(r) => setEditingReview(r)}
              onDelete={(id) => {
                const target = resenas.find((r) => r.id === id) || null;
                setReviewToDelete(target);
              }}
            />
          ))}
        </div>

        <ReviewEditModal
          isOpen={!!editingReview}
          resena={editingReview}
          submitting={editing}
          onClose={() => setEditingReview(null)}
          onSubmit={handleEditSubmit}
        />

        <Modal
          isOpen={!!reviewToDelete}
          onClose={() => setReviewToDelete(null)}
          title="Eliminar reseña"
          size="sm"
        >
          <p className="text-gray-700 dark:text-gray-200 mb-4">
            ¿Seguro que deseas eliminar esta reseña? Esta acción no se puede
            deshacer.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setReviewToDelete(null)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              Cancelar
            </button>
            <button
              onClick={() => reviewToDelete && handleDelete(reviewToDelete.id)}
              disabled={deleting}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50 hover:bg-red-700"
            >
              {deleting ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
