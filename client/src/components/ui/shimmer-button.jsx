"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

const ShimmerButton = ({ children, className, variant = "default", size = "default", ...props }) => {
  const [MotionButton, setMotionButton] = useState(null)
  const [MotionDiv, setMotionDiv] = useState(null)

  useEffect(() => {
    import("framer-motion").then((mod) => {
      setMotionButton(() => mod.motion.button)
      setMotionDiv(() => mod.motion.div)
    })
  }, [])

  const variants = {
    default: "bg-[#106934] text-white hover:bg-[#106934]/90",
    outline: "border border-[#106934] text-[#106934] hover:bg-[#106934] hover:text-white",
    ghost: "hover:bg-[#106934]/10 text-[#106934]",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
  }

  // Return regular button during SSR, motion.button after hydration
  if (!MotionButton || !MotionDiv) {
    return (
      <button
        className={cn(
          "relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#106934] disabled:pointer-events-none disabled:opacity-50 overflow-hidden",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    )
  }

  return (
    <MotionButton
      className={cn(
        "relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#106934] disabled:pointer-events-none disabled:opacity-50 overflow-hidden",
        variants[variant],
        sizes[size],
        className,
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      <MotionDiv
        className="absolute inset-0 -top-[1px] -bottom-[1px] -left-[1px] -right-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <span className="relative z-10">{children}</span>
    </MotionButton>
  )
}

export { ShimmerButton }
