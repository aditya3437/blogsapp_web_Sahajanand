import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import { apiRequest } from '../services/api'

export default function AuthForm({ register, navigate }) {
  const { signIn } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const result = await apiRequest(`/auth/${register ? 'register' : 'login'}`, {
        method: 'POST',
        body: JSON.stringify(form),
      })
      signIn(result)
      navigate('/')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-art"><div className="auth-art-inner"><span className="auth-star">✳</span><p>Make room<br />for <em>good words.</em></p><span className="auth-art-note">READ SLOWLY. LIVE CURIOUSLY.</span></div></div>
      <div className="auth-panel">
        <span className="eyebrow">{register ? 'YOUR NEXT CHAPTER' : 'WELCOME BACK'}</span>
        <h1>{register ? 'Find your place.' : 'Good to see you.'}</h1>
        <p className="auth-intro">{register ? 'Create an account to join the conversation.' : 'Sign in to pick up where you left off.'}</p>
        {error && <div role="alert" className="notice notice-error">{error}</div>}
        <form className="auth-form" onSubmit={submit}>
          {register && <label>Your name<input required maxLength="80" autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>}
          <label>Email address<input required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
          <label>Password<input required type="password" minLength="8" autoComplete={register ? 'new-password' : 'current-password'} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
          <button className="button button-primary auth-submit" disabled={submitting}>{submitting ? 'Please wait…' : register ? 'Create your account' : 'Log in'}</button>
        </form>
        <p className="auth-switch">{register ? 'Already a member?' : 'New around here?'} <button className="text-button" onClick={() => navigate(register ? '/login' : '/register')}>{register ? 'Log in' : 'Create an account'}</button></p>
      </div>
    </section>
  )
}
