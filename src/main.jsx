import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

function Boot() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('perf') === 'low') {
      document.body.classList.add('perf-low')
    }
    // Respect OS reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('perf-low')
    }
  }, [])
  return (
    <StrictMode>
      <App />
    </StrictMode>
  )
}

createRoot(document.getElementById('root')).render(<Boot />)
