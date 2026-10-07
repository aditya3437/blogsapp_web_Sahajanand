export default function AdminRoute({ children, user }) {
  if (user?.role === 'admin') return children
  return (
    <div className="page-message">
      <span className="eyebrow">Restricted area</span>
      <h1>Admin access required</h1>
      <p>Your account does not have permission to open the dashboard.</p>
    </div>
  )
}
