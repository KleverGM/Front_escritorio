import React from "react";
import type { Resena } from "../../../domain/resenas/resena.types";
import Modal from "../common/Modal";
import ReviewForm from "./ReviewForm";
import type { ReviewFormValues } from "./ReviewForm";

type ReviewEditModalProps = {
  isOpen: boolean;
  resena: Resena | null;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: ReviewFormValues) => Promise<void> | void;
};

const ReviewEditModal: React.FC<ReviewEditModalProps> = ({
  isOpen,
  resena,
  submitting = false,
  onClose,
  onSubmit,
}) => {
  if (!resena) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar reseña" size="lg">
      <ReviewForm
        initialValues={{
          rating: resena.rating,
          titulo: resena.titulo,
          comentario: resena.comentario,
        }}
        submitting={submitting}
        submitLabel="Guardar cambios"
        onSubmit={onSubmit}
      />
    </Modal>
  );
};

export default ReviewEditModal;
