"use client"

import { useState } from "react"
import { Droppable, Draggable } from "react-beautiful-dnd"
import ActivityCard from "./ActivityCard"
import { Button } from "./ui/button"
import { PlusCircle, Trash2, Edit2, Calendar, MapPin, GripVertical } from "lucide-react"
import WeatherWidget from "./WeatherWidget"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card"
import { Input } from "./ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"

export default function DayColumn({
  day,
  index,
  dayDate,
  weather,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onRemoveDay,
  onUpdateTitle,
  onShowMap,
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(day.title)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleTitleSave = () => {
    onUpdateTitle(day.id, title)
    setIsEditingTitle(false)
  }

  const handleDeleteDay = () => {
    onRemoveDay(day.id)
    setIsDeleteDialogOpen(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleTitleSave()
    } else if (e.key === "Escape") {
      setTitle(day.title)
      setIsEditingTitle(false)
    }
  }

  // Calculate day stats
  const totalCost = day.activities.reduce((total, activity) => total + (Number.parseFloat(activity.cost) || 0), 0)
  const totalDuration = day.activities.reduce((total, activity) => total + (Number.parseInt(activity.duration) || 0), 0)

  // Format duration as hours and minutes
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins > 0 ? `${mins}m` : ""}`
  }

  return (
    <Draggable draggableId={day.id} index={index} type="day">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`h-full ${snapshot.isDragging ? "z-[100]" : `z-[${50 - index}]`}`}
        >
          <Card
            className={`flex-shrink-0 w-full h-[380px] flex flex-col bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md dark:shadow-lg dark:shadow-black/20 border-t-4 border-t-blue-500 dark:border-t-blue-400 hover:shadow-lg transition-shadow duration-300 day-column ${
              snapshot.isDragging ? "shadow-xl ring-2 ring-blue-200 dark:ring-blue-500 dragging" : ""
            }`}
          >
            <CardHeader className="pb-2 space-y-0 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div
                    {...provided.dragHandleProps}
                    className="cursor-grab active:cursor-grabbing p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                    title="Drag to move this day"
                  >
                    <GripVertical className="h-4 w-4 text-gray-400" />
                  </div>

                  {isEditingTitle ? (
                    <div className="flex items-center gap-2 w-full">
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-8 text-lg font-medium dark:bg-gray-800 dark:border-gray-700"
                        autoFocus
                      />
                      <button
                        type="button"
                        className="h-8 px-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground dark:text-gray-200 dark:hover:bg-gray-700"
                        onClick={handleTitleSave}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        {day.title}
                      </CardTitle>
                      <button
                        type="button"
                        className="h-6 w-6 inline-flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsEditingTitle(true)}
                        aria-label="Edit day title"
                        title="Edit day title"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="h-8 w-8 inline-flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  aria-label="Delete day"
                  title="Delete day"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{dayDate ? dayDate.toLocaleDateString() : "No date set"}</span>
                </div>

                <WeatherWidget weather={weather} />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={onShowMap}
                className="w-full mt-1 text-xs h-7 flex items-center gap-1.5 bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                <MapPin className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                View on Map
              </Button>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto pb-1 px-3 scrollbar-thin">
              <Droppable droppableId={day.id} type="activity">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`min-h-[100px] transition-colors rounded-md ${
                      snapshot.isDraggingOver ? "bg-blue-50/80 dark:bg-blue-900/30" : ""
                    }`}
                  >
                    {day.activities.length === 0 && !snapshot.isDraggingOver && (
                      <div className="h-[100px] flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 text-sm italic border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-md">
                        <PlusCircle className="h-5 w-5 mb-2 opacity-50" />
                        <p>No activities yet</p>
                        <p className="text-xs mt-1">Click "Add Activity" to get started</p>
                      </div>
                    )}

                    {day.activities.map((activity, index) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        index={index}
                        onUpdate={(updatedActivity) => onUpdateActivity(day.id, activity.id, updatedActivity)}
                        onDelete={() => onDeleteActivity(day.id, activity.id)}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>

            <CardFooter className="pt-0 pb-2 px-3 mt-auto space-y-2 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/50 dark:to-indigo-950/50">
              {day.activities.length > 0 && (
                <div className="w-full flex justify-between text-sm text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700 pt-2 mb-1">
                  <div className="font-medium">
                    Total: <span className="text-green-600 dark:text-green-400">${totalCost.toFixed(2)}</span>
                  </div>
                  <div className="font-medium">
                    Duration: <span className="text-blue-600 dark:text-blue-400">{formatDuration(totalDuration)}</span>
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border-dashed h-9 text-sm bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all group"
                onClick={onAddActivity}
              >
                <PlusCircle className="h-4 w-4 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Add Activity
                </span>
              </Button>
            </CardFooter>

            {/* Delete Day Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
                <AlertDialogHeader>
                  <AlertDialogTitle className="dark:text-gray-100">Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription className="dark:text-gray-300">
                    This will remove {day.title} and all its activities from your itinerary.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteDay}
                    className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                  >
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Card>
        </div>
      )}
    </Draggable>
  )
}
