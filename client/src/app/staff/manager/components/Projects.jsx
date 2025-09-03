import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { 
  FolderOpen, 
  Plus, 
  Calendar, 
  Users, 
  Clock, 
  MoreHorizontal,
  Filter
} from "lucide-react"

export default function Projects() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0d4f29]">Projects</h2>
          <p className="text-gray-600">Manage and track team projects</p>
        </div>
      </div>

      {/* Content will be implemented later */}
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">Projects section - Coming soon</p>
      </div>
    </div>
  )
} 