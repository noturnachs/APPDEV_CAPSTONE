"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Eye, EyeOff, Users, Building2, Mail, Lock, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { BlurIn } from "@/components/ui/blur-in"
import { FadeIn } from "@/components/ui/fade-in"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { authAPI } from "@/lib/api"
import toastUtils from '@/lib/toast'

export default function SignInPage() {
  const [userType, setUserType] = useState("client")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const clearForm = () => {
    setFormData({
      email: "",
      password: "",
    })
    setError("")
    setShowPassword(false)
  }

  // Clear form on component mount and prevent auto-fill
  useEffect(() => {
    clearForm()
    
    // Additional anti-auto-fill technique
    const inputs = document.querySelectorAll('input[type="email"], input[type="password"]')
    inputs.forEach(input => {
      input.setAttribute('autocomplete', 'new-password')
      input.setAttribute('data-form-type', 'other')
    })

    // Check for existing session and auto-logout if expired
    const token = localStorage.getItem('token')
    const loginTime = localStorage.getItem('loginTime')
    
    if (token && loginTime) {
      const now = Date.now()
      const sessionDuration = 24 * 60 * 60 * 1000 // 24 hours
      
      if (now - parseInt(loginTime) > sessionDuration) {
        // Session expired, clear storage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('loginTime')
        console.log('Session expired, logged out automatically')
      }
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      // Input validation
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields.')
        return
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address.')
        return
      }

      // Password length validation
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.')
        return
      }

      // Check if user is trying to login as staff through client portal
      if (userType === 'client') {
        setError('Invalid credentials. Please try again.')
        return
      }

             // Only proceed with staff login if Staff Portal is selected
       if (userType === 'employee') {
         // Rate limiting temporarily disabled for development
         // TODO: Re-enable rate limiting in production

        // Call the staff login API
        const { data } = await authAPI.login({
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        })

                // Reset login attempts on success (rate limiting disabled)
        // localStorage.removeItem('loginAttempts')
        // localStorage.removeItem('lastLoginAttempt')
       
       // Store token and user data
       localStorage.setItem('token', data.token)
       localStorage.setItem('user', JSON.stringify(data.staff))
       localStorage.setItem('loginTime', Date.now().toString())
       
       // Clear form before redirecting
       clearForm()
       
       // Show success toast
       toastUtils.auth.loginSuccess()
       
       // Route based on role
       if (data.staff.role === 'manager') {
         window.location.href = '/staff/manager'
       } else if (data.staff.role === 'admin') {
         window.location.href = '/staff/admin'
       } else if (data.staff.role === 'employee') {
         window.location.href = '/staff/employee'
       }
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Connection error. Please try again.')
      toastUtils.auth.loginError()
    } finally {
      setIsLoading(false)
    }
  }

  const illustrations = {
    client: "/images/illustrations/client_signin.svg",
    employee: "/images/illustrations/employee_signin.svg",
  }

  const userTypes = [
    {
      id: "client",
      title: "Client Portal",
      description: "Access your project dashboard and reports",
      icon: Users,
      features: ["Project Dashboard", "Progress Reports", "Document Access", "Support Chat"],
    },
    {
      id: "employee",
      title: "Staff Portal",
      description: "Access internal tools and resources",
      icon: Building2,
      features: ["Internal Tools", "Team Resources", "Project Management", "Analytics"],
    },
  ]

  const currentType = userTypes.find((t) => t.id === userType)
  const CurrentIcon = currentType?.icon

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
          <Link href="/" className="group">
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl text-slate-700 hover:text-[#106934] transition-all duration-300"
              whileHover={{ scale: 1.02, x: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="mr-2"
                initial={{ x: 0 }}
                whileHover={{ x: -2 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowLeft className="h-4 w-4" />
              </motion.div>
              <span className="font-medium">Back to Home</span>
            </motion.div>
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
                    Welcome Back to{" "}
                    <span className="bg-gradient-to-r from-[#106934] to-emerald-600 bg-clip-text text-transparent">
                      Alpha Environmental
                    </span>
                  </h1>
                </BlurIn>

                <FadeIn delay={0.4}>
                  <p className="text-xl text-slate-600 leading-relaxed">
                    Access your personalized dashboard and manage your environmental consulting projects with ease.
                  </p>
                </FadeIn>
              </div>

              {/* Illustration */}
              <FadeIn delay={0.6}>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={userType}
                      initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                      transition={{
                        duration: 0.8,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      src={illustrations[userType]}
                      alt={`${userType} portal illustration`}
                      className="w-full h-64 object-contain"
                      style={{ willChange: "transform, opacity" }}
                    />
                  </AnimatePresence>
                  <motion.div
                    className="text-center mt-6"
                    key={`info-${userType}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{currentType?.title}</h3>
                    <p className="text-slate-600 text-sm mb-4">{currentType?.description}</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {currentType?.features.map((feature, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-[#106934]/10 text-[#106934]"
                        >
                          {feature}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </FadeIn>
            </motion.div>

            {/* Right Side - Sign In Form */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
                {/* Glassmorphism effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-3xl" />

                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-[#106934] to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {CurrentIcon && <CurrentIcon className="h-8 w-8 text-white" />}
                    </motion.div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign In</h2>
                    <p className="text-slate-600">Choose your portal and enter your credentials</p>
                  </div>

                                     <form onSubmit={handleSubmit} className="space-y-6" autoComplete="new-password">
                    {/* Portal Selection - Now in Form */}
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-slate-700">Choose Your Portal</label>
                      <div className="grid grid-cols-2 gap-4">
                        {userTypes.map((type, index) => (
                          <motion.div
                            key={type.id}
                            onClick={() => setUserType(type.id)}
                            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-500 group ${
                              userType === type.id
                                ? "border-[#106934] bg-gradient-to-r from-[#106934]/5 to-emerald-50/50 shadow-md"
                                : "border-slate-200 hover:border-slate-300 hover:shadow-sm bg-white/50"
                            }`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + index * 0.2, duration: 0.6 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex flex-col items-center text-center space-y-3">
                              <div
                                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-500 ${
                                  userType === type.id
                                    ? "bg-gradient-to-br from-[#106934] to-emerald-600 text-white shadow-md"
                                    : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                                }`}
                              >
                                <type.icon className="h-6 w-6" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center justify-center space-x-2">
                                  <h4 className="font-semibold text-slate-900 text-sm">{type.title}</h4>
                                  {userType === type.id && (
                                    <motion.div
                                      initial={{ scale: 0, rotate: -180 }}
                                      animate={{ scale: 1, rotate: 0 }}
                                      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                                      className="w-4 h-4 bg-[#106934] rounded-full flex items-center justify-center"
                                    >
                                      <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                                    </motion.div>
                                  )}
                                </div>
                                <p className="text-slate-600 text-xs">{type.description}</p>
                              </div>
                            </div>

                            {/* Selection indicator */}
                            <div
                              className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#106934] to-emerald-600 rounded-b-xl transform transition-all duration-500 ${
                                userType === type.id ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                              }`}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Email Field */}
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0, duration: 0.6 }}
                    >
                      <label className="text-sm font-medium text-slate-700 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-slate-500" />
                        Email Address
                      </label>
                                             <Input
                         type="email"
                         placeholder="Enter your email"
                         value={formData.email}
                         onChange={(e) => handleInputChange("email", e.target.value)}
                         required
                         autoComplete="new-password"
                         data-form-type="other"
                         className="h-12 pl-4 pr-4 bg-white/50 border-slate-200 focus:border-[#106934] focus:ring-[#106934]/20 rounded-xl transition-all duration-300 text-slate-900 placeholder:text-slate-500"
                       />
                    </motion.div>

                    {/* Password Field */}
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2, duration: 0.6 }}
                    >
                      <label className="text-sm font-medium text-slate-700 flex items-center">
                        <Lock className="h-4 w-4 mr-2 text-slate-500" />
                        Password
                      </label>
                      <div className="relative">
                                                 <Input
                           type={showPassword ? "text" : "password"}
                           placeholder="Enter your password"
                           value={formData.password}
                           onChange={(e) => handleInputChange("password", e.target.value)}
                           required
                           autoComplete="new-password"
                           data-form-type="other"
                           className="h-12 pl-4 pr-12 bg-white/50 border-slate-200 focus:border-[#106934] focus:ring-[#106934]/20 rounded-xl transition-all duration-300 text-slate-900 placeholder:text-slate-500"
                         />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors duration-300"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </motion.div>

                    {/* Remember Me & Forgot Password */}
                    <motion.div
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4, duration: 0.6 }}
                    >
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox id="remember-me" />
                        <Label htmlFor="remember-me" className="text-sm text-slate-600">Remember me</Label>
                      </label>
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm text-[#106934] hover:text-[#106934]/80 font-medium transition-colors duration-300"
                      >
                        Forgot password?
                      </Link>
                    </motion.div>

                                         {/* Error Message */}
                     {error && (
                       <motion.div
                         initial={{ opacity: 0, y: -10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="p-3 bg-red-50 border border-red-200 rounded-lg"
                       >
                         <p className="text-sm text-red-600 text-center">{error}</p>
                       </motion.div>
                     )}

                     {/* Submit Button */}
                     <motion.div
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 1.6, duration: 0.6 }}
                       whileHover={{ scale: isLoading ? 1 : 1.02 }}
                       whileTap={{ scale: isLoading ? 1 : 0.98 }}
                     >
                       <Button
                         type="submit"
                         disabled={isLoading}
                         className="w-full h-12 bg-gradient-to-r from-[#106934] to-emerald-600 hover:from-[#106934]/90 hover:to-emerald-600/90 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         {isLoading ? (
                           <div className="flex items-center justify-center">
                             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                             Signing In...
                           </div>
                         ) : (
                           `Sign In to ${currentType?.title}`
                         )}
                       </Button>
                     </motion.div>
                  </form>

                  {/* Footer */}
                  <motion.div
                    className="mt-8 pt-6 border-t border-slate-200/50 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8, duration: 0.6 }}
                  >
                    <p className="text-sm text-slate-600">
                      Need access?{" "}
                      <Link
                        href="/quotation"
                        className="text-[#106934] hover:text-[#106934]/80 font-medium transition-colors duration-300"
                      >
                        Request a quote
                      </Link>{" "}
                      to get started
                    </p>
                  </motion.div>
                </div>
              </div>

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
