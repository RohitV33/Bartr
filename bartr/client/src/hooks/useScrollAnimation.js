import { useInView } from 'react-intersection-observer'
import { useAnimation } from 'framer-motion'
import { useEffect } from 'react'

/**
 * Returns [ref, controls] — attach ref to the wrapper element,
 * pass controls to motion components as `animate={controls}`.
 */
export function useScrollAnimation(threshold = 0.15, triggerOnce = true) {
  const controls = useAnimation()
  const [ref, inView] = useInView({ threshold, triggerOnce })

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    } else if (!triggerOnce) {
      controls.start('hidden')
    }
  }, [inView, controls, triggerOnce])

  return [ref, controls]
}

/** Standard fade + slide-up variant factory */
export function fadeUpVariant(delay = 0, duration = 0.6) {
  return {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, delay, ease: [0.22, 1, 0.36, 1] },
    },
  }
}

/** Staggered children container */
export function staggerContainerVariant(stagger = 0.12, delayChildren = 0) {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren,
      },
    },
  }
}

/** Staggered child (used with staggerContainerVariant) */
export const staggerChildVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}
