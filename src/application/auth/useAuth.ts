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
    return payload.user ?? null;
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

      // If token already contains user info, use it
      if (payload.user) {
        if (mounted) setUser(payload.user);
        return;
      }

      // If token contains direct claims like username/first_name, use them
      const maybeUserFromClaims =
        payload.username || payload.first_name || payload.email
          ? payload
          : null;
      if (maybeUserFromClaims) {
        if (mounted) setUser(maybeUserFromClaims);
        return;
      }

      // If token only has user_id, try fetching profile from API
      const userId = payload.user_id ?? payload.sub ?? null;
      if (!userId) {
        if (mounted) setUser(null);
        return;
      }

      try {
        // try /users/me/ first (common), fallback to /users/{id}/
        let res: any = null;
        try {
          res = await authHttp.get("/users/me/");
        } catch (e) {
          res = await authHttp.get(`/users/${userId}/`);
        }
        if (mounted) setUser(res?.data ?? null);
      } catch (e) {
        if (mounted) setUser(null);
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
    try {
      // notify other hook instances in the same window
      window.dispatchEvent(new Event("cursos_token_change"));
    } catch {}
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
