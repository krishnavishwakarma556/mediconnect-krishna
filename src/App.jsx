import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Header         from './components/Header'
import Footer         from './components/Footer'
import Home           from './pages/Home'
import CalorieTracker from './pages/CalorieTracker'
import About          from './pages/About'
import Goal           from './pages/Goal'
import Login          from './pages/Login'
import Admin          from './pages/Admin'
import './App.css'

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/"        element={<Home />} />
            <Route path="/calorie" element={<CalorieTracker />} />
            <Route path="/about"   element={<About />} />
            <Route path="/goal"    element={<Goal />} />
            <Route path="/login"   element={<Login />} />
            <Route path="/admin"   element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AppProvider>
  )
}
