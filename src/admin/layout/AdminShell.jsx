import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useMemo } from 'react'

const navItems = [
  { to: '/admin-dashboard', label: 'Overview' },
  { to: '/admin-dashboard/users', label: 'Users' },
  { to: '/admin-dashboard/journals', label: 'Journals' },
  { to: '/admin-dashboard/analytics', label: 'Analytics' },
  { to: '/admin-dashboard/moderation', label: 'Moderation' },
  { to: '/admin-dashboard/notifications', label: 'Notifications' },
  { to: '/admin-dashboard/settings', label: 'Settings' },
]

export default function AdminShell() {
  const location = useLocation()

  const activeLabel = useMemo(() => {
    const found = navItems.find((n) => n.to === location.pathname)
    return found?.label ?? 'Overview'
  }, [location.pathname])

  return (
    <div className="min-h-[calc(100vh-5rem)]">
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <aside className="w-full max-w-[16rem] shrink-0">
          <div className="sticky top-[5.5rem] rounded-3xl border border-white/20 bg-white/60 p-4 backdrop-blur-xl shadow-md dark:border-white/10 dark:bg-zinc-900/50">
            <div className="mb-5 flex items-center gap-3 px-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 shadow-inner dark:shadow-black/20">
                <Sparkles className="h-5 w-5 text-primary dark:text-icy-300" />
              </div>
              <div>
                <p className="font-serif text-lg font-semibold text-zinc-900 dark:text-stone-50">Admin</p>
                <p className="text-xs text-slate-600 dark:text-stone-400">{activeLabel}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary/15 to-accent/15 text-primary shadow-[0_0_24px_rgba(167,139,250,0.18)] dark:text-icy-300'
                        : 'text-slate-700 hover:text-zinc-900 dark:text-stone-300 dark:hover:text-white'
                    }`
                  }
                >
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

