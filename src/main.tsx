import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { logIntegrityReport } from './data/integrity/checker'
import './index.css'

// Run data integrity check in development only
if (import.meta.env.DEV) {
  // Defer to not block initial render
  setTimeout(() => {
    logIntegrityReport()
  }, 500)
}

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element not found')

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
