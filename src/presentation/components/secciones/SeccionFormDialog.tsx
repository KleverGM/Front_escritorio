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
  totalSecciones?: number;
}

export default function SeccionFormDialog({
  isOpen,
  onClose,
  onSubmit,
  moduloId,
  initialData,
  title = "Crear Sección",
  totalSecciones = 0,
}: SeccionFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const siguienteOrden = initialData?.orden || totalSecciones + 1;
  const [formData, setFormData] = useState<Partial<SeccionFormData>>({
    titulo: "",
    contenido: "",
    video_url: "",
    video_file: null,
    archivo: null,
    orden: siguienteOrden,
    modulo: moduloId,
    duracion_minutos: 5,
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
        orden: initialData.orden || siguienteOrden,
        modulo: moduloId,
        duracion_minutos: initialData.duracion_minutos || 5,
        es_preview: initialData.es_preview || false,
      });
    } else {
      setFormData({
        titulo: "",
        contenido: "",
        video_url: "",
        video_file: null,
        archivo: null,
        orden: siguienteOrden,
        modulo: moduloId,
        duracion_minutos: 5,
        es_preview: false,
      });
    }
  }, [initialData, moduloId, siguienteOrden]);

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
            placeholder="Ej: Introducción a Variables en Python"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d]"
          />
          <p className="mt-1 text-xs text-gray-500">
            Nombre de la lección que verán los estudiantes
          </p>
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
            placeholder="Describe el contenido de esta lección. Qué aprenderán los estudiantes, conceptos clave, ejemplos..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d]"
          />
          <p className="mt-1 text-xs text-gray-500">
            Descripción detallada de la lección
          </p>
        </div>

        {/* Video - Sección con indicador de opciones */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Video de la lección{" "}
            <span className="text-gray-400">(opcional - elige una opción)</span>
          </p>

          {/* Video URL */}
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-2">
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

          <div className="text-center text-xs text-gray-500 my-2">O</div>

          {/* Video File */}
          <FileUpload
            label="Sube un archivo de video MP4"
            accept="video/mp4"
            onChange={(file) =>
              setFormData((prev) => ({ ...prev, video_file: file }))
            }
            maxSize={100}
          />
        </div>

        {/* Archivo adicional */}
        <div>
          <FileUpload
            label="Archivo adicional (PDF, ZIP, etc.) - opcional"
            accept=".pdf,.zip,.rar,.doc,.docx"
            onChange={(file) =>
              setFormData((prev) => ({ ...prev, archivo: file }))
            }
            maxSize={50}
          />
          <p className="mt-1 text-xs text-gray-500">
            Material complementario para descargar (apuntes, código, etc.)
          </p>
        </div>

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
              min="1"
              placeholder="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d]"
            />
            <p className="mt-1 text-xs text-gray-500">
              Tiempo estimado de la lección
            </p>
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
            <p className="mt-1 text-xs text-gray-500">
              {initialData?.orden
                ? "Posición actual"
                : `Esta será la lección #${siguienteOrden}`}
            </p>
          </div>
        </div>

        {/* Vista previa */}
        <div className="border border-blue-200 bg-blue-50 rounded-lg p-3">
          <div className="flex items-start">
            <input
              type="checkbox"
              name="es_preview"
              id="es_preview"
              checked={formData.es_preview}
              onChange={handleChange}
              className="w-4 h-4 text-[#f8b31d] border-gray-300 rounded focus:ring-[#f8b31d] mt-0.5"
            />
            <div className="ml-2">
              <label
                htmlFor="es_preview"
                className="text-sm font-medium text-gray-700"
              >
                Permitir vista previa gratuita
              </label>
              <p className="text-xs text-gray-600 mt-1">
                Los usuarios podrán ver esta lección sin estar inscritos en el
                curso. Ideal para lecciones de introducción.
              </p>
            </div>
          </div>
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
