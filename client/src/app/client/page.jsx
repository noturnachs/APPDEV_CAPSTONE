"use client"

import { useState } from "react"
import { 
  LayoutDashboard, 
  FileCheck,
  FileText, 
  ClipboardCheck,
  FolderOpen,
  History,
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

// Import components
import Dashboard from "./components/Dashboard"
import Permits from "./components/Permits"
import Quotations from "./components/Quotations"
import ComplianceReports from "./components/ComplianceReports"
import Documents from "./components/Documents"
import HistoryComponent from "./components/History"
import SettingsComponent from "./components/Settings"

export default function ClientPage() {
  const [activeNav, setActiveNav] = useState("dashboard")

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "permits", label: "Permits", icon: FileCheck },
    { id: "quotations", label: "Quotations", icon: FileText },
    { id: "compliance-reports", label: "Compliance Reports", icon: ClipboardCheck },
    { id: "documents", label: "Documents", icon: FolderOpen },
    { id: "history", label: "History", icon: History },
  ]

  const bottomItems = [
    { id: "settings", label: "Settings", icon: Settings },
  ]

  // User data for the dropdown
  const user = {
    name: "John Anderson",
    email: "john.anderson@techcorp.com",
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
      case "permits":
        return <Permits />
      case "quotations":
        return <Quotations />
      case "compliance-reports":
        return <ComplianceReports />
      case "documents":
        return <Documents />
      case "history":
        return <HistoryComponent />
      case "settings":
        return <SettingsComponent />
      default:
        return <Dashboard />
    }
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="true" className="border-r border-gray-200">
        <SidebarContent className="bg-gray-50">
          {/* Header with Logo */}
          <SidebarHeader className="h-16 border-b border-gray-200">
            <SidebarHeaderContent />
          </SidebarHeader>

          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-[#2d7a47] font-medium">Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeNav === item.id}
                      onClick={() => setActiveNav(item.id)}
                      className={
                        activeNav === item.id 
                          ? "bg-[#0d4f29] text-white hover:bg-[#0d4f29]/90"
                          : "text-[#0d4f29] hover:bg-[#106934]/10 hover:text-[#0d4f29]"
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
          <SidebarFooter className="border-t border-gray-200">
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeNav === item.id}
                    onClick={() => setActiveNav(item.id)}
                    className={
                      activeNav === item.id
                        ? "bg-[#0d4f29] text-white hover:bg-[#0d4f29]/90"
                        : "text-[#0d4f29] hover:bg-[#106934]/10 hover:text-[#0d4f29]"
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

      <SidebarInset className="bg-white">
        {/* Header with Breadcrumb */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center gap-2">
            {/* Dynamic Breadcrumb */}
            <nav className="flex items-center space-x-1 text-sm">
              <button 
                className="text-[#2d7a47] hover:text-[#0d4f29] transition-colors font-medium"
                onClick={() => setActiveNav("dashboard")}
              >
                Client Portal
              </button>
              <ChevronRight className="h-4 w-4 text-[#2d7a47]" />
              <span className="text-[#0d4f29] font-semibold">{getCurrentSectionLabel()}</span>
            </nav>
          </div>
        </header>

        {/* Dynamic Content Area */}
        {renderCurrentComponent()}
      </SidebarInset>
    </SidebarProvider>
  )
}

// Helper component for sidebar header content that handles collapsed state
function SidebarHeaderContent() {
  return (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src="/images/logo.png" alt="Alpha Systems" />
        <AvatarFallback className="bg-[#0d4f29] text-white text-sm font-bold rounded-lg">
          A
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0 overflow-hidden">
        <SidebarMenuLabel className="text-sm font-semibold text-[#2d7a47]">Alpha Systems</SidebarMenuLabel>
        <SidebarMenuLabel className="text-xs text-gray-500">Client Portal</SidebarMenuLabel>
      </div>
    </>
  )
}
