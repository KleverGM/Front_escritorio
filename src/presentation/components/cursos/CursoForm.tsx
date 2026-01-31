import React, { useState } from "react";
import { CATEGORIAS, NIVELES } from "../../../domain/cursos/curso.types";
import type { CursoFormData } from "../../../domain/cursos/curso.types";
import { FileUpload } from "../common";

interface CursoFormProps {
  initialData?: Partial<CursoFormData>;
  onSubmit: (data: CursoFormData) => void;
  loading?: boolean;
  instructores?: Array<{
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
  }>;
  isAdmin?: boolean;
}

export default function CursoForm({
  initialData,
  onSubmit,
  loading = false,
  instructores = [],
  isAdmin = false,
}: CursoFormProps) {
  const [formData, setFormData] = useState<Partial<CursoFormData>>({
    titulo: initialData?.titulo || "",
    descripcion: initialData?.descripcion || "",
    categoria: initialData?.categoria || "",
    nivel: initialData?.nivel || "",
    precio: initialData?.precio || 0,
    instructor_id: initialData?.instructor_id,
    imagen: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "precio" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleImageChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, imagen: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.titulo ||
      !formData.descripcion ||
      !formData.categoria ||
      !formData.nivel
    ) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    onSubmit(formData as CursoFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Instructor (solo admin) */}
      {isAdmin && instructores.length > 0 && (
        <div>
          <label
            htmlFor="instructor_id"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Instructor *
          </label>
          <select
            id="instructor_id"
            name="instructor_id"
            value={formData.instructor_id || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                instructor_id: e.target.value
                  ? parseInt(e.target.value)
                  : undefined,
              }))
            }
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
          >
            <option value="" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              Selecciona un instructor
            </option>
            {instructores.map((inst) => (
              <option
                key={inst.id}
                value={inst.id}
                className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              >
                {inst.first_name && inst.last_name
                  ? `${inst.first_name} ${inst.last_name}`
                  : inst.username}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Título */}
      <div>
        <label
          htmlFor="titulo"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Título del curso *
        </label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
        />
      </div>

      {/* Descripción */}
      <div>
        <label
          htmlFor="descripcion"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Descripción *
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
        />
      </div>

      {/* Categoría y Nivel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="categoria"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Categoría *
          </label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
          >
            <option value="" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              Selecciona una categoría
            </option>
            {CATEGORIAS.map((cat) => (
              <option
                key={cat.value}
                value={cat.value}
                className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              >
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="nivel"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nivel *
          </label>
          <select
            id="nivel"
            name="nivel"
            value={formData.nivel}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
          >
            <option value="" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              Selecciona un nivel
            </option>
            {NIVELES.map((niv) => (
              <option
                key={niv.value}
                value={niv.value}
                className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              >
                {niv.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Precio */}
      <div>
        <label
          htmlFor="precio"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Precio (USD) *
        </label>
        <input
          type="number"
          id="precio"
          name="precio"
          value={formData.precio}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
        />
      </div>

      {/* Imagen */}
      <FileUpload
        label="Imagen del curso"
        accept="image/*"
        onChange={handleImageChange}
        preview={imagePreview}
        maxSize={5}
      />

      {/* Botones */}
      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-[#f8b31d] text-white rounded-lg hover:bg-[#e0a219] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Guardando..." : "Guardar curso"}
        </button>
      </div>
    </form>
  );
}
