import React from "react";
import type { JSX } from "react";

interface TipoBadgeProps {
  tipo: string;
  showIcon?: boolean;
}

export default function TipoBadge({ tipo, showIcon = false }: TipoBadgeProps) {
  const getTipoColor = (tipo: string) => {
    const tipos: Record<string, string> = {
      mensaje_sistema:
        "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-800",
      aviso:
        "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-800",
      recordatorio:
        "bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-800",
      urgente:
        "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 border-red-300 dark:border-red-800",
    };
    return (
      tipos[tipo] ||
      "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
    );
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      mensaje_sistema: "Sistema",
      aviso: "Aviso",
      recordatorio: "Recordatorio",
      urgente: "Urgente",
    };
    return labels[tipo] || tipo;
  };

  const getTipoIcon = (tipo: string) => {
    const icons: Record<string, JSX.Element> = {
      mensaje_sistema: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      ),
      aviso: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
      recordatorio: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      ),
      urgente: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    };
    return icons[tipo] || null;
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded border ${getTipoColor(tipo)}`}
    >
      {showIcon && getTipoIcon(tipo)}
      {getTipoLabel(tipo)}
    </span>
  );
}
