import { useAnimatedCounter } from '../hooks/useAnimatedCounter'

export default function AnimatedCounter({ value, suffix = '', className = '' }) {
  const display = useAnimatedCounter(value)
  return (
    <span className={className}>
      {display}
      {suffix}
    </span>
  )
}
