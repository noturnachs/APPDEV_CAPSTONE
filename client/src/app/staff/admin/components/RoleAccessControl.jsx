"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Shield, 
  Users, 
  Settings, 
  Lock,
  Unlock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Check,
  X
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function RoleAccessControl() {
  const [roles] = useState([
    {
      id: 1,
      name: "Admin",
      description: "Full system access and control",
      permissions: ["all"],
      userCount: 1,
      color: "bg-red-100 text-red-800"
    },
    {
      id: 2,
      name: "Manager",
      description: "Project and team management",
      permissions: ["quotations", "projects", "reports", "employees"],
      userCount: 2,
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: 3,
      name: "Employee",
      description: "Basic operational access",
      permissions: ["tasks", "reports"],
      userCount: 8,
      color: "bg-green-100 text-green-800"
    }
  ])

  const [permissions] = useState([
    { id: "quotations", name: "Quotations", description: "Manage and approve quotations" },
    { id: "projects", name: "Projects", description: "View and manage projects" },
    { id: "reports", name: "Reports", description: "Generate and view reports" },
    { id: "employees", name: "Employees", description: "Manage team members" },
    { id: "tasks", name: "Tasks", description: "Create and assign tasks" },
    { id: "settings", name: "Settings", description: "System configuration" },
    { id: "users", name: "Users", description: "User management" },
    { id: "logs", name: "Logs", description: "System logs and audit" }
  ])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Role & Access Control</h1>
          <p className="text-gray-600 mt-1">Manage user roles and permissions</p>
        </div>
        <Button className="bg-[#106934] hover:bg-[#106934]/90">
          <Plus className="h-4 w-4 mr-2" />
          Create New Role
        </Button>
      </div>

      {/* Roles Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role, index) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-[#106934]" />
                    {role.name}
                  </CardTitle>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${role.color}`}>
                    {role.userCount} users
                  </span>
                </div>
                <p className="text-sm text-gray-600">{role.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Permissions:</h4>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                        >
                          {permission === "all" ? "All Access" : permission}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    {role.name !== "Admin" && (
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Permissions Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2 text-[#106934]" />
              Permissions Matrix
            </CardTitle>
            <p className="text-sm text-gray-600">Overview of permissions for each role</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Permission</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Admin</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Manager</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Employee</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((permission, index) => (
                    <motion.tr
                      key={permission.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      className="border-b border-gray-100"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{permission.name}</p>
                          <p className="text-sm text-gray-500">{permission.description}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="py-4 px-4 text-center">
                        {["quotations", "projects", "reports", "employees"].includes(permission.id) ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {["tasks", "reports"].includes(permission.id) ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-red-500 mx-auto" />
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-[#106934]" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Require 2FA for all users</p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Session Timeout</p>
                <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
              </div>
              <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>4 hours</option>
                <option>8 hours</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Password Policy</p>
                <p className="text-sm text-gray-500">Minimum password requirements</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-[#106934]" />
              Access Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Failed login attempts</span>
                <span className="font-medium text-gray-900">3 today</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Active sessions</span>
                <span className="font-medium text-gray-900">12</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Last security scan</span>
                <span className="font-medium text-gray-900">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">System health</span>
                <span className="font-medium text-green-600">Good</span>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              View Detailed Logs
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 