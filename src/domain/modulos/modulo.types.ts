export interface Modulo {
  id: number;
  titulo: string;
  descripcion: string;
  orden: number;
  curso_id?: number;
  curso?: number;
  secciones?: Seccion[];
}

export interface Seccion {
  id: number;
  titulo: string;
  contenido: string;
  video_url: string | null;
  video_file: string | null;
  archivo: string | null;
  orden: number;
  modulo_id?: number;
  modulo?: number;
  duracion_minutos: number;
  es_preview: boolean;
}

export interface ModuloFormData {
  titulo: string;
  descripcion: string;
  orden: number;
  curso: number;
}

export interface SeccionFormData {
  titulo: string;
  contenido: string;
  video_url?: string;
  video_file?: File | null;
  archivo?: File | null;
  orden: number;
  modulo: number;
  duracion_minutos: number;
  es_preview?: boolean;
}
