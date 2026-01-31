import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { cursoService } from "../../../application/cursos/curso.service";
import { inscripcionService } from "../../../application/inscripciones/inscripcion.service";
import type { ProgresoSeccion } from "../../../domain/inscripciones/inscripcion.types";
import { LoadingSpinner, ErrorMessage, Card } from "../../components/common";

export default function CursoContenido() {
  const { id } = useParams<{ id: string }>();
  const cursoId = parseInt(id || "0");

  const [curso, setCurso] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState<number | null>(null);
  const [completing, setCompleting] = useState(false);
  const [completedSections, setCompletedSections] = useState<Set<number>>(
    () => new Set(),
  );
  const [progressBySection, setProgressBySection] = useState<
    Record<number, ProgresoSeccion>
  >({});

  useEffect(() => {
    loadData();
  }, [cursoId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [cursoData, inscripciones, progreso] = await Promise.all([
        cursoService.getById(cursoId),
        inscripcionService.getMisInscripciones(),
        inscripcionService.getProgresoSecciones(cursoId),
      ]);

      setCurso(cursoData);

      const enrolled = inscripciones.some((i) => i.curso?.id === cursoId);
      setIsEnrolled(enrolled);

      const progressMap: Record<number, ProgresoSeccion> = {};
      const completed = new Set<number>();
      (progreso ?? []).forEach((p: any) => {
        const sectionId = p.seccion_id ?? p.seccion?.id;
        if (!sectionId) return;
        progressMap[sectionId] = p;
        if (p.completado) completed.add(sectionId);
      });
      setProgressBySection(progressMap);
      setCompletedSections(completed);

      const firstSectionId =
        cursoData?.modulos?.[0]?.secciones?.[0]?.id ?? null;
      setCurrentSectionId(firstSectionId);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Error al cargar contenido");
    } finally {
      setLoading(false);
    }
  };

  const allSections = useMemo(() => {
    if (!curso?.modulos) return [] as any[];
    const items: any[] = [];
    curso.modulos.forEach((m: any) => {
      (m.secciones ?? []).forEach((s: any) => {
        items.push({ ...s, moduloTitulo: m.titulo, moduloOrden: m.orden });
      });
    });
    return items;
  }, [curso]);

  const currentSection = useMemo(() => {
    if (!currentSectionId) return null;
    return allSections.find((s) => s.id === currentSectionId) ?? null;
  }, [allSections, currentSectionId]);

  const currentProgress = useMemo(() => {
    if (!currentSection) return null;
    return progressBySection[currentSection.id] ?? null;
  }, [currentSection, progressBySection]);

  const getVideoUrls = (url?: string) => {
    if (!url)
      return {
        embedUrl: null as string | null,
        externalUrl: null as string | null,
      };

    const isYouTube = /(?:youtube\.com|youtu\.be)/i.test(url);
    if (!isYouTube) {
      return { embedUrl: url, externalUrl: url };
    }

    try {
      const normalized = url.replace("youtu.be/", "youtube.com/watch?v=");
      const parsed = new URL(normalized);
      const videoId =
        parsed.searchParams.get("v") || parsed.pathname.split("/").pop();

      if (!videoId) {
        return { embedUrl: null, externalUrl: url };
      }

      return {
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        externalUrl: `https://www.youtube.com/watch?v=${videoId}`,
      };
    } catch {
      return { embedUrl: url, externalUrl: url };
    }
  };

  const videoUrls = useMemo(() => {
    if (!currentSection) return { embedUrl: null, externalUrl: null };
    const rawUrl =
      currentSection.video_url_completa || currentSection.video_url;
    return getVideoUrls(rawUrl);
  }, [currentSection]);

  const formatTiempoVisto = (seconds?: number) => {
    if (!seconds) return "0 min";
    const minutes = Math.round(seconds / 60);
    return `${minutes} min`;
  };

  const handleMarkCompleted = async () => {
    if (!currentSection) return;
    if (completedSections.has(currentSection.id)) return;

    try {
      setCompleting(true);
      await inscripcionService.marcarSeccionCompletada(currentSection.id);
      setCompletedSections((prev) => new Set(prev).add(currentSection.id));
      setProgressBySection((prev) => ({
        ...prev,
        [currentSection.id]: {
          ...(prev[currentSection.id] ?? {
            id: 0,
            seccion_id: currentSection.id,
            fecha_completado: null,
            tiempo_visto: 0,
          }),
          completado: true,
        },
      }));
    } catch (err: any) {
      setError(err?.response?.data?.detail || "No se pudo marcar la sección");
    } finally {
      setCompleting(false);
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
        <ErrorMessage message={error || "Contenido no disponible"} />
        <Link
          to={`/app/cursos/${cursoId}`}
          className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Volver al curso
        </Link>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
        <Card className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Acceso restringido
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Debes estar inscrito en este curso para ver el contenido.
          </p>
          <Link
            to={`/app/cursos/${cursoId}`}
            className="inline-block px-4 py-2 bg-[#f8b31d] text-white rounded-lg hover:bg-[#e0a219]"
          >
            Ver detalle del curso
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <Link
            to={`/app/cursos/${cursoId}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Volver al curso
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {curso.titulo}
            </h1>
            <div className="flex items-center gap-2">
              <Link
                to={`/app/cursos/${cursoId}/resenas`}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                Ver reseñas
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Navegación */}
          <div className="lg:col-span-1">
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Contenido
              </h2>
              <div className="space-y-3">
                {curso.modulos?.map((modulo: any) => (
                  <div key={modulo.id}>
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Módulo {modulo.orden}: {modulo.titulo}
                    </div>
                    <div className="space-y-1">
                      {(modulo.secciones ?? []).map((seccion: any) => {
                        const active = seccion.id === currentSectionId;
                        const completed = completedSections.has(seccion.id);
                        return (
                          <button
                            key={seccion.id}
                            onClick={() => setCurrentSectionId(seccion.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-colors ${
                              active
                                ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                                : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{seccion.titulo}</span>
                              {completed && (
                                <span className="text-green-600 dark:text-green-400">
                                  ✓
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Contenido actual */}
          <div className="lg:col-span-2">
            <Card>
              {currentSection ? (
                <div>
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {currentSection.moduloTitulo}
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {currentSection.titulo}
                    </h2>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {currentProgress?.completado
                        ? "Sección completada"
                        : "Sección pendiente"}
                      {" · "}
                      Tiempo visto:{" "}
                      {formatTiempoVisto(currentProgress?.tiempo_visto)}
                    </div>
                  </div>

                  {videoUrls.embedUrl ? (
                    <div className="mb-4">
                      <iframe
                        title="Video"
                        src={videoUrls.embedUrl}
                        className="w-full h-80 rounded-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      {videoUrls.externalUrl && (
                        <div className="mt-2">
                          <a
                            href={videoUrls.externalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Ver en YouTube
                          </a>
                        </div>
                      )}
                    </div>
                  ) : null}

                  <div className="prose max-w-none text-gray-700 dark:text-gray-200 dark:prose-invert mb-6">
                    {currentSection.contenido ||
                      "No hay contenido de texto para esta sección."}
                  </div>

                  {currentSection.archivo && (
                    <div className="mb-6">
                      <a
                        href={currentSection.archivo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Descargar archivo adjunto
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleMarkCompleted}
                      disabled={
                        completing || completedSections.has(currentSection.id)
                      }
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {completedSections.has(currentSection.id)
                        ? "Sección completada"
                        : completing
                          ? "Marcando..."
                          : "Marcar como completada"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-600 dark:text-gray-300">
                  No hay secciones disponibles.
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
