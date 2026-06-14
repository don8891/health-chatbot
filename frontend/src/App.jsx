import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing  from './pages/Landing'
import Home     from './pages/Home'
import Chat     from './pages/Chat'
import Settings from './pages/Settings'
import AuthPage from './pages/AuthPage'
import ProtectedRoute from './components/ProtectedRoute'
import InstallPrompt from './components/InstallPrompt'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"         element={<Landing />}  />
        <Route path="/auth"     element={<AuthPage />} />
        <Route path="/home"     element={<ProtectedRoute><Home /></ProtectedRoute>}     />
        <Route path="/chat"     element={<ProtectedRoute><Chat /></ProtectedRoute>}     />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
      <InstallPrompt />
    </Router>
  )
}

export default App