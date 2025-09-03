import { Card } from "@/components/ui/card"
import { BarChart3, Users, FolderOpen, CheckSquare, FileText, TrendingUp } from "lucide-react"

export default function Dashboard() {
  const stats = [
    {
      title: "Active Projects",
      value: "12",
      icon: FolderOpen,
      change: "+2 this month",
      changeType: "positive"
    },
    {
      title: "Team Members",
      value: "24",
      icon: Users,
      change: "+3 new hires",
      changeType: "positive"
    },
    {
      title: "Pending Tasks",
      value: "47",
      icon: CheckSquare,
      change: "-8 from last week",
      changeType: "positive"
    },
    {
      title: "Quotations",
      value: "18",
      icon: FileText,
      change: "+5 this week",
      changeType: "positive"
    },
    {
      title: "Revenue",
      value: "$125,430",
      icon: TrendingUp,
      change: "+12% from last month",
      changeType: "positive"
    },
    {
      title: "Performance Score",
      value: "94%",
      icon: BarChart3,
      change: "+2% improvement",
      changeType: "positive"
    }
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0d4f29]">Manager Dashboard</h2>
          <p className="text-gray-600">Overview of your team and projects</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
              <stat.icon className="h-4 w-4 text-[#106934]" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-[#0d4f29]">{stat.value}</p>
              <p className={`text-xs ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Project Overview */}
        <Card className="p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-[#0d4f29] mb-4">Recent Projects</h3>
          <div className="space-y-3">
            {[
              { name: "Website Redesign", status: "In Progress", progress: 75 },
              { name: "Mobile App Development", status: "Planning", progress: 25 },
              { name: "Database Migration", status: "Review", progress: 90 },
              { name: "API Integration", status: "In Progress", progress: 45 }
            ].map((project, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{project.name}</p>
                  <p className="text-xs text-gray-500">{project.status}</p>
                </div>
                <div className="w-20">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#106934] h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{project.progress}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Team Performance */}
        <Card className="p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-[#0d4f29] mb-4">Team Performance</h3>
          <div className="space-y-3">
            {[
              { name: "Alex Meian", role: "Frontend Developer", performance: 95 },
              { name: "Maria Garcia", role: "Backend Developer", performance: 88 },
              { name: "John Smith", role: "UI/UX Designer", performance: 92 },
              { name: "Emily Chen", role: "Project Coordinator", performance: 87 }
            ].map((member, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#106934]">{member.performance}%</p>
                  <p className="text-xs text-gray-500">Performance</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
} 