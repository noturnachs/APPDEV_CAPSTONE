"use client"

import { motion } from "framer-motion"
import { Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function EmailForm({ email, onEmailChange, onSubmit, isLoading }) {
  return (
    <motion.form
      key="email-form"
      onSubmit={onSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <label className="text-sm font-medium text-slate-700 flex items-center">
          <Mail className="h-4 w-4 mr-2 text-slate-500" />
          Email Address
        </label>
        <Input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          className="h-12 pl-4 pr-4 bg-white/50 border-slate-200 focus:border-[#106934] focus:ring-[#106934]/20 rounded-xl transition-all duration-300"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <Button type="submit" className="w-full h-12 font-medium text-base" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Sending Reset Link...</span>
            </div>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </motion.div>
    </motion.form>
  )
}
