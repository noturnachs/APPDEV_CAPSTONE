"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Clock } from 'lucide-react'

const SessionTimeout = () => {
  const [showWarning, setShowWarning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const checkSession = () => {
      const loginTime = localStorage.getItem('loginTime')
      if (!loginTime) return

      const now = Date.now()
      const sessionDuration = 24 * 60 * 60 * 1000 // 24 hours
      const warningTime = 5 * 60 * 1000 // 5 minutes before expiry
      const timeElapsed = now - parseInt(loginTime)
      const timeRemaining = sessionDuration - timeElapsed

      if (timeRemaining <= warningTime && timeRemaining > 0) {
        setShowWarning(true)
        setTimeLeft(Math.ceil(timeRemaining / 1000 / 60)) // Convert to minutes
      } else if (timeRemaining <= 0) {
        // Session expired
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('loginTime')
        router.push('/auth/signin')
      }
    }

    // Check immediately
    checkSession()

    // Check every minute
    const interval = setInterval(checkSession, 60000)

    return () => clearInterval(interval)
  }, [router])

  const handleExtendSession = () => {
    // Update login time to extend session
    localStorage.setItem('loginTime', Date.now().toString())
    setShowWarning(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('loginTime')
    router.push('/auth/signin')
  }

  if (!showWarning) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-100 rounded-full">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Session Expiring Soon</h3>
            <p className="text-sm text-gray-600">Your session will expire in {timeLeft} minutes</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-6 p-3 bg-yellow-50 rounded-lg">
          <Clock className="h-4 w-4 text-yellow-600" />
          <span className="text-sm text-yellow-800">
            For security reasons, you'll be automatically logged out soon.
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExtendSession}
            className="flex-1 bg-[#106934] text-white px-4 py-2 rounded-lg hover:bg-[#0d4f29] transition-colors"
          >
            Extend Session
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Logout Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default SessionTimeout 