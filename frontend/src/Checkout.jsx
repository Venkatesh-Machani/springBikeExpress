import { useState } from 'react'
import { ENDPOINTS, apiRequest } from './api'
import { BikeImg, LAST_ORDER_KEY, PAYMENT_METHODS, bikeKey, go, money, saveOrderMeta } from './lib.jsx'
import { NotFound } from './BikePage.jsx'

export default function Checkout({ id, bikes, loading, session }) {
  const [method, setMethod] = useState('phonepe')
  const [upiId, setUpiId] = useState('')
  const [address, setAddress] = useState(session?.address || '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const bike = bikes.find(b => String(bikeKey(b)) === String(id))
  if (!bike) return <NotFound loading={loading}/>
  const chosen = PAYMENT_METHODS.find(m => m.id === method)
  const cod = chosen.kind === 'cod'

  async function pay(event) {
    event.preventDefault(); setError('')
    if (!address.trim()) return setError('Enter a delivery address to continue.')
    if (chosen.needsId && !/^[\w.\-]{2,}@[A-Za-z]{2,}$/.test(upiId.trim())) return setError('Enter a valid UPI ID, for example name@bank.')
    if (bike.bikeId == null) return setError('Live bike inventory is needed to place an order. Please refresh once the backend is running.')
    if (Number(bike.stockQuantity) <= 0) return setError('Sorry, this motorcycle is out of stock.')
    setBusy(true)
    try {
      if (!cod) await new Promise(resolve => setTimeout(resolve, 1800)) // payment confirmation step
      const paymentStatus = cod ? 'PENDING' : 'PAID'
      const res = await apiRequest(ENDPOINTS.addOrder, { method: 'POST', body: JSON.stringify({ userId: session.userId, bikeId: bike.bikeId, orderStatus: 'PENDING', paymentStatus, shippingAddress: address.trim() }) })
      const orderId = res?.orderId ?? res?.id ?? (typeof res === 'number' ? res : null)
      const meta = { method: chosen.label, cod }
      if (orderId != null) saveOrderMeta(orderId, meta)
      sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify({ orderId, bikeId: bike.bikeId, bikeName: bike.bikeName, colour: bike.colour, image: bike.image, price: bike.price, address: address.trim(), paymentStatus, ...meta, placedAt: new Date().toISOString() }))
      go('/success')
    } catch (err) { setError(err.message || 'Could not place the order. Please try again.'); setBusy(false) }
  }

  return <section className="page">
    <a className="crumb" href={`#/bike/${encodeURIComponent(id)}`}>← Back to {bike.bikeName}</a>
    <div className="steps"><span className="done">1 · Choose bike</span><i/><span className="now">2 · Payment</span><i/><span>3 · Confirmation</span></div>
    <form className="pay-layout" onSubmit={pay}>
      <div className="pay-main">
        <div className="pay-card"><h2>Delivery address</h2><textarea rows="3" value={address} onChange={e => setAddress(e.target.value)} placeholder="House no., street, city, PIN code"/></div>
        <div className="pay-card"><h2>Choose payment method</h2><p className="pay-sub">All payment options are protected and confirmed instantly.</p>
          <div className="methods" role="radiogroup" aria-label="Payment method">{PAYMENT_METHODS.map(m => <label key={m.id} className={method === m.id ? 'method active' : 'method'}><input type="radio" name="method" checked={method === m.id} onChange={() => { setMethod(m.id); setError('') }}/><span className="method-logo" style={{ background: m.color }}>{m.mark}</span><span className="method-text"><b>{m.label}</b><small>{m.note}</small></span><span className="radio-dot"/></label>)}</div>
          {chosen.needsId && <label className="upi-field">{chosen.label} ID<input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@bank" autoComplete="off"/></label>}
        </div>
      </div>
      <aside className="pay-card summary"><h2>Order summary</h2>
        <div className="sum-bike"><BikeImg bike={bike} alt={bike.bikeName}/><div><small>{bike.year} · {bike.colour}</small><b>{bike.bikeName}</b><span>{bike.cc} cc · {bike.mileage} km/l · {bike.fuelType}</span></div></div>
        <div className="sum-row"><span>Ex-showroom price</span><b>{money(bike.price)}</b></div>
        <div className="sum-row"><span>Delivery</span><b className="free">Free</b></div>
        <div className="sum-row"><span>Payment</span><b>{chosen.label}</b></div>
        <div className="sum-total"><span>Total payable</span><b>{money(bike.price)}</b></div>
        {error && <p className="login-error" role="alert">{error}</p>}
        <button className="button dark pay-btn" disabled={busy}>{busy ? 'Processing payment…' : cod ? 'Confirm order' : `Pay ${money(bike.price)}`} <span>↗</span></button>
        <small className="pay-fine">{cod ? 'Pay in cash when your motorcycle arrives.' : 'You’ll get an instant confirmation once the payment is done.'}</small>
      </aside>
    </form>
    {busy && !cod && <div className="processing"><div className="spinner"/><b>Confirming your payment…</b><small>Please don’t close this window</small></div>}
  </section>
}
