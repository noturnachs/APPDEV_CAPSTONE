"use client"

import { motion, AnimatePresence } from "framer-motion"

export default function StepIndicator({ step, stepContent }) {
  const currentStep = stepContent[step]

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
    >
      <div className="flex items-center justify-center space-x-4 mb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${currentStep.color} flex items-center justify-center`}
            initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <currentStep.icon className={`h-6 w-6 ${currentStep.iconColor}`} />
          </motion.div>
        </AnimatePresence>
      </div>
      <motion.div
        key={`step-info-${step}`}
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <h3 className="font-semibold text-slate-900 text-sm">{currentStep.title}</h3>
        <p className="text-slate-600 text-xs mt-1">{currentStep.description}</p>
      </motion.div>
    </motion.div>
  )
}
