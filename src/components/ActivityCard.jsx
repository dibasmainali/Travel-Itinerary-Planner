"use client"

import { useState } from "react"
import { Draggable } from "react-beautiful-dnd"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Clock, MapPin, Edit2, Trash2, Save, X, DollarSign, Tag, Flag, Clock3 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
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

export default function ActivityCard({ activity, index, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedActivity, setEditedActivity] = useState({ ...activity })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleSave = () => {
    onUpdate(editedActivity)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedActivity({ ...activity })
    setIsEditing(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedActivity((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setEditedActivity((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDelete = () => {
    try {
      onDelete()
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error in handleDelete:", error)
      // Close the dialog even if there's an error
      setIsDeleteDialogOpen(false)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
      case "low":
        return "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
      default:
        return "bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      Food: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-200 dark:border-orange-700/50",
      Sightseeing:
        "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-700/50",
      Adventure:
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-700/50",
      Transportation:
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700/50",
      Accommodation:
        "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700/50",
      Shopping:
        "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/40 dark:text-pink-200 dark:border-pink-700/50",
      Entertainment:
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-200 dark:border-yellow-700/50",
      Other: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
    }

    return colors[category] || colors["Other"]
  }

  return (
    <Draggable draggableId={activity.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-2 transition-all ${snapshot.isDragging ? "shadow-lg scale-[1.02] z-10" : "z-0"}`}
          style={{
            ...provided.draggableProps.style,
            position: snapshot.isDragging ? "relative" : provided.draggableProps.style?.position,
          }}
        >
          <Card
            className={`border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden transition-all duration-200 hover:shadow-md activity-card ${
              snapshot.isDragging ? "shadow-xl ring-2 ring-blue-200 dark:ring-blue-500 dragging" : ""
            } ${
              activity.priority === "high"
                ? "border-l-4 border-l-red-500 dark:border-l-red-600"
                : activity.priority === "low"
                  ? "border-l-4 border-l-blue-500 dark:border-l-blue-600"
                  : ""
            }`}
          >
            <CardContent className="p-2">
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    name="title"
                    value={editedActivity.title}
                    onChange={handleChange}
                    placeholder="Activity title"
                    className="font-medium text-sm dark:bg-gray-700 dark:border-gray-600"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Time
                      </label>
                      <Input
                        name="time"
                        value={editedActivity.time}
                        onChange={handleChange}
                        placeholder="e.g. 09:00"
                        className="text-xs h-7 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock3 className="h-3 w-3" />
                        Duration (min)
                      </label>
                      <Input
                        name="duration"
                        type="number"
                        value={editedActivity.duration || ""}
                        onChange={handleChange}
                        placeholder="e.g. 60"
                        className="text-xs h-7 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Location
                    </label>
                    <Input
                      name="location"
                      value={editedActivity.location}
                      onChange={handleChange}
                      placeholder="Location"
                      className="text-xs h-7 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Cost
                      </label>
                      <Input
                        name="cost"
                        type="number"
                        value={editedActivity.cost || ""}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="text-xs h-7 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Flag className="h-3 w-3" />
                        Priority
                      </label>
                      <Select
                        value={editedActivity.priority || "medium"}
                        onValueChange={(value) => handleSelectChange("priority", value)}
                      >
                        <SelectTrigger className="text-xs h-7 dark:bg-gray-700 dark:border-gray-600">
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

                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      Category
                    </label>
                    <Select
                      value={editedActivity.category || "Other"}
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger className="text-xs h-7 dark:bg-gray-700 dark:border-gray-600">
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

                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400">Notes</label>
                    <Textarea
                      name="notes"
                      value={editedActivity.notes}
                      onChange={handleChange}
                      placeholder="Notes"
                      className="min-h-[40px] text-xs dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  <div className="flex justify-end gap-1 pt-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancel}
                      className="h-7 px-2 text-xs dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      className="h-7 px-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-xs"
                    >
                      <Save className="h-3.5 w-3.5 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{activity.title}</h3>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        className="h-5 w-5 inline-flex items-center justify-center rounded-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsEditing(true)}
                        aria-label="Edit activity"
                        title="Edit activity"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        className="h-5 w-5 inline-flex items-center justify-center rounded-sm text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        aria-label="Delete activity"
                        title="Delete activity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {activity.category && (
                      <Badge variant="outline" className={getCategoryColor(activity.category)}>
                        {activity.category}
                      </Badge>
                    )}

                    {activity.priority && (
                      <Badge className={getPriorityColor(activity.priority)}>
                        {activity.priority.charAt(0).toUpperCase() + activity.priority.slice(1)}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1">
                    {activity.time && (
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                        <Clock className="h-3 w-3 mr-1.5 text-gray-400 dark:text-gray-500" />
                        <span>{activity.time}</span>
                        {activity.duration && (
                          <span className="ml-1 text-gray-400 dark:text-gray-500">
                            ({Math.floor(activity.duration / 60)}h{" "}
                            {activity.duration % 60 > 0 ? `${activity.duration % 60}m` : ""})
                          </span>
                        )}
                      </div>
                    )}

                    {activity.location && (
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                        <MapPin className="h-3 w-3 mr-1.5 text-gray-400 dark:text-gray-500" />
                        <span>{activity.location}</span>
                      </div>
                    )}

                    {activity.cost > 0 && (
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                        <DollarSign className="h-3 w-3 mr-1.5 text-gray-400 dark:text-gray-500" />
                        <span>${Number.parseFloat(activity.cost).toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {activity.notes && (
                    <div className="mt-1.5 pt-1.5 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delete Activity Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="dark:text-gray-100">Delete Activity</AlertDialogTitle>
                <AlertDialogDescription className="dark:text-gray-300">
                  Are you sure you want to delete "{activity.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </Draggable>
  )
}
