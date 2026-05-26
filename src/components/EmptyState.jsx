import { motion } from 'framer-motion'

export default function EmptyState({ icon: Icon, title, description, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`flex flex-col items-center rounded-2xl border border-dashed border-stone-300/90 bg-white/50 px-6 py-14 text-center backdrop-blur-sm sm:px-10 dark:border-white/15 dark:bg-zinc-900/40 ${className}`}
    >
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ice-100/80 dark:bg-blue-950/35">
          <Icon className="h-7 w-7 text-cobalt-500 dark:text-icy-300" />
        </div>
      )}
      <h3 className="font-serif text-xl font-semibold text-zinc-900 dark:text-stone-50">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600 dark:text-stone-400">
        {description}
      </p>
    </motion.div>
  )
}
