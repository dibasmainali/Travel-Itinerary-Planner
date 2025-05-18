"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Clock, MapPin, Save, X, DollarSign, Tag, Flag, Clock3, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"

export default function AddActivityForm({ onAdd, onCancel }) {
  const [activity, setActivity] = useState({
    title: "",
    time: "",
    location: "",
    notes: "",
    category: "Other",
    priority: "medium",
    cost: "",
    duration: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setActivity((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setActivity((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!activity.title.trim()) return
    onAdd(activity)
  }

  const quickAddActivity = (template) => {
    onAdd({
      ...activity,
      ...template,
    })
  }

  return (
    <Card className="border rounded-md bg-white dark:bg-gray-800 shadow-md overflow-hidden w-full">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 py-4 px-6">
        <CardTitle className="text-xl font-medium text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Add New Activity
        </CardTitle>
      </CardHeader>
      <Tabs defaultValue="custom" className="w-full">
        <TabsList className="w-full grid grid-cols-2 rounded-none">
          <TabsTrigger value="custom" className="rounded-none py-2">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Custom Activity</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="quick" className="rounded-none py-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Quick Templates</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="custom">
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <div>
              <label className="text-sm font-medium mb-1 block">Activity Title</label>
              <Input
                name="title"
                value={activity.title}
                onChange={handleChange}
                placeholder="Enter activity title"
                className="font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium mb-1 block">Start Time</label>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    <Input name="time" value={activity.time} onChange={handleChange} placeholder="e.g. 09:00" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium mb-1 block">Duration (minutes)</label>
                  <div className="flex items-center">
                    <Clock3 className="h-4 w-4 mr-2 text-blue-500" />
                    <Input
                      name="duration"
                      type="number"
                      value={activity.duration}
                      onChange={handleChange}
                      placeholder="e.g. 60"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium mb-1 block">Location</label>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                    <Input
                      name="location"
                      value={activity.location}
                      onChange={handleChange}
                      placeholder="Enter location"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium mb-1 block">Cost</label>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                    <Input name="cost" type="number" value={activity.cost} onChange={handleChange} placeholder="0.00" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium mb-1 block">Priority</label>
                  <div className="flex items-center">
                    <Flag className="h-4 w-4 mr-2 text-red-500" />
                    <Select value={activity.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium mb-1 block">Category</label>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-purple-500" />
                    <Select value={activity.category} onValueChange={(value) => handleSelectChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Sightseeing">Sightseeing</SelectItem>
                        <SelectItem value="Adventure">Adventure</SelectItem>
                        <SelectItem value="Transportation">Transportation</SelectItem>
                        <SelectItem value="Accommodation">Accommodation</SelectItem>
                        <SelectItem value="Shopping">Shopping</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium mb-1 block">Notes</label>
              <Textarea
                name="notes"
                value={activity.notes}
                onChange={handleChange}
                placeholder="Add notes here"
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              <Button type="button" variant="outline" onClick={onCancel} size="lg">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="quick">
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
            {quickTemplates.map((template) => (
              <QuickAddButton
                key={template.title}
                title={template.title}
                icon={template.icon}
                duration={template.duration}
                cost={template.cost}
                onClick={() => quickAddActivity(template)}
              />
            ))}

            <div className="col-span-2 md:col-span-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <Button variant="outline" size="lg" onClick={onCancel} className="w-full">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

function QuickAddButton({ title, icon, duration, cost, onClick }) {
  return (
    <Button
      variant="outline"
      className="h-auto py-4 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-gray-200 dark:border-gray-700 transition-all"
      onClick={onClick}
    >
      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">{icon}</div>
      <span className="text-sm font-medium">{title}</span>
      <div className="flex gap-1 justify-center text-xs text-gray-500">
        {duration}min {cost > 0 && `• $${cost}`}
      </div>
    </Button>
  )
}

// Quick add templates
const quickTemplates = [
  {
    title: "Breakfast",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-orange-500"
      >
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
        <line x1="6" y1="1" x2="6" y2="4"></line>
        <line x1="10" y1="1" x2="10" y2="4"></line>
        <line x1="14" y1="1" x2="14" y2="4"></line>
      </svg>
    ),
    time: "08:00",
    duration: 60,
    category: "Food",
    cost: 15,
    priority: "medium",
  },
  {
    title: "Lunch",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-orange-500"
      >
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
        <path d="M7 2v20"></path>
        <path d="M21 15V2"></path>
        <path d="M18 15V2"></path>
        <path d="M21 15a3 3 0 1 1-6 0"></path>
      </svg>
    ),
    time: "13:00",
    duration: 90,
    category: "Food",
    cost: 25,
    priority: "medium",
  },
  {
    title: "Dinner",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-orange-500"
      >
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
        <path d="M7 2v20"></path>
        <path d="M21 15V2"></path>
        <path d="M18 15V2"></path>
        <path d="M21 15a3 3 0 1 1-6 0"></path>
      </svg>
    ),
    time: "19:00",
    duration: 120,
    category: "Food",
    cost: 40,
    priority: "medium",
  },
  {
    title: "Museum",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-500"
      >
        <path d="M2 20h20"></path>
        <path d="M12 2L2 8l10 6 10-6-10-6Z"></path>
        <path d="M6 12v8"></path>
        <path d="M12 12v8"></path>
        <path d="M18 12v8"></path>
      </svg>
    ),
    time: "10:00",
    duration: 180,
    category: "Sightseeing",
    cost: 20,
    priority: "medium",
  },
  {
    title: "Tour",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-500"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
      </svg>
    ),
    time: "14:00",
    duration: 120,
    category: "Sightseeing",
    cost: 30,
    priority: "high",
  },
  {
    title: "Hiking",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-green-500"
      >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
        <path d="M5 3v4"></path>
        <path d="M19 17v4"></path>
        <path d="M3 5h4"></path>
        <path d="M17 19h4"></path>
      </svg>
    ),
    time: "09:00",
    duration: 180,
    category: "Adventure",
    cost: 0,
    priority: "high",
  },
]
