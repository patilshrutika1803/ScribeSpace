import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2, Shield, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { bodyText, btnGradient, cardSoft, heading, input, label } from '../constants/ui'

export default function AdminLogin() {
  const { login, error, loading, isAdmin, isUser } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')

  if (isAdmin) return <Navigate to="/admin-dashboard" replace />
  if (isUser) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!email || !password) {
      setLocalError('Please fill in all fields')
      return
    }

    const success = await login(email, password)
    if (success) {
      navigate('/admin-dashboard')
    } else {
      setLocalError(error || 'Login failed')
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12 sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`${cardSoft} w-full max-w-md`}
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-cyan-900/40">
            <Shield className="h-6 w-6 text-amber-700 dark:text-cyan-300" />
          </div>
          <h1 className={`${heading} text-3xl sm:text-4xl`}>Admin access</h1>
          <p className={`mx-auto mt-3 max-w-xl text-sm ${bodyText}`}>
            Restricted area for platform administrators.
          </p>
        </div>

        {localError && (
          <div className="mb-5 flex items-start gap-3 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-700 dark:text-red-300">{localError}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="admin-email" className={label}>Admin email</label>
            <input
              name="email"
              id="admin-email"
              type="email"
              required
              placeholder="admin@scribespace.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={input}
            />
          </div>
          <div>
            <label htmlFor="admin-password" className={label}>Password</label>
            <input
              name="password"
              id="admin-password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={input}
            />
          </div>
          <button type="submit" disabled={loading} className={`${btnGradient} w-full`}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying…
              </>
            ) : (
              'Enter admin panel'
            )}
          </button>
        </form>

        <p className={`mt-6 text-center text-sm ${bodyText}`}>
          <Link to="/" className="text-zinc-800 hover:underline dark:text-stone-200">
            ← Back to home
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
