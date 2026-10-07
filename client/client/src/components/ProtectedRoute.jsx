export default function ProtectedRoute({ children, loading, user, onSignIn }) {
  if (loading) return <div className="page-message">Checking your session…</div>
  if (!user) return onSignIn
  return children
}
