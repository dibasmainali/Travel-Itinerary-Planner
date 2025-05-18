"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "./button"

export function Calendar({ className, mode = "single", selected, onSelect, ...props }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const handleSelect = (date) => {
    if (mode === "single") {
      onSelect(date)
    }
  }

  const isSelected = (date) => {
    if (!selected) return false

    if (mode === "single") {
      return date.toDateString() === selected.toDateString()
    }

    return false
  }

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      newMonth.setMonth(newMonth.getMonth() - 1)
      return newMonth
    })
  }

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      newMonth.setMonth(newMonth.getMonth() + 1)
      return newMonth
    })
  }

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i))
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousMonth}
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-medium dark:text-gray-200">
          {months[month]} {year}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextMonth}
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (!day) {
            return <div key={`empty-${i}`} className="h-8" />
          }

          const isToday = day.toDateString() === new Date().toDateString()

          return (
            <Button
              key={day.toISOString()}
              variant="ghost"
              className={cn(
                "h-8 w-8 p-0 font-normal dark:text-gray-300 dark:hover:bg-gray-700",
                isSelected(day) &&
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700",
                isToday && !isSelected(day) && "border border-primary dark:border-blue-500",
              )}
              onClick={() => handleSelect(day)}
            >
              {day.getDate()}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
