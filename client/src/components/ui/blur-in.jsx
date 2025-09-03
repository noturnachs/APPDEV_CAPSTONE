"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

const BlurIn = ({ children, className, variant, duration = 1, delay = 0, yOffset = 6, ...props }) => {
  const [MotionDiv, setMotionDiv] = useState(null)

  useEffect(() => {
    import("framer-motion").then((mod) => {
      setMotionDiv(() => mod.motion.div)
    })
  }, [])

  const variants = {
    hidden: { filter: "blur(20px)", opacity: 0, y: yOffset },
    visible: { filter: "blur(0px)", opacity: 1, y: -yOffset },
  }
  const transition = {
    duration,
    delay,
    ease: [0.16, 1, 0.3, 1],
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
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={transition}
      variants={variants}
      className={cn(className)}
      {...props}
    >
      {children}
    </MotionDiv>
  )
}

export { BlurIn }
