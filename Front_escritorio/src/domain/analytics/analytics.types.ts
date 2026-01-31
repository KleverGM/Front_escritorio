export interface EventoAnalytics {
  id: number;
  usuario_id: number;
  tipo_evento: string;
  curso_id: number | null;
  seccion_id: number | null;
  datos_extra: any;
  fecha: string;
}

export interface EventoFormData {
  tipo_evento: string;
  curso_id?: number;
  seccion_id?: number;
  datos_extra?: any;
}

export interface EstadisticasActividad {
  eventos_hoy: number;
  eventos_semana: number;
  eventos_mes: number;
  total_eventos: number;
  usuarios_activos: number;
  eventos_por_tipo: Record<string, number>;
  cursos_mas_visitados: Array<{
    curso_id: number;
    titulo: string;
    visitas: number;
  }>;
}
