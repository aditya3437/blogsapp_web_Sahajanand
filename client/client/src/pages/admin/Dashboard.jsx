import { useEffect, useState } from 'react'
import { useAuth } from '../../context/useAuth'
import { apiRequest } from '../../services/api'
import AdminLayout from './AdminLayout'

export default function Dashboard({ navigate }) {
  const { token } = useAuth()
  const [counts, setCounts] = useState({ posts: 0, users: 0 })
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([apiRequest('/posts'), apiRequest('/users', { token })])
      .then(([posts, users]) => setCounts({ posts: posts.length, users: users.length }))
      .catch((requestError) => setError(requestError.message))
  }, [token])

  return (
    <AdminLayout active="" navigate={navigate}>
      <div className="admin-content-heading"><div><span className="eyebrow">OVERVIEW</span><h2>Good morning.</h2></div></div>
      {error && <div role="alert" className="notice notice-error">{error}</div>}
      <div className="dashboard-cards">
        <button className="dashboard-card" onClick={() => navigate('/admin/posts')}><span className="eyebrow">PUBLISHED STORIES</span><strong>{counts.posts}</strong><span>Manage the journal →</span></button>
        <button className="dashboard-card" onClick={() => navigate('/admin/users')}><span className="eyebrow">COMMUNITY MEMBERS</span><strong>{counts.users}</strong><span>Manage members →</span></button>
      </div>
    </AdminLayout>
  )
}
