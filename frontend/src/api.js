const API_ROOT = import.meta.env.VITE_API_ROOT || ''

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_ROOT}${path}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  })
  if (response.status === 204) return null
  const body = await response.json().catch(() => null)
  if (!response.ok) throw new Error(body?.message || body?.error || `Request failed (${response.status})`)
  return body
}

export const getBikes = () => apiRequest('/api/bikes/getAllBikes')
