import { useState, useEffect } from "react";
import { notificacionService } from "./notificacion.service";
import type {
  Notificacion,
  NotificacionFiltros,
} from "../../domain/notificaciones/notificacion.types";

export function useNotificaciones(filtros?: NotificacionFiltros) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotificaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificacionService.getAll(filtros);
      setNotificaciones(data.results || data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Error al cargar notificaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotificaciones();
  }, [JSON.stringify(filtros)]);

  return { notificaciones, loading, error, reload: loadNotificaciones };
}

export function useNotificacionesNoLeidas() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadNotificaciones = async () => {
    try {
      setLoading(true);
      const [data, countData] = await Promise.all([
        notificacionService.getNoLeidas(),
        notificacionService.contarNoLeidas(),
      ]);
      setNotificaciones(data);
      setCount(countData);
    } catch (err) {
      console.error("Error al cargar notificaciones no leídas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotificaciones();

    // Polling cada 30 segundos
    const interval = setInterval(loadNotificaciones, 30000);
    return () => clearInterval(interval);
  }, []);

  return { notificaciones, count, loading, reload: loadNotificaciones };
}
