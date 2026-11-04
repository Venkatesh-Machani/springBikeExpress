import { useCallback, useEffect, useState } from 'react'
import { getOrdersForUser } from './api'
import { BikeImg, Status, bikeKey, fmtDate, getOrderMeta, money } from './lib.jsx'

export default function OrdersPage({ session, bikes }) {
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState('')
  const load = useCallback(() => {
    setError('')
    getOrdersForUser(session.userId)
      .then(rows => setOrders([...rows].sort((a, b) => (new Date(b.orderDate) - new Date(a.orderDate)) || (b.orderId - a.orderId))))
      .catch(err => { setOrders([]); setError(err.message || 'Could not load your orders.') })
  }, [session.userId])
  useEffect(() => { load() }, [load])
  const meta = getOrderMeta()

  return <section className="page">
    <div className="page-head"><div className="eyebrow"><i/>ORDER HISTORY</div><h1>Your <em>orders.</em></h1><p>Only orders placed with your account are shown here.</p></div>
    {error && <div className="admin-alert"><b>Couldn’t load your orders.</b><span>{error}</span><button onClick={load}>Try again</button></div>}
    {orders === null ? <div className="empty"><h3>Loading your orders…</h3></div>
      : orders.length ? <div className="order-list">{orders.map(o => {
        const bike = bikes.find(b => String(b.bikeId) === String(o.bikeId)) || { bikeName: `Motorcycle #${o.bikeId}` }
        const m = meta[o.orderId]
        return <article className="order-card" key={o.orderId}>
          <div className="order-img"><BikeImg bike={bike} alt={bike.bikeName} loading="lazy"/></div>
          <div className="order-body"><div className="order-top"><div><small>ORDER #{o.orderId} · {fmtDate(o.orderDate)}</small><h3>{bike.bikeName}</h3>{bike.colour && <span className="order-sub">{bike.colour} · {bike.year}</span>}</div><div className="order-chips"><Status value={o.orderStatus}/><Status value={o.paymentStatus}/></div></div>
            <div className="order-meta"><div><small>Amount</small><b>{bike.price ? money(bike.price) : '—'}</b></div><div><small>Payment</small><b>{m?.method || '—'}</b></div><div className="order-addr"><small>Delivering to</small><b>{o.shippingAddress || '—'}</b></div></div>
          </div>
        </article>
      })}</div>
      : <div className="empty"><span>▤</span><h3>No orders yet</h3><p>When you place an order, it will show up here.</p><a className="button dark" href="#collection">Explore motorcycles ↗</a></div>}
  </section>
}
