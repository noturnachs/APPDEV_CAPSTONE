import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  PanelLeft, 
  Home, 
  Search, 
  Settings, 
  Calendar, 
  Mail, 
  MessageCircle, 
  Bell, 
  ChevronRight,
  MoreHorizontal,
  Plus,
  User
} from "lucide-react"
import { createContext, useContext, useState } from "react"

const SidebarContext = createContext()

const SidebarProvider = ({ children, defaultOpen = true }) => {
  const [isCollapsed, setIsCollapsed] = useState(!defaultOpen)

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="flex min-h-screen">
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

const Sidebar = ({ children, collapsible = true, className, ...props }) => {
  const { isCollapsed } = useContext(SidebarContext)

  return (
    <div
      className={cn(
        "relative flex h-screen transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const SidebarTrigger = ({ className, ...props }) => {
  const context = useContext(SidebarContext)
  
  if (!context) {
    throw new Error("SidebarTrigger must be used within a SidebarProvider")
  }
  
  const { setIsCollapsed, isCollapsed } = context

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setIsCollapsed(!isCollapsed)}
      className={cn("h-8 w-8 p-0", className)}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
    </Button>
  )
}

const SidebarInset = ({ children, className, ...props }) => {
  return (
    <main
      className={cn(
        "flex flex-1 flex-col transition-all duration-300 ease-in-out",
        className
      )}
      {...props}
    >
      {children}
    </main>
  )
}

const SidebarContent = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col border-r border-sidebar-border bg-sidebar-background text-sidebar-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const SidebarHeader = ({ children, className, ...props }) => {
  const context = useContext(SidebarContext)
  const isCollapsed = context?.isCollapsed || false

  return (
    <div
      className={cn(
        "flex items-center border-b border-sidebar-border px-3 py-2",
        isCollapsed ? "justify-center px-2" : "px-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const SidebarMenu = ({ children, className, ...props }) => {
  return (
    <ul
      className={cn("flex flex-col gap-1 p-2", className)}
      {...props}
    >
      {children}
    </ul>
  )
}

const SidebarMenuItem = ({ children, className, ...props }) => {
  return (
    <li className={cn("", className)} {...props}>
      {children}
    </li>
  )
}

const SidebarMenuButton = ({ 
  children, 
  className, 
  isActive = false, 
  asChild = false,
  size = "default",
  ...props 
}) => {
  const context = useContext(SidebarContext)
  const isCollapsed = context?.isCollapsed || false
  
  const sizes = {
    default: isCollapsed ? "h-9 w-9 p-0" : "h-9 px-2",
    sm: isCollapsed ? "h-8 w-8 p-0" : "h-8 px-2",
    lg: isCollapsed ? "h-11 w-11 p-0" : "h-11 px-2"
  }

  if (asChild) {
    return children
  }

  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 rounded-md text-left text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sidebar-ring disabled:pointer-events-none disabled:opacity-50",
        sizes[size],
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
        isCollapsed && "justify-center gap-0",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

const SidebarMenuIcon = ({ children, className, ...props }) => {
  return (
    <div
      className={cn("flex h-4 w-4 shrink-0 items-center justify-center", className)}
      {...props}
    >
      {children}
    </div>
  )
}

const SidebarMenuLabel = ({ children, className, ...props }) => {
  const context = useContext(SidebarContext)
  const isCollapsed = context?.isCollapsed || false
  
  if (isCollapsed) return null

  return (
    <span
      className={cn("truncate", className)}
      {...props}
    >
      {children}
    </span>
  )
}

const SidebarMenuSub = ({ children, className, ...props }) => {
  return (
    <ul
      className={cn("ml-4 flex flex-col gap-1 border-l border-sidebar-border pl-4", className)}
      {...props}
    >
      {children}
    </ul>
  )
}

const SidebarGroup = ({ children, className, ...props }) => {
  return (
    <div
      className={cn("px-2 py-1", className)}
      {...props}
    >
      {children}
    </div>
  )
}

const SidebarGroupLabel = ({ children, className, ...props }) => {
  const context = useContext(SidebarContext)
  const isCollapsed = context?.isCollapsed || false
  
  if (isCollapsed) return null

  return (
    <div
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-sidebar-foreground/70",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const SidebarGroupContent = ({ children, className, ...props }) => {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  )
}

const SidebarFooter = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "mt-auto border-t border-sidebar-border p-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export {
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
  SidebarMenuSub,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
} 