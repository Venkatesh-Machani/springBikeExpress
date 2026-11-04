export const API_ROOT = import.meta.env.VITE_API_ROOT || ''

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

// Accepts a plain array or a wrapped response such as { content: [...] } / { data: [...] }
export function asList(data) {
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object') {
    for (const key of ['content', 'data', 'items', 'bikes', 'orders', 'users', 'wishlist', 'wishlists', 'result']) {
      if (Array.isArray(data[key])) return data[key]
    }
  }
  return []
}

/* ------------------------------------------------------------------
   Backend routes. Bikes / users / orders match your existing admin code.
   The wishlist + "orders by user" routes are best guesses following the
   same naming style: if your Spring controllers use different paths,
   change them HERE and nothing else needs to be touched.
------------------------------------------------------------------- */
export const ENDPOINTS = {
  allBikes: '/api/bikes/getAllBikes',
  allOrders: '/api/orders/getAllOrders',
  addOrder: '/api/orders/addOrder',
  ordersByUser: id => `/api/orders/getOrdersByUser/${id}`,
  allWishlists: '/api/wishlist/getAllWishlists',
  wishlistByUser: id => `/api/wishlist/getWishlistByUser/${id}`,
  addWishlist: '/api/wishlist/addWishlist',
  deleteWishlist: id => `/api/wishlist/deleteWishlist/${id}`,
}

export const getBikes = async () => asList(await apiRequest(ENDPOINTS.allBikes))

const sameUser = (value, userId) => value == null || String(value) === String(userId)

// Orders that belong to one user. Tries the per-user route first and falls back to filtering the full list.
export async function getOrdersForUser(userId) {
  try {
    return asList(await apiRequest(ENDPOINTS.ordersByUser(userId))).filter(o => sameUser(o.userId ?? o.user?.userId, userId))
  } catch { /* fall through */ }
  return asList(await apiRequest(ENDPOINTS.allOrders)).filter(o => String(o.userId ?? o.user?.userId) === String(userId))
}

export const wishlistBikeId = w => w.bikeId ?? w.bike?.bikeId
export const wishlistUserId = w => w.userId ?? w.user?.userId
export const wishlistRowId = w => w.wishlistId ?? w.id

export async function getWishlistForUser(userId) {
  return asList(await apiRequest(ENDPOINTS.wishlistByUser(userId))).filter(w => sameUser(wishlistUserId(w), userId))
}
export const getAllWishlists = async () => asList(await apiRequest(ENDPOINTS.allWishlists))
export const addWishlist = (userId, bikeId) => apiRequest(ENDPOINTS.addWishlist, { method: 'POST', body: JSON.stringify({ userId, bikeId }) })
export const removeWishlist = id => apiRequest(ENDPOINTS.deleteWishlist(id), { method: 'DELETE' })
