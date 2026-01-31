import React from "react";
import { useAuth } from "../../application/auth/useAuth";

type Props = {
  roles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode | null;
};

function normalize(s?: string) {
  return (s ?? "").toString().toLowerCase();
}

export default function RequireRole({ roles, children, fallback = null }: Props) {
  const { user } = useAuth() as { user: any | null };

  if (!user) return null;

  const userRole = normalize(user.tipo_usuario ?? user.role ?? user.type ?? user.user_type ?? user.username);

  const allowed = roles.some((r) => userRole.includes(r.toLowerCase()));

  return allowed ? <>{children}</> : <>{fallback}</>;
}
