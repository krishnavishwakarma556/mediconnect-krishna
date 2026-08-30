import { useState } from 'react'
import { diseaseDatabase } from '../data/index'
import { useApp } from '../context/AppContext'

const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)
const allSymptoms = [...new Set(diseaseDatabase.flatMap(d => d.symptoms))].sort()

export default function Home() {
  const { addAppointment } = useApp()

  // Symptom state
  const [selected,     setSelected]     = useState([])
  const [query,        setQuery]        = useState('')
  const [dropOpen,     setDropOpen]     = useState(false)

  // Results state
  const [showResults,  setShowResults]  = useState(false)
  const [noSymptoms,   setNoSymptoms]   = useState(false)
  const [diagnosis,    setDiagnosis]    = useState(null)

  // Appointment state
  const [showAppt,     setShowAppt]     = useState(false)
  const [form,         setForm]         = useState({ name:'', email:'', date:'', time:'' })
  const [submitting,   setSubmitting]   = useState(false)
  const [confirmed,    setConfirmed]    = useState(null)
  const [apptError,    setApptError]    = useState('')

  const filtered = allSymptoms.filter(s =>
    !selected.includes(s) && s.toLowerCase().includes(query.toLowerCase())
  )

  const addSym = (s) => { setSelected(p => [...p, s]); setQuery('') }
  const remSym = (s) => setSelected(p => p.filter(x => x !== s))

  const analyze = () => {
    setShowAppt(false); setConfirmed(null)
    if (!selected.length) { setNoSymptoms(true); setDiagnosis(null); setShowResults(true); return }
    setNoSymptoms(false)
    let best = { disease: null, score: 0 }
    diseaseDatabase.forEach(d => {
      const c = d.symptoms.filter(s => selected.includes(s)).length
      if (c > best.score) best = { disease: d, score: c }
      else if (c === best.score && c > 0 && best.disease && d.symptoms.length < best.disease.symptoms.length)
        best = { disease: d, score: c }
    })
    setDiagnosis(best.disease)
    setShowResults(true)
  }

  const handleApptSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true); setApptError('')
    try {
      const appt = await addAppointment({
        name:      form.name,
        email:     form.email,
        date:      form.date,
        time:      form.time,
        condition: diagnosis ? diagnosis.name : 'General Consultation',
      })
      setConfirmed(appt)
    } catch (err) {
      setApptError(err.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const fmtDate = (d) => {
    try { return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) }
    catch { return d }
  }

  return (
    <section className="section-container">
      <div className="page-wrapper">

        {/* Hero */}
        <div className="hero-section fade-in-animation">
          <span className="hero-eyebrow">AI-Powered Health Platform</span>
          <h1>Your Health,&nbsp;<span className="text-teal">Simplified.</span></h1>
          <p className="hero-subtitle">Describe your symptoms, track nutrition, and connect with a doctor — all in one place.</p>
        </div>

        {/* Symptom Checker */}
        <div className="card-container narrow fade-in-animation">
          <div className="section-header-block center-text">
            <h2>Symptom Checker</h2>
            <div className="section-divider"></div>
            <p>Select one or more symptoms to identify potential conditions.</p>
          </div>

          <div style={{ position:'relative' }}>
            <label className="field-label">Search &amp; Select Symptoms</label>
            <div className="symptom-multi-select-container" onClick={() => document.getElementById('sym-input').focus()}>
              {selected.map(s => (
                <span key={s} className="symptom-tag">
                  <span>{capitalize(s)}</span>
                  <button className="symptom-tag-remove-button" onClick={e => { e.stopPropagation(); remSym(s) }}>✕</button>
                </span>
              ))}
              <input
                id="sym-input"
                className="symptom-search-input"
                placeholder="Type to search symptoms…"
                autoComplete="off"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setDropOpen(true)}
                onBlur={() => setTimeout(() => setDropOpen(false), 150)}
              />
            </div>
            {dropOpen && filtered.length > 0 && (
              <div className="dropdown-options-panel">
                {filtered.map(s => (
                  <div key={s} className="dropdown-option-item" onMouseDown={() => addSym(s)}>
                    {capitalize(s)}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-center mt-32">
            <button className="primary-button full-width" style={{ justifyContent:'center', fontSize:'1rem', padding:'14px 32px' }} onClick={analyze}>
              🔬 Analyze Symptoms
            </button>
          </div>
        </div>

        {/* Results */}
        {showResults && (
          <div className="results-wrapper fade-in-animation">
            <div className="section-header-block center-text mt-32">
              <h2>Analysis Results</h2>
              <div className="section-divider"></div>
            </div>

            {noSymptoms ? (
              <div className="care-advice-card" style={{ borderLeft:'4px solid var(--color-error)' }}>
                <h4 style={{ color:'var(--color-error)' }}>No Symptoms Selected</h4>
                <p>Please select at least one symptom from the dropdown to analyze.</p>
              </div>
            ) : diagnosis ? (
              <>
                <div className="disease-result-card">
                  <p className="result-label">Potential Condition Identified</p>
                  <h2 className="disease-name">{diagnosis.name}</h2>
                  <p className="disease-description">{diagnosis.description}</p>
                </div>
                <div className="care-advice-card">
                  <h4>Recommended Care &amp; Treatment</h4>
                  <p>{diagnosis.cure}</p>
                </div>
              </>
            ) : (
              <div className="care-advice-card">
                <h4>No Clear Match Found</h4>
                <p>We couldn't determine a specific condition from the selected symptoms. Please consult a healthcare professional.</p>
              </div>
            )}

            {!noSymptoms && (
              <div className="results-action-row">
                <button className="secondary-button" onClick={() => { setShowAppt(true); setConfirmed(null); setForm({ name:'', email:'', date:'', time:'' }) }}>
                  📅 Book a Consultation
                </button>
                <span className="results-disclaimer">This is not a medical diagnosis. Always consult a qualified doctor.</span>
              </div>
            )}
          </div>
        )}

        {/* Appointment Booking */}
        {showAppt && (
          <div className="appointment-section-wrapper fade-in-animation">
            <div className="card-container mt-32">
              <div className="section-header-block center-text">
                <h2>Book an Online Consultation</h2>
                <div className="section-divider"></div>
                <p>Fill in your details below and we'll confirm your appointment.</p>
              </div>

              {!confirmed ? (
                <>
                  {apptError && (
                    <div className="care-advice-card" style={{ borderLeft:'4px solid var(--color-error)', marginBottom:'20px', padding:'14px 20px' }}>
                      <p style={{ color:'var(--color-error)', margin:0 }}>⚠️ {apptError}</p>
                    </div>
                  )}
                  <form onSubmit={handleApptSubmit}>
                    <div className="appointment-form-grid">
                      <div>
                        <label className="field-label">Full Name</label>
                        <input type="text" className="input-field" placeholder="e.g., Priya Sharma" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                      </div>
                      <div>
                        <label className="field-label">Email Address</label>
                        <input type="email" className="input-field" placeholder="e.g., priya@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                      </div>
                      <div>
                        <label className="field-label">Preferred Date</label>
                        <input type="date" className="input-field" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required />
                      </div>
                      <div>
                        <label className="field-label">Preferred Time</label>
                        <input type="time" className="input-field" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} required />
                      </div>
                    </div>
                    <div className="flex-center mt-32">
                      <button type="submit" className="primary-button" style={{ fontSize:'1rem', padding:'14px 36px' }} disabled={submitting}>
                        {submitting ? '⏳ Booking…' : '✅ Confirm Appointment'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="appointment-confirmation-message fade-in-animation">
                  <div className="confirm-icon">✅</div>
                  <h3>Appointment Confirmed!</h3>
                  <p>Thank you, <strong>{confirmed.name}</strong>.</p>
                  <p>Your consultation is scheduled for <strong>{fmtDate(confirmed.date)}</strong> at <strong>{confirmed.time}</strong>.</p>
                  <p className="mt-8 text-small">A confirmation has been sent to <strong>{confirmed.email}</strong>.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
