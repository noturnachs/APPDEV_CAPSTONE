"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SentContent({ email, onResend, isLoading }) {
  return (
    <motion.div
      key="sent-content"
      className="space-y-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
    >
      <div className="space-y-4">
        <div className="p-4 bg-blue-50/50 border border-blue-200/50 rounded-xl">
          <h3 className="font-semibold text-blue-900 mb-2">Email Sent!</h3>
          <p className="text-sm text-blue-800">We've sent a password reset link to:</p>
          <p className="font-medium text-blue-900 mt-1">{email}</p>
        </div>

        <p className="text-sm text-slate-600">Didn't receive the email? Check your spam folder or try again.</p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={onResend}
          className="w-full h-12 font-medium text-base bg-transparent"
          variant="outline"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-600 rounded-full animate-spin" />
              <span>Resending...</span>
            </div>
          ) : (
            "Resend Email"
          )}
        </Button>

        <Link href="/auth/signin">
          <Button className="w-full h-12 font-medium text-base bg-transparent" variant="outline">
            Back to Sign In
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}
