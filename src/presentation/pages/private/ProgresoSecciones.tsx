import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { inscripcionService } from "../../../application/inscripciones/inscripcion.service";
import { cursoService } from "../../../application/cursos/curso.service";
import type { Inscripcion } from "../../../domain/inscripciones/inscripcion.types";
import type { CursoDetalle } from "../../../domain/cursos/curso.types";
import type { ProgresoSeccion } from "../../../domain/inscripciones/inscripcion.types";
import {
  Card,
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from "../../components/common";

export default function ProgresoSecciones() {
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [selectedCursoId, setSelectedCursoId] = useState<number | null>(null);
  const [curso, setCurso] = useState<CursoDetalle | null>(null);
  const [progreso, setProgreso] = useState<ProgresoSeccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [progresoInput, setProgresoInput] = useState(0);
  const [completadoInput, setCompletadoInput] = useState(false);

  useEffect(() => {
    const loadInscripciones = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await inscripcionService.getMisInscripciones();
        setInscripciones(data);
        if (data.length > 0) {
          setSelectedCursoId(data[0].curso.id);
        }
      } catch (e: any) {
        setError(e?.response?.data?.detail || "Error al cargar inscripciones");
      } finally {
        setLoading(false);
      }
    };

    loadInscripciones();
  }, []);

  useEffect(() => {
    const loadCurso = async () => {
      if (!selectedCursoId) return;
      try {
        setLoading(true);
        setError(null);
        const [cursoData, progresoData] = await Promise.all([
          cursoService.getById(selectedCursoId),
          inscripcionService.getProgresoSecciones(selectedCursoId),
        ]);
        setCurso(cursoData);
        setProgreso(progresoData ?? []);
      } catch (e: any) {
        setError(e?.response?.data?.detail || "Error al cargar progreso");
      } finally {
        setLoading(false);
      }
    };

    loadCurso();
  }, [selectedCursoId]);

  useEffect(() => {
    if (!selectedCursoId) return;
    const inscripcion = inscripciones.find(
      (i) => i.curso.id === selectedCursoId,
    );
    if (inscripcion) {
      setProgresoInput(Math.round(inscripcion.progreso ?? 0));
      setCompletadoInput(!!inscripcion.completado);
    }
  }, [selectedCursoId, inscripciones]);

  const progresoMap = useMemo(() => {
    const map: Record<number, ProgresoSeccion> = {};
    progreso.forEach((p: any) => {
      const id = p.seccion_id ?? p.seccion?.id;
      if (id) map[id] = p;
    });
    return map;
  }, [progreso]);

  const secciones = useMemo(() => {
    if (!curso?.modulos) return [] as any[];
    const items: any[] = [];
    curso.modulos.forEach((modulo: any) => {
      (modulo.secciones ?? []).forEach((seccion: any) => {
        items.push({
          ...seccion,
          moduloTitulo: modulo.titulo,
          moduloOrden: modulo.orden,
        });
      });
    });
    return items;
  }, [curso]);

  const totalSecciones = secciones.length;
  const completadas = secciones.filter(
    (s) => progresoMap[s.id]?.completado,
  ).length;
  const progresoPercent = totalSecciones
    ? Math.round((completadas / totalSecciones) * 100)
    : 0;

  const selectedInscripcion = useMemo(() => {
    if (!selectedCursoId) return null;
    return inscripciones.find((i) => i.curso.id === selectedCursoId) ?? null;
  }, [inscripciones, selectedCursoId]);

  const formatTiempoVisto = (seconds?: number) => {
    if (!seconds) return "0 min";
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.round(minutes / 60);
    return `${hours} h`;
  };

  const handleUpdateInscripcion = async () => {
    if (!selectedInscripcion) return;
    try {
      setSaving(true);
      setError(null);
      const progresoValue = Math.min(100, Math.max(0, progresoInput));
      const completadoValue = completadoInput || progresoValue >= 100;
      await inscripcionService.update(selectedInscripcion.id, {
        progreso: progresoValue,
        completado: completadoValue,
      });
      setInscripciones((prev) =>
        prev.map((i) =>
          i.id === selectedInscripcion.id
            ? { ...i, progreso: progresoValue, completado: completadoValue }
            : i,
        ),
      );
      setCompletadoInput(completadoValue);
      setProgresoInput(progresoValue);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "No se pudo actualizar progreso");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Progreso por sección
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Revisa tu avance detallado por curso y sección
          </p>
        </div>

        {error && <ErrorMessage message={error} className="mb-6" />}

        {inscripciones.length === 0 ? (
          <EmptyState
            icon="📚"
            title="Aún no tienes cursos inscritos"
            description="Inscríbete para ver tu progreso por sección"
            action={
              <Link
                to="/app/cursos"
                className="px-4 py-2 bg-[#f8b31d] text-white rounded-lg hover:bg-[#e0a219]"
              >
                Explorar cursos
              </Link>
            }
          />
        ) : (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Seleccionar curso
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Elige un curso para ver el progreso de sus secciones
                  </p>
                </div>
                <select
                  value={selectedCursoId ?? ""}
                  onChange={(e) => setSelectedCursoId(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                >
                  {inscripciones.map((inscripcion) => (
                    <option
                      key={inscripcion.curso.id}
                      value={inscripcion.curso.id}
                    >
                      {inscripcion.curso.titulo}
                    </option>
                  ))}
                </select>
              </div>
            </Card>

            {curso ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total de secciones
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                      {totalSecciones}
                    </p>
                  </Card>
                  <Card>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Completadas
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                      {completadas}
                    </p>
                  </Card>
                  <Card>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Progreso
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                      {progresoPercent}%
                    </p>
                  </Card>
                </div>

                {selectedInscripcion && (
                  <Card>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Ajustar progreso del curso
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Puedes actualizar manualmente tu progreso y marcar el
                      curso como completado.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                          Progreso (%)
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={progresoInput}
                          onChange={(e) =>
                            setProgresoInput(Number(e.target.value))
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div className="flex items-end">
                        <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                          <input
                            type="checkbox"
                            checked={completadoInput}
                            onChange={(e) =>
                              setCompletadoInput(e.target.checked)
                            }
                          />
                          Marcar como completado
                        </label>
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={handleUpdateInscripcion}
                          disabled={saving}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700"
                        >
                          {saving ? "Guardando..." : "Guardar cambios"}
                        </button>
                      </div>
                    </div>
                  </Card>
                )}

                <Card>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {curso.titulo}
                    </h2>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/app/cursos/${curso.id}/contenido`}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        Ver contenido
                      </Link>
                      <Link
                        to={`/app/cursos/${curso.id}/resenas`}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        Reseñas
                      </Link>
                    </div>
                  </div>

                  {secciones.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-300">
                      No hay secciones disponibles.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {secciones.map((seccion) => {
                        const prog = progresoMap[seccion.id];
                        const completed = !!prog?.completado;
                        return (
                          <div
                            key={seccion.id}
                            className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                          >
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Módulo {seccion.moduloOrden}:{" "}
                                {seccion.moduloTitulo}
                              </p>
                              <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                {seccion.titulo}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  completed
                                    ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                                }`}
                              >
                                {completed ? "Completada" : "Pendiente"}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {formatTiempoVisto(prog?.tiempo_visto)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
