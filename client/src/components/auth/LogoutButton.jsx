"use client"

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

const LogoutButton = ({ className = "" }) => {
  const router = useRouter()

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('loginTime')
    localStorage.removeItem('loginAttempts')
    localStorage.removeItem('lastLoginAttempt')
    
    // Redirect to signin page
    router.push('/auth/signin')
  }

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300 ${className}`}
    >
      <LogOut className="h-4 w-4" />
      <span>Logout</span>
    </button>
  )
}

export default LogoutButton 