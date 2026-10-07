import { useAuth } from '../context/useAuth'

export default function Navbar({ navigate }) {
  const { user, signOut } = useAuth()
  const logout = () => {
    signOut()
    navigate('/')
  }

  return (
    <header className="site-header">
      <a className="brand" href="/" onClick={(event) => { event.preventDefault(); navigate('/') }}>
        <span className="brand-mark">P</span>
        <span>Papertrail<span className="brand-period">.</span></span>
      </a>
      <nav className="main-nav" aria-label="Main navigation">
        <a href="/" onClick={(event) => { event.preventDefault(); navigate('/') }}>Discover</a>
        {user?.role === 'admin' && <a href="/admin" onClick={(event) => { event.preventDefault(); navigate('/admin') }}>Dashboard</a>}
        {user ? (
          <div className="nav-account">
            <span className="nav-user">{user.name}</span>
            <button className="button button-quiet" onClick={logout}>Log out</button>
          </div>
        ) : (
          <div className="nav-account">
            <a href="/login" onClick={(event) => { event.preventDefault(); navigate('/login') }}>Log in</a>
            <a href="/register" onClick={(event) => { event.preventDefault(); navigate('/register') }} className="button button-primary nav-join">Join Papertrail</a>
          </div>
        )}
      </nav>
    </header>
  )
}