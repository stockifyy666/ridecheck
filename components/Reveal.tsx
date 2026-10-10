'use client'
import { useEffect, useRef, useState } from 'react'

type Direction = 'up' | 'left' | 'right' | 'fade'

interface Props {
  children: React.ReactNode
  direction?: Direction
  delay?: number
  className?: string
}

const TRANSLATE: Record<Direction, string> = {
  up:    'translate-y-8',
  left:  '-translate-x-10',
  right: 'translate-x-10',
  fade:  'translate-y-0',
}

export default function Reveal({ children, direction = 'up', delay = 0, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible
          ? 'opacity-100 translate-x-0 translate-y-0'
          : `opacity-0 ${TRANSLATE[direction]}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
