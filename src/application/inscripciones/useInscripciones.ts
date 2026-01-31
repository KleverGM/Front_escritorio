import { useState, useEffect } from "react";
import { inscripcionService } from "./inscripcion.service";
import type {
  Inscripcion,
  InscripcionFiltros,
} from "../../domain/inscripciones/inscripcion.types";

export function useInscripciones(filtros?: InscripcionFiltros) {
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInscripciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inscripcionService.getAll(filtros);
      setInscripciones(data.results || data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Error al cargar inscripciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInscripciones();
  }, [JSON.stringify(filtros)]);

  return { inscripciones, loading, error, reload: loadInscripciones };
}

export function useMisInscripciones() {
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInscripciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inscripcionService.getMisInscripciones();
      setInscripciones(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail || "Error al cargar mis inscripciones",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInscripciones();
  }, []);

  return { inscripciones, loading, error, reload: loadInscripciones };
}
