import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cursoService } from "../../../application/cursos/curso.service";
import type { Curso } from "../../../domain/cursos/curso.types";
import {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  SearchBar,
} from "../../components/common";
import { CursoCard, CursoFiltros } from "../../components/cursos";

export default function CatalogoCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("");
  const [nivel, setNivel] = useState("");

  useEffect(() => {
    loadCursos();
  }, [search, categoria, nivel]);

  const loadCursos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cursoService.getAll({
        search,
        categoria,
        nivel,
        activo: true,
      });
      setCursos(data.results || data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Error al cargar cursos");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategoria("");
    setNivel("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Catálogo de Cursos
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Explora nuestra amplia selección de cursos
          </p>
        </div>

        {/* Filtros */}
        <CursoFiltros
          search={search}
          onSearchChange={setSearch}
          categoria={categoria}
          onCategoriaChange={setCategoria}
          nivel={nivel}
          onNivelChange={setNivel}
          onClear={handleClearFilters}
        />

        {/* Error */}
        {error && <ErrorMessage message={error} className="mb-6" />}

        {/* Loading */}
        {loading && <LoadingSpinner />}

        {/* Resultados */}
        {!loading && !error && (
          <>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              {cursos.length} curso{cursos.length !== 1 ? "s" : ""} encontrado
              {cursos.length !== 1 ? "s" : ""}
            </div>

            {cursos.length === 0 ? (
              <EmptyState
                icon="📚"
                title="No se encontraron cursos"
                description="Intenta ajustar los filtros de búsqueda"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cursos.map((curso) => (
                  <CursoCard
                    key={curso.id}
                    curso={curso}
                    actions={
                      <Link
                        to={`/app/cursos/${curso.id}`}
                        className="px-4 py-2 bg-[#f8b31d] text-white rounded-lg hover:bg-[#e0a219] text-sm shadow-sm"
                      >
                        Ver Detalles
                      </Link>
                    }
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
