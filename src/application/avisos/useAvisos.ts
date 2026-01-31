import { useState, useEffect } from "react";
import { avisoService } from "./aviso.service";
import type { Aviso, AvisoFiltros } from "../../domain/avisos/aviso.types";

export function useAvisos(filtros?: AvisoFiltros) {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAvisos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await avisoService.getAll(filtros);
      setAvisos(data.results || data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Error al cargar avisos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvisos();
  }, [JSON.stringify(filtros)]);

  return { avisos, loading, error, reload: loadAvisos };
}

export function useAvisosNoLeidos() {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAvisos = async () => {
    try {
      setLoading(true);
      const data = await avisoService.getNoLeidos();
      setAvisos(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Error al cargar avisos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvisos();
  }, []);

  return { avisos, loading, error, reload: loadAvisos };
}
