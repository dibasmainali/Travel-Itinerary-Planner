import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { Calendar, DollarSign, Clock } from "lucide-react"

export default function TripSummary({ isOpen, onClose, days, startDate }) {
  // Calculate total cost
  const totalCost = days.reduce((total, day) => {
    return (
      total +
      day.activities.reduce((dayTotal, activity) => {
        return dayTotal + (Number.parseFloat(activity.cost) || 0)
      }, 0)
    )
  }, 0)

  // Calculate total duration in minutes
  const totalDuration = days.reduce((total, day) => {
    return (
      total +
      day.activities.reduce((dayTotal, activity) => {
        return dayTotal + (Number.parseInt(activity.duration) || 0)
      }, 0)
    )
  }, 0)

  // Format duration as hours and minutes
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Count activities by category
  const categoryCounts = {}
  days.forEach((day) => {
    day.activities.forEach((activity) => {
      const category = activity.category || "Other"
      categoryCounts[category] = (categoryCounts[category] || 0) + 1
    })
  })

  // Count activities by priority
  const priorityCounts = {
    high: 0,
    medium: 0,
    low: 0,
  }

  days.forEach((day) => {
    day.activities.forEach((activity) => {
      const priority = activity.priority || "medium"
      priorityCounts[priority] = (priorityCounts[priority] || 0) + 1
    })
  })

  // Calculate costs by day
  const costsByDay = days.map((day) => {
    const dayCost = day.activities.reduce((total, activity) => {
      return total + (Number.parseFloat(activity.cost) || 0)
    }, 0)
    return {
      title: day.title,
      cost: dayCost,
    }
  })

  // Format date range
  const getDateRange = () => {
    if (!startDate) return "No dates set"

    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + days.length - 1)

    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl dark:text-gray-100">Trip Summary</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            icon={<Calendar className="h-5 w-5 text-blue-500 dark:text-blue-400" />}
            title="Duration"
            value={`${days.length} days`}
            description={getDateRange()}
          />

          <StatCard
            icon={<DollarSign className="h-5 w-5 text-green-500 dark:text-green-400" />}
            title="Total Budget"
            value={`$${totalCost.toFixed(2)}`}
            description={`Avg $${(totalCost / days.length).toFixed(2)} per day`}
          />

          <StatCard
            icon={<Clock className="h-5 w-5 text-purple-500 dark:text-purple-400" />}
            title="Planned Time"
            value={formatDuration(totalDuration)}
            description={`${days.reduce((count, day) => count + day.activities.length, 0)} activities`}
          />
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="costs">Costs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-gray-100">Activities by Priority</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Distribution of activities by priority level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 dark:bg-red-600 mr-2"></div>
                        <span className="dark:text-gray-300">High Priority</span>
                      </div>
                      <span className="dark:text-gray-300">{priorityCounts.high}</span>
                    </div>
                    <Progress
                      value={
                        (priorityCounts.high / (priorityCounts.high + priorityCounts.medium + priorityCounts.low)) * 100
                      }
                      className="h-2 bg-gray-100 dark:bg-gray-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 dark:bg-yellow-600 mr-2"></div>
                        <span className="dark:text-gray-300">Medium Priority</span>
                      </div>
                      <span className="dark:text-gray-300">{priorityCounts.medium}</span>
                    </div>
                    <Progress
                      value={
                        (priorityCounts.medium / (priorityCounts.high + priorityCounts.medium + priorityCounts.low)) *
                        100
                      }
                      className="h-2 bg-gray-100 dark:bg-gray-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-600 mr-2"></div>
                        <span className="dark:text-gray-300">Low Priority</span>
                      </div>
                      <span className="dark:text-gray-300">{priorityCounts.low}</span>
                    </div>
                    <Progress
                      value={
                        (priorityCounts.low / (priorityCounts.high + priorityCounts.medium + priorityCounts.low)) * 100
                      }
                      className="h-2 bg-gray-100 dark:bg-gray-700"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-gray-100">Most Expensive Day</CardTitle>
                </CardHeader>
                <CardContent>
                  {costsByDay.length > 0 ? (
                    <div className="space-y-2">
                      <div className="text-2xl font-bold dark:text-gray-100">
                        {costsByDay.sort((a, b) => b.cost - a.cost)[0].title}
                      </div>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        ${costsByDay.sort((a, b) => b.cost - a.cost)[0].cost.toFixed(2)}
                      </div>
                    </div>
                  ) : (
                    <div className="dark:text-gray-300">No cost data available</div>
                  )}
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-gray-100">Busiest Day</CardTitle>
                </CardHeader>
                <CardContent>
                  {days.length > 0 ? (
                    <div className="space-y-2">
                      <div className="text-2xl font-bold dark:text-gray-100">
                        {days.sort((a, b) => b.activities.length - a.activities.length)[0].title}
                      </div>
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {days.sort((a, b) => b.activities.length - a.activities.length)[0].activities.length} activities
                      </div>
                    </div>
                  ) : (
                    <div className="dark:text-gray-300">No activity data available</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-gray-100">Activities by Category</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Distribution of activities across categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(categoryCounts).map(([category, count]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${getCategoryColor(category)}`}></div>
                          <span className="dark:text-gray-300">{category}</span>
                        </div>
                        <span className="dark:text-gray-300">{count}</span>
                      </div>
                      <Progress
                        value={(count / days.reduce((total, day) => total + day.activities.length, 0)) * 100}
                        className="h-2 bg-gray-100 dark:bg-gray-700"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="costs">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-gray-100">Costs by Day</CardTitle>
                <CardDescription className="dark:text-gray-300">Breakdown of expenses for each day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {costsByDay.map((day, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="dark:text-gray-300">{day.title}</span>
                        <span className="dark:text-gray-300">${day.cost.toFixed(2)}</span>
                      </div>
                      <Progress value={(day.cost / totalCost) * 100} className="h-2 bg-gray-100 dark:bg-gray-700" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function StatCard({ icon, title, value, description }) {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
        </div>
        <div className="text-2xl font-bold dark:text-gray-100">{value}</div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}

function getCategoryColor(category) {
  const colors = {
    Food: "bg-orange-500 dark:bg-orange-600",
    Sightseeing: "bg-blue-500 dark:bg-blue-600",
    Adventure: "bg-green-500 dark:bg-green-600",
    Transportation: "bg-purple-500 dark:bg-purple-600",
    Accommodation: "bg-red-500 dark:bg-red-600",
    Shopping: "bg-pink-500 dark:bg-pink-600",
    Entertainment: "bg-yellow-500 dark:bg-yellow-600",
    Other: "bg-gray-500 dark:bg-gray-600",
  }

  return colors[category] || "bg-gray-500 dark:bg-gray-600"
}
