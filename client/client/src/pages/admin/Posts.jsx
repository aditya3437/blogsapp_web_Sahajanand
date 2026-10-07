import { useCallback, useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { useAuth } from '../../context/useAuth'
import { apiRequest } from '../../services/api'

const emptyForm = { title: '', content: '' }

export default function Posts({ navigate }) {
  const { token } = useAuth()
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const loadPosts = useCallback(async () => {
    try {
      const result = await apiRequest('/posts')
      setPosts(result)
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    apiRequest('/posts')
      .then((result) => {
        if (!cancelled) {
          setPosts(result)
          setError('')
        }
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message)
      })
    return () => { cancelled = true }
  }, [])

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      await apiRequest(editingId ? `/posts/${editingId}` : '/posts', {
        token,
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(form),
      })
      setEditingId('')
      setForm(emptyForm)
      await loadPosts()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this story? This cannot be undone.')) return
    try {
      setError('')
      await apiRequest(`/posts/${id}`, { token, method: 'DELETE' })
      await loadPosts()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <AdminLayout active="posts" navigate={navigate}>
      <div className="admin-content-heading"><div><span className="eyebrow">EDITORIAL</span><h2>Stories</h2></div><span className="record-count">{posts.length} total</span></div>
      {error && <div role="alert" className="notice notice-error">{error}</div>}
      <form className="admin-form" onSubmit={submit}>
        <h3>{editingId ? 'Edit story' : 'Write a new story'}</h3>
        <label>Title<input required maxLength="160" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="A thought worth sharing" /></label>
        <label>Story<textarea required maxLength="50000" rows="6" value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} placeholder="Start with what you noticed…" /></label>
        <div className="form-actions"><button className="button button-primary" disabled={busy}>{busy ? 'Saving…' : editingId ? 'Save changes' : 'Publish story'}</button>{editingId && <button type="button" className="button button-quiet" onClick={() => { setEditingId(''); setForm(emptyForm) }}>Cancel</button>}</div>
      </form>
      <div className="record-list">
        {posts.map((post) => <article className="record-row" key={post._id}><div className="record-icon">✳</div><div className="record-main"><h3>{post.title}</h3><p>{post.author?.name || 'Unknown author'} · {new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(post.createdAt))}</p></div><div className="record-actions"><button className="text-button" onClick={() => { setEditingId(post._id); setForm({ title: post.title, content: post.content }); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Edit</button><button className="text-button danger-text" onClick={() => remove(post._id)}>Delete</button></div></article>)}
        {!posts.length && <p className="list-empty">No stories yet. Write the first one above.</p>}
      </div>
    </AdminLayout>
  )
}
