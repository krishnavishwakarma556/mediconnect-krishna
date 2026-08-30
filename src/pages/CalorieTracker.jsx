import { useState } from 'react'
import { foodDatabase } from '../data/index'

export default function CalorieTracker() {
  const [query,    setQuery]    = useState('')
  const [dropOpen, setDropOpen] = useState(false)
  const [selFood,  setSelFood]  = useState(null)
  const [weight,   setWeight]   = useState('')
  const [log,      setLog]      = useState([])
  const [errFood,  setErrFood]  = useState(false)
  const [errWt,    setErrWt]    = useState(false)

  const filtered = foodDatabase.filter(f => query.trim() && f.name.toLowerCase().includes(query.toLowerCase()))

  const pick = (food) => { setSelFood(food); setQuery(food.name); setDropOpen(false) }

  const addEntry = () => {
    const food = selFood || foodDatabase.find(f => f.name.toLowerCase() === query.trim().toLowerCase()) || null
    const w    = parseFloat(weight)
    let err    = false
    if (!food) { setErrFood(true); err = true } else setErrFood(false)
    if (!w || w <= 0) { setErrWt(true);  err = true } else setErrWt(false)
    if (err) { setTimeout(() => { setErrFood(false); setErrWt(false) }, 2500); return }

    const m = w / 100
    setLog(p => [...p, {
      id: Date.now(), name: food.name, weight: w,
      calories: Math.round(food.calories * m),
      protein:  +(food.protein * m).toFixed(1),
      carbs:    +(food.carbs   * m).toFixed(1),
      fat:      +(food.fat     * m).toFixed(1),
    }])
    setQuery(''); setWeight(''); setSelFood(null)
  }

  const remove = (id) => setLog(p => p.filter(f => f.id !== id))

  const totals = log.reduce((a, f) => ({
    calories: a.calories + f.calories,
    protein:  +(a.protein + f.protein).toFixed(1),
    carbs:    +(a.carbs   + f.carbs).toFixed(1),
    fat:      +(a.fat     + f.fat).toFixed(1),
  }), { calories:0, protein:0, carbs:0, fat:0 })

  return (
    <section className="section-container">
      <div className="page-wrapper">
        <div className="section-header-block center-text">
          <h2>Calorie &amp; Nutrient Tracker</h2>
          <div className="section-divider"></div>
          <p>Search for Indian foods, enter the weight in grams, and track your daily macros.</p>
        </div>

        <div className="card-container calorie-tracker-wrapper">
          <div className="tracker-input-row">
            <div>
              <label className="field-label">Food Item</label>
              <div className="food-search-wrapper">
                <input
                  className={`input-field ${errFood ? 'error-state':''}`}
                  placeholder="e.g., Roti, Paneer, Banana…"
                  autoComplete="off"
                  value={query}
                  onChange={e => { setQuery(e.target.value); setSelFood(null) }}
                  onFocus={() => setDropOpen(true)}
                  onBlur={() => setTimeout(() => setDropOpen(false), 150)}
                />
                {dropOpen && filtered.length > 0 && (
                  <div className="dropdown-options-panel">
                    {filtered.map(f => (
                      <div key={f.name} className="dropdown-option-item" onMouseDown={() => pick(f)}>
                        {f.name} — {f.calories} kcal/100g
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="field-label">Weight (grams)</label>
              <input
                type="number" min="1"
                className={`input-field ${errWt ? 'error-state':''}`}
                placeholder="e.g., 150"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addEntry()}
              />
            </div>
          </div>

          <div className="flex-center mt-16">
            <button className="primary-button" style={{ padding:'12px 32px' }} onClick={addEntry}>+ Add Food</button>
          </div>

          <hr style={{ border:'none', borderTop:'1px solid var(--color-gray-200)', margin:'28px 0' }} />

          <h3 className="mb-8" style={{ textAlign:'center', fontSize:'1rem', fontFamily:'var(--font-body)', fontWeight:'600', color:'var(--color-gray-800)' }}>Today's Food Log</h3>
          <div className="food-items-list">
            {log.length === 0 ? (
              <div className="food-empty-message">🍽️ Your food log is empty. Add items above.</div>
            ) : log.map(e => (
              <div key={e.id} className="food-item-entry fade-in-animation">
                <div className="food-item-info">
                  <span className="food-item-name">{e.name} <span className="text-small">({e.weight}g)</span></span>
                  <span className="food-item-macros">{e.calories} kcal &nbsp;|&nbsp; P: {e.protein}g &nbsp;|&nbsp; C: {e.carbs}g &nbsp;|&nbsp; F: {e.fat}g</span>
                </div>
                <button className="danger-button" onClick={() => remove(e.id)}>✕ Remove</button>
              </div>
            ))}
          </div>

          <h3 className="mt-24 mb-8" style={{ textAlign:'center', fontSize:'1rem', fontFamily:'var(--font-body)', fontWeight:'600', color:'var(--color-gray-800)' }}>Total Nutrients</h3>
          <div id="food-nutrient-summary">
            {[
              { cls:'calories', label:'Calories (kcal)', val: totals.calories },
              { cls:'protein',  label:'Protein',         val: `${totals.protein}g` },
              { cls:'carbs',    label:'Carbs',           val: `${totals.carbs}g` },
              { cls:'fat',      label:'Fat',             val: `${totals.fat}g` },
            ].map(n => (
              <div key={n.cls} className={`nutrient-card ${n.cls}`}>
                <div className="nutrient-value">{n.val}</div>
                <div className="nutrient-label">{n.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
