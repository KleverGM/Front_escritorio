import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { authHttp } from "../../../../infrastructure/http/httpClients";
import { LoadingSpinner, ErrorMessage } from "../../../components/common";
import CursoInfoCard from "../../../components/admin/CursoInfoCard";
import CursoEditForm from "../../../components/admin/CursoEditForm";

interface Curso {
  id: number;
  titulo: string;
  descripcion: string;
  instructor: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
  categoria: string;
  nivel: string;
  precio: string;
  imagen: string | null;
  activo: boolean;
  fecha_creacion: string;
  total_modulos?: number;
  total_secciones?: number;
  total_estudiantes?: number;
}

export default function EditarCurso() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [curso, setCurso] = useState<Curso | null>(null);
  const [instructores, setInstructores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",
    nivel: "",
    precio: "",
    activo: true,
    instructor_id: null as number | null,
  });

  useEffect(() => {
    loadCurso();
    loadInstructores();
  }, [id]);

  const loadCurso = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await authHttp.get(`/cursos/${id}/`);
      const data = res.data;
      setCurso(data);
      setFormData({
        titulo: data.titulo || "",
        descripcion: data.descripcion || "",
        categoria: data.categoria || "",
        nivel: data.nivel || "",
        precio: data.precio || "0",
        activo: data.activo ?? true,
        instructor_id: data.instructor?.id || null,
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.error ||
          "Error al cargar el curso",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadInstructores = async () => {
    try {
      const res = await authHttp.get("/users/", {
        params: { perfil: "instructor", page_size: 100 },
      });
      const data = res.data?.results || res.data || [];
      setInstructores(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar instructores:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await authHttp.patch(`/cursos/${id}/`, formData);
      setSuccess(true);
      setTimeout(() => {
        navigate("/app/admin/cursos");
      }, 1500);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.error ||
          "Error al actualizar el curso",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleInstructorChange = (instructorId: number | null) => {
    setFormData((prev) => ({ ...prev, instructor_id: instructorId }));
  };

  const toggleActivo = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const newActivo = !formData.activo;
      await authHttp.patch(`/cursos/${id}/`, { activo: newActivo });
      setFormData((prev) => ({ ...prev, activo: newActivo }));
      setSuccess(true);
      loadCurso();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.error ||
          "Error al cambiar el estado del curso",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEliminar = async () => {
    if (!curso) return;

    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar el curso "${curso.titulo}"?\n\n` +
        "Solo se puede eliminar si NO tiene estudiantes inscritos, módulos o reseñas.\n" +
        "Si tiene contenido relacionado, se te sugerirá desactivarlo en su lugar.",
    );

    if (!confirmar) return;

    setSaving(true);
    setError(null);

    try {
      await authHttp.delete(`/cursos/${id}/`);
      alert("Curso eliminado exitosamente");
      navigate("/app/admin/cursos");
    } catch (err: any) {
      // El backend puede devolver un objeto con detalles del error
      const errorData = err?.response?.data;

      if (errorData?.error) {
        // Construir mensaje detallado
        let mensaje = errorData.error;

        if (errorData.total_estudiantes) {
          mensaje += `\n\nEstudiantes inscritos: ${errorData.total_estudiantes}`;
        }
        if (errorData.total_modulos) {
          mensaje += `\nMódulos: ${errorData.total_modulos}`;
        }
        if (errorData.total_secciones) {
          mensaje += `\nSecciones: ${errorData.total_secciones}`;
        }
        if (errorData.total_resenas) {
          mensaje += `\nReseñas: ${errorData.total_resenas}`;
        }
        if (errorData.accion_recomendada) {
          mensaje += `\n\nRecomendación: ${errorData.accion_recomendada}`;
        }

        setError(mensaje);
      } else {
        setError(err?.response?.data?.detail || "Error al eliminar el curso");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !curso) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <ErrorMessage message={error} />
          <Link
            to="/app/admin/cursos"
            className="mt-4 inline-block text-[#f8b31d] hover:underline"
          >
            ← Volver a la lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 overflow-x-hidden">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/app/admin/cursos"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Volver a Gestión de Cursos
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Editar Curso</h1>
          <p className="text-gray-600 mt-1">
            Modifica los detalles del curso o cambia su estado
          </p>
        </div>

        {/* Información del curso */}
        {curso && (
          <CursoInfoCard
            curso={curso}
            activo={formData.activo}
            onToggleActivo={toggleActivo}
            onEliminar={handleEliminar}
            saving={saving}
          />
        )}

        {/* Mensajes */}
        {error && <ErrorMessage message={error} className="mb-6" />}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            ✓ Curso actualizado correctamente
          </div>
        )}

        {/* Formulario de edición */}
        <CursoEditForm
          formData={formData}
          instructores={instructores}
          onChange={handleChange}
          onInstructorChange={handleInstructorChange}
          onSubmit={handleSubmit}
          saving={saving}
        />
      </div>
    </div>
  );
}
