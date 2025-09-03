import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { 
  CheckSquare, 
  Plus, 
  Calendar, 
  User, 
  Clock, 
  MoreHorizontal,
  Filter,
  AlertCircle,
  CheckCircle2,
  Circle
} from "lucide-react"

export default function Tasks() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0d4f29]">Tasks</h2>
          <p className="text-gray-600">Manage and track team tasks</p>
        </div>
      </div>

      {/* Content will be implemented later */}
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">Tasks section - Coming soon</p>
      </div>
    </div>
  )
} 