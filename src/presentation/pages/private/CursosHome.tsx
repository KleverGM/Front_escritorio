import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { authHttp } from "../../../infrastructure/http/httpClients";

type Curso = {
  id: number;
  titulo: string;
  descripcion?: string;
  imagen?: string | null;
  precio?: string;
  instructor?: { first_name?: string; last_name?: string; username?: string };
  categoria?: string;
  nivel?: string;
};

export default function CursosHome() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const [cursos, setCursos] = useState<Curso[]>([]);
  const [totalCursos, setTotalCursos] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchCursos() {
      setLoading(true);
      setError(null);
      // clear previous data to avoid mixing cached/local entries
      setCursos([]);
      try {
        const params: any = { page_size: 100 };
        if (q) params.q = q;
        const res = await authHttp.get("/cursos/", { params, headers: { 'Cache-Control': 'no-cache' } });
        if (!mounted) return;
        const data = res.data?.results ?? res.data ?? [];
        // filter out any stray/mock course matching known patterns (title/instructor/description)
          // Show all courses returned by the API.
          const filtered = Array.isArray(data) ? data : []
          const total = typeof res.data?.count === 'number' ? res.data.count : filtered.length
          setTotalCursos(total as number | null)
          setCursos(filtered)
      } catch (err: any) {
        setError(err?.message ?? "Error al cargar cursos");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchCursos();
    return () => {
      mounted = false;
    };
  }, [q]);

  // Metadata fetch removed: only general info is shown to all users for now

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-2 sm:px-4 lg:px-6 py-6">
        <h2 className="text-3xl font-bold text-center mb-2">Cursos recomendados</h2>
        <p className="text-sm text-gray-600 text-center mb-6">Descubre cursos seleccionados para impulsar tu carrera — aprende a tu ritmo con instructores expertos.</p>

        {loading && <div className="text-center py-6">Cargando cursos...</div>}
        {error && <div className="text-red-600 text-center py-4">{error}</div>}

        {/* Frase larga alineada a la izquierda con número inline */}
        <div className="w-full mb-6 pl-0">
          <p className="text-left text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
            {totalCursos ?? '—'} esperando por ti!!
          </p>
        </div>

        {!loading && !error && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {cursos.length === 0 && <div className="text-center text-gray-600 col-span-full">No se encontraron cursos.</div>}
            {cursos.map((c) => (
              <div key={c.id} className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm flex flex-col h-full">
                {c.imagen ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.imagen} alt={c.titulo} className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover" />
                ) : (
                  <div className="w-full h-64 sm:h-72 md:h-80 lg:h-96 bg-gray-100 flex items-center justify-center text-gray-400">No imagen</div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-2xl md:text-3xl font-semibold text-slate-900">{c.titulo}</div>
                    <div className="text-sm text-slate-600 mt-1">{c.instructor ? `${c.instructor.first_name ?? ''} ${c.instructor.last_name ?? ''}`.trim() : ''}</div>
                    <div className="text-sm text-gray-600 mt-3">{c.descripcion ? (c.descripcion.length > 240 ? c.descripcion.slice(0, 240) + '...' : c.descripcion) : ''}</div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-xl md:text-2xl font-bold">${c.precio ?? '0.00'}</div>
                    <button className="ml-4 px-4 py-2 md:px-5 md:py-3 bg-[#f8b31d] rounded text-black font-medium">Ver</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
