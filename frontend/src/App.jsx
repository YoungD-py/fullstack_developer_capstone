import React, { useState } from 'react'
import Login from './components/Login.jsx'
import DealersList from './components/DealersList.jsx'
import DealerDetails from './components/DealerDetails.jsx'
import Register from './components/Register.jsx'

export default function App() {
  const [user, setUser] = useState(null)
  const [selectedDealer, setSelectedDealer] = useState(null)
  const [view, setView] = useState('dealers')

  if (!user) {
    return <Login onLoginSuccess={(username) => setUser(username)} />
  }

  const handleLogout = () => {
    setUser(null)
    setView('dealers')
    setSelectedDealer(null)
  }

  return (
    <div className="container py-4">
      <nav className="navbar navbar-expand-lg navbar-light bg-light rounded mb-4">
        <div className="container-fluid">
          <span className="navbar-brand">Car Dealership & Reviews</span>
          <div className="d-flex gap-2 align-items-center">
            <span className="text-muted small">Hi, {user}!</span>
            <button className={`btn btn-sm ${view==='dealers'?'btn-primary':'btn-outline-primary'}`} onClick={()=>setView('dealers')}>Dealers</button>
            <button className={`btn btn-sm ${view==='register'?'btn-primary':'btn-outline-primary'}`} onClick={()=>setView('register')}>Register</button>
            <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      {view === 'register' && (
        <Register onSuccess={()=>setView('dealers')} />
      )}

      {view === 'dealers' && (
        <div className="row g-4">
          <div className="col-12 col-lg-5">
            <DealersList onSelect={setSelectedDealer} selectedId={selectedDealer?.id} />
          </div>
          <div className="col-12 col-lg-7">
            {selectedDealer ? (
              <DealerDetails dealer={selectedDealer} />
            ) : (
              <div className="alert alert-info">Pilih dealer untuk melihat detail dan ulasan.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
