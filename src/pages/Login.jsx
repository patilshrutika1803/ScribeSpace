import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { bodyText, btnGradient, cardSoft, headingDisplay, iconWrap, input, label } from '../constants/ui'

export default function Login() {
  const { loginUser, isUser, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  if (isUser) return <Navigate to="/dashboard" replace />
  if (isAdmin) return <Navigate to="/admin-dashboard" replace />

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      loginUser()
      setLoading(false)
      navigate('/dashboard')
    }, 900)
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
            <LogIn className="h-6 w-6 text-violet-700 dark:text-violet-300" />
          </div>
          <h1 className={headingDisplay}>Welcome back</h1>
          <p className={`mx-auto mt-3 max-w-xl text-sm ${bodyText}`}>
            Return to your sanctuary. Sign in to continue your journey.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className={label}>Email</label>
            <input id="email" type="email" required placeholder="you@example.com" className={input} autoComplete="email" />
          </div>
          <div>
            <label htmlFor="password" className={label}>Password</label>
            <input id="password" type="password" required placeholder="••••••••" className={input} autoComplete="current-password" />
          </div>
          <button type="submit" disabled={loading} className={`${btnGradient} w-full`}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className={`mt-6 text-center text-sm ${bodyText}`}>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-medium text-violet-700 hover:underline dark:text-violet-300">
            Create one
          </Link>
        </p>
        <p className={`mt-3 text-center text-xs ${bodyText}`}>
          <Link to="/admin-login" className="hover:text-zinc-900 dark:hover:text-stone-200">
            Admin login
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
