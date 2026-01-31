import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { cursoService } from "../../../../application/cursos/curso.service";
import {
  moduloService,
  seccionService,
} from "../../../../application/modulos/modulo.service";
import type { CursoDetalle } from "../../../../domain/cursos/curso.types";
import type { Modulo } from "../../../../domain/modulos/modulo.types";
import { LoadingSpinner, ErrorMessage, Card } from "../../../components/common";
import { ModuloCard } from "../../../components/modulos";
import { ModuloFormDialog } from "../../../components/modulos";
import { SeccionFormDialog } from "../../../components/secciones";

export default function GestionModulos() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cursoId = parseInt(id || "0");

  const [curso, setCurso] = useState<CursoDetalle | null>(null);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModuloDialog, setShowModuloDialog] = useState(false);
  const [showSeccionDialog, setShowSeccionDialog] = useState(false);
  const [editingModulo, setEditingModulo] = useState<Modulo | null>(null);
  const [editingSeccion, setEditingSeccion] = useState<any | null>(null);
  const [selectedModuloId, setSelectedModuloId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, [cursoId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cursoData, modulosData] = await Promise.all([
        cursoService.getById(cursoId),
        moduloService.getByCursoId(cursoId),
      ]);
      setCurso(cursoData);
      // La respuesta puede venir como array directo o dentro de 'results'
      setModulos(
        Array.isArray(modulosData)
          ? modulosData
          : (modulosData as any)?.results || [],
      );
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModulo = async (data: any) => {
    await moduloService.create(data);
    await loadData();
    setShowModuloDialog(false);
  };

  const handleEditModulo = async (data: any) => {
    if (editingModulo) {
      await moduloService.update(editingModulo.id, data);
      await loadData();
      setShowModuloDialog(false);
      setEditingModulo(null);
    }
  };

  const handleDeleteModulo = async (moduloId: number) => {
    try {
      await moduloService.delete(moduloId);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Error al eliminar módulo");
    }
  };

  const handleAddSeccion = (moduloId: number) => {
    setSelectedModuloId(moduloId);
    setEditingSeccion(null);
    setShowSeccionDialog(true);
  };

  const handleEditSeccion = (seccion: any) => {
    setSelectedModuloId(seccion.modulo_id);
    setEditingSeccion(seccion);
    setShowSeccionDialog(true);
  };

  const handleDeleteSeccion = async (seccionId: number) => {
    try {
      await seccionService.delete(seccionId);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Error al eliminar sección");
    }
  };

  const handleCreateSeccion = async (data: any) => {
    if (editingSeccion) {
      // Editar sección existente
      await seccionService.update(editingSeccion.id, data);
    } else {
      // Crear nueva sección
      await seccionService.create(data);
    }

    await loadData();
    setShowSeccionDialog(false);
    setSelectedModuloId(null);
    setEditingSeccion(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !curso) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <ErrorMessage message={error || "Curso no encontrado"} />
        <Link
          to="/app/admin/cursos"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          ← Volver a cursos
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/app/admin/cursos"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Volver a Cursos
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestión de Módulos
              </h1>
              <p className="text-gray-600 mt-1">{curso.titulo}</p>
            </div>
            <button
              onClick={() => {
                setEditingModulo(null);
                setShowModuloDialog(true);
              }}
              className="px-4 py-2 bg-[#f8b31d] text-white rounded-lg hover:bg-[#e0a219] transition-colors"
            >
              + Nuevo Módulo
            </button>
          </div>
        </div>

        {/* Información del curso */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Categoría</p>
              <p className="text-lg font-semibold text-gray-900">
                {curso.categoria}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Nivel</p>
              <p className="text-lg font-semibold text-gray-900">
                {curso.nivel}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Precio</p>
              <p className="text-lg font-semibold text-gray-900">
                ${parseFloat(curso.precio).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Módulos</p>
              <p className="text-lg font-semibold text-gray-900">
                {modulos.length}
              </p>
            </div>
          </div>
        </Card>

        {/* Lista de módulos */}
        {modulos.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay módulos
              </h3>
              <p className="text-gray-600 mb-4">
                Comienza creando el primer módulo de este curso
              </p>
              <button
                onClick={() => setShowModuloDialog(true)}
                className="px-4 py-2 bg-[#f8b31d] text-white rounded-lg hover:bg-[#e0a219]"
              >
                Crear Módulo
              </button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {modulos.map((modulo) => (
              <ModuloCard
                key={modulo.id}
                modulo={modulo}
                cursoId={cursoId}
                isInstructor={true}
                onEdit={(m) => {
                  setEditingModulo(m);
                  setShowModuloDialog(true);
                }}
                onDelete={handleDeleteModulo}
                onAddSeccion={handleAddSeccion}
                onEditSeccion={handleEditSeccion}
                onDeleteSeccion={handleDeleteSeccion}
              />
            ))}
          </div>
        )}

        {/* Diálogo de módulo */}
        <ModuloFormDialog
          isOpen={showModuloDialog}
          onClose={() => {
            setShowModuloDialog(false);
            setEditingModulo(null);
          }}
          onSubmit={editingModulo ? handleEditModulo : handleCreateModulo}
          cursoId={cursoId}
          initialData={editingModulo || undefined}
          title={editingModulo ? "Editar Módulo" : "Crear Módulo"}
        />

        {/* Diálogo de sección */}
        {selectedModuloId && (
          <SeccionFormDialog
            isOpen={showSeccionDialog}
            onClose={() => {
              setShowSeccionDialog(false);
              setSelectedModuloId(null);
              setEditingSeccion(null);
            }}
            onSubmit={handleCreateSeccion}
            moduloId={selectedModuloId}
            initialData={editingSeccion || undefined}
            title={editingSeccion ? "Editar Sección" : "Crear Sección"}
          />
        )}
      </div>
    </div>
  );
}
