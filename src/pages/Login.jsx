import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Login() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)

  const { login, currentUser } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) navigate(currentUser.role === 'admin' ? '/admin' : '/')
  }, [currentUser, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const result = await login(email.trim(), password)
    if (result.success) {
      navigate(result.user.role === 'admin' ? '/admin' : '/')
    } else {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <section className="section-container">
      <div className="page-wrapper">
        <div className="hero-section fade-in-animation" style={{ paddingBottom:'30px' }}>
          <span className="hero-eyebrow">Welcome Back</span>
          <h1>Sign In to <span className="text-teal">MediConnect</span></h1>
          <p className="hero-subtitle">Access your health dashboard and manage your appointments.</p>
        </div>

        <div className="card-container narrow fade-in-animation" style={{ maxWidth:'460px' }}>
          <div className="section-header-block center-text">
            <h2>🔐 Login</h2>
            <div className="section-divider"></div>
          </div>

          {error && (
            <div className="care-advice-card fade-in-animation" style={{ borderLeft:'4px solid var(--color-error)', marginBottom:'20px', padding:'14px 20px' }}>
              <p style={{ color:'var(--color-error)', margin:0 }}>⚠️ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
              <div>
                <label className="field-label" htmlFor="login-email">Email Address</label>
                <input type="email" id="login-email" className="input-field" placeholder="e.g., admin@mediconnect.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
              </div>
              <div>
                <label className="field-label" htmlFor="login-password">Password</label>
                <div style={{ position:'relative' }}>
                  <input type={showPass ? 'text':'password'} id="login-password" className="input-field" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingRight:'48px' }} autoComplete="current-password" required />
                  <button type="button" onClick={() => setShowPass(p => !p)} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'1rem', color:'var(--color-gray-400)' }}>
                    {showPass ? '🙈':'👁️'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-center mt-32">
              <button type="submit" className="primary-button full-width" style={{ justifyContent:'center', fontSize:'1rem', padding:'14px' }} disabled={loading}>
                {loading ? '⏳ Signing in…':'🔐 Sign In'}
              </button>
            </div>
          </form>

          <div className="login-demo-box">
            <strong>Demo Credentials (after running seed.js):</strong>
            <div style={{ marginTop:'10px', display:'flex', flexDirection:'column', gap:'6px' }}>
              <div>👑 <strong>Admin:</strong> <code>admin@mediconnect.com</code> / <code>admin123</code></div>
              <div>👤 <strong>User:</strong> <code>user@mediconnect.com</code> / <code>user123</code></div>
            </div>
            <p style={{ marginTop:'10px', fontSize:'0.78rem', color:'var(--color-gray-400)' }}>
              Run <code>node seed.js</code> in the backend folder to create these accounts.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
