export interface Aviso {
  id: number;
  usuario:
    | {
        id: number;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
      }
    | number;
  titulo: string;
  descripcion: string;
  contenido?: string;
  tipo: "aviso" | "mensaje_sistema" | "recordatorio" | "urgente";
  fecha_creacion: string;
  fecha_envio: string | null;
  leido: boolean;
  comentario: string;
  para_todos?: boolean;
  usuarios?: number[];
}

export interface AvisoFormData {
  usuario_id?: number;
  titulo: string;
  descripcion: string;
  tipo: "aviso" | "mensaje_sistema" | "recordatorio" | "urgente";
  comentario?: string;
  para_todos?: boolean;
  usuarios?: number[];
}

export interface AvisoFiltros {
  leido?: boolean;
  tipo?: string;
  search?: string;
  page?: number;
}

export const TIPOS_AVISO = [
  { value: "aviso", label: "Aviso" },
  { value: "mensaje_sistema", label: "Mensaje del Sistema" },
  { value: "recordatorio", label: "Recordatorio" },
  { value: "urgente", label: "Urgente" },
] as const;
