"use client"

import { useEffect, useRef, useState } from "react"

export function useScrollReveal<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px", ...options }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [options])

  return { ref, visible }
}
