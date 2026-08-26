import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { Activity, LayoutDashboard, LogOut } from 'lucide-react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Progress from './pages/Progress'

function Navigation({ onLogout }) {
  const location = useLocation();
  
  return (
    <nav className="nav">
      <div className="nav-brand">
        <Activity color="#FF6B00" size={28} />
        FITPULSE GYM
      </div>
      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Dashboard</Link>
        <Link to="/progress" className={location.pathname === '/progress' ? 'active' : ''}>Progress</Link>
        <button className="secondary" onClick={onLogout} style={{marginLeft: '20px', padding: '5px 10px'}}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  )
}

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check local storage for simple auth persistence
    const savedUser = localStorage.getItem('gymUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('gymUser', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('gymUser')
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <BrowserRouter>
      <div className="container">
        <Navigation onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/progress" element={<Progress user={user} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
