import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { inscripcionService } from "../../../application/inscripciones/inscripcion.service";
import type { Inscripcion } from "../../../domain/inscripciones/inscripcion.types";
import {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  SearchBar,
  Card,
} from "../../components/common";

export default function MisCompras() {
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCompras();
  }, []);

  const loadCompras = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inscripcionService.getMisInscripciones();
      setInscripciones(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Error al cargar compras");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return inscripciones;
    return inscripciones.filter((i) => {
      const titulo = i.curso?.titulo?.toLowerCase() || "";
      const instructor = `${i.curso?.instructor?.first_name || ""} ${
        i.curso?.instructor?.last_name || ""
      }`.toLowerCase();
      return titulo.includes(query) || instructor.includes(query);
    });
  }, [inscripciones, search]);

  const totalCompras = inscripciones.length;
  const completadas = inscripciones.filter((i) => i.completado).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Mis compras
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Tus cursos adquiridos y su estado
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Compras totales
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {totalCompras}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cursos completados
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {completadas}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              En progreso
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {totalCompras - completadas}
            </p>
          </Card>
        </div>

        <div className="mb-6">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar por curso o instructor..."
          />
        </div>

        {error && <ErrorMessage message={error} className="mb-6" />}

        {filtered.length === 0 ? (
          <EmptyState
            icon="🧾"
            title="No tienes compras"
            description="Explora el catálogo y adquiere tu primer curso"
            action={
              <Link
                to="/app/cursos"
                className="px-4 py-2 bg-[#f8b31d] text-white rounded-lg hover:bg-[#e0a219]"
              >
                Explorar cursos
              </Link>
            }
          />
        ) : (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Curso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Instructor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Fecha de compra
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {filtered.map((inscripcion) => (
                    <tr
                      key={inscripcion.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {inscripcion.curso?.titulo || "Curso"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {inscripcion.curso?.instructor?.first_name || ""} {""}
                        {inscripcion.curso?.instructor?.last_name || ""}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {new Date(
                          inscripcion.fecha_inscripcion,
                        ).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        {inscripcion.completado ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-200">
                            Completado
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200">
                            En progreso
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/app/cursos/${inscripcion.curso?.id}`}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            Ver detalle
                          </Link>
                          <Link
                            to={`/app/cursos/${inscripcion.curso?.id}/contenido`}
                            className="px-3 py-2 bg-[#f8b31d] text-white rounded-lg text-sm hover:bg-[#e0a219]"
                          >
                            Ir al curso
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
