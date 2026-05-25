import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { bodyText, btnGradient, cardSoft, headingDisplay, iconWrap, input, label } from '../constants/ui'

export default function Signup() {
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
            <UserPlus className="h-6 w-6 text-violet-700 dark:text-violet-300" />
          </div>
          <h1 className={headingDisplay}>Begin your journey</h1>
          <p className={`mx-auto mt-3 max-w-xl text-sm ${bodyText}`}>
            Create your space in ScribeSpace — calm, private, and yours.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className={label}>Full name</label>
            <input id="name" type="text" required placeholder="Your name" className={input} autoComplete="name" />
          </div>
          <div>
            <label htmlFor="signup-email" className={label}>Email</label>
            <input id="signup-email" type="email" required placeholder="you@example.com" className={input} autoComplete="email" />
          </div>
          <div>
            <label htmlFor="signup-password" className={label}>Password</label>
            <input id="signup-password" type="password" required placeholder="••••••••" className={input} autoComplete="new-password" />
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
