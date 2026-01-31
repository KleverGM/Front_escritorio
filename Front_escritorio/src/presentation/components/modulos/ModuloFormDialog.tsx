import React, { useState } from "react";
import type { ModuloFormData } from "../../../domain/modulos/modulo.types";
import { Modal } from "../common";

interface ModuloFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ModuloFormData) => Promise<void>;
  cursoId: number;
  initialData?: Partial<ModuloFormData>;
  title?: string;
}

export default function ModuloFormDialog({
  isOpen,
  onClose,
  onSubmit,
  cursoId,
  initialData,
  title = "Crear Módulo",
}: ModuloFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<ModuloFormData>>({
    titulo: initialData?.titulo || "",
    descripcion: initialData?.descripcion || "",
    orden: initialData?.orden || 1,
    curso_id: cursoId,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "orden" ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titulo) {
      alert("El título es obligatorio");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData as ModuloFormData);
      onClose();
      // Reset form
      setFormData({
        titulo: "",
        descripcion: "",
        orden: 1,
        curso_id: cursoId,
      });
    } catch (error) {
      console.error("Error al guardar módulo:", error);
      alert("Error al guardar el módulo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Título */}
        <div>
          <label
            htmlFor="titulo"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Título *
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
          />
        </div>

        {/* Descripción */}
        <div>
          <label
            htmlFor="descripcion"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
          />
        </div>

        {/* Orden */}
        <div>
          <label
            htmlFor="orden"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Orden *
          </label>
          <input
            type="number"
            id="orden"
            name="orden"
            value={formData.orden}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
          />
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#f8b31d] text-white rounded-lg hover:bg-[#e0a219] disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
