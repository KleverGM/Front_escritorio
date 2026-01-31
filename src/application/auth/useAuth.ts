import { useMemo, useState, useEffect } from "react";
import { authService } from "./auth.service";
import { tokenStorage } from "../../infrastructure/storage/tokenStorage";
import { authHttp } from "../../infrastructure/http/httpClients";
import type { RegisterPayload } from "../../domain/auth/auth.types";

type JwtPayload = Record<string, any> | null;

function parseJwt(token: string): JwtPayload {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch (e) {
    return null;
  }
}

export function useAuth() {
  const [access, setAccess] = useState<string | null>(tokenStorage.getAccess());

  const isAuthenticated = useMemo(() => !!access, [access]);

  const [user, setUser] = useState<any | null>(() => {
    if (!access) return null;
    const payload = parseJwt(access);
    if (!payload) return null;
    // Si el token tiene información del usuario, usarla inmediatamente
    return payload.user ?? payload ?? null;
  });

  useEffect(() => {
    let mounted = true;
    async function fetchProfileIfNeeded() {
      if (!access) {
        if (mounted) setUser(null);
        return;
      }

      const payload = parseJwt(access);
      if (!payload) {
        if (mounted) setUser(null);
        return;
      }

      // Siempre intentar cargar del backend para tener datos completos
      const userId = payload.user_id ?? payload.sub ?? null;
      if (!userId || isNaN(Number(userId))) {
        // Si no hay userId, usar lo que haya en el token
        if (mounted) setUser(payload.user ?? payload);
        return;
      }

      // Cargar datos completos del backend
      try {
        const res = await authHttp.get(`/users/${userId}/`);
        if (mounted && res?.data) {
          setUser(res.data);
        }
      } catch (e) {
        console.warn("No se pudo cargar el perfil del usuario desde backend");
        // Mantener lo que ya está en el estado (del token)
      }
    }

    fetchProfileIfNeeded();
    return () => {
      mounted = false;
    };
  }, [access]);

  const login = async (email: string, password: string) => {
    const tokens = await authService.login({ email, password });
    tokenStorage.set(tokens.access, tokens.refresh);
    setAccess(tokens.access);

    // Decodificar el token para obtener el user_id
    const payload = parseJwt(tokens.access);
    const userId = payload?.user_id ?? payload?.sub ?? null;

    // Intentar obtener el perfil del token primero
    let perfil = payload?.user?.perfil ?? payload?.perfil ?? null;

    // Si no está en el token, hacer petición al backend
    if (!perfil && userId) {
      try {
        const res = await authHttp.get(`/users/${userId}/`);
        perfil = res?.data?.perfil ?? null;
      } catch (e) {
        console.warn("No se pudo obtener el perfil del usuario", e);
      }
    }

    try {
      // notify other hook instances in the same window
      window.dispatchEvent(new Event("cursos_token_change"));
    } catch {}

    // Retornar el perfil para que Login.tsx pueda redirigir correctamente
    return perfil;
  };

  const register = async (payload: RegisterPayload) => {
    // Register but do not auto-login (login endpoint may vary)
    await authService.register(payload);
  };

  const logout = () => {
    tokenStorage.clear();
    setAccess(null);
    try {
      window.dispatchEvent(new Event("cursos_token_change"));
    } catch {}
  };

  // keep hook instances in sync when tokenStorage changes
  useEffect(() => {
    function onChange() {
      setAccess(tokenStorage.getAccess());
    }
    window.addEventListener("cursos_token_change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("cursos_token_change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return { isAuthenticated, access, user, login, register, logout } as const;
}
