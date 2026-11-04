import { useMemo } from 'react'
import { BikeGlyph, BikeImg, LAST_ORDER_KEY, money } from './lib.jsx'

const COLORS = ['#d9f36a', '#1b1c19', '#919d68', '#e8590c', '#f2c94c', '#5f259f']

export default function Success() {
  const order = useMemo(() => { try { return JSON.parse(sessionStorage.getItem(LAST_ORDER_KEY) || 'null') } catch { return null } }, [])
  const confetti = useMemo(() => Array.from({ length: 36 }, (_, i) => ({ '--x': `${(i * 97) % 100}%`, '--d': `${2.4 + (i % 5) * 0.5}s`, '--delay': `${(i % 9) * 0.12}s`, '--c': COLORS[i % COLORS.length], '--r': `${(i * 41) % 180}deg` })), [])
  if (!order) return <section className="page"><div className="empty"><span>▤</span><h3>No recent order found</h3><p>Your orders are always available in My orders.</p><a className="button dark" href="#/orders">View my orders ↗</a></div></section>
  return <section className="page success-page">
    <div className="confetti" aria-hidden="true">{confetti.map((s, i) => <span key={i} style={s}/>)}</div>
    <div className="success-hero">
      <svg className="ok-check" viewBox="0 0 120 120" aria-hidden="true"><circle className="ok-ring" cx="60" cy="60" r="52"/><circle className="ok-fill" cx="60" cy="60" r="52"/><path className="ok-tick" d="M38 62 54 78 84 44"/></svg>
      <span className="eyebrow ok-fade" style={{ '--i': 1 }}><i/>ORDER CONFIRMED</span>
      <h1 className="ok-fade" style={{ '--i': 2 }}>Order placed <em>successfully!</em></h1>
      <p className="ok-fade" style={{ '--i': 3 }}>{order.cod ? 'Thank you! Please keep the amount ready – you’ll pay when your motorcycle is delivered.' : 'Payment received. Thank you for choosing BIKEXPRESS – your ride is on its way.'}</p>
      <div className="road ok-fade" style={{ '--i': 4 }} aria-hidden="true"><span className="road-bike"><BikeGlyph spin/></span></div>
    </div>
    <div className="pay-card success-card ok-fade" style={{ '--i': 5 }}>
      <div className="sum-bike"><BikeImg bike={{ image: order.image }} alt={order.bikeName}/><div><small>{order.colour}</small><b>{order.bikeName}</b><span>{money(order.price)}</span></div></div>
      <dl className="success-grid">
        {order.orderId != null && <div><dt>Order number</dt><dd>#{order.orderId}</dd></div>}
        <div><dt>Payment method</dt><dd>{order.method}</dd></div>
        <div><dt>Payment status</dt><dd>{order.cod ? 'Pay on delivery' : 'Paid'}</dd></div>
        <div><dt>Amount</dt><dd>{money(order.price)}</dd></div>
        <div className="wide"><dt>Delivering to</dt><dd>{order.address}</dd></div>
      </dl>
      <div className="success-actions"><a className="button dark" href="#/orders">View my orders ↗</a><a className="text-button" href="#collection">Continue exploring →</a></div>
    </div>
  </section>
}
