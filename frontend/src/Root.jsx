import { useState } from 'react'
import { apiRequest } from './api'
import Storefront from './App.jsx'
import AdminDashboard from './AdminDashboard.jsx'

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event) {
    event.preventDefault()
    setBusy(true); setError('')
    try { await onLogin(email.trim(), password) } catch (err) { setError(err.message || 'Could not sign in. Please try again.') }
    finally { setBusy(false) }
  }
  return <main className="login-page"><section className="login-photo"><a className="brand login-brand" href="#"><span className="brand-mark">↗</span><span>bike<span className="brand-light">express</span></span></a><div className="login-photo-copy"><span>THE ROAD IS YOURS</span><h1>Every great<br/>ride begins<br/><em>somewhere.</em></h1><p>Sign in to find your next ride or manage the BikeExpress showroom.</p></div><div className="login-photo-bottom">BUILT FOR THE MOMENT <i/> BIKEEXPRESS</div></section><section className="login-panel"><div className="login-card"><div className="eyebrow"><i/>WELCOME TO BIKEEXPRESS</div><h2>Good to see you.</h2><p className="login-intro">Sign in with your account to continue.</p><form onSubmit={submit}><label htmlFor="login-email">Email address</label><input id="login-email" type="email" autoComplete="username" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required/><label htmlFor="login-password">Password</label><input id="login-password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required/><button className="button dark login-submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'} <span>↗</span></button>{error && <p className="login-error" role="alert">{error}</p>}</form><div className="login-footer"><span>RIDER ACCOUNT</span><span>ADMIN ACCOUNT</span><small>Your account type is detected automatically after sign-in.</small></div></div><div className="login-footnote">© 2025 BikeExpress <span>Ride safe. Ride often.</span></div></section></main>
}

export default function Root() {
  const [session, setSession] = useState(() => { try { return JSON.parse(sessionStorage.getItem('bikeexpress-session') || 'null') } catch { return null } })
  async function login(email, password) {
    const identity = await apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    sessionStorage.setItem('bikeexpress-session', JSON.stringify(identity))
    setSession(identity)
  }
  async function logout() {
    try { await apiRequest('/api/auth/logout', { method: 'POST' }) } catch { /* clear the local view even if the server session has expired */ }
    sessionStorage.removeItem('bikeexpress-session')
    setSession(null)
  }
  if (!session) return <LoginScreen onLogin={login}/>
  if (session.role === 'ADMIN') return <AdminDashboard session={session} onLogout={logout}/>
  return <Storefront session={session} onLogout={logout}/>
}
