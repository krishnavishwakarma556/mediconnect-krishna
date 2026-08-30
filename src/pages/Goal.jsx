import { useState } from 'react'

export default function Goal() {
  const [plan, setPlan] = useState(null)

  return (
    <section className="section-container">
      <div className="page-wrapper">
        <div className="section-header-block center-text">
          <span className="hero-eyebrow" style={{ display:'inline-block', background:'var(--color-teal-pale)', color:'var(--color-teal)', fontSize:'0.78rem', fontWeight:'700', letterSpacing:'0.12em', textTransform:'uppercase', padding:'6px 16px', borderRadius:'999px', marginBottom:'18px' }}>
            Personalized Planning
          </span>
          <h1>Set Your Health Goal</h1>
          <div className="section-divider" style={{ margin:'14px auto 16px' }}></div>
          <p style={{ maxWidth:'520px', margin:'0 auto', fontSize:'1.05rem' }}>Choose your objective below to receive a tailored diet and exercise plan.</p>
        </div>

        <div className="disclaimer-banner mt-32" style={{ maxWidth:'640px', margin:'32px auto' }}>
          <strong>⚠️ Disclaimer:</strong> These plans are for general informational purposes only. Consult a doctor or registered dietitian before making major changes.
        </div>

        <div className="goal-toggle-row mt-24">
          <button className={`goal-toggle-button ${plan==='lose' ? 'active-button':'inactive-button'}`} onClick={() => setPlan(p => p==='lose' ? null : 'lose')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 20V4M6 14l6 6 6-6"/></svg>
            Lose Weight
          </button>
          <button className={`goal-toggle-button ${plan==='gain' ? 'active-button':'inactive-button'}`} onClick={() => setPlan(p => p==='gain' ? null : 'gain')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 4v16M6 10l6-6 6 6"/></svg>
            Gain Weight
          </button>
        </div>

        {plan === 'lose' && (
          <div style={{ maxWidth:'820px', margin:'0 auto' }}>
            <div className="card-container fade-in-animation">
              <h2 className="plan-section-title center-text" style={{ color:'var(--color-teal)' }}>🏃 Your Weight Loss Plan</h2>
              <div className="plan-card">
                <h4>🥗 Diet Strategy: Calorie Deficit + Nutrient Density</h4>
                <ul>
                  <li><strong>Calorie Deficit:</strong> Consume 300–500 calories less than your daily maintenance level.</li>
                  <li><strong>Prioritize Protein:</strong> Lean chicken, fish, paneer, dals, eggs keep you full and preserve muscle.</li>
                  <li><strong>High-Fiber Foods:</strong> Vegetables, legumes, and whole grains promote satiety.</li>
                  <li><strong>Hydration:</strong> Drink at least 8–10 glasses of water daily.</li>
                  <li><strong>Limit Ultra-Processed Foods:</strong> Reduce sugary drinks, packaged snacks, and fast food.</li>
                  <li><strong>Meal Timing:</strong> Smaller, more frequent meals help manage hunger.</li>
                </ul>
              </div>
              <div className="plan-card mt-16">
                <h4>🏋️ Exercise Strategy: Burn + Maintain Muscle</h4>
                <ul>
                  <li><strong>Cardio (3–5 days/week):</strong> 30–60 minutes of walking, jogging, cycling, or swimming.</li>
                  <li><strong>Strength Training (2–3 days/week):</strong> Squats, push-ups, lunges — builds metabolism.</li>
                  <li><strong>NEAT Activities:</strong> Take stairs, walk more — adds up significantly.</li>
                  <li><strong>Consistency Over Intensity:</strong> Moderate routine for 6 months beats 3 intense weeks.</li>
                  <li><strong>Rest Days:</strong> 1–2 full rest days per week for recovery.</li>
                </ul>
              </div>
              <div className="plan-card mt-16" style={{ background:'var(--color-teal-pale)' }}>
                <h4 style={{ color:'var(--color-teal)' }}>📅 Sample Week</h4>
                <ul>
                  <li><strong>Mon / Wed / Fri:</strong> 45-min cardio</li>
                  <li><strong>Tue / Thu:</strong> 40-min strength training</li>
                  <li><strong>Saturday:</strong> Active rest — yoga or leisure walk</li>
                  <li><strong>Sunday:</strong> Full rest &amp; meal prep</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {plan === 'gain' && (
          <div style={{ maxWidth:'820px', margin:'0 auto' }}>
            <div className="card-container fade-in-animation">
              <h2 className="plan-section-title center-text" style={{ color:'var(--color-navy)' }}>💪 Your Weight Gain Plan</h2>
              <div className="plan-card">
                <h4>🍛 Diet Strategy: Calorie Surplus + Quality Foods</h4>
                <ul>
                  <li><strong>Calorie Surplus:</strong> Consume 300–500 calories more than your daily maintenance level.</li>
                  <li><strong>Ample Protein:</strong> 1.6–2.2g per kg of body weight. Eggs, chicken, fish, paneer, tofu.</li>
                  <li><strong>Complex Carbs:</strong> Roti, rice, oats, potatoes fuel your workouts.</li>
                  <li><strong>Healthy Fats:</strong> Nuts, seeds, ghee, avocado, peanut butter.</li>
                  <li><strong>Eat Frequently:</strong> 3 main meals + 2–3 calorie-dense snacks.</li>
                  <li><strong>Don't Skip Breakfast:</strong> High-protein, high-calorie to start the day.</li>
                </ul>
              </div>
              <div className="plan-card mt-16">
                <h4>🏗️ Exercise Strategy: Progressive Overload</h4>
                <ul>
                  <li><strong>Strength Training (3–5 days/week):</strong> Squats, deadlifts, bench press, rows.</li>
                  <li><strong>Progressive Overload:</strong> Increase weight, reps, or sets each week.</li>
                  <li><strong>Minimal Cardio:</strong> Light 20–30 min walks — avoid burning your surplus.</li>
                  <li><strong>Rest &amp; Recovery:</strong> 7–9 hours of quality sleep per night.</li>
                  <li><strong>Track Progress:</strong> Weigh weekly, measure monthly — visible in 8–12 weeks.</li>
                </ul>
              </div>
              <div className="plan-card mt-16" style={{ background:'#f0fdf4', borderLeft:'4px solid var(--color-success)' }}>
                <h4 style={{ color:'#166534' }}>📅 Sample Week</h4>
                <ul>
                  <li><strong>Monday:</strong> Push day (chest, shoulders, triceps)</li>
                  <li><strong>Tuesday:</strong> Pull day (back, biceps)</li>
                  <li><strong>Wednesday:</strong> Rest or light walk</li>
                  <li><strong>Thursday:</strong> Leg day</li>
                  <li><strong>Friday:</strong> Full-body compound lifts</li>
                  <li><strong>Sat / Sun:</strong> Rest, meal prep, active recovery</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
