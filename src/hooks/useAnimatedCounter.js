import { useEffect, useState } from 'react'

export function useAnimatedCounter(target, duration = 700) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const end = Number(target) || 0
    const start = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setValue(Math.round(end * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [target, duration])

  return value
}
