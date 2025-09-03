"use client"

import { BellIcon, LogOutIcon, MoreVerticalIcon, UserCircleIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import toastUtils from '@/lib/toast'

export function AvatarDropdown({ user, isMobile = false }) {
  const router = useRouter()

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('loginTime')
    localStorage.removeItem('loginAttempts')
    localStorage.removeItem('lastLoginAttempt')
    
    // Show logout toast
    toastUtils.auth.logout()
    
    // Redirect to signin page
    router.push('/auth/signin')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          className="text-[#0d4f29] hover:bg-[#106934]/10 hover:text-[#0d4f29] data-[state=open]:bg-[#106934]/10 data-[state=open]:text-[#0d4f29]"
        >
          <Avatar className="h-6 w-6 rounded-lg">
            <AvatarImage src={user.avatar || "/images/pp.jpg"} alt={user.name} />
            <AvatarFallback className="rounded-lg bg-[#0d4f29] text-white text-xs font-medium">
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight min-w-0 overflow-hidden">
            <span className="truncate font-medium text-[#0d4f29]">{user.name}</span>
            <span className="truncate text-xs text-gray-500">{user.email}</span>
          </div>
          <MoreVerticalIcon className="ml-auto h-4 w-4 text-[#0d4f29]/60 shrink-0" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-56 rounded-lg border-[#106934]/20 shadow-lg"
        side={isMobile ? "bottom" : "top"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar || "/images/pp.jpg"} alt={user.name} />
              <AvatarFallback className="rounded-lg bg-[#0d4f29] text-white">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-gray-500">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-gray-700 hover:bg-[#106934]/10 hover:text-[#0d4f29] focus:bg-[#106934]/10 focus:text-[#0d4f29]">
            <UserCircleIcon className="h-4 w-4 text-[#106934]" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem className="text-gray-700 hover:bg-[#106934]/10 hover:text-[#0d4f29] focus:bg-[#106934]/10 focus:text-[#0d4f29]">
            <BellIcon className="h-4 w-4 text-[#106934]" />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-gray-700 hover:bg-[#106934]/10 hover:text-[#0d4f29] focus:bg-[#106934]/10 focus:text-[#0d4f29]"
        >
          <LogOutIcon className="h-4 w-4 text-[#106934]" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 