import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api/axios'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mediconnect_user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const [appointments,    setAppointments]    = useState([])
  const [apptLoading,     setApptLoading]     = useState(false)
  const [apptError,       setApptError]       = useState(null)
  const [apptStats,       setApptStats]       = useState({ total: 0, pending: 0, confirmed: 0, cancelled: 0 })

  /* ── AUTH ─────────────────────────────────────────── */

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('mediconnect_token', data.token)
      localStorage.setItem('mediconnect_user',  JSON.stringify(data.user))
      setCurrentUser(data.user)
      return { success: true, user: data.user }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.'
      return { success: false, error: msg }
    }
  }

  const logout = () => {
    localStorage.removeItem('mediconnect_token')
    localStorage.removeItem('mediconnect_user')
    setCurrentUser(null)
    setAppointments([])
  }

  // Verify token is still valid on mount
  useEffect(() => {
    const token = localStorage.getItem('mediconnect_token')
    if (token && currentUser) {
      api.get('/auth/me').catch(() => {
        // Token invalid — log out silently
        logout()
      })
    }
    // eslint-disable-next-line
  }, [])

  /* ── APPOINTMENTS ─────────────────────────────────── */

  // Book a new appointment (public)
  const addAppointment = async (data) => {
    const { data: res } = await api.post('/appointments', data)
    return res.appointment
  }

  // Fetch all appointments (admin only)
  const fetchAppointments = useCallback(async (statusFilter = 'All') => {
    setApptLoading(true)
    setApptError(null)
    try {
      const params = statusFilter !== 'All' ? { status: statusFilter } : {}
      const { data } = await api.get('/appointments', { params })
      setAppointments(data.appointments)
    } catch (err) {
      setApptError(err.response?.data?.message || 'Failed to load appointments')
    } finally {
      setApptLoading(false)
    }
  }, [])

  // Fetch stats (admin only)
  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/appointments/stats')
      setApptStats(data.stats)
    } catch (err) {
      console.error('Stats fetch error:', err.message)
    }
  }, [])

  // Update appointment status (admin)
  const updateAppointmentStatus = async (id, status) => {
    const { data } = await api.patch(`/appointments/${id}/status`, { status })
    setAppointments(prev =>
      prev.map(a => a._id === id ? data.appointment : a)
    )
    // Refresh stats
    fetchStats()
    return data.appointment
  }

  // Delete one appointment (admin)
  const deleteAppointment = async (id) => {
    await api.delete(`/appointments/${id}`)
    setAppointments(prev => prev.filter(a => a._id !== id))
    fetchStats()
  }

  // Bulk delete cancelled (admin)
  const deleteCancelled = async () => {
    const { data } = await api.delete('/appointments/bulk/cancelled')
    setAppointments(prev => prev.filter(a => a.status !== 'cancelled'))
    fetchStats()
    return data.deletedCount
  }

  return (
    <AppContext.Provider value={{
      currentUser,
      login,
      logout,
      appointments,
      apptLoading,
      apptError,
      apptStats,
      addAppointment,
      fetchAppointments,
      fetchStats,
      updateAppointmentStatus,
      deleteAppointment,
      deleteCancelled,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
