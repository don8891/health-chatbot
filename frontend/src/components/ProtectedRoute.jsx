import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('auth_token')
  
  if (!token) {
    // Redirect to the unified authentication gate
    return <Navigate to="/auth" replace />
  }

  return children
}
