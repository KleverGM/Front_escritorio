import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { authHttp } from '../../../infrastructure/http/httpClients'
import RequireRole from '../../components/RequireRole'

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    authHttp
      .get('/notificaciones/')
      .then((res) => {
        if (!mounted) return
        const data = res.data?.results ?? res.data ?? []
        setNotificaciones(Array.isArray(data) ? data : [])
      })
      .catch((e) => {
        if (!mounted) return
        setError(e?.response?.data?.detail ?? 'Error al cargar notificaciones')
      })
      .finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Notificaciones</h1>
        <RequireRole roles={["admin"]} fallback={null}>
          <Link to="/app/notificaciones/create" className="px-3 py-2 bg-emerald-600 text-white rounded">Crear notificación</Link>
        </RequireRole>
      </div>

      {loading && <div>Cargando...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && !error && (
        <ul className="space-y-2">
          {notificaciones.length === 0 && <li className="text-gray-500">No hay notificaciones.</li>}
          {notificaciones.map((n: any) => (
            <li key={n.id ?? n.pk ?? n._id} className="p-3 border rounded">
              <div className="font-medium">{n.titulo ?? n.message ?? 'Sin título'}</div>
              <div className="text-sm text-gray-600">{n.mensaje ?? n.message ?? ''}</div>
              <div className="text-xs text-gray-400 mt-1">{n.fecha_creacion ?? n.created_at ?? ''}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
