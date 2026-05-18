import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing  from './pages/Landing'
import Home     from './pages/Home'
import Chat     from './pages/Chat'
import Settings from './pages/Settings'
import InstallPrompt from './components/InstallPrompt'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"         element={<Landing />}  />
        <Route path="/home"     element={<Home />}     />
        <Route path="/chat"     element={<Chat />}     />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <InstallPrompt />
    </Router>
  )
}

export default App