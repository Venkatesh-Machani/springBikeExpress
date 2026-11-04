import { useEffect, useMemo, useState } from 'react'
import { apiRequest, getBikes } from './api'
import { Brand, BikeImg, bikeHref, bikeKey, money, sample, useRoute, useWishlist } from './lib.jsx'
import BikePage from './BikePage.jsx'
import Checkout from './Checkout.jsx'
import Success from './Success.jsx'
import WishlistPage from './WishlistPage.jsx'
import OrdersPage from './OrdersPage.jsx'

const HERO_IMG = 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1600&q=90'
const STORY_IMG = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1400&q=85'

function Home({ bikes, live, wishlist }) {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const [category, setCategory] = useState('All bikes')
  const [sort, setSort] = useState('Featured')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    if (!live || !query.trim()) { setSearchResults(null); setSearching(false); return }
    let active = true
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const rows = await apiRequest(`/api/bikes/search?query=${encodeURIComponent(query.trim())}`)
        if (active) setSearchResults(Array.isArray(rows) ? rows : [])
      } catch {
        if (active) setSearchResults([])
      } finally {
        if (active) setSearching(false)
      }
    }, 250)
    return () => { active = false; clearTimeout(timer) }
  }, [live, query])

  const categories = ['All bikes', ...new Set(bikes.map(b => b.category || 'Motorcycles'))]
  const filtered = useMemo(() => {
    const source = searchResults ?? bikes
    let rows = source.filter(b => `${b.bikeName} ${b.model}`.toLowerCase().includes(query.trim().toLowerCase()))
    if (category !== 'All bikes') rows = rows.filter(b => (b.category || 'Motorcycles') === category)
    if (sort === 'Price: low to high') rows = [...rows].sort((a, b) => a.price - b.price)
    if (sort === 'Price: high to low') rows = [...rows].sort((a, b) => b.price - a.price)
    return rows
  }, [bikes, searchResults, query, category, sort])

  return <>
    <section className="hero"><div className="hero-copy"><div className="eyebrow"><i/>YOUR NEXT CHAPTER STARTS HERE</div><h1>Find your<br/>kind of <em>freedom.</em></h1><p>From weekday streets to the open road, the right motorcycle changes everything. Let’s find yours.</p><div className="hero-buttons"><a className="button dark" href="#collection">Explore motorcycles <span>↗</span></a><a className="text-button" href="#why">Why ride with us →</a></div><div className="hero-proof"><div className="avatars"><span>R</span><span>A</span><span>M</span><b>+</b></div><div><strong>4.9/5</strong><small>from riders like you</small></div><i className="divider"/><div><strong>2,400+</strong><small>happy miles started</small></div></div></div><div className="hero-visual"><BikeImg bike={{ image: HERO_IMG }} alt="Motorcycle ready for an open road adventure"/><div className="shade"/><div className="hero-note"><i/>THE OPEN ROAD IS CALLING</div><div className="hero-caption"><b>01 / 04</b><i/> BUILT FOR THE MOMENT</div><div className="sticker"><small>MADE FOR</small><strong>the<br/>ride.</strong><small>EST. 2024</small></div></div></section>
    <section className="trust" id="why"><div><span>✦</span><p><b>Rider-first, always</b><small>Good advice. No pressure.</small></p></div><div><span>◇</span><p><b>Quality you can feel</b><small>Every bike, carefully chosen.</small></p></div><div><span>↗</span><p><b>Here for the long ride</b><small>Support before and after.</small></p></div><div className="rating"><b>★★★★★</b><small>Loved by riders across India</small></div></section>
    <section className="collection" id="collection"><div className="section-top"><div><div className="eyebrow"><i/>THE LINEUP</div><h2>Meet your <em>match.</em></h2><p>Good rides come in all shapes. Find the one that feels like you.</p></div><a className="all-link" href="#collection">Explore all motorcycles ↗</a></div><div className="catalog-tools"><div className="filters">{categories.map(c => <button key={c} onClick={() => setCategory(c)} className={category === c ? 'filter active' : 'filter'}>{c}</button>)}</div><div className="catalog-controls"><label className="search">⌕<input aria-label="Search motorcycles by bike or model name" placeholder="Search by bike or model..." value={query} onChange={e => setQuery(e.target.value)}/></label><select aria-label="Sort motorcycles" value={sort} onChange={e => setSort(e.target.value)}><option>Featured</option><option>Price: low to high</option><option>Price: high to low</option></select></div></div><div className="results">{searching ? 'Searching…' : `${filtered.length} motorcycles`} <span>· {live ? 'Connected to BIKEXPRESS inventory' : 'Preview collection'}</span></div>
      <div className="bike-grid">{filtered.map(bike => {
        const saved = wishlist.has(bike)
        return <article className="bike-card" key={bikeKey(bike)}>
          <div className="bike-photo"><a className="photo-link" href={bikeHref(bike)} aria-label={`View ${bike.bikeName}`}><BikeImg bike={bike} alt={`${bike.bikeName}, ${bike.colour}`} loading="lazy"/></a><span className="badge">{bike.badge || (bike.stockQuantity > 0 ? 'READY TO RIDE' : 'COMING SOON')}</span><button className={saved ? 'favorite selected' : 'favorite'} onClick={() => wishlist.toggle(bike)} aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}>{saved ? '♥' : '♡'}</button><a className="quick" href={bikeHref(bike)}>View details ↗</a></div>
          <div className="bike-info"><div className="bike-name"><div><small>{bike.category || bike.fuelType || 'MOTORCYCLE'}</small><a href={bikeHref(bike)}><h3>{bike.bikeName}</h3></a></div><span>{bike.year}</span></div><div className="specs">{bike.cc} cc <i>·</i> {bike.mileage} km/l <i>·</i> {bike.fuelType}</div><div className="buy-row"><div><b>{money(bike.price)}</b><small>Ex-showroom price</small></div><a className="add" href={bikeHref(bike)} aria-label={`View ${bike.bikeName}`}>→</a></div></div>
        </article>
      })}</div>{filtered.length === 0 && <div className="empty"><span>⌕</span><h3>No rides found</h3><p>Try a different search or browse all motorcycles.</p><button className="text-button" onClick={() => { setQuery(''); setCategory('All bikes') }}>Clear filters →</button></div>}</section>
    <section className="story"><div className="story-photo"><BikeImg bike={{ image: STORY_IMG }} alt="A rider out exploring" loading="lazy"/></div><div className="story-copy"><div className="eyebrow"><i/>MORE THAN A MOTORCYCLE</div><h2>There’s a road<br/>with your name <em>on it.</em></h2><p>We believe buying a bike should feel as good as the first ride. Straightforward choices, real people, and support that stays with you.</p><a className="button lime" href="#footer">Get to know us ↗</a></div></section>
    <section className="newsletter"><div><div className="eyebrow"><i/>THE GOOD STUFF, OCCASIONALLY</div><h2>Keep the good rides <em>coming.</em></h2><p>New bikes, riding stories and the odd reason to take the long way home.</p></div><form onSubmit={e => { e.preventDefault(); setSubscribed(true); e.target.reset() }}><label className="sr" htmlFor="email">Your email address</label><input id="email" type="email" placeholder={subscribed ? 'You’re on the list. See you out there!' : 'Your email address'} required/><button>Count me in →</button></form></section>
  </>
}

export default function Storefront({ session, onLogout }) {
  const route = useRoute()
  const [bikes, setBikes] = useState(sample)
  const [live, setLive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const wishlist = useWishlist(session, setNotice)

  useEffect(() => { getBikes().then(rows => { if (rows.length) { setBikes(rows); setLive(true) } }).catch(() => {}).finally(() => setLoading(false)) }, [])
  useEffect(() => { if (!notice) return; const t = setTimeout(() => setNotice(''), 3000); return () => clearTimeout(t) }, [notice])
  useEffect(() => {
    setMenuOpen(false)
    if (route.name === 'home' && route.anchor) { const t = setTimeout(() => document.getElementById(route.anchor)?.scrollIntoView({ behavior: 'smooth' }), 80); return () => clearTimeout(t) }
    window.scrollTo(0, 0)
  }, [route.name, route.params.join('/'), route.anchor])

  const shared = { bikes, loading, live, session, wishlist, notify: setNotice }
  let page
  if (route.name === 'bike') page = <BikePage id={route.params[0]} {...shared}/>
  else if (route.name === 'checkout') page = <Checkout id={route.params[0]} {...shared}/>
  else if (route.name === 'success') page = <Success {...shared}/>
  else if (route.name === 'wishlist') page = <WishlistPage {...shared}/>
  else if (route.name === 'orders') page = <OrdersPage {...shared}/>
  else page = <Home bikes={bikes} live={live} wishlist={wishlist}/>
  const on = name => route.name === name ? 'active' : undefined

  return <div className="storefront" id="top">
    <div className="announcement">A better ride is closer than you think <b>·</b> Free delivery on select models</div>
    <header className="header"><Brand href="#/"/><nav className="nav"><a href="#collection">Motorcycles</a><a href="#/wishlist" className={on('wishlist')}>Wishlist{wishlist.items.length > 0 && <b className="nav-count">{wishlist.items.length}</b>}</a><a href="#/orders" className={on('orders')}>My orders</a><a href="#why">Why BIKEXPRESS</a><a href="#footer">Contact</a></nav><div className="header-actions"><a className="search-link" href="#collection">⌕ <span>Find your ride</span></a><a className="icon-btn" href="#/wishlist" aria-label={`Wishlist, ${wishlist.items.length} saved`}>♡{wishlist.items.length > 0 && <b className="bag-count">{wishlist.items.length}</b>}</a><span className="signed-in-as">{session?.name || 'Rider'}</span><button className="signout-button" onClick={onLogout}>Sign out</button><button className="mobile-menu" onClick={() => setMenuOpen(o => !o)} aria-expanded={menuOpen}>{menuOpen ? 'Close' : 'Menu'}</button></div></header>
    {menuOpen && <div className="mobile-panel" onClick={() => setMenuOpen(false)}><a href="#/">Home</a><a href="#collection">Motorcycles</a><a href="#/wishlist">Wishlist ({wishlist.items.length})</a><a href="#/orders">My orders</a><a href="#footer">Contact</a><button onClick={onLogout}>Sign out</button></div>}
    <main>{page}</main>
    <footer id="footer"><div className="footer-top"><Brand href="#/"/><p>Here’s to good roads<br/>and the people who ride them.</p><div className="footer-links"><a href="#collection">Motorcycles</a><a href="#/orders">My orders</a><a href="#why">Our story</a><a href="mailto:hello@bikexpress.in">Get in touch</a></div></div><div className="footer-bottom"><span>© 2026 BIKEXPRESS. Made for the ride.</span><span>Ride safe. Ride often. <b>✦</b></span></div></footer>
    {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice('')}>×</button></div>}
  </div>
}
