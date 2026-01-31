import React from "react";
import { CATEGORIAS, NIVELES } from "../../../domain/cursos/curso.types";
import { SearchBar } from "../common";

interface CursoFiltrosProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoria: string;
  onCategoriaChange: (value: string) => void;
  nivel: string;
  onNivelChange: (value: string) => void;
  onClear?: () => void;
}

export default function CursoFiltros({
  search,
  onSearchChange,
  categoria,
  onCategoriaChange,
  nivel,
  onNivelChange,
  onClear,
}: CursoFiltrosProps) {
  const hasFilters = search || categoria || nivel;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Búsqueda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar
          </label>
          <SearchBar
            value={search}
            onChange={onSearchChange}
            placeholder="Buscar cursos..."
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            value={categoria}
            onChange={(e) => onCategoriaChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
          >
            <option value="">Todas las categorías</option>
            {CATEGORIAS.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Nivel */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nivel
          </label>
          <select
            value={nivel}
            onChange={(e) => onNivelChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent"
          >
            <option value="">Todos los niveles</option>
            {NIVELES.map((niv) => (
              <option key={niv.value} value={niv.value}>
                {niv.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botón limpiar filtros */}
      {hasFilters && onClear && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClear}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
