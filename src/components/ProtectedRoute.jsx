import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowedRole, redirectTo }) {
  const { role } = useAuth()

  if (role !== allowedRole) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}
