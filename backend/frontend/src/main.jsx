import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthUserProvider } from './context/AuthUser.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthUserProvider>
      <App />
    </AuthUserProvider>
  </BrowserRouter>,
)
