import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { 
  Users, 
  Plus, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  MoreHorizontal,
  Filter,
  Star,
  Target,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle
} from "lucide-react"

export default function EmployeePerformance() {
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [sortBy, setSortBy] = useState("performance")

  const employees = [
    {
      id: 1,
      name: "Alex Meian",
      email: "alex.meian@alphasystems.com",
      avatar: "/images/pp.jpg",
      role: "Frontend Developer",
      department: "Development",
      performanceScore: 95,
      lastReview: "2024-01-15",
      nextReview: "2024-04-15",
      tasksCompleted: 24,
      tasksAssigned: 26,
      projectsActive: 3,
      attendanceRate: 98,
      skills: ["React", "TypeScript", "UI/UX"],
      goals: [
        { title: "Master Next.js", progress: 80, target: "Q1 2024" },
        { title: "Lead a project", progress: 60, target: "Q2 2024" }
      ],
      achievements: [
        "Completed React certification",
        "Mentored 2 junior developers",
        "Improved app performance by 40%"
      ],
      performanceTrend: "up"
    },
    {
      id: 2,
      name: "Maria Garcia",
      email: "maria.garcia@alphasystems.com",
      avatar: "/images/pp.jpg",
      role: "Backend Developer",
      department: "Development",
      performanceScore: 88,
      lastReview: "2024-01-10",
      nextReview: "2024-04-10",
      tasksCompleted: 22,
      tasksAssigned: 25,
      projectsActive: 2,
      attendanceRate: 96,
      skills: ["Node.js", "Python", "Database"],
      goals: [
        { title: "API optimization", progress: 90, target: "Q1 2024" },
        { title: "Learn microservices", progress: 45, target: "Q2 2024" }
      ],
      achievements: [
        "Optimized database queries",
        "Reduced API response time by 30%",
        "Built 5 new endpoints"
      ],
      performanceTrend: "up"
    },
    {
      id: 3,
      name: "John Smith",
      email: "john.smith@alphasystems.com",
      avatar: "/images/pp.jpg",
      role: "UI/UX Designer",
      department: "Design",
      performanceScore: 92,
      lastReview: "2024-01-20",
      nextReview: "2024-04-20",
      tasksCompleted: 18,
      tasksAssigned: 20,
      projectsActive: 4,
      attendanceRate: 94,
      skills: ["Figma", "User Research", "Prototyping"],
      goals: [
        { title: "Design system creation", progress: 70, target: "Q1 2024" },
        { title: "User testing certification", progress: 30, target: "Q3 2024" }
      ],
      achievements: [
        "Created new design system",
        "Improved user satisfaction by 25%",
        "Designed 3 successful products"
      ],
      performanceTrend: "stable"
    },
    {
      id: 4,
      name: "Emily Chen",
      email: "emily.chen@alphasystems.com",
      avatar: "/images/pp.jpg",
      role: "Project Coordinator",
      department: "Management",
      performanceScore: 87,
      lastReview: "2024-01-05",
      nextReview: "2024-04-05",
      tasksCompleted: 16,
      tasksAssigned: 18,
      projectsActive: 5,
      attendanceRate: 99,
      skills: ["Project Management", "Agile", "Communication"],
      goals: [
        { title: "PMP certification", progress: 85, target: "Q2 2024" },
        { title: "Team leadership skills", progress: 55, target: "Q3 2024" }
      ],
      achievements: [
        "Delivered 3 projects on time",
        "Improved team communication",
        "Reduced project delays by 50%"
      ],
      performanceTrend: "up"
    },
    {
      id: 5,
      name: "Robert Kim",
      email: "robert.kim@alphasystems.com",
      avatar: "/images/pp.jpg",
      role: "Database Administrator",
      department: "Development",
      performanceScore: 82,
      lastReview: "2024-01-12",
      nextReview: "2024-04-12",
      tasksCompleted: 14,
      tasksAssigned: 17,
      projectsActive: 2,
      attendanceRate: 92,
      skills: ["PostgreSQL", "MongoDB", "Data Analysis"],
      goals: [
        { title: "Cloud migration", progress: 40, target: "Q2 2024" },
        { title: "Security certification", progress: 25, target: "Q4 2024" }
      ],
      achievements: [
        "Migrated 2 databases",
        "Implemented backup system",
        "Improved query performance"
      ],
      performanceTrend: "down"
    },
    {
      id: 6,
      name: "David Wilson",
      email: "david.wilson@alphasystems.com",
      avatar: "/images/pp.jpg",
      role: "Mobile Developer",
      department: "Development",
      performanceScore: 90,
      lastReview: "2024-01-18",
      nextReview: "2024-04-18",
      tasksCompleted: 20,
      tasksAssigned: 22,
      projectsActive: 2,
      attendanceRate: 97,
      skills: ["React Native", "iOS", "Android"],
      goals: [
        { title: "Flutter expertise", progress: 60, target: "Q2 2024" },
        { title: "App store optimization", progress: 80, target: "Q1 2024" }
      ],
      achievements: [
        "Published 2 apps",
        "Achieved 4.5+ app ratings",
        "Reduced app crashes by 60%"
      ],
      performanceTrend: "up"
    }
  ]

  const departments = ["all", "Development", "Design", "Management"]

  const getPerformanceColor = (score) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-yellow-600"
    return "text-red-600"
  }

  const getPerformanceRating = (score) => {
    if (score >= 90) return "Excellent"
    if (score >= 80) return "Good"
    if (score >= 70) return "Average"
    return "Needs Improvement"
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "stable":
        return <Minus className="h-4 w-4 text-gray-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredEmployees = employees.filter(employee => {
    return filterDepartment === "all" || employee.department === filterDepartment
  })

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    switch (sortBy) {
      case "performance":
        return b.performanceScore - a.performanceScore
      case "name":
        return a.name.localeCompare(b.name)
      case "department":
        return a.department.localeCompare(b.department)
      default:
        return 0
    }
  })

  const averagePerformance = employees.reduce((sum, emp) => sum + emp.performanceScore, 0) / employees.length
  const highPerformers = employees.filter(emp => emp.performanceScore >= 90).length
  const needsAttention = employees.filter(emp => emp.performanceScore < 80).length

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0d4f29]">Employee Performance</h2>
          <p className="text-gray-600">Track and manage team performance metrics</p>
        </div>
        <Button className="bg-[#0d4f29] hover:bg-[#0d4f29]/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Review
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-[#0d4f29]">{employees.length}</p>
            </div>
            <Users className="h-8 w-8 text-[#106934]" />
          </div>
        </Card>
        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Performance</p>
              <p className="text-2xl font-bold text-[#0d4f29]">{Math.round(averagePerformance)}%</p>
            </div>
            <Target className="h-8 w-8 text-[#106934]" />
          </div>
        </Card>
        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Performers</p>
              <p className="text-2xl font-bold text-green-600">{highPerformers}</p>
            </div>
            <Award className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Needs Attention</p>
              <p className="text-2xl font-bold text-red-600">{needsAttention}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Filters and Sort */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Department:</span>
          </div>
          <div className="flex gap-2">
            {departments.map((dept) => (
              <Button
                key={dept}
                variant={filterDepartment === dept ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterDepartment(dept)}
                className={filterDepartment === dept 
                  ? "bg-[#0d4f29] hover:bg-[#0d4f29]/90 text-white" 
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }
              >
                {dept.charAt(0).toUpperCase() + dept.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#106934] focus:border-transparent"
          >
            <option value="performance">Performance</option>
            <option value="name">Name</option>
            <option value="department">Department</option>
          </select>
        </div>
      </div>

      {/* Employee Performance List */}
      <div className="space-y-4">
        {sortedEmployees.map((employee) => (
          <Card key={employee.id} className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-6">
              {/* Employee Info */}
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={employee.avatar} alt={employee.name} />
                  <AvatarFallback className="bg-[#0d4f29] text-white">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-[#0d4f29]">{employee.name}</h3>
                  <p className="text-sm text-gray-600">{employee.role}</p>
                  <p className="text-xs text-gray-500">{employee.department}</p>
                </div>
              </div>

              {/* Performance Score */}
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className={`text-2xl font-bold ${getPerformanceColor(employee.performanceScore)}`}>
                    {employee.performanceScore}%
                  </p>
                  <p className="text-xs text-gray-500">{getPerformanceRating(employee.performanceScore)}</p>
                </div>
                {getTrendIcon(employee.performanceTrend)}
              </div>

              {/* Key Metrics */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Tasks</p>
                  <p className="font-medium text-[#0d4f29]">
                    {employee.tasksCompleted}/{employee.tasksAssigned}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-[#106934] h-2 rounded-full" 
                      style={{ width: `${(employee.tasksCompleted / employee.tasksAssigned) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Projects</p>
                  <p className="font-medium text-[#0d4f29]">{employee.projectsActive}</p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
                <div>
                  <p className="text-gray-600">Attendance</p>
                  <p className="font-medium text-[#0d4f29]">{employee.attendanceRate}%</p>
                  <p className="text-xs text-gray-500">This month</p>
                </div>
                <div>
                  <p className="text-gray-600">Next Review</p>
                  <p className="font-medium text-[#0d4f29]">{employee.nextReview}</p>
                  <p className="text-xs text-gray-500">Scheduled</p>
                </div>
              </div>

              {/* Actions */}
              <Button variant="ghost" size="sm" className="text-gray-500">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Goals Progress */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700 mb-3">Current Goals</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {employee.goals.map((goal, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{goal.title}</p>
                      <p className="text-xs text-gray-500">Target: {goal.target}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-[#106934] h-2 rounded-full" 
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-[#0d4f29] w-10">{goal.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills and Achievements */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Key Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {employee.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Recent Achievements</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {employee.achievements.slice(0, 2).map((achievement, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {sortedEmployees.length === 0 && (
        <Card className="p-12 text-center border border-gray-200">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
          <p className="text-gray-600 mb-4">
            No employees match the current filter criteria.
          </p>
        </Card>
      )}
    </div>
  )
} 