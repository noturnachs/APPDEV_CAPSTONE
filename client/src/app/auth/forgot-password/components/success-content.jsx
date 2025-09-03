"use client"

import { motion } from "framer-motion"
import { CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SuccessContent() {
  return (
    <motion.div
      key="success-content"
      className="space-y-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
    >
      <div className="space-y-4">
        <div className="p-4 bg-green-50/50 border border-green-200/50 rounded-xl">
          <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <h3 className="font-semibold text-green-900 mb-2">Reset Link Sent Successfully!</h3>
          <p className="text-sm text-green-800">
            Please check your email and follow the instructions to reset your password.
          </p>
        </div>

        <p className="text-sm text-slate-600">The link will expire in 1 hour for security reasons.</p>
      </div>

      <Link href="/auth/signin">
        <Button className="w-full h-12 font-medium text-base">
          Return to Sign In
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </motion.div>
  )
}
