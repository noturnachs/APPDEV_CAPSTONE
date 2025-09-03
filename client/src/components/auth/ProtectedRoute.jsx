"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthGuard from './AuthGuard'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Set client flag
    setIsClient(true)
    
    // Only run auth check on client-side
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        const loginTime = localStorage.getItem('loginTime')

        // Check if token exists
        if (!token || !user) {
          router.push('/auth/signin')
          return
        }

        // Check if session is expired (24 hours)
        const now = Date.now()
        const sessionDuration = 24 * 60 * 60 * 1000 // 24 hours
        
        if (now - parseInt(loginTime) > sessionDuration) {
          // Session expired, clear storage and redirect
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('loginTime')
          router.push('/auth/signin')
          return
        }

        // Parse user data
        const userData = JSON.parse(user)
        setUserRole(userData.role)
        setIsAuthenticated(true)

        // Check role-based access
        if (allowedRoles.length > 0 && !allowedRoles.includes(userData.role)) {
          // User doesn't have permission for this page
          router.push('/auth/signin')
          return
        }

      } catch (error) {
        console.error('Auth check error:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('loginTime')
        router.push('/auth/signin')
      } finally {
        setIsLoading(false)
      }
    }

    // Only run on client-side
    if (typeof window !== 'undefined') {
      checkAuth()
    } else {
      setIsLoading(false)
    }
  }, [router, allowedRoles])

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#106934] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show children only if authenticated and authorized
  return isAuthenticated ? <AuthGuard>{children}</AuthGuard> : null
}

export default ProtectedRoute 