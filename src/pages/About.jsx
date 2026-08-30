import { useEffect, useRef } from 'react'
import { Chart, ArcElement, DoughnutController, LineElement, LineController, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler } from 'chart.js'
Chart.register(ArcElement, DoughnutController, LineElement, LineController, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler)

export default function About() {
  const macroRef  = useRef(null); const macroInst  = useRef(null)
  const growthRef = useRef(null); const growthInst = useRef(null)

  useEffect(() => {
    if (macroRef.current) {
      macroInst.current?.destroy()
      macroInst.current = new Chart(macroRef.current.getContext('2d'), {
        type: 'doughnut',
        data: { labels:['Carbohydrates','Protein','Fat'], datasets:[{ data:[55,25,20], backgroundColor:['#F4A261','#00A896','#FF6B6B'], borderColor:'#FFFFFF', borderWidth:4, hoverOffset:8 }] },
        options: { responsive:true, maintainAspectRatio:false, cutout:'68%', plugins:{ legend:{ position:'bottom', labels:{ padding:16, font:{ family:"'DM Sans', sans-serif", size:12 }, color:'#5A657A' } } } },
      })
    }
    if (growthRef.current) {
      growthInst.current?.destroy()
      const ctx = growthRef.current.getContext('2d')
      const gradient = ctx.createLinearGradient(0,0,0,320)
      gradient.addColorStop(0,'rgba(0,168,150,0.4)'); gradient.addColorStop(1,'rgba(0,168,150,0.0)')
      growthInst.current = new Chart(ctx, {
        type: 'line',
        data: { labels:['Launch','User Accounts','API Integration','AI/ML Analysis','Mobile App'], datasets:[{ label:'Projected MAU', data:[1000,15000,50000,120000,300000], fill:true, backgroundColor:gradient, borderColor:'#00A896', borderWidth:2.5, tension:0.4, pointBackgroundColor:'#00A896', pointBorderColor:'#FFFFFF', pointBorderWidth:2, pointRadius:6 }] },
        options: { responsive:true, maintainAspectRatio:false, scales:{ y:{ beginAtZero:true, ticks:{ callback: v => v>=1000?(v/1000)+'k':v, color:'#9AA3B5' } }, x:{ grid:{ display:false }, ticks:{ color:'#5A657A' } } }, plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label: i => ` ${i.raw.toLocaleString()} users` } } } },
      })
    }
    return () => { macroInst.current?.destroy(); growthInst.current?.destroy() }
  }, [])

  const problems  = [{ i:'🔍', t:'Unreliable Symptom Searches', d:'Google searches lead to anxiety and misinformation.' }, { i:'📝', t:'Manual Nutrition Tracking', d:'Generic apps lack Indian food data.' }, { i:'📞', t:'Disconnected Next Steps', d:'Booking a doctor is a separate, cumbersome process.' }, { i:'🎯', t:'No Goal-Based Guidance', d:"Generic fitness advice isn't tailored to individuals." }]
  const solutions = [{ i:'💡', t:'Guided Symptom Analysis', d:'Structured, data-driven symptom checker.' }, { i:'🥗', t:'Integrated Calorie Tracker', d:'Comprehensive Indian food database.' }, { i:'📅', t:'Seamless Appointment Booking', d:'Book immediately after symptom analysis.' }, { i:'🏆', t:'Personalized Health Goals', d:'Evidence-based Lose/Gain Weight plans.' }]
  const modules   = ['Navigation Module','Symptom Selector UI','Symptom Analyzer Logic','Diagnosis Renderer','Food Search UI','Calorie Calculator','Food Log Manager','Appointment Booking Form','Nutrient Totals Display','Goal Plan Toggler','Disease Data Store','Food Data Store']

  return (
    <>
      <div className="infographic-header">
        <span style={{ display:'inline-block', background:'rgba(0,168,150,0.25)', color:'var(--color-teal-light)', fontSize:'0.75rem', fontWeight:'700', letterSpacing:'0.12em', textTransform:'uppercase', padding:'6px 16px', borderRadius:'999px', marginBottom:'16px' }}>Project Overview</span>
        <h1>MediConnect: Your Health, Simplified</h1>
        <p>An interactive health management platform — from identifying symptoms to tracking nutrition and booking consultations.</p>
      </div>

      <main className="section-container">
        <div className="page-wrapper">
          <div className="section-header-block center-text"><h2>The Problem &amp; The Solution</h2><div className="section-divider"></div><p style={{ maxWidth:'560px', margin:'0 auto' }}>Managing personal health today is fragmented, confusing, and stressful. MediConnect changes that.</p></div>

          <div className="problem-solution-grid mt-32">
            <div className="problem-card">
              <h3 style={{ color:'var(--color-accent)', marginBottom:'20px' }}>❌ The Problem</h3>
              {problems.map(p => <div key={p.t} className="ps-item problem-item"><span className="ps-item-icon">{p.i}</span><div><div className="ps-item-title">{p.t}</div><div className="ps-item-desc">{p.d}</div></div></div>)}
            </div>
            <div className="solution-card">
              <h3 style={{ color:'var(--color-teal)', marginBottom:'20px' }}>✅ The Solution</h3>
              {solutions.map(s => <div key={s.t} className="ps-item solution-item"><span className="ps-item-icon">{s.i}</span><div><div className="ps-item-title">{s.t}</div><div className="ps-item-desc">{s.d}</div></div></div>)}
            </div>
          </div>

          <div className="section-header-block center-text" style={{ marginTop:'64px' }}><h2>Core Features at a Glance</h2><div className="section-divider"></div></div>
          <div className="two-column-grid mt-32">
            <div className="card-container"><h3 style={{ color:'var(--color-teal)', marginBottom:'12px' }}>🔬 Symptom Checker</h3><p style={{ marginBottom:'20px', fontSize:'0.88rem' }}>Guides users through symptom selection and returns the most likely condition with care advice.</p><div style={{ display:'flex', flexDirection:'column', gap:'6px', alignItems:'center' }}>{[{bg:'var(--color-gray-100)',t:'1. Select Symptoms'},{bg:'var(--color-gray-100)',t:'2. Run Matching Algorithm'},{bg:'var(--color-teal-pale)',t:'3. View Diagnosis + Book Appointment',c:'var(--color-teal)'}].map((x,i,a) => <div key={x.t}>{i>0 && <div style={{ fontSize:'1.4rem', color:'var(--color-gray-400)', textAlign:'center' }}>▼</div>}<div style={{ background:x.bg, borderRadius:'8px', padding:'10px 20px', fontSize:'0.82rem', fontWeight:'600', width:'100%', textAlign:'center', color:x.c||'inherit' }}>{x.t}</div></div>)}</div></div>
            <div className="card-container"><h3 style={{ color:'var(--color-accent)', marginBottom:'12px' }}>🍱 Calorie Tracker</h3><p style={{ marginBottom:'20px', fontSize:'0.88rem' }}>Log meals with weight inputs, track macronutrients, and review your daily intake at a glance.</p><div className="chart-wrapper"><canvas ref={macroRef}></canvas></div></div>
            <div className="card-container"><h3 style={{ color:'var(--color-navy)', marginBottom:'12px' }}>📅 Appointment Booking</h3><p style={{ fontSize:'0.88rem' }}>Book a consultation immediately after symptom analysis. Saved to MongoDB in real-time.</p><div style={{ marginTop:'16px', background:'var(--color-gray-100)', borderRadius:'10px', padding:'16px' }}><div style={{ fontSize:'0.8rem', color:'var(--color-gray-400)', marginBottom:'8px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em' }}>Required Fields</div><div style={{ display:'flex', flexDirection:'column', gap:'8px', fontSize:'0.85rem' }}><div>👤 Full Name</div><div>📧 Email Address</div><div>📅 Preferred Date</div><div>⏰ Preferred Time</div></div></div></div>
            <div className="card-container"><h3 style={{ color:'var(--color-gold)', marginBottom:'12px' }}>🎯 Health Goal Planner</h3><p style={{ fontSize:'0.88rem' }}>Evidence-based Lose Weight and Gain Weight plans with structured diet and exercise guidance.</p><div style={{ marginTop:'16px', display:'flex', gap:'10px' }}><div style={{ flex:1, background:'#e6f7f6', borderRadius:'10px', padding:'14px', textAlign:'center', fontSize:'0.82rem', fontWeight:'700', color:'var(--color-teal)' }}>📉 Lose Weight<br/><span style={{ fontSize:'0.75rem', fontWeight:'400', color:'var(--color-gray-600)' }}>Deficit + Cardio</span></div><div style={{ flex:1, background:'#f0fdf4', borderRadius:'10px', padding:'14px', textAlign:'center', fontSize:'0.82rem', fontWeight:'700', color:'#166534' }}>📈 Gain Weight<br/><span style={{ fontSize:'0.75rem', fontWeight:'400', color:'var(--color-gray-600)' }}>Surplus + Strength</span></div></div></div>
          </div>

          <div className="section-header-block center-text" style={{ marginTop:'64px' }}><h2>System Architecture</h2><div className="section-divider"></div><p>MERN Stack — MongoDB + Express + React + Node.js</p></div>
          <div className="module-architecture-grid mt-32">
            {modules.map(m => <div key={m} className={`module-chip ${m==='Appointment Booking Form'?'highlight':''}`}>{m}</div>)}
          </div>

          <div className="section-header-block center-text" style={{ marginTop:'64px' }}><h2>Future Vision &amp; Growth</h2><div className="section-divider"></div></div>
          <div className="chart-card mt-32"><h3>Projected User Growth Roadmap</h3><div className="chart-wrapper wide"><canvas ref={growthRef}></canvas></div></div>

          <div className="two-column-grid mt-24" style={{ gridTemplateColumns:'repeat(4,1fr)' }}>
            {[{v:'10+',l:'Diseases in DB',c:'var(--color-teal)'},{v:'22+',l:'Indian Foods',c:'var(--color-navy)'},{v:'4',l:'Core Modules',c:'var(--color-gold)'},{v:'MERN',l:'Tech Stack',c:'var(--color-accent)'}].map(k => (
              <div key={k.l} className="card-container center-text" style={{ padding:'20px' }}>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'2rem', color:k.c }}>{k.v}</div>
                <div style={{ fontSize:'0.78rem', color:'var(--color-gray-400)', fontWeight:'600', textTransform:'uppercase', marginTop:'4px' }}>{k.l}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
