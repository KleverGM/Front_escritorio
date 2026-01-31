import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { inscripcionService } from "../../../application/inscripciones/inscripcion.service";
import type { Inscripcion } from "../../../domain/inscripciones/inscripcion.types";
import {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  ProgressBar,
  Card,
} from "../../components/common";

export default function MisCursos() {
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"todos" | "en-progreso" | "completados">(
    "todos",
  );

  useEffect(() => {
    loadInscripciones();
  }, []);

  const loadInscripciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inscripcionService.getMisInscripciones();
      setInscripciones(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Error al cargar inscripciones");
    } finally {
      setLoading(false);
    }
  };

  const filteredInscripciones = inscripciones.filter((insc) => {
    if (filter === "completados") return insc.completado;
    if (filter === "en-progreso") return !insc.completado && insc.progreso > 0;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Mis Cursos</h1>
          <p className="text-gray-600 mt-1">Continúa donde lo dejaste</p>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter("todos")}
            className={`px-4 py-2 rounded-lg ${
              filter === "todos"
                ? "bg-[#f8b31d] text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Todos ({inscripciones.length})
          </button>
          <button
            onClick={() => setFilter("en-progreso")}
            className={`px-4 py-2 rounded-lg ${
              filter === "en-progreso"
                ? "bg-[#f8b31d] text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            En Progreso (
            {
              inscripciones.filter((i) => !i.completado && i.progreso > 0)
                .length
            }
            )
          </button>
          <button
            onClick={() => setFilter("completados")}
            className={`px-4 py-2 rounded-lg ${
              filter === "completados"
                ? "bg-[#f8b31d] text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Completados ({inscripciones.filter((i) => i.completado).length})
          </button>
        </div>

        {/* Error */}
        {error && <ErrorMessage message={error} className="mb-6" />}

        {/* Lista de cursos */}
        {filteredInscripciones.length === 0 ? (
          <EmptyState
            icon="📚"
            title="No tienes cursos inscritos"
            description="Explora el catálogo y comienza a aprender"
            action={
              <Link
                to="/app/cursos"
                className="px-4 py-2 bg-[#f8b31d] text-white rounded-lg hover:bg-[#e0a219]"
              >
                Explorar Cursos
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInscripciones.map((inscripcion) => (
              <Card key={inscripcion.id} hoverable>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {inscripcion.curso.titulo}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {inscripcion.curso.instructor.first_name}{" "}
                    {inscripcion.curso.instructor.last_name}
                  </p>
                </div>

                {/* Progreso */}
                <div className="mb-4">
                  <ProgressBar
                    progress={inscripcion.progreso}
                    color={inscripcion.completado ? "green" : "blue"}
                  />
                </div>

                {/* Estado */}
                <div className="flex items-center justify-between mb-4">
                  {inscripcion.completado ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      ✓ Completado
                    </span>
                  ) : inscripcion.progreso > 0 ? (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      En progreso
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      No iniciado
                    </span>
                  )}

                  <span className="text-sm text-gray-500">
                    {new Date(
                      inscripcion.fecha_inscripcion,
                    ).toLocaleDateString()}
                  </span>
                </div>

                {/* Botón */}
                <Link
                  to={`/app/cursos/${inscripcion.curso.id}/contenido`}
                  className="block w-full text-center px-4 py-2 bg-[#f8b31d] text-white rounded-lg hover:bg-[#e0a219]"
                >
                  {inscripcion.progreso > 0 ? "Continuar" : "Comenzar"}
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
