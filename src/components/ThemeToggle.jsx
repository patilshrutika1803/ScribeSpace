import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { isDark, toggleTheme, themeName } = useTheme()

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch theme. Current: ${themeName}`}
      title={themeName}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-zinc-900 shadow-md transition-all duration-300 hover:border-violet-400 hover:shadow-lg dark:border-white/10 dark:bg-zinc-900 dark:text-stone-50"
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.span
        key={isDark ? 'moon' : 'sun'}
        initial={{ rotate: -30, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-violet-300" />
        ) : (
          <Sun className="h-4 w-4 text-amber-600" />
        )}
      </motion.span>
    </motion.button>
  )
}
