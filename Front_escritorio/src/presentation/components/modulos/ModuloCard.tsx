import React from "react";
import { Link } from "react-router-dom";
import type { Modulo, Seccion } from "../../../domain/modulos/modulo.types";
import { Card } from "../common";

interface ModuloCardProps {
  modulo: Modulo;
  cursoId: number;
  onEdit?: (modulo: Modulo) => void;
  onDelete?: (moduloId: number) => void;
  onAddSeccion?: (moduloId: number) => void;
  onEditSeccion?: (seccion: Seccion) => void;
  onDeleteSeccion?: (seccionId: number) => void;
  isInstructor?: boolean;
}

export default function ModuloCard({
  modulo,
  cursoId,
  onEdit,
  onDelete,
  onAddSeccion,
  onEditSeccion,
  onDeleteSeccion,
  isInstructor = false,
}: ModuloCardProps) {
  const totalSecciones = modulo.secciones?.length || 0;
  const duracionTotal =
    modulo.secciones?.reduce((sum, s) => sum + s.duracion_minutos, 0) || 0;

  return (
    <Card className="mb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
              Módulo {modulo.orden}
            </span>
            <h3 className="text-lg font-semibold text-gray-900">
              {modulo.titulo}
            </h3>
          </div>

          {modulo.descripcion && (
            <p className="text-gray-600 text-sm mb-3">{modulo.descripcion}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{totalSecciones} secciones</span>
            <span>•</span>
            <span>{duracionTotal} minutos</span>
          </div>
        </div>

        {/* Acciones del instructor */}
        {isInstructor && (
          <div className="flex items-center gap-2">
            {onAddSeccion && (
              <button
                onClick={() => onAddSeccion(modulo.id)}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
              >
                + Sección
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(modulo)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "¿Estás seguro de eliminar este módulo y todas sus secciones?",
                    )
                  ) {
                    onDelete(modulo.id);
                  }
                }}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>

      {/* Lista de secciones */}
      {modulo.secciones && modulo.secciones.length > 0 && (
        <div className="mt-4 space-y-2">
          {modulo.secciones.map((seccion) => (
            <div
              key={seccion.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <div className="flex items-center gap-3 flex-1">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {seccion.video_url || seccion.video_file ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  )}
                </svg>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {seccion.titulo}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {seccion.duracion_minutos} min
                    {seccion.es_preview && " • Vista previa"}
                  </p>
                </div>
              </div>

              {/* Botones de acciones para secciones (solo instructores) */}
              {isInstructor && (onEditSeccion || onDeleteSeccion) && (
                <div className="flex items-center gap-2">
                  {onEditSeccion && (
                    <button
                      onClick={() => onEditSeccion(seccion)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Editar sección"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                  )}
                  {onDeleteSeccion && (
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `¿Estás seguro de eliminar la sección "${seccion.titulo}"?`,
                          )
                        ) {
                          onDeleteSeccion(seccion.id);
                        }
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Eliminar sección"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
