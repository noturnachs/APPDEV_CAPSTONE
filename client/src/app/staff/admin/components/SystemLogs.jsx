"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  FileText, 
  Search, 
  Filter,
  Download,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SystemLogs() {
  const [logs] = useState([
    {
      id: 1,
      timestamp: "2024-01-15 14:30:25",
      level: "info",
      user: "admin@alphasystems.com",
      action: "User login",
      details: "Successful login from 192.168.1.100",
      ip: "192.168.1.100"
    },
    {
      id: 2,
      timestamp: "2024-01-15 14:28:10",
      level: "warning",
      user: "manager@alphasystems.com",
      action: "Quotation approval",
      details: "Quotation #QB-2024-001 approved",
      ip: "192.168.1.101"
    },
    {
      id: 3,
      timestamp: "2024-01-15 14:25:45",
      level: "error",
      user: "employee@alphasystems.com",
      action: "Failed login attempt",
      details: "Invalid password for user employee@alphasystems.com",
      ip: "192.168.1.102"
    },
    {
      id: 4,
      timestamp: "2024-01-15 14:20:15",
      level: "info",
      user: "system",
      action: "Database backup",
      details: "Automatic backup completed successfully",
      ip: "system"
    },
    {
      id: 5,
      timestamp: "2024-01-15 14:15:30",
      level: "success",
      user: "admin@alphasystems.com",
      action: "User created",
      details: "New user account created: john.doe@alphasystems.com",
      ip: "192.168.1.100"
    },
    {
      id: 6,
      timestamp: "2024-01-15 14:10:20",
      level: "info",
      user: "manager@alphasystems.com",
      action: "Report generated",
      details: "Monthly report generated and exported",
      ip: "192.168.1.101"
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterLevel, setFilterLevel] = useState("all")
  const [filterUser, setFilterUser] = useState("all")

  const getLevelIcon = (level) => {
    switch (level) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getLevelColor = (level) => {
    switch (level) {
      case "error":
        return "bg-red-50 text-red-700 border-red-200"
      case "warning":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "success":
        return "bg-green-50 text-green-700 border-green-200"
      case "info":
        return "bg-blue-50 text-blue-700 border-blue-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = filterLevel === "all" || log.level === filterLevel
    const matchesUser = filterUser === "all" || log.user === filterUser
    
    return matchesSearch && matchesLevel && matchesUser
  })

  const uniqueUsers = [...new Set(logs.map(log => log.user))]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
          <p className="text-gray-600 mt-1">Monitor system activity and events</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
          <Button className="bg-[#106934] hover:bg-[#106934]/90">
            <Activity className="h-4 w-4 mr-2" />
            Real-time
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-[#106934]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Logs</p>
                  <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Errors</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {logs.filter(log => log.level === "error").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Warnings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {logs.filter(log => log.level === "warning").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {uniqueUsers.filter(user => user !== "system").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#106934] focus:border-transparent"
                >
                  <option value="all">All Levels</option>
                  <option value="error">Error</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                  <option value="info">Info</option>
                </select>
                
                <select
                  value={filterUser}
                  onChange={(e) => setFilterUser(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#106934] focus:border-transparent"
                >
                  <option value="all">All Users</option>
                  {uniqueUsers.map(user => (
                    <option key={user} value={user}>{user}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Logs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>System Activity Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLogs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className={`p-4 rounded-lg border ${getLevelColor(log.level)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getLevelIcon(log.level)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">{log.action}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{log.user}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{log.ip}</span>
                        </div>
                        <p className="text-sm text-gray-700">{log.details}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Log Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Login attempts</span>
                <span className="font-medium text-gray-900">15 today</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Failed logins</span>
                <span className="font-medium text-red-600">3 today</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Quotations processed</span>
                <span className="font-medium text-gray-900">8 today</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Reports generated</span>
                <span className="font-medium text-gray-900">5 today</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Database</span>
                <span className="font-medium text-green-600">Healthy</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">API Services</span>
                <span className="font-medium text-green-600">Online</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Backup Status</span>
                <span className="font-medium text-green-600">Up to date</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Security Scan</span>
                <span className="font-medium text-green-600">Passed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 