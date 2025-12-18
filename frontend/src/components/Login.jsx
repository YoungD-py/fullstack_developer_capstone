import React, { useState } from 'react'
import { api } from '../api'

export default function Login({ onLoginSuccess }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.login(form)
      if (onLoginSuccess) onLoginSuccess(res.username)
    } catch (err) {
      setError(err.message || 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body p-5">
          <h2 className="card-title text-center mb-4">Car Dealership</h2>
          <p className="text-center text-muted mb-4">Masuk untuk melanjutkan</p>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                className="form-control form-control-lg"
                value={form.username}
                onChange={onChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control form-control-lg"
                value={form.password}
                onChange={onChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-lg w-100"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <hr />
          <p className="text-center text-muted small">
            Demo credentials: <br />
            <strong>admin</strong> / <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
