"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Clock, MapPin, Save, X, DollarSign, Tag, Flag, Clock3, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

export default function AddActivityModal({ isOpen, onClose, onAdd, dayTitle, isLoading = false }) {
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

  const [activeTab, setActiveTab] = useState("custom")
  const initialFocusRef = useRef(null)

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
    if (!activity.title.trim()) {
      // Focus the title input if empty
      if (initialFocusRef.current) initialFocusRef.current.focus()
      return
    }
    onAdd(activity)
    resetForm()
  }

  const quickAddActivity = (template) => {
    onAdd({
      ...activity,
      ...template,
    })
    resetForm()
  }

  const resetForm = () => {
    setActivity({
      title: "",
      time: "",
      location: "",
      notes: "",
      category: "Other",
      priority: "medium",
      cost: "",
      duration: "",
    })
    setActiveTab("custom")
  }

  useEffect(() => {
    if (isOpen && initialFocusRef.current) {
      initialFocusRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      window.addEventListener("keydown", handleEscape)
      return () => window.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50  flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200 ease-in-out "
      style={{ opacity: isOpen ? 1 : 0 }}
    >
      <div className="bg-white mx-20 dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-black/30 w-full h-auto max-w-md overflow-hidden animate-in fade-in-90 zoom-in-90 relative border dark:border-gray-700">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 py-4 px-6 flex justify-between items-center">
          <h2 className="text-xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Add New Activity
            {dayTitle && (
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 block">to {dayTitle}</span>
            )}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 rounded-none">
            <TabsTrigger value="custom" className="rounded-none py-2">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Custom</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="quick" className="rounded-none py-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Quick Add</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="custom">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block dark:text-gray-200">Activity Title</label>
                <Input
                  name="title"
                  value={activity.title}
                  onChange={handleChange}
                  placeholder="Enter activity title"
                  required
                  ref={initialFocusRef}
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block dark:text-gray-200">Start Time</label>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                    <Input
                      name="time"
                      value={activity.time}
                      onChange={handleChange}
                      placeholder="e.g. 09:00"
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block dark:text-gray-200">Duration (min)</label>
                  <div className="flex items-center">
                    <Clock3 className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                    <Input
                      name="duration"
                      type="number"
                      value={activity.duration}
                      onChange={handleChange}
                      placeholder="e.g. 60"
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block dark:text-gray-200">Location</label>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                  <Input
                    name="location"
                    value={activity.location}
                    onChange={handleChange}
                    placeholder="Enter location"
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block dark:text-gray-200">Cost</label>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
                    <Input
                      name="cost"
                      type="number"
                      value={activity.cost}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block dark:text-gray-200">Priority</label>
                  <div className="flex items-center">
                    <Flag className="h-4 w-4 mr-2 text-red-500 dark:text-red-400" />
                    <Select value={activity.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* <div>
                <label className="text-sm font-medium mb-1 block dark:text-gray-200">Category</label>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-purple-500 dark:text-purple-400" />
                  <Select value={activity.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
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
              </div> */}

              <div>
                <label className="text-sm font-medium mb-1 block dark:text-gray-200">Notes</label>
                <Textarea
                  name="notes"
                  value={activity.notes}
                  onChange={handleChange}
                  placeholder="Add notes here"
                  className="min-h-[80px] dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Add
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="quick">
            <div className="grid grid-cols-2 gap-3 p-6">
              {quickTemplates.map((template) => (
                <QuickAddButton
                  key={template.title}
                  title={template.title}
                  icon={template.icon}
                  duration={template.duration}
                  cost={template.cost}
                  onClick={() => quickAddActivity(template)}
                  disabled={isLoading}
                />
              ))}

              <div className="col-span-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function QuickAddButton({ title, icon, duration, cost, onClick, disabled }) {
  return (
    <Button
      variant="outline"
      className="h-auto py-3 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-gray-200 dark:border-gray-700 dark:bg-gray-800 transition-all"
      onClick={onClick}
      disabled={disabled}
    >
      <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">{icon}</div>
      <span className="text-sm font-medium dark:text-gray-200">{title}</span>
      <div className="flex gap-1 justify-center text-xs text-gray-500 dark:text-gray-400">
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
        className="text-orange-500 dark:text-orange-400"
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
        className="text-orange-500 dark:text-orange-400"
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
        className="text-orange-500 dark:text-orange-400"
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
        className="text-blue-500 dark:text-blue-400"
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
        className="text-blue-500 dark:text-blue-400"
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
        className="text-green-500 dark:text-green-400"
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
