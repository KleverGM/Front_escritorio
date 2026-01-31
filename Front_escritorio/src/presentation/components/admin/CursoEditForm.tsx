import React from "react";
import { Link } from "react-router-dom";

interface CursoEditFormProps {
  formData: {
    titulo: string;
    descripcion: string;
    categoria: string;
    nivel: string;
    precio: string;
    instructor_id: number | null;
  };
  instructores: Array<{
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
  }>;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onInstructorChange: (instructorId: number | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
}

export default function CursoEditForm({
  formData,
  instructores,
  onChange,
  onInstructorChange,
  onSubmit,
  saving,
}: CursoEditFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Detalles del Curso
      </h2>

      <div className="space-y-4">
        {/* Instructor */}
        <div>
          <label
            htmlFor="instructor_id"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Instructor *
          </label>
          <select
            id="instructor_id"
            name="instructor_id"
            value={formData.instructor_id || ""}
            onChange={(e) =>
              onInstructorChange(
                e.target.value ? parseInt(e.target.value) : null,
              )
            }
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
          >
            <option value="">Selecciona un instructor</option>
            {instructores.map((instructor) => (
              <option key={instructor.id} value={instructor.id}>
                {instructor.first_name && instructor.last_name
                  ? `${instructor.first_name} ${instructor.last_name}`
                  : instructor.username}
              </option>
            ))}
          </select>
        </div>

        {/* Título */}
        <div>
          <label
            htmlFor="titulo"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Título del curso *
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
          />
        </div>

        {/* Descripción */}
        <div>
          <label
            htmlFor="descripcion"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Descripción *
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={onChange}
            required
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
          />
        </div>

        {/* Categoría y Nivel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="categoria"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Categoría *
            </label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
            >
              <option value="">Selecciona una categoría</option>
              <option value="programacion">Programación</option>
              <option value="diseño">Diseño</option>
              <option value="marketing">Marketing</option>
              <option value="negocios">Negocios</option>
              <option value="idiomas">Idiomas</option>
              <option value="musica">Música</option>
              <option value="fotografia">Fotografía</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="nivel"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nivel *
            </label>
            <select
              id="nivel"
              name="nivel"
              value={formData.nivel}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
            >
              <option value="">Selecciona un nivel</option>
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>
        </div>

        {/* Precio */}
        <div>
          <label
            htmlFor="precio"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Precio *
          </label>
          <input
            type="number"
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={onChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 px-6 py-2 bg-[#f8b31d] text-white rounded-lg hover:bg-[#e0a419] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
        <Link
          to="/app/admin/cursos"
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
