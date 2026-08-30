import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const FILTERS = ['All', 'pending', 'confirmed', 'cancelled']

export default function Admin() {
  const { currentUser, appointments, apptLoading, apptError, apptStats,
          fetchAppointments, fetchStats, updateAppointmentStatus,
          deleteAppointment, deleteCancelled } = useApp()
  const navigate = useNavigate()

  const [filter,         setFilter]         = useState('All')
  const [confirmDelete,  setConfirmDelete]  = useState(null)
  const [actionLoading,  setActionLoading]  = useState(null)
  const [toast,          setToast]          = useState(null)

  // Auth guard
  useEffect(() => {
    if (!currentUser)               { navigate('/login');  return }
    if (currentUser.role !== 'admin') { navigate('/');      return }
  }, [currentUser, navigate])

  // Load data on mount and filter change
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchAppointments(filter)
      fetchStats()
    }
  }, [filter, currentUser, fetchAppointments, fetchStats])

  if (!currentUser || currentUser.role !== 'admin') return null

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const handleStatus = async (id, status) => {
    setActionLoading(id + status)
    try {
      await updateAppointmentStatus(id, status)
      showToast(`Appointment marked as ${status}`)
    } catch { showToast('Failed to update status') }
    finally { setActionLoading(null) }
  }

  const handleDelete = async (id) => {
    if (confirmDelete !== id) {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(c => c === id ? null : c), 3000)
      return
    }
    setActionLoading(id + 'del')
    try {
      await deleteAppointment(id)
      setConfirmDelete(null)
      showToast('Appointment deleted')
    } catch { showToast('Delete failed') }
    finally { setActionLoading(null) }
  }

  const handleBulkDelete = async () => {
    setActionLoading('bulk')
    try {
      const count = await deleteCancelled()
      showToast(`Deleted ${count} cancelled appointments`)
    } catch { showToast('Bulk delete failed') }
    finally { setActionLoading(null) }
  }

  const fmtDate = (d) => {
    if (!d) return '—'
    try { return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { year:'numeric', month:'short', day:'numeric' }) } catch { return d }
  }
  const fmtCreated = (iso) => {
    if (!iso) return '—'
    try { return new Date(iso).toLocaleDateString('en-IN', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }) } catch { return '—' }
  }

  const statCards = [
    { label:'Total',     value: apptStats.total,     color:'var(--color-navy)',   icon:'📋' },
    { label:'Pending',   value: apptStats.pending,   color:'var(--color-gold)',   icon:'⏳' },
    { label:'Confirmed', value: apptStats.confirmed, color:'var(--color-teal)',   icon:'✅' },
    { label:'Cancelled', value: apptStats.cancelled, color:'var(--color-accent)', icon:'❌' },
  ]

  return (
    <section className="section-container">
      <div className="page-wrapper">

        {/* Toast */}
        {toast && (
          <div style={{ position:'fixed', top:'80px', right:'24px', zIndex:999, background:'var(--color-navy)', color:'white', padding:'12px 20px', borderRadius:'var(--radius-md)', boxShadow:'var(--shadow-lg)', fontSize:'0.88rem', fontWeight:'600', animation:'fade-slide-up 0.3s ease' }}>
            {toast}
          </div>
        )}

        {/* Header */}
        <div className="section-header-block">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
            <div>
              <h2 style={{ marginBottom:'6px' }}>🛡️ Admin Dashboard</h2>
              <div className="section-divider" style={{ margin:'0 0 8px' }}></div>
              <p>Manage all patient appointment bookings — connected to MongoDB.</p>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <span style={{ background:'var(--color-teal-pale)', color:'var(--color-teal)', padding:'6px 14px', borderRadius:'999px', fontSize:'0.82rem', fontWeight:'600' }}>
                👑 {currentUser.name}
              </span>
              <button className="ghost-button" style={{ padding:'8px 16px', fontSize:'0.82rem' }} onClick={() => { fetchAppointments(filter); fetchStats() }}>
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats-grid">
          {statCards.map(s => (
            <div key={s.label} className="admin-stat-card">
              <div style={{ fontSize:'1.8rem', marginBottom:'6px' }}>{s.icon}</div>
              <div className="admin-stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="admin-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div className="card-container">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px', marginBottom:'20px' }}>
            <h3>All Appointments</h3>
            {apptStats.cancelled > 0 && (
              <button className="danger-button" onClick={handleBulkDelete} disabled={actionLoading === 'bulk'}>
                {actionLoading === 'bulk' ? '⏳ Deleting…' : `🗑 Delete All Cancelled (${apptStats.cancelled})`}
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="admin-filter-row">
            {FILTERS.map(f => (
              <button key={f} className={`filter-btn ${filter===f?'active':''}`} onClick={() => setFilter(f)}>
                {f === 'All' ? `All (${apptStats.total})` : f === 'pending' ? `Pending (${apptStats.pending})` : f === 'confirmed' ? `Confirmed (${apptStats.confirmed})` : `Cancelled (${apptStats.cancelled})`}
              </button>
            ))}
          </div>

          {/* Loading */}
          {apptLoading ? (
            <div className="loading-box"><div className="spinner"></div><p>Loading appointments from MongoDB…</p></div>
          ) : apptError ? (
            <div className="care-advice-card" style={{ borderLeft:'4px solid var(--color-error)' }}>
              <h4 style={{ color:'var(--color-error)' }}>Error loading appointments</h4>
              <p>{apptError}</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="admin-empty-state">
              <div className="empty-icon">{filter === 'All' ? '📋' : '🔍'}</div>
              <h3 style={{ color:'var(--color-gray-400)', fontFamily:'var(--font-body)', fontWeight:'500', marginBottom:'8px' }}>
                {filter === 'All' ? 'No appointments yet' : `No ${filter} appointments`}
              </h3>
              <p>{filter === 'All' ? 'Book an appointment from the Home page to see it here.' : `No appointments with status "${filter}" found.`}</p>
            </div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Patient Name</th>
                    <th>Email</th>
                    <th>Condition</th>
                    <th>Appt. Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Booked On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt, idx) => (
                    <tr key={appt._id}>
                      <td style={{ color:'var(--color-gray-400)', fontWeight:'600' }}>{idx + 1}</td>
                      <td><strong>{appt.name || '—'}</strong></td>
                      <td style={{ color:'var(--color-gray-600)' }}>{appt.email || '—'}</td>
                      <td>
                        <span style={{ background:'var(--color-gray-100)', padding:'3px 10px', borderRadius:'999px', fontSize:'0.78rem', fontWeight:'600', color:'var(--color-navy)', whiteSpace:'nowrap' }}>
                          {appt.condition || 'General'}
                        </span>
                      </td>
                      <td style={{ whiteSpace:'nowrap' }}>{fmtDate(appt.date)}</td>
                      <td>{appt.time || '—'}</td>
                      <td><span className={`status-badge status-${appt.status}`}>{appt.status}</span></td>
                      <td style={{ fontSize:'0.78rem', color:'var(--color-gray-400)', whiteSpace:'nowrap' }}>{fmtCreated(appt.createdAt)}</td>
                      <td>
                        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                          {appt.status !== 'confirmed' && (
                            <button className="admin-action-btn confirm" onClick={() => handleStatus(appt._id, 'confirmed')} disabled={!!actionLoading}>
                              {actionLoading === appt._id+'confirmed' ? '…' : '✅ Confirm'}
                            </button>
                          )}
                          {appt.status !== 'pending' && (
                            <button className="admin-action-btn pending-btn" onClick={() => handleStatus(appt._id, 'pending')} disabled={!!actionLoading}>
                              {actionLoading === appt._id+'pending' ? '…' : '⏳ Pending'}
                            </button>
                          )}
                          {appt.status !== 'cancelled' && (
                            <button className="admin-action-btn cancel-btn" onClick={() => handleStatus(appt._id, 'cancelled')} disabled={!!actionLoading}>
                              {actionLoading === appt._id+'cancelled' ? '…' : '✗ Cancel'}
                            </button>
                          )}
                          <button
                            className="admin-action-btn delete"
                            onClick={() => handleDelete(appt._id)}
                            disabled={!!actionLoading}
                            style={confirmDelete === appt._id ? { background:'var(--color-error)', color:'white', borderColor:'var(--color-error)' } : {}}
                          >
                            {actionLoading === appt._id+'del' ? '…' : confirmDelete === appt._id ? '⚠️ Sure?' : '🗑 Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
