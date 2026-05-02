import { useState, useEffect, useRef } from 'react'

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const currentRef = ref.current
    if (!currentRef) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        observer.unobserve(currentRef)
      }
    }, options)

    observer.observe(currentRef)
    return () => observer.disconnect()
  }, [options])

  return { ref, isInView }
}
