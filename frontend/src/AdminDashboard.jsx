import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiRequest } from './api'

const tabs = [
  { id: 'overview', label: 'Overview', icon: '▦' },
  { id: 'bikes', label: 'Motorcycles', icon: '◈' },
  { id: 'users', label: 'Customers', icon: '♙' },
  { id: 'orders', label: 'Orders', icon: '▤' },
]
const statuses = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED']
const payments = ['PENDING', 'PAID', 'FAILED', 'REFUNDINPROCESS', 'REFUNDDONE']
const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0)
const date = value => value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

export default function AdminDashboard({ session, onLogout }) {
  const [tab, setTab] = useState('overview')
  const [data, setData] = useState({ bikes: [], users: [], orders: [] })
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [query, setQuery] = useState('')
  const [bikeSearchResults, setBikeSearchResults] = useState(null)
  const [bikeSearchLoading, setBikeSearchLoading] = useState(false)
  const [editor, setEditor] = useState(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true); setLoadError('')
    try {
      const [bikes, users, orders] = await Promise.all([
        apiRequest('/api/bikes/getAllBikes'),
        apiRequest('/api/users/getAllUsers'),
        apiRequest('/api/orders/getAllOrders'),
      ])
      setData({ bikes: bikes || [], users: users || [], orders: orders || [] })
    } catch (err) { setLoadError(err.message || 'Could not load dashboard data.') }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { refresh() }, [refresh])
  useEffect(() => {
    if (tab !== 'bikes' || !query.trim()) { setBikeSearchResults(null); setBikeSearchLoading(false); return }
    let active = true
    const timer = setTimeout(async () => {
      setBikeSearchLoading(true)
      try {
        const rows = await apiRequest(`/api/bikes/search?query=${encodeURIComponent(query.trim())}`)
        if (active) setBikeSearchResults(Array.isArray(rows) ? rows : [])
      } catch {
        if (active) setBikeSearchResults([])
      } finally {
        if (active) setBikeSearchLoading(false)
      }
    }, 250)
    return () => { active = false; clearTimeout(timer) }
  }, [tab, query])
  useEffect(() => { if (!notice) return; const t = setTimeout(() => setNotice(''), 3000); return () => clearTimeout(t) }, [notice])

  const totals = useMemo(() => ({ inventory: data.bikes.reduce((sum, bike) => sum + Number(bike.stockQuantity || 0), 0), revenue: data.orders.filter(o => o.paymentStatus === 'PAID').length }), [data])
  const bikes = (bikeSearchResults ?? data.bikes).filter(b => `${b.bikeName} ${b.model}`.toLowerCase().includes(query.trim().toLowerCase()))
  const users = data.users.filter(u => `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase()))
  const orders = data.orders.filter(o => `${o.orderId} ${o.userId} ${o.bikeId} ${o.orderStatus}`.toLowerCase().includes(query.toLowerCase()))

  function startCreate(kind) {
    if (kind === 'order' && (!data.users.length || !data.bikes.length)) { setNotice('Add at least one customer and one motorcycle before creating an order.'); return }
    const initial = kind === 'bike' ? { year: new Date().getFullYear(), stockQuantity: 1, fuelType: 'Petrol' }
      : kind === 'user' ? {} : { orderStatus: 'PENDING', paymentStatus: 'PENDING' }
    setEditor({ kind, mode: 'create', item: initial })
  }
  function startEdit(kind, item) { setEditor({ kind, mode: 'edit', item: { ...item } }) }

  async function saveEditor(event) {
    event.preventDefault(); setBusy(true)
    const form = new FormData(event.currentTarget)
    const body = Object.fromEntries(form.entries())
    for (const [key, value] of Object.entries(body)) if (['year','price','stockQuantity','cc','mileage','phoneNumber','userId','bikeId'].includes(key)) body[key] = value === '' ? null : Number(value)
    if (editor.kind === 'bike' && editor.mode === 'edit') body.bikeId = editor.item.bikeId
    if (editor.kind === 'order' && editor.mode === 'edit') body.orderId = editor.item.orderId
    if (editor.kind === 'order' && editor.mode === 'create') body.orderDate = new Date().toISOString().slice(0, 19)
    if (editor.kind === 'user' && editor.mode === 'edit' && !body.password) delete body.password
    const route = editor.kind === 'bike'
      ? (editor.mode === 'create' ? ['/api/bikes/addBike', 'PUT'] : ['/api/bikes/updateBike', 'PUT'])
      : editor.kind === 'user'
        ? (editor.mode === 'create' ? ['/api/users/addUser', 'POST'] : ['/api/users/update', 'PUT'])
        : (editor.mode === 'create' ? ['/api/orders/addOrder', 'POST'] : ['/api/orders/updateOrder', 'PATCH'])
    try {
      await apiRequest(route[0], { method: route[1], body: JSON.stringify(body) })
      setEditor(null); await refresh(); setNotice(`${editor.kind[0].toUpperCase()}${editor.kind.slice(1)} ${editor.mode === 'create' ? 'created' : 'updated'} successfully.`)
    } catch (err) { setNotice(err.message || 'Could not save changes.') }
    finally { setBusy(false) }
  }

  async function remove(kind, item) {
    const label = kind === 'bike' ? item.bikeName : kind === 'user' ? item.name : `order #${item.orderId}`
    if (!window.confirm(`Delete ${label}? This action cannot be undone.`)) return
    const url = kind === 'bike' ? `/api/bikes/deleteBike/${encodeURIComponent(item.model)}`
      : kind === 'user' ? `/api/users/deleteUser/${encodeURIComponent(item.email)}`
      : `/api/orders/deleteOrder/${item.orderId}`
    try { await apiRequest(url, { method: 'DELETE' }); await refresh(); setNotice(`${label} deleted.`) }
    catch (err) { setNotice(err.message || `Could not delete ${label}.`) }
  }

  return <div className="admin-shell">
    <aside className="admin-sidebar"><a className="brand admin-brand" href="#admin"><span className="brand-mark">↗</span><span>bike<span className="brand-light">express</span></span></a><div className="admin-workspace"><span className="workspace-mark">B</span><span><b>BikeExpress</b><small>ADMIN WORKSPACE</small></span><span className="workspace-dots">•••</span></div><div className="sidebar-label">WORKSPACE</div><nav className="admin-nav">{tabs.map(item => <button key={item.id} className={tab === item.id ? 'admin-nav-item active' : 'admin-nav-item'} onClick={() => { setTab(item.id); setQuery('') }}><span>{item.icon}</span>{item.label}{item.id === 'orders' && data.orders.length > 0 && <small>{data.orders.length}</small>}</button>)}</nav><div className="sidebar-bottom"><div className="admin-online"><i/>Backend connected</div><div className="admin-profile"><span className="profile-avatar">A</span><div><b>{session.name}</b><small>Administrator</small></div><button onClick={onLogout} title="Sign out" aria-label="Sign out">⇥</button></div></div></aside>
    <main className="admin-main" id="admin"><header className="admin-topbar"><div className="admin-breadcrumb">Workspace <span>/</span> <b>{tabs.find(item => item.id === tab)?.label}</b></div><div className="admin-top-actions"><span className="admin-live"><i/> Live inventory</span><button onClick={refresh} className="refresh-button" disabled={loading}>↻ <span>Refresh</span></button><button onClick={onLogout} className="top-logout">Sign out</button></div></header>
      <section className="admin-content"><div className="admin-page-heading"><div><span className="admin-overline">BIKEEXPRESS ADMIN</span><h1>{tab === 'overview' ? 'Good morning.' : tabs.find(item => item.id === tab)?.label}</h1><p>{tab === 'overview' ? 'Here’s what’s happening in your showroom today.' : `Manage your ${tab === 'bikes' ? 'motorcycle inventory' : tab === 'users' ? 'customer accounts' : 'customer orders'}.`}</p></div>{tab !== 'overview' && <button className="button dark admin-create" onClick={() => startCreate(tab === 'bikes' ? 'bike' : tab === 'users' ? 'user' : 'order')}>＋ <span>{tab === 'bikes' ? 'Add motorcycle' : tab === 'users' ? 'Add customer' : 'Create order'}</span></button>}</div>
        {loadError && <div className="admin-alert"><b>Couldn’t load dashboard data.</b><span>{loadError}</span><button onClick={refresh}>Try again</button></div>}
        {tab === 'overview' && <><div className="admin-stats"><article className="stat-card stat-dark"><span className="stat-icon">◈</span><small>MODELS IN CATALOG</small><strong>{data.bikes.length}</strong><span className="stat-caption">{totals.inventory} units in stock</span></article><article className="stat-card"><span className="stat-icon">♙</span><small>REGISTERED CUSTOMERS</small><strong>{data.users.length}</strong><span className="stat-caption">Customer accounts</span></article><article className="stat-card"><span className="stat-icon">▤</span><small>TOTAL ORDERS</small><strong>{data.orders.length}</strong><span className="stat-caption">{data.orders.filter(o => o.orderStatus === 'PENDING').length} need attention</span></article><article className="stat-card"><span className="stat-icon">₹</span><small>PAID ORDERS</small><strong>{totals.revenue}</strong><span className="stat-caption">Orders marked paid</span></article></div><div className="admin-panels"><section className="admin-panel"><div className="panel-heading"><div><span className="admin-overline">QUICK ACCESS</span><h2>Manage your showroom</h2></div></div><div className="quick-grid"><button onClick={() => setTab('bikes')}><span>◈</span><b>Motorcycles</b><small>Update inventory, pricing and bike details</small><i>↗</i></button><button onClick={() => setTab('users')}><span>♙</span><b>Customers</b><small>View customer accounts and contact details</small><i>↗</i></button><button onClick={() => setTab('orders')}><span>▤</span><b>Orders</b><small>Review orders and update their status</small><i>↗</i></button></div></section><section className="admin-panel recent-panel"><div className="panel-heading"><div><span className="admin-overline">LATEST ACTIVITY</span><h2>Recent orders</h2></div><button onClick={() => setTab('orders')}>View all →</button></div>{data.orders.length ? data.orders.slice(0, 4).map(order => <div className="recent-order" key={order.orderId}><span className="order-number">#{order.orderId}</span><div><b>Customer {order.userId}</b><small>Motorcycle {order.bikeId} · {date(order.orderDate)}</small></div><Status value={order.orderStatus}/></div>) : <div className="admin-empty-small">Orders will appear here when customers place them.</div>}</section></div></>}
        {tab === 'bikes' && <DataPanel title="Motorcycle inventory" count={bikes.length} query={query} setQuery={setQuery} loading={loading}><table><thead><tr><th>MOTORCYCLE</th><th>MODEL YEAR</th><th>PRICE</th><th>STOCK</th><th>ENGINE</th><th>FUEL</th><th/></tr></thead><tbody>{bikes.map(b => <tr key={b.bikeId}><td><div className="table-primary">{b.bikeName}</div><div className="table-secondary">{b.model} · ID {b.bikeId}</div></td><td>{b.year}</td><td>{money(b.price)}</td><td><span className={Number(b.stockQuantity) <= 2 ? 'stock low' : 'stock'}>{b.stockQuantity} units</span></td><td>{b.cc} cc</td><td>{b.fuelType}</td><td><RowActions onEdit={() => startEdit('bike', b)} onDelete={() => remove('bike', b)}/></td></tr>)}</tbody></table>{!bikes.length && <EmptyTable loading={loading || bikeSearchLoading} label="No motorcycles match your search."/>}</DataPanel>}
        {tab === 'users' && <DataPanel title="Customer accounts" count={data.users.length} query={query} setQuery={setQuery} loading={loading}><table><thead><tr><th>CUSTOMER</th><th>PHONE</th><th>ADDRESS</th><th>ACCOUNT ID</th><th/></tr></thead><tbody>{users.map(u => <tr key={u.userId}><td><div className="customer-cell"><span>{(u.name || '?').slice(0,1).toUpperCase()}</span><div><b>{u.name}</b><small>{u.email}</small></div></div></td><td>{u.phoneNumber || '—'}</td><td className="address-cell">{u.address || '—'}</td><td>#{u.userId}</td><td><RowActions onEdit={() => startEdit('user', u)} onDelete={() => remove('user', u)}/></td></tr>)}</tbody></table>{!users.length && <EmptyTable loading={loading} label="No customers match your search."/>}</DataPanel>}
        {tab === 'orders' && <DataPanel title="Order management" count={data.orders.length} query={query} setQuery={setQuery} loading={loading}><table><thead><tr><th>ORDER</th><th>PLACED</th><th>CUSTOMER</th><th>MOTORCYCLE</th><th>ORDER STATUS</th><th>PAYMENT</th><th/></tr></thead><tbody>{orders.map(o => <tr key={o.orderId}><td><b>#{o.orderId}</b></td><td>{date(o.orderDate)}</td><td>Customer #{o.userId}</td><td>Bike #{o.bikeId}</td><td><Status value={o.orderStatus}/></td><td><Status value={o.paymentStatus}/></td><td><RowActions onEdit={() => startEdit('order', o)} onDelete={() => remove('order', o)}/></td></tr>)}</tbody></table>{!orders.length && <EmptyTable loading={loading} label="No orders match your search."/>}</DataPanel>}
      </section>
    </main>
    {editor && <Editor editor={editor} data={data} onClose={() => setEditor(null)} onSubmit={saveEditor} busy={busy}/>}
    {notice && <div className="admin-toast" role="status">{notice}<button onClick={() => setNotice('')}>×</button></div>}
  </div>
}

function Status({ value }) { const label = (value || 'UNKNOWN').replaceAll('_', ' ').toLowerCase(); return <span className={`status-chip ${label.replaceAll(' ', '-')}`}>{label}</span> }
function RowActions({ onEdit, onDelete }) { return <div className="row-actions"><button onClick={onEdit} title="Edit">✎</button><button onClick={onDelete} title="Delete">⌫</button></div> }
function EmptyTable({ loading, label }) { return <div className="table-empty">{loading ? 'Loading…' : label}</div> }
function DataPanel({ title, count, query, setQuery, loading, children }) { return <section className="admin-panel data-panel"><div className="data-panel-heading"><div><h2>{title}</h2><small>{count} records</small></div><label className="admin-search">⌕<input placeholder="Search records…" value={query} onChange={e => setQuery(e.target.value)} aria-label="Search records"/></label></div><div className="table-scroll">{children}</div></section> }

function Editor({ editor, data, onClose, onSubmit, busy }) {
  const { kind, mode, item } = editor
  const bikeOptions = data.bikes.map(b => [b.bikeId, `${b.bikeName} (${b.model})`])
  const userOptions = data.users.map(u => [u.userId, `${u.name} (${u.email})`])
  let fields
  if (kind === 'bike') fields = [
    ['bikeName','Motorcycle name','text',true], ['model','Model','text',true], ['year','Year','number',true], ['colour','Colour','text',true], ['price','Price (₹)','number',true], ['stockQuantity','Stock quantity','number',true], ['cc','Engine (cc)','number',true], ['mileage','Mileage (km/l)','number',true], ['fuelType','Fuel type','text',true], ['description','Description','textarea',true], ['image','Image URL','url',false],
  ]
  else if (kind === 'user') fields = [
    ['name','Full name','text',true], ['email','Email address','email',true], ['phoneNumber','Phone number','tel',true], ['address','Address','textarea',true], ...(mode === 'create' ? [['password','Temporary password','password',true]] : [['password','New password (optional)','password',false]]),
  ]
  else fields = mode === 'create' ? [
    ['userId','Customer','select',true,userOptions], ['bikeId','Motorcycle','select',true,bikeOptions], ['orderStatus','Order status','select',true,statuses.map(x => [x,x])], ['paymentStatus','Payment status','select',true,payments.map(x => [x,x])], ['shippingAddress','Shipping address','textarea',true],
  ] : [
    ['orderStatus','Order status','select',true,statuses.map(x => [x,x])], ['paymentStatus','Payment status','select',true,payments.map(x => [x,x])], ['shippingAddress','Shipping address','textarea',true],
  ]
  return <div className="editor-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}><section className="editor-card" role="dialog" aria-modal="true" aria-labelledby="editor-title"><div className="editor-heading"><div><span className="admin-overline">{mode === 'create' ? 'NEW RECORD' : `EDIT ${kind.toUpperCase()}`}</span><h2 id="editor-title">{mode === 'create' ? `Add ${kind === 'bike' ? 'motorcycle' : kind === 'user' ? 'customer' : 'order'}` : 'Update details'}</h2></div><button onClick={onClose} aria-label="Close">×</button></div><form onSubmit={onSubmit} className="editor-form">{fields.map(([name,label,type,required,options]) => <label key={name} className={type === 'textarea' ? 'wide' : ''}>{label}{type === 'select' ? <select name={name} defaultValue={item[name] ?? options[0]?.[0]} required={required}>{options.map(([value,text]) => <option value={value} key={value}>{text}</option>)}</select> : type === 'textarea' ? <textarea name={name} defaultValue={item[name] ?? ''} required={required} rows="3"/> : <input name={name} type={type} defaultValue={item[name] ?? ''} required={required} readOnly={kind === 'user' && name === 'email' && mode === 'edit'} min={type === 'number' ? '0' : undefined} step={name === 'price' ? '0.01' : '1'}/>}</label>)}<div className="editor-actions"><button type="button" className="cancel-button" onClick={onClose}>Cancel</button><button className="button dark" disabled={busy}>{busy ? 'Saving…' : mode === 'create' ? 'Create' : 'Save changes'} <span>↗</span></button></div></form></section></div>
}
