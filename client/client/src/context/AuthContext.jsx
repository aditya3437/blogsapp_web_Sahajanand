import { useCallback, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext.js'
import { apiRequest } from '../services/api'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('blog-token') || '')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('blog-token')))
  const [sessionError, setSessionError] = useState('')

  useEffect(() => {
    if (!token) return

    let cancelled = false
    apiRequest('/auth/me', { token })
      .then(({ user: currentUser }) => {
        if (!cancelled) {
          setUser(currentUser)
          setSessionError('')
        }
      })
      .catch((error) => {
        if (!cancelled) {
          if (error.status === 401) {
            localStorage.removeItem('blog-token')
            setToken('')
            setUser(null)
          } else {
            setSessionError(error.message)
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [token])

  const signIn = useCallback(({ token: nextToken, user: nextUser }) => {
    localStorage.setItem('blog-token', nextToken)
    setSessionError('')
    setToken(nextToken)
    setUser(nextUser)
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem('blog-token')
    setSessionError('')
    setToken('')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, user, loading, sessionError, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
