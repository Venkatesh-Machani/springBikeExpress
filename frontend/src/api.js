const API_ROOT = import.meta.env.VITE_API_ROOT || ''

export async function getBikes() {
  const response = await fetch(`${API_ROOT}/api/bikes/getAllBikes`)
  if (!response.ok) throw new Error(`Could not load bikes (${response.status})`)
  return response.json()
}
