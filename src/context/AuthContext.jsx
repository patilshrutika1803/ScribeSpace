import { createContext, useContext, useEffect, useState } from 'react'

const ROLE_KEY = 'role'

const AuthContext = createContext(null)

function readRole() {
  if (typeof window === 'undefined') return null
  const role = localStorage.getItem(ROLE_KEY)
  return role === 'user' || role === 'admin' ? role : null
}

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(readRole)

  useEffect(() => {
    const onStorage = () => setRole(readRole())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const loginUser = () => {
    localStorage.setItem(ROLE_KEY, 'user')
    setRole('user')
  }

  const loginAdmin = () => {
    localStorage.setItem(ROLE_KEY, 'admin')
    setRole('admin')
  }

  const logout = () => {
    localStorage.removeItem(ROLE_KEY)
    setRole(null)
  }

  const value = {
    role,
    isUser: role === 'user',
    isAdmin: role === 'admin',
    isAuthenticated: role === 'user' || role === 'admin',
    loginUser,
    loginAdmin,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

