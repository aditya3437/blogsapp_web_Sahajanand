import { useCallback, useEffect, useState } from 'react'
import { apiRequest } from '../services/api'

export default function Home({ navigate }) {
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadPosts = useCallback(async () => {
    setLoading(true)
    try {
      const result = await apiRequest('/posts')
      setPosts(result)
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    apiRequest('/posts')
      .then((result) => {
        if (!cancelled) {
          setPosts(result)
          setError('')
          setLoading(false)
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(requestError.message)
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [])

  const filteredPosts = posts.filter((post) => {
    const query = search.trim().toLowerCase()
    return !query || `${post.title} ${post.content} ${post.author?.name || ''}`.toLowerCase().includes(query)
  })

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-line" /> STORIES WORTH SITTING WITH</span>
          <h1>Ideas for a life<br />well <em>observed.</em></h1>
          <p>Thoughtful writing on creativity, culture, and the little things that make a life.</p>
          <a className="hero-link" href="#latest">Explore the latest <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-sun" /><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <div className="art-book"><span /><span /><span /></div><div className="art-caption">EST. FOR THE CURIOUS</div>
        </div>
        <div className="hero-index"><span>01</span><span className="index-rule" /><span>03</span></div>
      </section>

      <section id="latest" className="stories-section">
        <div className="section-heading">
          <div><span className="eyebrow">THE JOURNAL</span><h2>Latest stories<span className="brand-period">.</span></h2></div>
          <label className="search-box"><span className="sr-only">Search stories</span><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a story" /></label>
        </div>
        {loading ? (
          <div className="empty-state"><p>Gathering the latest stories…</p></div>
        ) : error ? (
          <div className="notice notice-error"><span>{error}</span><button className="text-button" onClick={loadPosts}>Try again</button></div>
        ) : filteredPosts.length ? (
          <div className="story-grid">
            {filteredPosts.map((post, index) => (
              <article className={`story-card story-card-${index % 3}`} key={post._id}>
                <button className="story-art" onClick={() => navigate(`/posts/${post._id}`)} aria-label={`Read ${post.title}`}>
                  <span className="story-art-shape" /><span className="story-number">{String(index + 1).padStart(2, '0')}</span><span className="story-read">READ STORY ↗</span>
                </button>
                <div className="story-meta"><span>{post.author?.name || 'Papertrail'}</span><span>{new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(post.createdAt))}</span></div>
                <h3><a href={`/posts/${post._id}`} onClick={(event) => { event.preventDefault(); navigate(`/posts/${post._id}`) }}>{post.title}</a></h3>
                <p>{post.content.length > 155 ? `${post.content.slice(0, 155).trim()}…` : post.content}</p>
                <a href={`/posts/${post._id}`} onClick={(event) => { event.preventDefault(); navigate(`/posts/${post._id}`) }} className="read-link">Read story <span aria-hidden="true">↗</span></a>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">✳</span><h3>{search ? 'No stories found' : 'The first page is still blank.'}</h3>
            <p>{search ? 'Try another search term.' : 'Come back soon — new stories are on their way.'}</p>
          </div>
        )}
      </section>
      <section className="manifesto"><span className="manifesto-mark">“</span><p>There is no such thing as an ordinary moment.<br />Only the ones we forgot to notice.</p><span className="eyebrow">A NOTE TO OURSELVES</span></section>
    </div>
  )
}
