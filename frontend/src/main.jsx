import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './Root.jsx'
import './styles.css'
import './extra.css'

document.title = 'BIKEXPRESS'
const favicon = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><circle cx='32' cy='32' r='32' fill='#d9f36a'/><g fill='none' stroke='#1b1c19' stroke-width='3.6' stroke-linecap='round' stroke-linejoin='round'><circle cx='18' cy='38' r='8.5'/><circle cx='46' cy='38' r='8.5'/><path d='M18 38 27 22h14l5 16M27 22l-3-6h-6M41 22l4-6h6M26 30h14'/></g></svg>`
let icon = document.querySelector("link[rel~='icon']")
if (!icon) { icon = document.createElement('link'); icon.rel = 'icon'; document.head.appendChild(icon) }
icon.type = 'image/svg+xml'
icon.href = `data:image/svg+xml,${encodeURIComponent(favicon)}`

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)
