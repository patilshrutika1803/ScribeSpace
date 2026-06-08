import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../utils/api'

const TOKEN_KEY = 'token'
const ROLE_KEY = 'role'

const AuthContext = createContext(null)

function readToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

function readRole() {
  if (typeof window === 'undefined') return null
  const role = localStorage.getItem(ROLE_KEY)
  return role === 'user' || role === 'admin' ? role : null
}

function readUser() {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('user')
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(readToken)
  const [role, setRole] = useState(readRole)
  const [user, setUser] = useState(readUser)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const onStorage = () => {
      setToken(readToken())
      setRole(readRole())
      setUser(readUser())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const register = async (name, email, password) => {
    setError(null)
    setLoading(true)
    try {
      const data = await api.register(name, email, password)
      const authToken = data.token
      const userRole = data.user.role
      localStorage.setItem(TOKEN_KEY, authToken)
      localStorage.setItem(ROLE_KEY, userRole)
      localStorage.setItem('user', JSON.stringify(data.user))
      api.setToken(authToken)
      setToken(authToken)
      setRole(userRole)
      setUser(data.user)
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    setError(null)
    setLoading(true)
    try {
      const data = await api.login(email, password)
      const authToken = data.token
      const userRole = data.user.role
      localStorage.setItem(TOKEN_KEY, authToken)
      localStorage.setItem(ROLE_KEY, userRole)
      localStorage.setItem('user', JSON.stringify(data.user))
      api.setToken(authToken)
      setToken(authToken)
      setRole(userRole)
      setUser(data.user)
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ROLE_KEY)
    localStorage.removeItem('user')
    api.removeToken()
    setToken(null)
    setRole(null)
    setUser(null)
    setError(null)
  }

  const value = {
    token,
    role,
    user,
    error,
    loading,
    isUser: role === 'user',
    isAdmin: role === 'admin',
    isAuthenticated: Boolean(token) && (role === 'user' || role === 'admin'),
    register,
    login,
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

