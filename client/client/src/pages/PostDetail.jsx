import { useEffect, useState } from 'react'
import { apiRequest } from '../services/api'

export default function PostDetail({ id, navigate }) {
  const [result, setResult] = useState({ id: '', post: null, error: '' })

  useEffect(() => {
    let cancelled = false
    apiRequest(`/posts/${id}`)
      .then((post) => { if (!cancelled) setResult({ id, post, error: '' }) })
      .catch((requestError) => { if (!cancelled) setResult({ id, post: null, error: requestError.message }) })
    return () => { cancelled = true }
  }, [id])

  if (result.id !== id) return <div className="page-message">Loading story…</div>
  if (result.error) return <div className="page-message"><span className="eyebrow">STORY UNAVAILABLE</span><h1>We couldn’t find that story.</h1><p>{result.error}</p><button className="button button-primary" onClick={() => navigate('/')}>Back to stories</button></div>
  if (!result.post) return <div className="page-message">Loading story…</div>
  const post = result.post

  return (
    <article className="post-page">
      <button className="back-link" onClick={() => navigate('/')}>← All stories</button>
      <div className="post-heading"><span className="eyebrow">A PAPERTRAIL STORY</span><h1>{post.title}</h1><div className="story-meta post-byline"><span>By {post.author?.name || 'Papertrail'}</span><span>{new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(post.createdAt))}</span></div></div>
      <div className="post-cover"><span className="story-art-shape" /><span className="cover-label">PAPERTRAIL JOURNAL</span></div>
      <div className="post-content">{post.content.split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
      <div className="post-end"><span>✳</span><p>Thank you for reading.</p></div>
    </article>
  )
}
