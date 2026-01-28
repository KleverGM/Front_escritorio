import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authHttp } from '../../../infrastructure/http/httpClients'
import RequireRole from '../../components/RequireRole'

export default function CrearNotificacion() {
  const nav = useNavigate()
  const [usuarioId, setUsuarioId] = useState<string>('')
  const [isGlobal, setIsGlobal] = useState<boolean>(false)
  const [searchResults, setSearchResults] = useState<any[] | null>(null)
  const [searching, setSearching] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [tipo, setTipo] = useState('mensaje_sistema')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      // resolve usuario_id: if global, send null; if digits, use directly; if text, assume username and try to resolve
      let targetId: number | null = null
      if (!isGlobal && usuarioId) {
        if (/^\d+$/.test(usuarioId.trim())) targetId = Number(usuarioId.trim())
        else {
          // try to resolve by username/search
          try {
            const res = await authHttp.get(`/users/?search=${encodeURIComponent(usuarioId.trim())}`)
            const users = res.data?.results ?? res.data ?? []
            if (Array.isArray(users) && users.length === 1) targetId = users[0].id
            else if (Array.isArray(users) && users.length > 1) {
              // pick first match by default (could be improved to force selection)
              targetId = users[0].id
            } else {
              // not found
              throw new Error('Usuario no encontrado')
            }
          } catch (e: any) {
            throw e
          }
        }
      }

      const payload = {
        usuario_id: isGlobal ? null : targetId,
        tipo,
        titulo,
        mensaje
      }
      await authHttp.post('/notificaciones/', payload)
      nav('/app')
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Error al crear notificación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <RequireRole roles={["admin"]} fallback={<div>No autorizado</div>}>
      <div className="p-6 max-w-xl">
        <h1 className="text-2xl font-semibold mb-4">Crear notificación</h1>
        {error && <div className="mb-3 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Enviar a todos (global)</label>
            <label className="inline-flex items-center gap-2 mt-1">
              <input type="checkbox" checked={isGlobal} onChange={e => setIsGlobal(e.target.checked)} />
              <span className="text-sm">Enviar a todos</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium">Usuario (id o username, opcional)</label>
            <div className="flex gap-2 mt-1">
              <input disabled={isGlobal} value={usuarioId} onChange={e => setUsuarioId(e.target.value)} placeholder="id o username" className="block w-full border rounded p-2" />
              <button type="button" disabled={isGlobal || !usuarioId.trim()} onClick={async () => {
                setSearching(true)
                setSearchResults(null)
                try {
                  const res = await authHttp.get(`/users/?search=${encodeURIComponent(usuarioId.trim())}`)
                  const users = res.data?.results ?? res.data ?? []
                  setSearchResults(Array.isArray(users) ? users : [])
                  if (Array.isArray(users) && users.length === 1) {
                    setUsuarioId(String(users[0].id))
                  }
                } catch (e) {
                  setSearchResults([])
                } finally {
                  setSearching(false)
                }
              }} className="px-3 py-2 bg-gray-100 border rounded">Buscar</button>
            </div>
            {searching && <div className="text-xs text-gray-500 mt-1">Buscando...</div>}
            {searchResults && (
              <div className="mt-2">
                {searchResults.length === 0 && <div className="text-xs text-gray-500">No se encontraron usuarios.</div>}
                {searchResults.length > 0 && (
                  <ul className="border rounded p-2 max-h-40 overflow-auto">
                    {searchResults.map((u: any) => (
                      <li key={u.id} className="py-1 flex justify-between items-center">
                        <div className="text-sm">{u.username ?? u.first_name ?? u.email} <span className="text-xs text-gray-400">(id: {u.id})</span></div>
                        <button type="button" onClick={() => setUsuarioId(String(u.id))} className="text-xs text-blue-600">Seleccionar</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Título</label>
            <input value={titulo} onChange={e => setTitulo(e.target.value)} className="mt-1 block w-full border rounded p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Mensaje</label>
            <textarea value={mensaje} onChange={e => setMensaje(e.target.value)} className="mt-1 block w-full border rounded p-2" rows={4} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Tipo</label>
            <select value={tipo} onChange={e => setTipo(e.target.value)} className="mt-1 block w-full border rounded p-2">
              <option value="mensaje_sistema">mensaje_sistema</option>
              <option value="aviso">aviso</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-emerald-600 text-white rounded">{loading ? 'Enviando...' : 'Crear'}</button>
            <button type="button" onClick={() => nav('/app')} className="px-4 py-2 border rounded">Cancelar</button>
          </div>
        </form>
      </div>
    </RequireRole>
  )
}
