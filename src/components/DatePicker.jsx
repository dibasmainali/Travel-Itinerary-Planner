"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"

export default function DatePicker({ isOpen, onClose, onSelectDate, currentDate }) {
  const [selectedDate, setSelectedDate] = useState(currentDate || new Date())

  useEffect(() => {
    if (currentDate) {
      setSelectedDate(currentDate)
    }
  }, [currentDate, isOpen])

  const handleSave = () => {
    onSelectDate(selectedDate)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-100">Set Trip Start Date</DialogTitle>
        </DialogHeader>

        <div className="py-4 flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600"
          >
            Set Start Date
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
