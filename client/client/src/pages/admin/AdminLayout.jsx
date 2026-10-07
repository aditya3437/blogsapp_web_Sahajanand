export default function AdminLayout({ active, navigate, children }) {
  return (
    <section className="admin-page">
      <div className="admin-heading">
        <div><span className="eyebrow">PAPERTRAIL / CONTROL ROOM</span><h1>Dashboard<span className="brand-period">.</span></h1></div>
        <span className="admin-status"><i /> Administrator</span>
      </div>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <span className="sidebar-label">MANAGE</span>
          <button className={active === 'posts' ? 'admin-nav active' : 'admin-nav'} onClick={() => navigate('/admin/posts')}><span>▤</span> Stories</button>
          <button className={active === 'users' ? 'admin-nav active' : 'admin-nav'} onClick={() => navigate('/admin/users')}><span>◉</span> Members</button>
          <div className="sidebar-note"><span>✳</span><p>Good writing makes a little more room for wonder.</p></div>
        </aside>
        <div className="admin-content">{children}</div>
      </div>
    </section>
  )
}
