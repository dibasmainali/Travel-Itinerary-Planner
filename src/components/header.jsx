"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Calendar, Download, Moon, Sun, BarChart3, Clock } from "lucide-react"

export default function Header({
  onExport,
  onShowSummary,
  onSetStartDate,
  onShowKeyboardShortcuts,
  daysCount,
  activitiesCount,
  startDate,
}) {
  const [theme, setTheme] = useState("light")
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
    // Check for user preference
    const savedTheme = localStorage.getItem("theme") || "light"
    setTheme(savedTheme)
    document.documentElement.classList.toggle("dark", savedTheme === "dark")
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  return (
    <header className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 p-1.5 sm:p-2 rounded-lg">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 bg-clip-text text-transparent">
            Travel Itinerary Planner
          </h1>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>
              {daysCount} {daysCount === 1 ? "day" : "days"}
            </span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>
              {activitiesCount} {activitiesCount === 1 ? "activity" : "activities"}
            </span>
          </div>
          {startDate && (
            <>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Starting {startDate.toLocaleDateString()}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full h-7 w-7 sm:h-8 sm:w-8"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-yellow-300" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={onShowKeyboardShortcuts}
            className="rounded-full h-7 w-7 sm:h-8 sm:w-8"
            aria-label="Keyboard shortcuts"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 5h18v14H3z"></path>
              <path d="M6 9v.01"></path>
              <path d="M10 9v.01"></path>
              <path d="M14 9v.01"></path>
              <path d="M18 9v.01"></path>
              <path d="M6 13v.01"></path>
              <path d="M18 13v.01"></path>
              <path d="M10 13h4"></path>
              <path d="M6 17v.01"></path>
              <path d="M10 17v.01"></path>
              <path d="M14 17v.01"></path>
              <path d="M18 17v.01"></path>
            </svg>
          </Button>

          <Button
            variant="outline"
            onClick={onSetStartDate}
            size="sm"
            className="flex items-center gap-1 h-7 text-xs dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            aria-label={startDate ? "Change trip dates" : "Set trip dates"}
          >
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{startDate ? "Change Dates" : "Set Dates"}</span>
            <span className="sm:hidden">Dates</span>
          </Button>

          <Button
            variant="outline"
            onClick={onShowSummary}
            size="sm"
            className="flex items-center gap-1 h-7 text-xs dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            aria-label="View trip summary"
          >
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Summary</span>
          </Button>

          <Button
            onClick={onExport}
            size="sm"
            className="flex items-center gap-1 h-7 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600"
            aria-label="Export itinerary"
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
