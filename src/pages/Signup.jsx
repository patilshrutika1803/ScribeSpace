import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2, UserPlus, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { bodyText, btnGradient, cardSoft, headingDisplay, iconWrap, input, label } from '../constants/ui'

export default function Signup() {
  const { register, error, loading, isUser, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')

  if (isUser) return <Navigate to="/dashboard" replace />
  if (isAdmin) return <Navigate to="/admin-dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!name || !email || !password) {
      setLocalError('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters')
      return
    }

    const success = await register(name, email, password)
    if (success) {
      navigate('/dashboard')
    } else {
      setLocalError(error || 'Registration failed')
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
          <div className={`${iconWrap} mx-auto mb-4`}>
            <UserPlus className="h-6 w-6 text-violet-700 dark:text-violet-300" />
          </div>
          <h1 className={headingDisplay}>Begin your journey</h1>
          <p className={`mx-auto mt-3 max-w-xl text-sm ${bodyText}`}>
            Create your space in ScribeSpace — calm, private, and yours.
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
            <label htmlFor="name" className={label}>Full name</label>
            <input
              id="name"
              type="text"
              required
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={input}
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="signup-email" className={label}>Email</label>
            <input
              id="signup-email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={input}
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="signup-password" className={label}>Password</label>
            <input
              id="signup-password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={input}
              autoComplete="new-password"
            />
          </div>
          <button type="submit" disabled={loading} className={`${btnGradient} w-full`}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account…
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <p className={`mt-6 text-center text-sm ${bodyText}`}>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-violet-700 hover:underline dark:text-violet-300">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
