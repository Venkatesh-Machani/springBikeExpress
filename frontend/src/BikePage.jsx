import { BikeImg, bikeHref, bikeKey, go, money } from './lib.jsx'

export function NotFound({ loading, children }) {
  return <section className="page"><div className="empty"><span>{loading ? '…' : '⌕'}</span><h3>{loading ? 'Loading motorcycle…' : 'We couldn’t find that motorcycle'}</h3>{!loading && <><p>It may have been removed or sold out.</p><a className="button dark" href="#collection">Browse motorcycles ↗</a></>}{children}</div></section>
}

export default function BikePage({ id, bikes, loading, wishlist }) {
  const bike = bikes.find(b => String(bikeKey(b)) === String(id))
  if (!bike) return <NotFound loading={loading}/>
  const stock = Number(bike.stockQuantity ?? 1)
  const saved = wishlist.has(bike)
  const related = bikes.filter(b => bikeKey(b) !== bikeKey(bike)).slice(0, 3)
  const specs = [['Engine', `${bike.cc} cc`], ['Mileage', `${bike.mileage} km/l`], ['Fuel type', bike.fuelType], ['Model year', bike.year], ['Colour', bike.colour], ['Model', bike.model]]
  return <section className="page">
    <a className="crumb" href="#collection">← All motorcycles</a>
    <div className="bike-detail">
      <div className="bd-photo"><BikeImg bike={bike} alt={`${bike.bikeName}, ${bike.colour}`}/><span className="badge">{bike.badge || (stock > 0 ? 'READY TO RIDE' : 'COMING SOON')}</span></div>
      <div className="bd-info">
        <small className="bd-kicker">{bike.category || bike.fuelType || 'MOTORCYCLE'} · {bike.year}</small>
        <h1>{bike.bikeName}</h1>
        <p className="bd-sub">{bike.colour}{bike.model && bike.model !== bike.bikeName ? ` · ${bike.model}` : ''}</p>
        <div className="bd-price"><b>{money(bike.price)}</b><small>Ex-showroom price · Free delivery on select models</small></div>
        <p className="bd-desc">{bike.description || 'A motorcycle made for the way you want to ride.'}</p>
        <div className="spec-grid">{specs.map(([k, v]) => <div key={k}><small>{k}</small><b>{v ?? '—'}</b></div>)}</div>
        <div className={stock > 0 ? 'stock-line ok' : 'stock-line out'}><i/>{stock > 0 ? (stock <= 3 ? `Only ${stock} left in stock` : 'In stock · ready to ship') : 'Currently out of stock'}</div>
        <div className="bd-actions">
          <button className="button dark bd-order" disabled={stock <= 0} onClick={() => go(`/checkout/${encodeURIComponent(bikeKey(bike))}`)}>Place order <span>↗</span></button>
          <button className={saved ? 'ghost-btn saved' : 'ghost-btn'} onClick={() => wishlist.toggle(bike)}>{saved ? '♥ Saved to wishlist' : '♡ Add to wishlist'}</button>
        </div>
      </div>
    </div>
    {related.length > 0 && <div className="related"><h2>You may also <em>like</em></h2><div className="related-grid">{related.map(b => <a className="related-card" key={bikeKey(b)} href={bikeHref(b)}><div><BikeImg bike={b} alt={b.bikeName} loading="lazy"/></div><b>{b.bikeName}</b><small>{money(b.price)}</small></a>)}</div></div>}
  </section>
}
