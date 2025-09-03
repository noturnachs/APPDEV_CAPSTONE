"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const NumberTicker = ({ value, direction = "up", delay = 0, className, decimalPlaces = 0, ...props }) => {
  const ref = useRef(null)
  const [MotionSpan, setMotionSpan] = useState(null)
  const [isInView, setIsInView] = useState(false)
  const [displayValue, setDisplayValue] = useState(direction === "down" ? value : 0)

  useEffect(() => {
    import("framer-motion").then((mod) => {
      setMotionSpan(() => mod.motion.span)
      
      // Set up intersection observer manually instead of using framer-motion's useInView
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        },
        { threshold: 0.1 }
      )
      
      if (ref.current) {
        observer.observe(ref.current)
      }
      
      return () => observer.disconnect()
    })
  }, [])

  useEffect(() => {
    if (!isInView) return

    const timer = setTimeout(() => {
      const startValue = direction === "down" ? value : 0
      const endValue = direction === "down" ? 0 : value
      const duration = 2000
      const startTime = Date.now()

      const updateValue = () => {
        const now = Date.now()
        const progress = Math.min((now - startTime) / duration, 1)

        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentValue = startValue + (endValue - startValue) * easeOutQuart

        setDisplayValue(Number.parseFloat(currentValue.toFixed(decimalPlaces)))

        if (progress < 1) {
          requestAnimationFrame(updateValue)
        }
      }

      updateValue()
    }, delay)

    return () => clearTimeout(timer)
  }, [isInView, value, direction, delay, decimalPlaces])

  // Return regular span during SSR, motion.span after hydration
  if (!MotionSpan) {
    return (
      <span ref={ref} className={cn("tabular-nums", className)} {...props}>
        {value}
      </span>
    )
  }

  return (
    <MotionSpan ref={ref} className={cn("tabular-nums", className)} {...props}>
      {displayValue}
    </MotionSpan>
  )
}

export { NumberTicker }
