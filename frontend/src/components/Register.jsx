import React, { useState } from 'react'
import { api } from '../api'

export default function Register({ onSuccess }) {
  const [form, setForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setOk(false)
    setLoading(true)
    try {
      await api.register(form)
      setOk(true)
      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header">Register</div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {ok && <div className="alert alert-success">Registrasi berhasil!</div>}
        <form onSubmit={onSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Username</label>
            <input name="username" className="form-control" value={form.username} onChange={onChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">First Name</label>
            <input name="first_name" className="form-control" value={form.first_name} onChange={onChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Last Name</label>
            <input name="last_name" className="form-control" value={form.last_name} onChange={onChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control" value={form.email} onChange={onChange} required />
          </div>
          <div className="col-12">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" value={form.password} onChange={onChange} required />
          </div>
          <div className="col-12">
            <button className="btn btn-primary" disabled={loading}>{loading ? 'Mendaftar...' : 'Daftar'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
