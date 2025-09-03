"use client"

import { useState, useEffect } from "react"
import { 
  LayoutDashboard, 
  Users,
  Shield,
  FileText,
  Settings,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { AvatarDropdown } from "@/components/ui/avatar-dropdown"
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuIcon,
  SidebarMenuLabel,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
} from "@/components/ui/sidebar"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import SessionTimeout from "@/components/auth/SessionTimeout"

// Import components
import Dashboard from "./components/Dashboard"
import UserManagement from "./components/UserManagement"
import RoleAccessControl from "./components/RoleAccessControl"
import SystemLogs from "./components/SystemLogs"
import SettingsComponent from "./components/Settings"

export default function AdminPage() {
  const [activeNav, setActiveNav] = useState("dashboard")
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    // Get user data from localStorage
    const user = localStorage.getItem('user')
    if (user) {
      setUserData(JSON.parse(user))
    }
  }, [])

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "user-management", label: "User Management", icon: Users },
    { id: "role-access-control", label: "Role & Access Control", icon: Shield },
    { id: "system-logs", label: "System Logs", icon: FileText },
  ]

  const bottomItems = [
    { id: "settings", label: "Settings", icon: Settings },
  ]

  // User data for the dropdown
  const user = {
    name: userData ? `${userData.first_name} ${userData.last_name}` : "Admin",
    email: userData ? userData.email : "admin@alphasystems.com",
    avatar: "/images/pp.jpg"
  }

  // Get current section label
  const getCurrentSectionLabel = () => {
    const currentItem = navigationItems.find(item => item.id === activeNav) || 
                       bottomItems.find(item => item.id === activeNav)
    return currentItem?.label || "Dashboard"
  }

  // Render the appropriate component based on activeNav
  const renderCurrentComponent = () => {
    switch (activeNav) {
      case "dashboard":
        return <Dashboard />
      case "user-management":
        return <UserManagement />
      case "role-access-control":
        return <RoleAccessControl />
      case "system-logs":
        return <SystemLogs />
      case "settings":
        return <SettingsComponent />
      default:
        return <Dashboard />
    }
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <SessionTimeout />
      <SidebarProvider>
        <Sidebar collapsible="true" className="border-r border-border">
        <SidebarContent className="bg-sidebar">
          {/* Header with Logo */}
          <SidebarHeader className="h-16 border-b border-border">
            <SidebarHeaderContent />
          </SidebarHeader>

          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-primary font-medium">Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeNav === item.id}
                      onClick={() => setActiveNav(item.id)}
                      className={
                        activeNav === item.id 
                          ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }
                    >
                      <SidebarMenuIcon>
                        <item.icon className="h-4 w-4" />
                      </SidebarMenuIcon>
                      <SidebarMenuLabel>{item.label}</SidebarMenuLabel>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Bottom Navigation */}
          <SidebarFooter className="border-t border-border">
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeNav === item.id}
                    onClick={() => setActiveNav(item.id)}
                    className={
                      activeNav === item.id
                        ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }
                  >
                    <SidebarMenuIcon>
                      <item.icon className="h-4 w-4" />
                    </SidebarMenuIcon>
                    <SidebarMenuLabel>{item.label}</SidebarMenuLabel>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* User Profile with Dropdown */}
              <SidebarMenuItem>
                <AvatarDropdown user={user} />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="bg-background">
        {/* Header with Breadcrumb */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-sidebar px-4">
          <SidebarTrigger className="-ml-1 text-[#0d4f29] hover:text-[#106934]" />
          <div className="flex flex-1 items-center gap-2">
            {/* Dynamic Breadcrumb */}
            <nav className="flex items-center space-x-1 text-sm">
              <button 
                className="text-sidebar-primary hover:text-sidebar-primary/80 transition-colors font-medium"
                onClick={() => setActiveNav("dashboard")}
              >
                Admin
              </button>
              <ChevronRight className="h-4 w-4 text-sidebar-primary" />
              <span className="text-sidebar-foreground font-semibold">{getCurrentSectionLabel()}</span>
            </nav>
          </div>
        </header>

        {/* Dynamic Content Area */}
        {renderCurrentComponent()}
      </SidebarInset>
    </SidebarProvider>
    </ProtectedRoute>
  )
}

// Helper component for sidebar header content that handles collapsed state
function SidebarHeaderContent() {
  return (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src="/images/logo.png" alt="Alpha Systems" />
        <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm font-bold rounded-lg">
          A
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0 overflow-hidden">
        <SidebarMenuLabel className="text-sm font-semibold text-sidebar-primary">Alpha Systems</SidebarMenuLabel>
        <SidebarMenuLabel className="text-xs text-sidebar-foreground">Admin Portal</SidebarMenuLabel>
      </div>
    </>
  )
} 