import { useState, useEffect } from "react";
import { cursoService } from "./curso.service";
import type {
  Curso,
  CursoDetalle,
  CursoFiltros,
} from "../../domain/cursos/curso.types";

export function useCursos(filtros?: CursoFiltros) {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCursos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cursoService.getAll(filtros);
      setCursos(data.results || data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Error al cargar cursos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCursos();
  }, [JSON.stringify(filtros)]);

  return { cursos, loading, error, reload: loadCursos };
}

export function useCurso(id: number | null) {
  const [curso, setCurso] = useState<CursoDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCurso = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await cursoService.getById(id);
      setCurso(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Error al cargar curso");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurso();
  }, [id]);

  return { curso, loading, error, reload: loadCurso };
}
