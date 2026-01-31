import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authHttp } from "../../infrastructure/http/httpClients";
import { useAuth } from "../../application/auth/useAuth";

export default function CrearCursosLayouts() {
  const navigate = useNavigate();
  useAuth();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [nivel, setNivel] = useState("");
  const [precio, setPrecio] = useState("0.00");
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [categoriasOptions, setCategoriasOptions] = useState<string[]>([]);
  const [nivelesOptions, setNivelesOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagenPreview) URL.revokeObjectURL(imagenPreview);
    };
  }, [imagenPreview]);

  useEffect(() => {
    let mounted = true;
    const loadOptions = async () => {
      try {
        const res = await authHttp.get("/cursos/?page_size=200");
        const items = res.data?.results || [];
        const cats = Array.from(
          new Set(
            items
              .map((c: any) => c.categoria)
              .filter((v: any): v is string => typeof v === "string"),
          ),
        ) as string[];
        const nvs = Array.from(
          new Set(
            items
              .map((c: any) => c.nivel)
              .filter((v: any): v is string => typeof v === "string"),
          ),
        ) as string[];
        if (!mounted) return;
        setCategoriasOptions(cats);
        setNivelesOptions(nvs);
      } catch (e) {
        // ignore
        console.warn("No se pudieron cargar categorías/niveles", e);
      }
    };
    loadOptions();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (imagenFile) {
        const form = new FormData();
        form.append("titulo", titulo);
        form.append("descripcion", descripcion);
        form.append("categoria", categoria);
        form.append("nivel", nivel);
        form.append("precio", String(parseFloat(precio)));
        form.append("activo", String(true));
        form.append("imagen", imagenFile);
        await authHttp.post("/cursos/", form);
      } else {
        const payload = {
          titulo,
          descripcion,
          categoria,
          nivel,
          precio: parseFloat(precio),
          activo: true,
        };
        await authHttp.post("/cursos/", payload);
      }
      // On success, navigate to cursos and reload to refresh list
      navigate("/app/cursos");
      try {
        if (typeof window !== "undefined")
          setTimeout(() => window.location.reload(), 250);
      } catch (_) {}
    } catch (err: any) {
      const resp = err?.response?.data;
      const formatApiError = (d: any) => {
        if (!d) return "Error al crear el curso";
        if (typeof d === "string") return d;
        if (d.detail) return String(d.detail);
        if (d.non_field_errors)
          return Array.isArray(d.non_field_errors)
            ? d.non_field_errors.join(" ")
            : String(d.non_field_errors);
        // field errors
        if (typeof d === "object") {
          try {
            const parts: string[] = [];
            for (const k of Object.keys(d)) {
              const v = d[k];
              if (Array.isArray(v)) parts.push(`${k}: ${v.join(" ")}`);
              else parts.push(`${k}: ${String(v)}`);
            }
            return parts.join(" -- ");
          } catch (e) {
            return JSON.stringify(d);
          }
        }
        return "Error al crear el curso";
      };
      setError(formatApiError(resp));
      // Do not store created courses in the frontend; surface API errors to the user only.
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Crear curso</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded shadow-sm grid grid-cols-2 gap-8"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              placeholder="Ej. Curso de Kotlin"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="mt-1 block w-full border rounded-md px-3 py-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              placeholder="Breve descripción del curso"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="mt-1 block w-full border rounded-md px-3 py-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              {categoriasOptions.length > 0 ? (
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="mt-1 block w-full border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">Seleccione categoría</option>
                  {categoriasOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  placeholder="programacion"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="mt-1 block w-full border rounded-md px-3 py-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nivel
              </label>
              {nivelesOptions.length > 0 ? (
                <select
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value)}
                  className="mt-1 block w-full border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">Seleccione nivel</option>
                  {nivelesOptions.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  placeholder="intermedio"
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value)}
                  className="mt-1 block w-full border rounded-md px-3 py-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200"
                />
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio
              </label>
              <input
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="mt-1 block w-40 border rounded-md px-3 py-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 text-right"
              />
              <div className="text-xs text-gray-400 mt-1">Formato: 0.00</div>
            </div>
          </div>
        </div>

        {/* Columna derecha dentro del mismo cuadro */}
        <div className="flex flex-col items-center justify-start">
          <div className="w-full mb-4">
            <input
              id="imagen"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                if (file) {
                  if (imagenPreview) URL.revokeObjectURL(imagenPreview);
                  const url = URL.createObjectURL(file);
                  setImagenPreview(url);
                  setImagenFile(file);
                } else {
                  if (imagenPreview) URL.revokeObjectURL(imagenPreview);
                  setImagenPreview(null);
                  setImagenFile(null);
                }
              }}
              className="hidden"
            />
            <label
              htmlFor="imagen"
              className="px-4 py-2 bg-gray-100 border rounded-md text-sm cursor-pointer hover:bg-gray-200"
            >
              Seleccionar archivo
            </label>
            <span className="ml-4 text-sm text-gray-600">
              {imagenFile ? imagenFile.name : "Sin archivos seleccionados"}
            </span>
          </div>

          <div className="w-full h-96 flex items-center justify-center bg-gray-50">
            {imagenPreview ? (
              <img
                src={imagenPreview}
                alt="Preview"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-center text-gray-500">
                Arrastra o selecciona una imagen
                <br />
                Aquí se mostrará la vista previa
              </div>
            )}
          </div>
        </div>

        <div className="col-span-2">
          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-between mt-4">
            <div>
              <Link
                to="/app/cursos"
                className="text-sm text-gray-600 hover:underline"
              >
                Volver a cursos
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-md shadow"
            >
              {loading ? "Creando..." : "Crear curso"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
