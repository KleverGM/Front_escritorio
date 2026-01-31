import React, { useState, useEffect } from "react";
import type { SeccionFormData } from "../../../domain/modulos/modulo.types";
import { Modal, FileUpload } from "../common";

interface SeccionFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SeccionFormData) => Promise<void>;
  moduloId: number;
  initialData?: Partial<SeccionFormData>;
  title?: string;
}

export default function SeccionFormDialog({
  isOpen,
  onClose,
  onSubmit,
  moduloId,
  initialData,
  title = "Crear Sección",
}: SeccionFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<SeccionFormData>>({
    titulo: "",
    contenido: "",
    video_url: "",
    video_file: null,
    archivo: null,
    orden: 1,
    modulo_id: moduloId,
    duracion_minutos: 0,
    es_preview: false,
  });

  // Actualizar formData cuando initialData cambia
  useEffect(() => {
    if (initialData) {
      setFormData({
        titulo: initialData.titulo || "",
        contenido: initialData.contenido || "",
        video_url: initialData.video_url || "",
        video_file: null,
        archivo: null,
        orden: initialData.orden || 1,
        modulo_id: moduloId,
        duracion_minutos: initialData.duracion_minutos || 0,
        es_preview: initialData.es_preview || false,
      });
    } else {
      setFormData({
        titulo: "",
        contenido: "",
        video_url: "",
        video_file: null,
        archivo: null,
        orden: 1,
        modulo_id: moduloId,
        duracion_minutos: 0,
        es_preview: false,
      });
    }
  }, [initialData, moduloId]);

  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [archivoPreview, setArchivoPreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? parseInt(value) || 0
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titulo || !formData.contenido) {
      alert("El título y contenido son obligatorios");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData as SeccionFormData);
      onClose();
    } catch (error) {
      console.error("Error al guardar sección:", error);
      alert("Error al guardar la sección");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
      >
        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d]"
          />
        </div>

        {/* Contenido */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contenido *
          </label>
          <textarea
            name="contenido"
            value={formData.contenido}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d]"
          />
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL del Video (YouTube, Vimeo, etc.)
          </label>
          <input
            type="url"
            name="video_url"
            value={formData.video_url}
            onChange={handleChange}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d]"
          />
        </div>

        {/* Video File */}
        <FileUpload
          label="O sube un archivo de video MP4"
          accept="video/mp4"
          onChange={(file) =>
            setFormData((prev) => ({ ...prev, video_file: file }))
          }
          maxSize={100}
        />

        {/* Archivo adicional */}
        <FileUpload
          label="Archivo adicional (PDF, ZIP, etc.)"
          accept=".pdf,.zip,.rar,.doc,.docx"
          onChange={(file) =>
            setFormData((prev) => ({ ...prev, archivo: file }))
          }
          maxSize={50}
        />

        {/* Duración y Orden */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duración (minutos) *
            </label>
            <input
              type="number"
              name="duracion_minutos"
              value={formData.duracion_minutos}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orden *
            </label>
            <input
              type="number"
              name="orden"
              value={formData.orden}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d]"
            />
          </div>
        </div>

        {/* Vista previa */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="es_preview"
            id="es_preview"
            checked={formData.es_preview}
            onChange={handleChange}
            className="w-4 h-4 text-[#f8b31d] border-gray-300 rounded focus:ring-[#f8b31d]"
          />
          <label htmlFor="es_preview" className="ml-2 text-sm text-gray-700">
            Permitir vista previa gratuita
          </label>
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
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
