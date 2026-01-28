
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import RequireRole from '../../components/RequireRole'
import { publicHttp, authHttp } from '../../../infrastructure/http/httpClients'
import { useAuth } from '../../../application/auth/useAuth'

const Dashboard: React.FC = () => {
  const [totalCourses, setTotalCourses] = useState<number | null>(null)
  const [welcome, setWelcome] = useState<string | null>(null)
  const [myCourses, setMyCourses] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const location = useLocation() as any
  const { isAuthenticated, user } = useAuth() as { isAuthenticated: boolean; user: any | null }
  

  // fallback: try decode access token from localStorage if useAuth.user is not available
  function decodeLocalTokenName() {
    try {
      const token = localStorage.getItem('cursos_access')
      if (!token) return null
      const parts = token.split('.')
      if (parts.length < 2) return null
      const payload = parts[1]
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
      const obj = JSON.parse(decodeURIComponent(escape(json)))
      return obj.user?.first_name ?? obj.first_name ?? obj.user?.username ?? obj.username ?? obj.user?.email ?? obj.email ?? null
    } catch {
      return null
    }
  }

  function decodeLocalTokenPayload() {
    try {
      const token = localStorage.getItem('cursos_access')
      if (!token) return null
      const parts = token.split('.')
      if (parts.length < 2) return null
      const payload = parts[1]
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
      const obj = JSON.parse(decodeURIComponent(escape(json)))
      return obj
    } catch {
      return null
    }
  }

  

  useEffect(() => {
    let mounted = true
    publicHttp
      .get('/cursos/')
      .then((res) => {
        if (!mounted) return
        const count = res?.data?.count ?? null
        setTotalCourses(count)
      })
      .catch(() => {
        if (!mounted) return
        setTotalCourses(null)
      })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    try {
      const v = location?.state?.justLoggedIn
      if (v) {
        setWelcome('Bienvenido — ¡qué bueno verte! Empieza explorando tus cursos.')
        // clear state navigation to avoid showing again if user navigates back
        if (history?.replaceState) history.replaceState({}, '')
      }
    } catch {}
  }, [location])

  useEffect(() => {
    let mounted = true
    if (!isAuthenticated) {
      setMyCourses([])
      setNotifications([])
      return
    }

    setMyCourses([])

    authHttp
      .get('/inscripciones/')
      .then((res) => {
        if (!mounted) return
        const data = res?.data ?? []
        const items = Array.isArray(data) ? data : data.results ?? []
        if (!Array.isArray(items) || items.length === 0) {
          setMyCourses([])
          return
        }

        const payload = decodeLocalTokenPayload()
        const currentUserId = user?.id ?? payload?.user_id ?? payload?.id ?? null

        const filtered = items.filter((ins: any) => {
          const uid = ins.usuario?.id ?? ins.usuario ?? ins.user_id ?? null
          if (!currentUserId) return false
          return String(uid) === String(currentUserId)
        })

        const courses = filtered.map((ins: any) => ins.curso ?? { id: ins.curso_id, titulo: ins.curso_title })
        setMyCourses(courses)
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.warn('Failed to load inscripciones', err)
        if (!mounted) return
        setMyCourses([])
      })

    return () => {
      mounted = false
    }
  }, [isAuthenticated, user])

  

  return (
    <div className="p-6">
      {welcome && (
        <div role="status" aria-live="polite" className="mb-4 rounded-md border border-emerald-700/60 bg-emerald-900/5 px-3 py-2 text-emerald-700 text-sm">
          {welcome}
        </div>
      )}

      {(() => {
        const nameFromHook = user ? (user.first_name || user.username || user.email || null) : null
        const name = nameFromHook ?? decodeLocalTokenName()
        if (!name) return null
        return (
          <div className="text-lg font-medium text-slate-800 mb-2">
            Hola, {name}!!
            <div className="text-xs text-gray-500">Rol: {String(user?.tipo_usuario ?? user?.role ?? user?.type ?? '—')}</div>
          </div>
        )
      })()}

      {/* debug panel removed */}

      <h1 className="text-2xl font-semibold mb-2">Resumen</h1>
      {/* admin controls removed */}
      <p className="text-sm text-gray-600 mb-6">Descubre novedades y sigue avanzando en tu aprendizaje.</p>

      {/* KPI: show number of enrolled courses (0 if none) */}
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <div className="text-xs text-gray-500">Mis cursos en progreso</div>
          <div className="text-2xl font-bold">{Array.isArray(myCourses) ? myCourses.length : 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mis cursos: render list and link */}
        <div className="lg:col-span-2 bg-white shadow rounded p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Mis cursos</h2>
            <Link to="/app/cursos" className="text-sm text-blue-600">Ver todos</Link>
          </div>
          {Array.isArray(myCourses) && myCourses.length > 0 ? (
            <ul className="space-y-2">
              {myCourses.map((c, i) => (
                <li key={i} className="text-sm text-gray-700">{c.titulo ?? c.title ?? c.nombre ?? `Curso ${i + 1}`}</li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-500">Aún no estás inscrito en cursos.</div>
          )}
        </div>

        {/* Notificaciones: render only when there is data */}
        {Array.isArray(notifications) && notifications.length > 0 && (
          <div className="bg-white shadow rounded p-4">
            <h2 className="font-medium mb-3">Notificaciones recientes</h2>
            <ul className="text-sm text-gray-600 space-y-2">
              {notifications.map((n, idx) => (
                <li key={idx} className="border-b pb-2">{n.message ?? n.titulo ?? 'Notificación'}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <RequireRole roles={["admin", "instructor"]} fallback={null}>
          <Link to="/app/cursos/create" className="px-4 py-2 bg-blue-600 text-white rounded">Crear curso</Link>
        </RequireRole>
        
        <Link to="/app/cursos" className="px-4 py-2 border rounded">Explorar cursos</Link>
      </div>

      {/* debug inscripciones removed */}

      {/* admin global inscripciones removed */}
    </div>
  )
}

export default Dashboard
