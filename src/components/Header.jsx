import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currentUser, logout }     = useApp()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path
  const close    = ()     => setMobileOpen(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    close()
  }

  return (
    <header className="site-header">
      <nav className="nav-inner">
        <Link to="/" className="nav-brand" onClick={close}>
          <div className="nav-brand-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 13h-2v-4H9l3-6 3 6h-2v4z"/>
            </svg>
          </div>
          MediConnect
        </Link>

        {/* Desktop */}
        <div className="nav-desktop-links">
          <Link to="/"        className={`nav-link ${isActive('/')        ? 'active':''}`}>Home</Link>
          <Link to="/calorie" className={`nav-link ${isActive('/calorie') ? 'active':''}`}>Calorie Tracker</Link>
          <Link to="/about"   className={`nav-link ${isActive('/about')   ? 'active':''}`}>About Us</Link>
          <Link to="/goal"    className={`nav-link ${isActive('/goal')    ? 'active':''}`}>Health Goal</Link>
          {currentUser?.role === 'admin' && (
            <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active':''}`}>🛡️ Admin</Link>
          )}
          {currentUser ? (
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginLeft:'12px' }}>
              <span style={{ fontSize:'0.85rem', color:'var(--color-gray-600)', fontWeight:'500' }}>
                👋 {currentUser.name}
              </span>
              <button className="nav-login-button" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Link to="/login"><button className="nav-login-button">Login</button></Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile-menu-button"
          onClick={() => setMobileOpen(p => !p)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"/>
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`nav-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <Link to="/"        className={`nav-link ${isActive('/')        ? 'active':''}`} onClick={close}>Home</Link>
        <Link to="/calorie" className={`nav-link ${isActive('/calorie') ? 'active':''}`} onClick={close}>Calorie Tracker</Link>
        <Link to="/about"   className={`nav-link ${isActive('/about')   ? 'active':''}`} onClick={close}>About Us</Link>
        <Link to="/goal"    className={`nav-link ${isActive('/goal')    ? 'active':''}`} onClick={close}>Health Goal</Link>
        {currentUser?.role === 'admin' && (
          <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active':''}`} onClick={close}>🛡️ Admin</Link>
        )}
        {currentUser ? (
          <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginTop:'8px' }}>
            <span style={{ fontSize:'0.85rem', color:'var(--color-gray-600)', padding:'4px 14px' }}>
              👋 {currentUser.name}
            </span>
            <button className="nav-login-button" style={{ width:'100%' }} onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <Link to="/login" onClick={close}>
            <button className="nav-login-button" style={{ width:'100%', marginTop:'8px' }}>Login</button>
          </Link>
        )}
      </div>
    </header>
  )
}
