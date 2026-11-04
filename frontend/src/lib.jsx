import { useCallback, useEffect, useState } from 'react'
import { API_ROOT, addWishlist, getWishlistForUser, removeWishlist, wishlistBikeId, wishlistRowId } from './api'

export const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0)
export const fmtDate = v => v ? new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
export const bikeKey = b => b?.bikeId ?? b?.model
export const bikeHref = b => `#/bike/${encodeURIComponent(bikeKey(b))}`

export const sample = [
  { bikeName: 'Roadster 350', model: 'Roadster 350', year: 2025, colour: 'Midnight black', price: 218000, stockQuantity: 8, cc: 349, mileage: 35, fuelType: 'Petrol', description: 'A confident everyday classic with an easy riding position and a punchy, refined engine.', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=85', category: 'Cruiser', badge: 'BESTSELLER' },
  { bikeName: 'Scrambler X', model: 'Scrambler X', year: 2025, colour: 'Sandstone', price: 284000, stockQuantity: 5, cc: 398, mileage: 32, fuelType: 'Petrol', description: 'Made for the long way around. A light, lively scrambler that feels at home on any road.', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=85', category: 'Adventure', badge: 'NEW ARRIVAL' },
  { bikeName: 'Velocity 500', model: 'Velocity 500', year: 2025, colour: 'Racing red', price: 345000, stockQuantity: 4, cc: 499, mileage: 28, fuelType: 'Petrol', description: 'Sharp lines, responsive power and an unmistakable presence from the city to the coast.', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=85', category: 'Sport', badge: 'RIDER FAVOURITE' },
  { bikeName: 'City 160', model: 'City 160', year: 2025, colour: 'Pearl white', price: 132000, stockQuantity: 12, cc: 160, mileage: 48, fuelType: 'Petrol', description: 'Your daily commute, upgraded. Light handling and excellent efficiency in one tidy package.', image: 'https://images.unsplash.com/photo-1558980394-0c6b3c2f9a0d?auto=format&fit=crop&w=1000&q=85', category: 'Commuter', badge: 'CITY READY' },
]

/* ---------- images ---------- */
const FALLBACK_SVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 520'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#25271f'/><stop offset='1' stop-color='#5b6046'/></linearGradient></defs><rect width='800' height='520' fill='url(#g)'/><g fill='none' stroke='#d9f36a' stroke-width='11' stroke-linecap='round' stroke-linejoin='round'><circle cx='215' cy='335' r='82'/><circle cx='595' cy='335' r='82'/><path d='M215 335 L320 215 H475 L595 335'/><path d='M320 215 L292 172 H235'/><path d='M475 215 L525 150 H585'/><path d='M360 215 L395 335 H318'/></g><text x='400' y='468' text-anchor='middle' font-family='Georgia,serif' font-size='30' letter-spacing='10' fill='#d9f36a' opacity='.75'>BIKEXPRESS</text></svg>`
export const FALLBACK_IMG = `data:image/svg+xml;utf8,${encodeURIComponent(FALLBACK_SVG)}`
const IMAGE_KEYS = ['image', 'imageUrl', 'imageURL', 'image_url', 'imagePath', 'img', 'photo', 'photoUrl', 'picture', 'bikeImage', 'thumbnail']

export function bikeImage(bike) {
  for (const key of IMAGE_KEYS) {
    let v = bike?.[key]
    if (typeof v !== 'string' || !v.trim()) continue
    v = v.trim()
    if (/^(https?:|data:|blob:)/i.test(v)) return v
    if (v.startsWith('//')) return `https:${v}`
    // raw base64 stored in the database (e.g. a @Lob column)
    if (v.length > 200 && /^[A-Za-z0-9+/=\s]+$/.test(v)) {
      const mime = v.startsWith('iVBOR') ? 'png' : v.startsWith('PHN') ? 'svg+xml' : v.startsWith('UklGR') ? 'webp' : 'jpeg'
      return `data:image/${mime};base64,${v.replace(/\s/g, '')}`
    }
    return `${API_ROOT}${v.startsWith('/') ? '' : '/'}${v.replace(/\\/g, '/')}`
  }
  return FALLBACK_IMG
}

export function BikeImg({ bike, alt = '', ...rest }) {
  const src = bikeImage(bike)
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [src])
  return <img src={failed ? FALLBACK_IMG : src} alt={alt} onError={() => setFailed(true)} {...rest} />
}

/* ---------- brand ---------- */
export function BikeGlyph({ spin = false }) {
  const wheel = cx => <g className={spin ? 'wheel' : undefined}><circle cx={cx} cy="17" r="4.6" /><path d={`M${cx} 12.8V21.2M${cx - 4.2} 17H${cx + 4.2}`} strokeWidth="1" /></g>
  return <svg viewBox="0 0 32 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {wheel(7)}{wheel(25)}<path d="M7 17 13 9h8l4 8M13 9 11 6H8M21 9l2.2-3.5H27M12.5 13H20" />
  </svg>
}
export function Brand({ href = '#/', className = '' }) {
  return <a className={`brand ${className}`.trim()} href={href} aria-label="BIKEXPRESS home"><span className="brand-mark"><BikeGlyph /></span><span className="brand-word">BIKE<span className="brand-light">XPRESS</span></span></a>
}

export function Status({ value }) {
  const label = (value || 'UNKNOWN').replaceAll('_', ' ').toLowerCase()
  return <span className={`status-chip ${label.replaceAll(' ', '-')}`}>{label}</span>
}

/* ---------- tiny hash router (no extra dependency) ---------- */
export function parseHash() {
  const h = window.location.hash || ''
  if (!h.startsWith('#/')) return { name: 'home', params: [], anchor: h.slice(1) }
  const parts = h.slice(2).split('?')[0].split('/').filter(Boolean).map(decodeURIComponent)
  return { name: parts[0] || 'home', params: parts.slice(1), anchor: '' }
}
export function useRoute() {
  const [route, setRoute] = useState(parseHash)
  useEffect(() => {
    const onChange = () => setRoute(parseHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
export const go = path => { window.location.hash = `#${path}` }

/* ---------- payments ---------- */
export const PAYMENT_METHODS = [
  { id: 'phonepe', label: 'PhonePe', note: 'Approve the request in your PhonePe app', mark: 'Pe', color: '#5f259f', kind: 'upi' },
  { id: 'gpay', label: 'Google Pay', note: 'Approve the request in Google Pay', mark: 'G', color: '#1a73e8', kind: 'upi' },
  { id: 'paytm', label: 'Paytm', note: 'Pay with Paytm wallet or UPI', mark: 'P', color: '#00b9f1', kind: 'upi' },
  { id: 'navi', label: 'Navi', note: 'Pay instantly with Navi UPI', mark: 'N', color: '#3d5afe', kind: 'upi' },
  { id: 'cred', label: 'CRED', note: 'Pay using CRED UPI', mark: 'C', color: '#1c1c1c', kind: 'upi' },
  { id: 'upi', label: 'UPI', note: 'Pay with any UPI ID', mark: 'UPI', color: '#e8590c', kind: 'upi', needsId: true },
  { id: 'bhim', label: 'BHIM UPI', note: 'Pay with your BHIM UPI ID', mark: 'B', color: '#0b7a3e', kind: 'upi', needsId: true },
  { id: 'cod', label: 'Cash on Delivery', note: 'Pay when your motorcycle is delivered', mark: '₹', color: '#6b6d62', kind: 'cod' },
]
const META_KEY = 'bikeexpress-order-meta'
export const getOrderMeta = () => { try { return JSON.parse(localStorage.getItem(META_KEY) || '{}') } catch { return {} } }
export const saveOrderMeta = (orderId, meta) => { try { localStorage.setItem(META_KEY, JSON.stringify({ ...getOrderMeta(), [orderId]: meta })) } catch { /* ignore */ } }
export const LAST_ORDER_KEY = 'bikeexpress-last-order'

/* ---------- per-user wishlist (backend first, local copy as a safety net) ---------- */
export function useWishlist(session, notify) {
  const uid = session?.userId
  const storeKey = `bikeexpress-wishlist-${uid}`
  const [items, setItems] = useState(() => { try { return JSON.parse(localStorage.getItem(storeKey) || '[]') } catch { return [] } })
  const fromRows = rows => rows.map(w => ({ bikeId: wishlistBikeId(w), rowId: wishlistRowId(w) })).filter(x => x.bikeId != null)

  useEffect(() => { try { localStorage.setItem(storeKey, JSON.stringify(items)) } catch { /* ignore */ } }, [items, storeKey])
  useEffect(() => {
    if (uid == null) return
    let live = true
    getWishlistForUser(uid).then(rows => { if (live) setItems(fromRows(rows)) }).catch(() => {})
    return () => { live = false }
  }, [uid])

  const has = useCallback(bike => items.some(x => String(x.bikeId) === String(bikeKey(bike))), [items])

  async function toggle(bike) {
    const id = bikeKey(bike)
    const existing = items.find(x => String(x.bikeId) === String(id))
    if (existing) {
      setItems(old => old.filter(x => x !== existing))
      notify?.(`${bike.bikeName} removed from your wishlist`)
      try {
        let rowId = existing.rowId
        if (rowId == null) rowId = wishlistRowId((await getWishlistForUser(uid)).find(w => String(wishlistBikeId(w)) === String(id)) || {})
        if (rowId != null) await removeWishlist(rowId)
      } catch { /* kept locally */ }
    } else {
      setItems(old => [...old, { bikeId: id }])
      notify?.(`${bike.bikeName} saved to your wishlist`)
      if (bike.bikeId != null && uid != null) {
        try { await addWishlist(uid, bike.bikeId); setItems(fromRows(await getWishlistForUser(uid))) } catch { /* kept locally */ }
      }
    }
  }
  return { items, has, toggle }
}
