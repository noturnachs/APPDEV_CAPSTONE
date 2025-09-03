"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Settings, 
  Save,
  Globe,
  Mail,
  Database,
  Shield,
  Bell,
  Palette
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SettingsComponent() {
  const [settings, setSettings] = useState({
    companyName: "Alpha Environmental Systems",
    companyEmail: "info@alphasystems.com",
    companyPhone: "+63 912 345 6789",
    timezone: "Asia/Manila",
    dateFormat: "MM/DD/YYYY",
    language: "English",
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      passwordPolicy: "strong"
    }
  })

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Configure system preferences</p>
        </div>
        <Button className="bg-[#106934] hover:bg-[#106934]/90">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* General Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2 text-[#106934]" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <Input
                  value={settings.companyName}
                  onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Enter company name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Email
                </label>
                <Input
                  value={settings.companyEmail}
                  onChange={(e) => setSettings(prev => ({ ...prev, companyEmail: e.target.value }))}
                  placeholder="Enter company email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Phone
                </label>
                <Input
                  value={settings.companyPhone}
                  onChange={(e) => setSettings(prev => ({ ...prev, companyPhone: e.target.value }))}
                  placeholder="Enter company phone"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#106934] focus:border-transparent"
                >
                  <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
                  <option value="UTC">UTC (GMT+0)</option>
                  <option value="America/New_York">America/New_York (GMT-5)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-[#106934]" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) => handleSettingChange("notifications", "email", e.target.checked)}
                  className="w-4 h-4 text-[#106934] border-gray-300 rounded focus:ring-[#106934]"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">SMS Notifications</p>
                  <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.sms}
                  onChange={(e) => handleSettingChange("notifications", "sms", e.target.checked)}
                  className="w-4 h-4 text-[#106934] border-gray-300 rounded focus:ring-[#106934]"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-500">Receive browser push notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={(e) => handleSettingChange("notifications", "push", e.target.checked)}
                  className="w-4 h-4 text-[#106934] border-gray-300 rounded focus:ring-[#106934]"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-[#106934]" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Require 2FA for all users</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.security.twoFactor}
                  onChange={(e) => handleSettingChange("security", "twoFactor", e.target.checked)}
                  className="w-4 h-4 text-[#106934] border-gray-300 rounded focus:ring-[#106934]"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Session Timeout</p>
                  <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
                </div>
                <select
                  value={settings.security.sessionTimeout}
                  onChange={(e) => handleSettingChange("security", "sessionTimeout", parseInt(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={240}>4 hours</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Password Policy</p>
                  <p className="text-sm text-gray-500">Minimum password requirements</p>
                </div>
                <select
                  value={settings.security.passwordPolicy}
                  onChange={(e) => handleSettingChange("security", "passwordPolicy", e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="basic">Basic (6 characters)</option>
                  <option value="medium">Medium (8 characters, 1 number)</option>
                  <option value="strong">Strong (10 characters, 1 number, 1 symbol)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* System Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-[#106934]" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">System Version</span>
                <span className="font-medium text-gray-900">v1.0.0</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Database Version</span>
                <span className="font-medium text-gray-900">PostgreSQL 15.0</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Last Update</span>
                <span className="font-medium text-gray-900">2024-01-15</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">License</span>
                <span className="font-medium text-gray-900">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-[#106934]" />
              Email Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">SMTP Server</span>
                <span className="font-medium text-gray-900">smtp.gmail.com</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Port</span>
                <span className="font-medium text-gray-900">587</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Status</span>
                <span className="font-medium text-green-600">Connected</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Daily Limit</span>
                <span className="font-medium text-gray-900">1000 emails</span>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              Test Email Configuration
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 