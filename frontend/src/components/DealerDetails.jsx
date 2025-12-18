import React, { useEffect, useState } from 'react'
import { api } from '../api'
import PostReview from './PostReview.jsx'

export default function DealerDetails({ dealer }) {
  const [info, setInfo] = useState(null)
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!dealer) return
    setInfo(null)
    setReviews([])
    setError('')
    api.getDealer(dealer.id).then(setInfo).catch(e => setError(e.message))
    api.getReviews(dealer.id).then(d => setReviews(d.reviews || [])).catch(e => setError(e.message))
  }, [dealer])

  const onPosted = async () => {
    const d = await api.getReviews(dealer.id)
    setReviews(d.reviews || [])
    setShowForm(false)
  }

  if (!dealer) return null

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div>
          <div className="fw-bold">{dealer.full_name}</div>
          <div className="text-muted">{dealer.city}, {dealer.state}</div>
        </div>
        <button className="btn btn-success" onClick={()=>setShowForm(v=>!v)}>{showForm ? 'Tutup' : 'Post Review'}</button>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {info && (
          <div className="mb-3">
            <div className="small text-muted">Dealer ID: {info.id}</div>
          </div>
        )}

        {showForm && (
          <div className="mb-4">
            <PostReview dealerId={dealer.id} onPosted={onPosted} />
          </div>
        )}

        <h6 className="mb-3">Ulasan</h6>
        {!reviews.length && <div className="text-muted">Belum ada ulasan.</div>}
        <ul className="list-group">
          {reviews.map(rv => (
            <li key={rv.id} className="list-group-item">
              <div className="d-flex justify-content-between">
                <strong>@{rv.username}</strong>
                <span className={`badge bg-${rv.sentiment==='positive'?'success':rv.sentiment==='negative'?'danger':'secondary'}`}>{rv.sentiment}</span>
              </div>
              <div>{rv.review}</div>
              {rv.car && rv.car.make && (
                <div className="small text-muted mt-1">{rv.car.make} {rv.car.model} {rv.car.year}</div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
