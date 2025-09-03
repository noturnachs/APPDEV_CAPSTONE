"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

const WordPullUp = ({ children, className, delayMultiple = 0.08, ...props }) => {
  const [MotionSpan, setMotionSpan] = useState(null)
  const words = children.split(" ")

  useEffect(() => {
    import("framer-motion").then((mod) => {
      setMotionSpan(() => mod.motion.span)
    })
  }, [])

  const pullupVariant = {
    initial: { y: 100, opacity: 0 },
    animate: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * delayMultiple,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  }

  // Return regular spans during SSR, motion.span after hydration
  if (!MotionSpan) {
    return (
      <div className={cn("flex flex-wrap", className)} {...props}>
        {words.map((word, i) => (
          <span key={i} className="mr-2">
            {word}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-wrap", className)} {...props}>
      {words.map((word, i) => (
        <MotionSpan
          key={i}
          variants={pullupVariant}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          custom={i}
          className="mr-2"
        >
          {word}
        </MotionSpan>
      ))}
    </div>
  )
}

export { WordPullUp }
