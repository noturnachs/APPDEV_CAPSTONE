"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Mail, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"
import { BlurIn } from "@/components/ui/blur-in"
import { FadeIn } from "@/components/ui/fade-in"
import { Card, CardContent } from "@/components/ui/card"
import StepIndicator from "./components/step-indicator"
import EmailForm from "./components/email-form"
import SentContent from "./components/sent-content"
import SuccessContent from "./components/success-content"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState("email") // "email" | "sent" | "success"
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    setStep("sent")

    // Auto progress to success after 3 seconds (for demo)
    setTimeout(() => {
      setStep("success")
    }, 3000)
  }

  const handleResend = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  const stepContent = {
    email: {
      title: "Enter Your Email",
      description: "We'll send you a secure reset link",
      icon: Mail,
      color: "from-[#106934]/10 to-emerald-100/50",
      iconColor: "text-[#106934]",
    },
    sent: {
      title: "Check Your Email",
      description: "Reset link sent to your inbox",
      icon: Clock,
      color: "from-blue-100/50 to-indigo-100/50",
      iconColor: "text-blue-600",
    },
    success: {
      title: "Email Sent Successfully",
      description: "Follow the link in your email to reset",
      icon: CheckCircle2,
      color: "from-green-100/50 to-emerald-100/50",
      iconColor: "text-green-600",
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#106934]/5 to-emerald-100/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-100/40 to-[#106934]/10 rounded-full blur-3xl -z-10" />

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          className="p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link
            href="/auth/signin"
            className="inline-flex items-center text-slate-600 hover:text-[#106934] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
          </Link>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Side - Branding & Illustration */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-6">
                <BlurIn duration={1.2}>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent leading-tight">
                    Reset Your{" "}
                    <span className="bg-gradient-to-r from-[#106934] to-emerald-600 bg-clip-text text-transparent">
                      Password
                    </span>
                  </h1>
                </BlurIn>

                <FadeIn delay={0.4}>
                  <p className="text-xl text-slate-600 leading-relaxed">
                    Don't worry, it happens to the best of us. Enter your email address and we'll send you a link to
                    reset your password.
                  </p>
                </FadeIn>
              </div>

              {/* Main Illustration */}
              <FadeIn delay={0.6}>
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <motion.img
                    src="/images/illustrations/forgotpassword.svg"
                    alt="Forgot password illustration"
                    className="w-full h-64 object-contain mb-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Secure Password Recovery</h3>
                    <p className="text-slate-600 text-sm">
                      We'll help you regain access to your Alpha Environmental account safely and securely.
                    </p>
                  </motion.div>
                </div>
              </FadeIn>

              {/* Security Notice */}
              <FadeIn delay={0.8}>
                <div className="bg-blue-50/50 border border-blue-200/50 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Security Notice</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Reset links expire after 1 hour</li>
                    <li>• Check your spam folder if you don't see the email</li>
                    <li>• Contact support if you continue having issues</li>
                  </ul>
                </div>
              </FadeIn>
            </motion.div>

            {/* Right Side - Reset Form */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="shadow-xl border-0">
                <CardContent className="p-8 md:p-10">
                  <div className="relative z-10">
                    <div className="text-center mb-8">
                      <motion.div
                        className="w-16 h-16 bg-gradient-to-br from-[#106934] to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Mail className="h-8 w-8 text-white" />
                      </motion.div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Forgot Password</h2>
                      <p className="text-slate-600">Enter your email to receive a reset link</p>
                    </div>

                    {/* Step Indicator */}
                    <StepIndicator step={step} stepContent={stepContent} />

                    <AnimatePresence mode="wait">
                      {step === "email" && (
                        <EmailForm
                          email={email}
                          onEmailChange={setEmail}
                          onSubmit={handleSubmit}
                          isLoading={isLoading}
                        />
                      )}

                      {step === "sent" && <SentContent email={email} onResend={handleResend} isLoading={isLoading} />}

                      {step === "success" && <SuccessContent />}
                    </AnimatePresence>

                    {/* Footer */}
                    <motion.div
                      className="mt-8 pt-6 border-t border-slate-200/50 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2, duration: 0.6 }}
                    >
                      <p className="text-sm text-slate-600">
                        Remember your password?{" "}
                        <Link
                          href="/auth/signin"
                          className="text-[#106934] hover:text-[#106934]/80 font-medium transition-colors duration-300"
                        >
                          Sign in here
                        </Link>
                      </p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#106934]/20 to-emerald-200/40 rounded-full blur-xl" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-blue-200/30 to-[#106934]/10 rounded-full blur-xl" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
