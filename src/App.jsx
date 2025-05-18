"use client"

import { useState, useEffect, useRef } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import DayColumn from "./components/DayColumn"
import Header from "./components/header"
import { PlusCircle } from "lucide-react"
import { Button } from "./components/ui/button"
import { useToast } from "./hooks/use-toast"
import ExportModal from "./components/ExportModal"
import TripSummary from "./components/TripSummary"
import DatePicker from "./components/DatePicker"
import EmptyState from "./components/EmptyState"
import MapView from "./components/MapView"
import { Toaster } from "./components/ui/toaster"
import AddActivityModal from "./components/AddActivityModal"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../src/components/ui/dialog"

export default function ItineraryPlanner() {
  const { toast } = useToast()
  const [days, setDays] = useState([])
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [weatherData, setWeatherData] = useState({})
  const [selectedDay, setSelectedDay] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [addActivityInfo, setAddActivityInfo] = useState(null)
  const [isAddingActivityLoading, setIsAddingActivityLoading] = useState(false)
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false)

  // Use a ref to track if we're in the middle of a state update
  const isUpdatingRef = useRef(false)
  // Use a ref to store the original order of days
  const originalDaysRef = useRef([])

  // Load data from localStorage on initial render
  useEffect(() => {
    setIsLoading(true)
    const savedItinerary = localStorage.getItem("itinerary")
    if (savedItinerary) {
      try {
        const parsedData = JSON.parse(savedItinerary)
        // Store the original order
        originalDaysRef.current = parsedData.days || []
        // Set the days state
        setDays(parsedData.days || [])
        setStartDate(parsedData.startDate ? new Date(parsedData.startDate) : null)
        setWeatherData(parsedData.weatherData || {})
      } catch (error) {
        console.error("Failed to parse saved itinerary", error)
        initializeDefaultData()
      }
    } else {
      initializeDefaultData()
    }
    // Simulate loading time
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  // Save to localStorage whenever days change
  useEffect(() => {
    if (days.length > 0 || startDate) {
      // Only save to localStorage if we're not in the middle of a state update
      if (!isUpdatingRef.current) {
        // Use a timeout to ensure we're not in the middle of a React render cycle
        const saveTimeout = setTimeout(() => {
          localStorage.setItem(
            "itinerary",
            JSON.stringify({
              days: JSON.parse(JSON.stringify(days)), // Deep clone to avoid reference issues
              startDate: startDate ? startDate.toISOString() : null,
              weatherData,
            }),
          )
          console.log(
            "Saved to localStorage:",
            days.map((d) => d.title),
          )
        }, 0)

        return () => clearTimeout(saveTimeout)
      }
    }
  }, [days, startDate, weatherData])

  const initializeDefaultData = () => {
    const initialData = [
      {
        id: "day-1",
        title: "Day 1",
        activities: [
          {
            id: "activity-1",
            title: "Breakfast at hotel",
            time: "08:00",
            location: "Hotel restaurant",
            notes: "Continental breakfast included with stay",
            category: "Food",
            priority: "medium",
            cost: 0,
            duration: 60,
          },
          {
            id: "activity-2",
            title: "Visit museum",
            time: "10:00",
            location: "National Museum",
            notes: "Tickets already purchased online",
            category: "Sightseeing",
            priority: "high",
            cost: 25,
            duration: 180,
          },
        ],
      },
      {
        id: "day-2",
        title: "Day 2",
        activities: [
          {
            id: "activity-3",
            title: "Hiking tour",
            time: "09:00",
            location: "Mountain trail",
            notes: "Wear comfortable shoes and bring water",
            category: "Adventure",
            priority: "high",
            cost: 45,
            duration: 240,
          },
        ],
      },
    ]

    // Store the original order
    originalDaysRef.current = [...initialData]
    setDays(initialData)

    // Set default start date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setStartDate(tomorrow)

    // Generate simulated weather data
    generateSimulatedWeather(initialData.length, tomorrow)
  }

  const generateSimulatedWeather = (numDays, startDate) => {
    if (!startDate) return

    const weatherConditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Thunderstorm"]
    const newWeatherData = {}

    for (let i = 0; i < numDays; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(currentDate.getDate() + i)
      const dateString = currentDate.toISOString().split("T")[0]

      newWeatherData[dateString] = {
        condition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
        temperature: Math.floor(Math.random() * 25) + 10, // 10-35°C
        precipitation: Math.floor(Math.random() * 100), // 0-100%
      }
    }

    setWeatherData(newWeatherData)
  }

  const handleDragStart = (result) => {
    // When dragging starts, ensure the dragged item gets the highest z-index
    if (result.type === "day") {
      // For day dragging, we don't need additional handling as it's managed in the component
      return
    }

    // For activity dragging, we could add specific handling here if needed
  }

  const handleDragEnd = (result) => {
    const { source, destination, type } = result

    // Dropped outside the list
    if (!destination) return

    // Handle day reordering
    if (type === "day") {
      // Create a new array without modifying the original
      const reorderedDays = [...days]
      const [movedDay] = reorderedDays.splice(source.index, 1)
      reorderedDays.splice(destination.index, 0, movedDay)

      // Only update titles if explicitly requested
      // For now, preserve the original titles
      const updatedDays = reorderedDays.map((day, index) => ({
        ...day,
        // Keep the original title instead of renumbering
        // title: `Day ${index + 1}`,
      }))

      // Set the flag to indicate we're updating the state
      isUpdatingRef.current = true
      setDays(updatedDays)
      // Update the original order reference
      originalDaysRef.current = [...updatedDays]
      // Reset the flag after a short delay to ensure state is updated
      setTimeout(() => {
        isUpdatingRef.current = false
      }, 0)

      toast({
        title: "Days reordered",
        description: "Your itinerary days have been rearranged",
      })
      return
    }

    // Moving activities within the same day
    if (source.droppableId === destination.droppableId) {
      const dayIndex = days.findIndex((day) => day.id === source.droppableId)
      if (dayIndex === -1) return

      // Create a new activities array
      const newActivities = [...days[dayIndex].activities]
      const [movedActivity] = newActivities.splice(source.index, 1)
      newActivities.splice(destination.index, 0, movedActivity)

      // Create a new days array by making a deep copy
      const newDays = days.map((day, idx) => {
        if (idx === dayIndex) {
          return {
            ...day,
            activities: newActivities,
          }
        }
        return { ...day }
      })

      // Set the flag to indicate we're updating the state
      isUpdatingRef.current = true
      setDays(newDays)
      // Reset the flag after a short delay
      setTimeout(() => {
        isUpdatingRef.current = false
      }, 0)
    } else {
      // Moving from one day to another
      const sourceDayIndex = days.findIndex((day) => day.id === source.droppableId)
      const destDayIndex = days.findIndex((day) => day.id === destination.droppableId)

      if (sourceDayIndex === -1 || destDayIndex === -1) return

      // Create new activity arrays
      const sourceActivities = [...days[sourceDayIndex].activities]
      const destActivities = [...days[destDayIndex].activities]

      const [movedActivity] = sourceActivities.splice(source.index, 1)
      destActivities.splice(destination.index, 0, movedActivity)

      // Create a new days array with updated activities
      const newDays = days.map((day, idx) => {
        if (idx === sourceDayIndex) {
          return {
            ...day,
            activities: sourceActivities,
          }
        }
        if (idx === destDayIndex) {
          return {
            ...day,
            activities: destActivities,
          }
        }
        return { ...day }
      })

      // Set the flag to indicate we're updating the state
      isUpdatingRef.current = true
      setDays(newDays)
      // Reset the flag after a short delay
      setTimeout(() => {
        isUpdatingRef.current = false
      }, 0)

      toast({
        title: "Activity moved",
        description: `Moved "${movedActivity.title}" to ${days[destDayIndex].title}`,
      })
    }
  }

  const addNewDay = () => {
    const newDayNumber = days.length + 1
    const newDay = {
      id: `day-${Date.now()}`,
      title: `Day ${newDayNumber}`,
      activities: [],
    }

    // Set the flag to indicate we're updating the state
    isUpdatingRef.current = true
    const updatedDays = [...days, newDay]
    setDays(updatedDays)
    // Update the original order reference
    originalDaysRef.current = [...updatedDays]
    // Reset the flag
    isUpdatingRef.current = false

    // Generate weather for the new day if we have a start date
    if (startDate) {
      const newDayDate = new Date(startDate)
      newDayDate.setDate(newDayDate.getDate() + newDayNumber - 1)
      const dateString = newDayDate.toISOString().split("T")[0]

      if (!weatherData[dateString]) {
        const weatherConditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Thunderstorm"]
        setWeatherData((prev) => ({
          ...prev,
          [dateString]: {
            condition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
            temperature: Math.floor(Math.random() * 25) + 10,
            precipitation: Math.floor(Math.random() * 100),
          },
        }))
      }
    }

    toast({
      title: "Day added",
      description: `Day ${newDayNumber} has been added to your itinerary`,
    })
  }

  const removeDay = (dayId) => {
    const dayToRemove = days.find((day) => day.id === dayId)
    const updatedDays = days.filter((day) => day.id !== dayId)

    // Renumber the days
    const renamedDays = updatedDays.map((day, index) => ({
      ...day,
      title: `Day ${index + 1}`,
    }))

    // Set the flag to indicate we're updating the state
    isUpdatingRef.current = true
    setDays(renamedDays)
    // Update the original order reference
    originalDaysRef.current = [...renamedDays]
    // Reset the flag
    isUpdatingRef.current = false

    toast({
      title: "Day removed",
      description: `${dayToRemove?.title || "Day"} has been removed from your itinerary`,
    })
  }

  const updateDayTitle = (dayId, newTitle) => {
    const dayIndex = days.findIndex((day) => day.id === dayId)
    if (dayIndex === -1) return

    const newDays = [...days]
    newDays[dayIndex] = {
      ...days[dayIndex],
      title: newTitle,
    }

    // Set the flag to indicate we're updating the state
    isUpdatingRef.current = true
    setDays(newDays)
    // Update the original order reference
    originalDaysRef.current = [...newDays]
    // Reset the flag
    isUpdatingRef.current = false
  }

  const openAddActivityModal = (dayId) => {
    const day = days.find((d) => d.id === dayId)
    setAddActivityInfo({
      dayId,
      dayTitle: day?.title || "",
    })
  }

  const closeAddActivityModal = () => {
    setAddActivityInfo(null)
  }

  const addActivity = (dayId, activity) => {
    setIsAddingActivityLoading(true)

    try {
      const dayIndex = days.findIndex((day) => day.id === dayId)
      if (dayIndex === -1) throw new Error("Day not found")

      const newActivity = {
        id: `activity-${Date.now()}`,
        title: activity.title || "New Activity",
        time: activity.time || "",
        location: activity.location || "",
        notes: activity.notes || "",
        category: activity.category || "Other",
        priority: activity.priority || "medium",
        cost: activity.cost || 0,
        duration: activity.duration || 60,
      }

      // Create a new days array by making a shallow copy first
      const newDays = [...days]

      // Update the specific day with the new activity
      newDays[dayIndex] = {
        ...newDays[dayIndex],
        activities: [...newDays[dayIndex].activities, newActivity],
      }

      // Set the flag to indicate we're updating the state
      isUpdatingRef.current = true
      // Set the days state with the new array
      setDays(newDays)
      // Reset the flag
      isUpdatingRef.current = false

      toast({
        title: "Activity added",
        description: `${newActivity.title} has been added to ${days[dayIndex].title}`,
      })
    } catch (error) {
      console.error("Error adding activity:", error)
      toast({
        title: "Error adding activity",
        description: error.message || "Something went wrong",
      })
    } finally {
      setIsAddingActivityLoading(false)
      closeAddActivityModal()
    }
  }

  const updateActivity = (dayId, activityId, updatedActivity) => {
    const dayIndex = days.findIndex((day) => day.id === dayId)
    if (dayIndex === -1) return

    const activityIndex = days[dayIndex].activities.findIndex((activity) => activity.id === activityId)
    if (activityIndex === -1) return

    // Create a new days array, preserving the original order
    const newDays = [...days]

    // Update the specific activity
    newDays[dayIndex] = {
      ...newDays[dayIndex],
      activities: newDays[dayIndex].activities.map((activity, idx) =>
        idx === activityIndex ? { ...activity, ...updatedActivity } : activity,
      ),
    }

    // Set the flag to indicate we're updating the state
    isUpdatingRef.current = true
    setDays(newDays)
    // Reset the flag
    isUpdatingRef.current = false
  }

  const deleteActivity = (dayId, activityId) => {
    try {
      const dayIndex = days.findIndex((day) => day.id === dayId)
      if (dayIndex === -1) return

      const activityToDelete = days[dayIndex].activities.find((activity) => activity.id === activityId)
      if (!activityToDelete) return

      // Create a new days array, preserving the original order
      const newDays = [...days] // Create a shallow copy first

      // Update the specific day with filtered activities
      newDays[dayIndex] = {
        ...newDays[dayIndex],
        activities: newDays[dayIndex].activities.filter((activity) => activity.id !== activityId),
      }

      // Set the flag to indicate we're updating the state
      isUpdatingRef.current = true
      setDays(newDays)
      // Reset the flag
      isUpdatingRef.current = false

      toast({
        title: "Activity deleted",
        description: `${activityToDelete?.title || "Activity"} has been removed`,
      })
    } catch (error) {
      console.error("Error deleting activity:", error)
      toast({
        title: "Error",
        description: "Failed to delete activity. Please try again.",
      })
    }
  }

  const handleSetStartDate = (date) => {
    setStartDate(date)
    setIsDatePickerOpen(false)

    // Generate weather data for all days
    generateSimulatedWeather(days.length, date)

    toast({
      title: "Trip dates updated",
      description: `Your trip will start on ${date.toLocaleDateString()}`,
    })
  }

  const getDayDate = (dayIndex) => {
    if (!startDate) return null

    const date = new Date(startDate)
    date.setDate(date.getDate() + dayIndex)
    return date
  }

  const getDayWeather = (dayIndex) => {
    if (!startDate) return null

    const date = getDayDate(dayIndex)
    if (!date) return null

    const dateString = date.toISOString().split("T")[0]
    return weatherData[dateString] || null
  }

  const handleShowMap = (day) => {
    setSelectedDay(day)
  }

  const handleAddLocation = (dayId, locationData) => {
    if (!dayId || !locationData) return

    const { name, coordinates, address } = locationData

    const newActivity = {
      id: `activity-${Date.now()}`,
      title: name || "New Location",
      location: address || "",
      coordinates: coordinates,
      time: "",
      notes: "",
      category: "Sightseeing",
      priority: "medium",
      cost: 0,
      duration: 60,
    }

    const dayIndex = days.findIndex((day) => day.id === dayId)
    if (dayIndex === -1) return

    // Create a new days array, preserving the original order
    const newDays = [...days]

    // Update the specific day
    newDays[dayIndex] = {
      ...newDays[dayIndex],
      activities: [...newDays[dayIndex].activities, newActivity],
    }

    // Set the flag to indicate we're updating the state
    isUpdatingRef.current = true
    setDays(newDays)
    // Reset the flag
    isUpdatingRef.current = false

    toast({
      title: "Location added",
      description: `${name} has been added to ${days[dayIndex].title}`,
    })
  }

  useEffect(() => {
    const handleKeyboardShortcuts = (e) => {
      // Show keyboard shortcuts help when pressing ?
      if (e.key === "?") {
        e.preventDefault()
        setIsKeyboardShortcutsOpen(true)
        return
      }

      // Only handle other shortcuts when no modals are open
      if (isExportModalOpen || isSummaryOpen || isDatePickerOpen || addActivityInfo || isKeyboardShortcutsOpen) return

      // Ctrl/Cmd + N to add a new day
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault()
        addNewDay()
      }
    }

    window.addEventListener("keydown", handleKeyboardShortcuts)
    return () => window.removeEventListener("keydown", handleKeyboardShortcuts)
  }, [isExportModalOpen, isSummaryOpen, isDatePickerOpen, addActivityInfo, isKeyboardShortcutsOpen])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-blue-900 dark:to-gray-900">
        <div className="text-center">
          <div className="relative mb-4 mx-auto w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-700 opacity-25"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 dark:border-t-blue-400 animate-spin"></div>
          </div>
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200">Loading your itinerary...</h2>
        </div>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:bg-black">        <Header
          onExport={() => setIsExportModalOpen(true)}
          onShowSummary={() => setIsSummaryOpen(true)}
          onSetStartDate={() => setIsDatePickerOpen(true)}
          onShowKeyboardShortcuts={() => setIsKeyboardShortcutsOpen(true)}
          daysCount={days.length}
          activitiesCount={days.reduce((count, day) => count + day.activities.length, 0)}
          startDate={startDate}
        />

        <main className="container mx-auto py-4 px-2 sm:px-4">
          {days.length === 0 ? (
            <EmptyState onAddDay={addNewDay} />
          ) : (
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="w-full lg:w-2/3">
                <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                  <Droppable droppableId="days" type="day" direction="horizontal">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 droppable-container"
                      >
                        {days.map((day, index) => (
                          <DayColumn
                            key={day.id}
                            day={day}
                            index={index}
                            dayDate={getDayDate(index)}
                            weather={getDayWeather(index)}
                            onAddActivity={() => openAddActivityModal(day.id)}
                            onUpdateActivity={updateActivity}
                            onDeleteActivity={deleteActivity}
                            onRemoveDay={removeDay}
                            onUpdateTitle={updateDayTitle}
                            onShowMap={() => handleShowMap(day)}
                          />
                        ))}
                        {provided.placeholder}

                        <div className="flex items-start justify-center h-[380px]">
                          <Button
                            onClick={addNewDay}
                            variant="outline"
                            className="flex items-center gap-2 h-full w-full border-dashed border-2 bg-white/80 backdrop-blur-sm hover:bg-white dark:bg-gray-800/50 dark:hover:bg-gray-800/80 dark:border-gray-700 dark:text-gray-300 transition-all duration-200 hover:shadow-md"
                          >
                            <PlusCircle className="h-5 w-5" />
                            Add Day
                          </Button>
                        </div>
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>

              <div className="w-full lg:w-1/3 mt-3 lg:mt-0">
                <MapView days={days} selectedDay={selectedDay} onAddLocation={handleAddLocation} />
              </div>
            </div>
          )}
        </main>

        {/* Modals */}
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          itineraryData={days}
          startDate={startDate}
        />

        <TripSummary isOpen={isSummaryOpen} onClose={() => setIsSummaryOpen(false)} days={days} startDate={startDate} />

        <DatePicker
          isOpen={isDatePickerOpen}
          onClose={() => setIsDatePickerOpen(false)}
          onSelectDate={handleSetStartDate}
          currentDate={startDate}
        />

        <AddActivityModal
          isOpen={!!addActivityInfo}
          onClose={closeAddActivityModal}
          onAdd={(activity) => addActivity(addActivityInfo?.dayId, activity)}
          dayTitle={addActivityInfo?.dayTitle}
          isLoading={isAddingActivityLoading}
        />

        <Dialog open={isKeyboardShortcutsOpen} onOpenChange={setIsKeyboardShortcutsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Keyboard Shortcuts</DialogTitle>
              <DialogDescription>
                Use these keyboard shortcuts to navigate the application more efficiently.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Ctrl</kbd>
                  <span>+</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">N</kbd>
                </div>
                <div>Add a new day</div>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Esc</kbd>
                </div>
                <div>Close any open modal</div>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">?</kbd>
                </div>
                <div>Show this help dialog</div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsKeyboardShortcutsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Toaster />
      </div>
    </DndProvider>
  )
}
