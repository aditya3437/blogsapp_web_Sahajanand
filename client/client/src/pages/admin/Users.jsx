import { useCallback, useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { useAuth } from '../../context/useAuth'
import { apiRequest } from '../../services/api'

const emptyForm = { name: '', email: '', password: '', role: 'user' }

export default function Users({ navigate }) {
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const loadUsers = useCallback(async () => {
    try {
      const result = await apiRequest('/users', { token })
      setUsers(result)
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    }
  }, [token])

  useEffect(() => {
    let cancelled = false
    apiRequest('/users', { token })
      .then((result) => {
        if (!cancelled) {
          setUsers(result)
          setError('')
        }
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message)
      })
    return () => { cancelled = true }
  }, [token])

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      await apiRequest(editingId ? `/users/${editingId}` : '/users', {
        token,
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(form),
      })
      setEditingId('')
      setForm(emptyForm)
      await loadUsers()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this member? This cannot be undone.')) return
    try {
      setError('')
      await apiRequest(`/users/${id}`, { token, method: 'DELETE' })
      await loadUsers()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <AdminLayout active="users" navigate={navigate}>
      <div className="admin-content-heading"><div><span className="eyebrow">COMMUNITY</span><h2>Members</h2></div><span className="record-count">{users.length} total</span></div>
      {error && <div role="alert" className="notice notice-error">{error}</div>}
      <form className="admin-form" onSubmit={submit}>
        <h3>{editingId ? 'Edit member' : 'Add a member'}</h3>
        <div className="form-grid">
          <label>Name<input required maxLength="80" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
          <label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
          <label>{editingId ? 'New password (optional)' : 'Temporary password'}<input required={!editingId} type="password" minLength="8" autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
          <label>Role<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><option value="user">Member</option><option value="admin">Administrator</option></select></label>
        </div>
        <div className="form-actions"><button className="button button-primary" disabled={busy}>{busy ? 'Saving…' : editingId ? 'Save member' : 'Add member'}</button>{editingId && <button type="button" className="button button-quiet" onClick={() => { setEditingId(''); setForm(emptyForm) }}>Cancel</button>}</div>
      </form>
      <div className="record-list">
        {users.map((member) => <article className="record-row" key={member._id}><div className="avatar">{member.name.slice(0, 1).toUpperCase()}</div><div className="record-main"><h3>{member.name}</h3><p>{member.email} · <span className={`role-tag ${member.role}`}>{member.role}</span></p></div><div className="record-actions"><button className="text-button" onClick={() => { setEditingId(member._id); setForm({ name: member.name, email: member.email, password: '', role: member.role }); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Edit</button><button className="text-button danger-text" onClick={() => remove(member._id)}>Delete</button></div></article>)}
        {!users.length && <p className="list-empty">No members found.</p>}
      </div>
    </AdminLayout>
  )
}
