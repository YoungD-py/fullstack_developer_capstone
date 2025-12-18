const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

async function http(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let json
  try { json = text ? JSON.parse(text) : {} } catch { json = { raw: text } }
  if (!res.ok) throw new Error(json?.error || res.statusText)
  return json
}

export const api = {
  login: (payload) => http('/djangoapp/login/', { method: 'POST', body: payload }),
  logout: () => http('/djangoapp/logout/', { method: 'POST' }),
  register: (payload) => http('/djangoapp/register/', { method: 'POST', body: payload }),
  getDealers: () => http('/djangoapp/get_dealers/'),
  getDealer: (id) => http(`/djangoapp/dealer/${id}/`),
  getReviews: (id) => http(`/djangoapp/reviews/dealer/${id}/`),
  addReview: (payload) => http('/djangoapp/add_review/', { method: 'POST', body: payload }),
}
