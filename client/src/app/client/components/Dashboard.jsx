import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileCheck, FileText, ClipboardCheck, FolderOpen, Calendar, AlertCircle, CheckCircle2, Clock } from "lucide-react"

export default function Dashboard() {
  const stats = [
    {
      title: "Active Permits",
      value: "8",
      icon: FileCheck,
      change: "+2 this month",
      changeType: "positive"
    },
    {
      title: "Pending Quotations",
      value: "3",
      icon: FileText,
      change: "Awaiting approval",
      changeType: "neutral"
    },
    {
      title: "Compliance Status",
      value: "98%",
      icon: ClipboardCheck,
      change: "All systems green",
      changeType: "positive"
    },
    {
      title: "Documents",
      value: "24",
      icon: FolderOpen,
      change: "+4 recent uploads",
      changeType: "positive"
    }
  ]

  const recentActivity = [
    {
      type: "permit",
      title: "Building Permit #BP-2024-001",
      status: "approved",
      date: "2024-02-14",
      description: "Commercial renovation permit approved"
    },
    {
      type: "quotation",
      title: "Quotation #QT-2024-005",
      status: "pending",
      date: "2024-02-12",
      description: "Fire safety system installation quote"
    },
    {
      type: "compliance",
      title: "Monthly Safety Report",
      status: "submitted",
      date: "2024-02-10",
      description: "February compliance report submitted"
    },
    {
      type: "document",
      title: "Insurance Certificate",
      status: "uploaded",
      date: "2024-02-08",
      description: "Updated liability insurance documentation"
    }
  ]

  const upcomingDeadlines = [
    {
      title: "Quarterly Compliance Review",
      date: "2024-03-15",
      priority: "high",
      daysLeft: 30
    },
    {
      title: "Permit Renewal - Site A",
      date: "2024-03-20",
      priority: "medium",
      daysLeft: 35
    },
    {
      title: "Safety Training Documentation",
      date: "2024-03-25",
      priority: "medium",
      daysLeft: 40
    },
    {
      title: "Environmental Impact Assessment",
      date: "2024-04-01",
      priority: "low",
      daysLeft: 47
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "uploaded":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "submitted":
        return <CheckCircle2 className="h-4 w-4 text-blue-600" />
      case "uploaded":
        return <CheckCircle2 className="h-4 w-4 text-purple-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0d4f29]">Client Dashboard</h2>
          <p className="text-gray-600">Welcome back, John. Here's what's happening with your projects.</p>
        </div>
        <Button className="bg-[#0d4f29] hover:bg-[#0d4f29]/90 text-white">
          <FileText className="h-4 w-4 mr-2" />
          Request Quote
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
              <stat.icon className="h-4 w-4 text-[#106934]" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-[#0d4f29]">{stat.value}</p>
              <p className={`text-xs ${stat.changeType === 'positive' ? 'text-green-600' : stat.changeType === 'neutral' ? 'text-gray-600' : 'text-red-600'}`}>
                {stat.change}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card className="p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-[#0d4f29] mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-1">
                  {getStatusIcon(activity.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-[#0d4f29] mb-4">Upcoming Deadlines</h3>
          <div className="space-y-4">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(deadline.priority)}`}>
                      {deadline.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-500">{deadline.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#106934]">{deadline.daysLeft}</p>
                  <p className="text-xs text-gray-500">days left</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-[#0d4f29] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 border-[#106934] text-[#106934] hover:bg-[#106934]/10">
            <FileCheck className="h-6 w-6" />
            <span className="text-sm font-medium">Apply for Permit</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 border-[#106934] text-[#106934] hover:bg-[#106934]/10">
            <FileText className="h-6 w-6" />
            <span className="text-sm font-medium">Request Quote</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 border-[#106934] text-[#106934] hover:bg-[#106934]/10">
            <FolderOpen className="h-6 w-6" />
            <span className="text-sm font-medium">Upload Document</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 border-[#106934] text-[#106934] hover:bg-[#106934]/10">
            <ClipboardCheck className="h-6 w-6" />
            <span className="text-sm font-medium">View Compliance</span>
          </Button>
        </div>
      </Card>
    </div>
  )
} 