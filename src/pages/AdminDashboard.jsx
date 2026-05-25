import { motion } from 'framer-motion'
import { Activity, Bot, UserPlus, Users } from 'lucide-react'
import { bodyText, card, heading } from '../constants/ui'

const stats = [
  { label: 'Total users', value: '1,248', icon: Users },
  { label: 'Active sessions', value: '86', icon: Activity },
]

const recentSignups = [
  { name: 'Ava M.', email: 'ava@example.com', time: '2 min ago' },
  { name: 'Jordan K.', email: 'jordan@example.com', time: '18 min ago' },
  { name: 'Sam R.', email: 'sam@example.com', time: '1 hr ago' },
]

const aiActivity = [
  { event: 'Mood analysis completed', count: 342 },
  { event: 'Journal summaries generated', count: 128 },
  { event: 'Focus sessions started', count: 56 },
]

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="text-sm font-medium uppercase tracking-wider text-amber-700 dark:text-cyan-300">
          Admin
        </p>
        <h1 className={`${heading} mt-1 text-4xl sm:text-5xl`}>Control center</h1>
        <p className={`mt-3 max-w-2xl ${bodyText}`}>
          Platform overview and management. Placeholder data for frontend demo.
        </p>
      </motion.header>

      <div className="mb-8 grid gap-6 sm:grid-cols-2">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className={card}
          >
            <stat.icon className="mb-3 h-7 w-7 text-violet-700 dark:text-violet-300" />
            <p className={`text-sm ${bodyText}`}>{stat.label}</p>
            <p className="mt-1 font-serif text-3xl font-semibold text-zinc-900 dark:text-stone-50">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.section
          id="users"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className={card}
        >
          <div className="mb-4 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-violet-700 dark:text-violet-300" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-stone-50">Recent signups</h2>
          </div>
          <ul className="space-y-3">
            {recentSignups.map((user) => (
              <li
                key={user.email}
                className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50/80 px-4 py-3 dark:border-white/5 dark:bg-zinc-800/50"
              >
                <div>
                  <p className="font-medium text-zinc-900 dark:text-stone-50">{user.name}</p>
                  <p className={`text-sm ${bodyText}`}>{user.email}</p>
                </div>
                <span className={`text-xs ${bodyText}`}>{user.time}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className={card}
        >
          <div className="mb-4 flex items-center gap-2">
            <Bot className="h-5 w-5 text-violet-700 dark:text-violet-300" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-stone-50">AI activity</h2>
          </div>
          <ul className="space-y-3">
            {aiActivity.map((row) => (
              <li
                key={row.event}
                className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50/80 px-4 py-3 dark:border-white/5 dark:bg-zinc-800/50"
              >
                <p className={`text-sm ${bodyText}`}>{row.event}</p>
                <span className="font-semibold text-zinc-900 dark:text-stone-50">{row.count}</span>
              </li>
            ))}
          </ul>
        </motion.section>
      </div>
    </div>
  )
}
