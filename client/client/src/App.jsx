import { useEffect, useState } from 'react'
import AdminRoute from './components/AdminRoute'
import Footer from './components/Footer'
import Navbar from './components/NavBar'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext.jsx'
import { useAuth } from './context/useAuth'
import Home from './pages/Home'
import Login from './pages/Login'
import PostDetail from './pages/PostDetail'
import Register from './pages/Register'
import Dashboard from './pages/admin/Dashboard'
import AdminPosts from './pages/admin/Posts'
import AdminUsers from './pages/admin/Users'
import './App.css'

function AppContent() {
  const [path, setPath] = useState(window.location.pathname)
  const { user, loading, sessionError } = useAuth()

  const navigate = (nextPath) => {
    if (window.location.pathname !== nextPath) window.history.pushState({}, '', nextPath)
    setPath(nextPath)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const postId = path.match(/^\/posts\/([^/]+)$/)?.[1]
  const signInPage = <Login navigate={navigate} />
  let page

  if (path === '/login') {
    page = <Login navigate={navigate} />
  } else if (path === '/register') {
    page = <Register navigate={navigate} />
  } else if (path === '/admin' || path === '/admin/') {
    page = (
      <ProtectedRoute loading={loading} user={user} onSignIn={signInPage}>
        <AdminRoute user={user}><Dashboard navigate={navigate} /></AdminRoute>
      </ProtectedRoute>
    )
  } else if (path === '/admin/posts') {
    page = (
      <ProtectedRoute loading={loading} user={user} onSignIn={signInPage}>
        <AdminRoute user={user}><AdminPosts navigate={navigate} /></AdminRoute>
      </ProtectedRoute>
    )
  } else if (path === '/admin/users') {
    page = (
      <ProtectedRoute loading={loading} user={user} onSignIn={signInPage}>
        <AdminRoute user={user}><AdminUsers navigate={navigate} /></AdminRoute>
      </ProtectedRoute>
    )
  } else if (postId) {
    page = <PostDetail id={postId} navigate={navigate} />
  } else if (path === '/') {
    page = <Home navigate={navigate} />
  } else {
    page = <div className="page-message"><span className="eyebrow">404 — PAGE NOT FOUND</span><h1>That page wandered off.</h1><button className="button button-primary" onClick={() => navigate('/')}>Return home</button></div>
  }

  return (
    <div className="site-shell">
      <Navbar navigate={navigate} />
      <main>
        {sessionError && <div role="alert" className="notice notice-error session-notice">{sessionError}</div>}
        {page}
      </main>
      <Footer navigate={navigate} />
    </div>
  )
}

export default function App() {
  return <AuthProvider><AppContent /></AuthProvider>
}
