"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

const FadeIn = ({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 30,
  once = true,
  ...props
}) => {
  const [MotionDiv, setMotionDiv] = useState(null)

  useEffect(() => {
    import("framer-motion").then((mod) => {
      setMotionDiv(() => mod.motion.div)
    })
  }, [])

  const directionOffset = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { y: 0, x: distance },
    right: { y: 0, x: -distance },
  }

  // Return a regular div during SSR, motion.div after hydration
  if (!MotionDiv) {
    return (
      <div className={cn(className)} {...props}>
        {children}
      </div>
    )
  }

  return (
    <MotionDiv
      initial={{
        opacity: 0,
        ...directionOffset[direction],
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </MotionDiv>
  )
}

export { FadeIn }
