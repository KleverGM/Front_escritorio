import { useState, useEffect } from "react";
import { usuarioService } from "./usuario.service";
import type {
  Usuario,
  UsuarioFiltros,
} from "../../domain/usuarios/usuario.types";

export function useUsuarios(filtros?: UsuarioFiltros) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usuarioService.getAll(filtros);
      setUsuarios(data.results || data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, [JSON.stringify(filtros)]);

  return { usuarios, loading, error, reload: loadUsuarios };
}

export function useInstructores() {
  const [instructores, setInstructores] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInstructores = async () => {
      try {
        setLoading(true);
        const data = await usuarioService.getInstructores();
        setInstructores(data);
      } catch (err: any) {
        setError(err?.response?.data?.detail || "Error al cargar instructores");
      } finally {
        setLoading(false);
      }
    };

    loadInstructores();
  }, []);

  return { instructores, loading, error };
}
