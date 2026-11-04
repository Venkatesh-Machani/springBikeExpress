import { BikeImg, bikeHref, bikeKey, go, money } from './lib.jsx'

export default function WishlistPage({ bikes, loading, wishlist, session }) {
  const saved = wishlist.items.map(x => bikes.find(b => String(bikeKey(b)) === String(x.bikeId))).filter(Boolean)
  return <section className="page">
    <div className="page-head"><div className="eyebrow"><i/>{(session?.name || 'YOUR').toUpperCase()}’S WISHLIST</div><h1>Saved for <em>later.</em></h1><p>{saved.length ? `${saved.length} motorcycle${saved.length > 1 ? 's' : ''} you’ve got your eye on.` : 'Motorcycles you save will wait for you here.'}</p></div>
    {saved.length ? <div className="bike-grid wish-grid">{saved.map(bike => <article className="bike-card" key={bikeKey(bike)}>
      <div className="bike-photo"><a className="photo-link" href={bikeHref(bike)}><BikeImg bike={bike} alt={bike.bikeName} loading="lazy"/></a><button className="favorite selected" onClick={() => wishlist.toggle(bike)} aria-label="Remove from wishlist">♥</button></div>
      <div className="bike-info"><div className="bike-name"><div><small>{bike.category || bike.fuelType || 'MOTORCYCLE'}</small><a href={bikeHref(bike)}><h3>{bike.bikeName}</h3></a></div><span>{bike.year}</span></div><div className="specs">{bike.cc} cc <i>·</i> {bike.mileage} km/l <i>·</i> {bike.fuelType}</div>
        <div className="buy-row"><div><b>{money(bike.price)}</b><small>Ex-showroom price</small></div></div>
        <div className="wish-actions"><button className="button dark" onClick={() => go(`/checkout/${encodeURIComponent(bikeKey(bike))}`)} disabled={Number(bike.stockQuantity) <= 0}>Place order <span>↗</span></button><a className="text-button" href={bikeHref(bike)}>Details</a></div></div>
    </article>)}</div> : <div className="empty"><span>♡</span><h3>{loading ? 'Loading…' : 'Your wishlist is empty'}</h3><p>Tap the heart on any motorcycle to save it.</p><a className="button dark" href="#collection">Explore motorcycles ↗</a></div>}
  </section>
}
