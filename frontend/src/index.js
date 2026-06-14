import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { register } from './serviceWorkerRegistration'

import { GoogleOAuthProvider } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "1024376483526-fakeclientid.apps.googleusercontent.com"

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
)

// Register PWA service worker
register()
