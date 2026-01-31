export interface Respuesta {
  usuario_id: number;
  texto: string;
  fecha: string;
}

export interface Resena {
  id: string;
  curso_id: number;
  usuario_id: number;
  rating: number;
  titulo: string;
  comentario: string;
  fecha_creacion: string;
  fecha_modificacion?: string;
  verificado_compra: boolean;
  util_count: number;
  usuarios_util: number[];
  respuestas: Respuesta[];
  imagenes: string[];
  tags: string[];
  // Campos calculados del backend
  nombre_usuario: string;
  titulo_curso: string;
  es_mia: boolean;
}

export interface ResenaEstadisticas {
  total_resenas: number;
  rating_promedio: number;
  distribucion: {
    "5": number;
    "4": number;
    "3": number;
    "2": number;
    "1": number;
  };
}

export interface ResenaFormData {
  curso_id: number;
  rating: number;
  titulo: string;
  comentario: string;
  imagenes?: string[];
  tags?: string[];
}
