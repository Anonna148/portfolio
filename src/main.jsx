import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(13, 15, 43, 0.95)',
            color: '#f1f5f9',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            backdropFilter: 'blur(20px)',
            fontFamily: "'Inter', sans-serif",
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)
