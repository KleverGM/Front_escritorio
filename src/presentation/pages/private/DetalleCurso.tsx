import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { cursoService } from "../../../application/cursos/curso.service";
import { inscripcionService } from "../../../application/inscripciones/inscripcion.service";
import type { CursoDetalle } from "../../../domain/cursos/curso.types";
import {
  LoadingSpinner,
  ErrorMessage,
  Card,
  RatingStars,
} from "../../components/common";
import { ModuloCard } from "../../components/modulos";
import { useAuth } from "../../../application/auth/useAuth";

export default function DetalleCurso() {
  const { id } = useParams<{ id: string }>();
  const cursoId = parseInt(id || "0");
  const { user } = useAuth() as any;

  const [curso, setCurso] = useState<CursoDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inscrito, setInscrito] = useState(false);
  const [inscribiendo, setInscribiendo] = useState(false);

  useEffect(() => {
    loadCurso();
    checkInscripcion();
  }, [cursoId]);

  const loadCurso = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cursoService.getById(cursoId);
      setCurso(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Error al cargar curso");
    } finally {
      setLoading(false);
    }
  };

  const checkInscripcion = async () => {
    try {
      const inscripciones = await inscripcionService.getMisInscripciones();
      const yaInscrito = inscripciones.some((i) => i.curso.id === cursoId);
      setInscrito(yaInscrito);
    } catch (err) {
      console.error("Error al verificar inscripción:", err);
    }
  };

  const handleInscribirse = async () => {
    try {
      setInscribiendo(true);
      await inscripcionService.inscribirse(cursoId);
      setInscrito(true);
      alert("¡Te has inscrito exitosamente!");
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Error al inscribirse");
    } finally {
      setInscribiendo(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !curso) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
        <ErrorMessage message={error || "Curso no encontrado"} />
        <Link
          to="/app/cursos"
          className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Link
            to="/app/cursos"
            className="inline-flex items-center text-white hover:text-gray-200 mb-4"
          >
            ← Volver al catálogo
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                  {curso.categoria}
                </span>
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                  {curso.nivel}
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{curso.titulo}</h1>
              <p className="text-lg mb-4">{curso.descripcion}</p>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <RatingStars
                    rating={curso.rating_promedio || 0}
                    readonly
                    showNumber={false}
                  />
                  <span>
                    {curso.rating_promedio?.toFixed(1) || "N/A"} (
                    {curso.total_resenas || 0} reseñas)
                  </span>
                </div>
                <div>{curso.total_estudiantes || 0} estudiantes</div>
              </div>
            </div>

            {/* Card de inscripción */}
            <div>
              <Card className="bg-white dark:bg-gray-900">
                {curso.imagen && (
                  <img
                    src={curso.imagen}
                    alt={curso.titulo}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}

                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  ${parseFloat(curso.precio).toFixed(2)}
                </div>

                {inscrito ? (
                  <div className="space-y-2">
                    <Link
                      to={`/app/cursos/${curso.id}/contenido`}
                      className="block w-full text-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                    >
                      Ir al Curso
                    </Link>
                    <Link
                      to={`/app/cursos/${curso.id}/resenas`}
                      className="block w-full text-center px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 font-semibold text-gray-800 dark:text-gray-100"
                    >
                      Ver reseñas
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleInscribirse}
                    disabled={inscribiendo}
                    className="w-full px-6 py-3 bg-[#f8b31d] text-white rounded-lg hover:bg-[#e0a219] font-semibold disabled:opacity-50"
                  >
                    {inscribiendo ? "Inscribiendo..." : "Inscribirse Ahora"}
                  </button>
                )}

                <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  <p className="mb-2">✓ Acceso de por vida</p>
                  <p className="mb-2">✓ Certificado de finalización</p>
                  <p>✓ Soporte del instructor</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido del curso */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Instructor */}
            <Card className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Instructor
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {curso.instructor.first_name?.charAt(0) ||
                      curso.instructor.username.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {curso.instructor.first_name} {curso.instructor.last_name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    @{curso.instructor.username}
                  </p>
                </div>
              </div>
            </Card>

            {/* Contenido del curso */}
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Contenido del Curso
              </h2>
              {curso.modulos && curso.modulos.length > 0 ? (
                <div className="space-y-4">
                  {curso.modulos.map((modulo: any) => (
                    <ModuloCard
                      key={modulo.id}
                      modulo={modulo}
                      cursoId={cursoId}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">
                  Este curso aún no tiene contenido disponible
                </p>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            {/* Lo que aprenderás */}
            <Card className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Lo que aprenderás
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-200">
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Dominar los conceptos fundamentales
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Aplicar conocimientos en proyectos reales
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Obtener certificado de finalización
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
