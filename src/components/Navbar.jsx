import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { btnGradient } from '../constants/ui'
import ThemeToggle from './ThemeToggle'

function getNavLinks(role) {
  if (role === 'admin') {
    return [
      { to: '/admin-dashboard', label: 'Admin' },
      { to: '/admin-dashboard#users', label: 'Users' },
    ]
  }
  if (role === 'user') {
    return [
      { to: '/', label: 'Home', end: true },
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/journal', label: 'Journal' },
      { to: '/mood', label: 'Mood' },
      { to: '/focus', label: 'Focus' },
    ]
  }
  return [
    { to: '/', label: 'Home', end: true },
    { to: '/login', label: 'Login' },
    { to: '/signup', label: 'Sign Up' },
  ]
}

function NavItem({ to, label, end, onClick }) {
  return (
    <NavLink to={to} end={end} onClick={onClick} className="relative py-1">
      {({ isActive }) => (
        <>
          <span
            className={`text-sm font-medium transition-colors duration-300 ${
              isActive
                ? 'text-primary dark:text-ice-100'
                : 'text-slate-700 hover:text-zinc-900 dark:text-stone-100 dark:hover:text-white'
            }`}
          >
            {label}
          </span>
          {isActive && (
            <motion.span
              layoutId="nav-underline"
              initial={false}
              className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-primary to-accent shadow-[0_0_12px_rgba(167,139,250,0.55)] dark:shadow-[0_0_18px_rgba(167,139,250,0.7)]"
            />
          )}
        </>
      )}
    </NavLink>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { role, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const links = getNavLinks(role)

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
    navigate('/')
  }

  const logoTo = role === 'admin' ? '/admin-dashboard' : '/'

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-[#f4f7fb]/70 shadow-sm backdrop-blur-2xl transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950/80">
      <nav className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to={logoTo} className="shrink-0" onClick={() => setMobileOpen(false)}>
          <span className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">
            <span className="text-zinc-900 dark:text-stone-50">Scribe</span>
            <span className="bg-gradient-to-r from-primary via-accent to-accent bg-clip-text text-transparent dark:from-primary dark:via-accent dark:to-accent-2 drop-shadow-[0_0_10px_rgba(167,139,250,0.35)]">
              Space
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-6 lg:gap-7 xl:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavItem to={link.to} label={link.label} end={link.end} />
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 sm:flex">
          <ThemeToggle />
          {isAuthenticated ? (
            <motion.button
              type="button"
              onClick={handleLogout}
              className={btnGradient}
              whileTap={{ scale: 0.97 }}
            >
              Logout
            </motion.button>
          ) : (
            <Link to="/signup" className={btnGradient}>
              Get Started
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 xl:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/90 bg-[#f4f7fb]/90 text-zinc-900 shadow-md backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/80 dark:text-stone-50"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden border-t border-stone-200/70 xl:hidden dark:border-white/10"
          >
            <ul className="flex flex-col gap-1 px-4 py-4">
              {links.map((link) => (
                <li key={link.to}>
                  <NavItem
                    to={link.to}
                    label={link.label}
                    end={link.end}
                    onClick={() => setMobileOpen(false)}
                  />
                </li>
              ))}
              <li className="pt-3">
                {isAuthenticated ? (
                  <button type="button" onClick={handleLogout} className={`${btnGradient} w-full`}>
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/signup"
                    className={`${btnGradient} w-full text-center`}
                    onClick={() => setMobileOpen(false)}
                  >
                    Get Started
                  </Link>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
