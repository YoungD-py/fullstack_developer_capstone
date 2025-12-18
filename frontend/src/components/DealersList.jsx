import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function DealersList({ onSelect, selectedId }) {
  const [dealers, setDealers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.getDealers().then(d => setDealers(d.dealers || [])).catch(e => setError(e.message))
  }, [])

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-header">Daftar Dealer</div>
      <ul className="list-group list-group-flush">
        {dealers.map(d => (
          <li key={d.id} className={`list-group-item d-flex justify-content-between align-items-center ${selectedId===d.id?'active':''}`} style={{cursor:'pointer'}} onClick={()=>onSelect && onSelect(d)}>
            <span>{d.full_name}</span>
            <span className="badge bg-secondary">{d.city}, {d.state}</span>
          </li>
        ))}
        {!dealers.length && (
          <li className="list-group-item">{error || 'Tidak ada dealer.'}</li>
        )}
      </ul>
    </div>
  )
}
