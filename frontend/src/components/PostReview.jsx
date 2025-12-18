import React, { useState } from 'react'
import { api } from '../api'

export default function PostReview({ dealerId, onPosted }) {
  const [review, setReview] = useState('')
  const [car, setCar] = useState({ make: '', model: '', year: new Date().getFullYear() })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.addReview({ dealer_id: dealerId, review, car })
      setReview('')
      if (onPosted) onPosted()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="row g-3">
      {error && <div className="col-12"><div className="alert alert-danger">{error}</div></div>}
      <div className="col-12">
        <label className="form-label">Review</label>
        <textarea className="form-control" rows={3} value={review} onChange={e=>setReview(e.target.value)} required />
      </div>
      <div className="col-md-4">
        <label className="form-label">Car Make</label>
        <input className="form-control" value={car.make} onChange={e=>setCar({...car, make: e.target.value})} />
      </div>
      <div className="col-md-4">
        <label className="form-label">Car Model</label>
        <input className="form-control" value={car.model} onChange={e=>setCar({...car, model: e.target.value})} />
      </div>
      <div className="col-md-4">
        <label className="form-label">Year</label>
        <input type="number" className="form-control" value={car.year} onChange={e=>setCar({...car, year: Number(e.target.value)})} />
      </div>
      <div className="col-12">
        <button className="btn btn-primary" disabled={loading}>{loading ? 'Mengirim...' : 'Kirim Review'}</button>
      </div>
    </form>
  )
}
