"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AuthGuard = ({ children }) => {
  const router = useRouter()

  useEffect(() => {
    // Prevent back button navigation
    const handlePopState = (e) => {
      e.preventDefault()
      // Check if user is still authenticated
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      if (!token || !user) {
        router.push('/auth/signin')
        return
      }
      
      // Check session expiration
      const loginTime = localStorage.getItem('loginTime')
      const now = Date.now()
      const sessionDuration = 24 * 60 * 60 * 1000 // 24 hours
      
      if (now - parseInt(loginTime) > sessionDuration) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('loginTime')
        router.push('/auth/signin')
        return
      }
    }

    // Add event listener
    window.addEventListener('popstate', handlePopState)

    // Cleanup event listener
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [router])

  return children
}

export default AuthGuard 