import Hero from '../sections/Hero'
import { motion } from 'framer-motion'
import { Heart, Shield, Waves } from 'lucide-react'
import { bodyText, cardInteractive, headingDisplay, pageShell } from '../constants/ui'
import { staggerContainer, staggerItem } from '../constants/motion'

const features = [
  {
    icon: Heart,
    title: 'Emotionally intelligent',
    description:
      'A space designed to understand how you feel — not just what you type.',
  },
  {
    icon: Waves,
    title: 'Calm by design',
    description:
      'Soft motion, cinematic gradients, and gentle pacing at every turn.',
  },
  {
    icon: Shield,
    title: 'Your sanctuary',
    description:
      'A private-feeling environment built for reflection and emotional safety.',
  },
]

export default function Home() {
  return (
    <>
      <Hero />

      <section className={`${pageShell} pb-24`}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className={headingDisplay}>Built for how you feel</h2>
          <p className={`mx-auto mt-4 max-w-2xl ${bodyText}`}>
            ScribeSpace blends premium aesthetics with emotional wellness — a
            foundation ready for your AI journey.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              variants={staggerItem}
              className={`${cardInteractive} p-8`}
            >
              <feature.icon className="mb-4 h-8 w-8 text-violet-700 transition-transform duration-300 group-hover:scale-110 dark:text-violet-300" />
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-stone-50">
                {feature.title}
              </h3>
              <p className={`mt-2 text-sm leading-relaxed ${bodyText}`}>
                {feature.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </>
  )
}
