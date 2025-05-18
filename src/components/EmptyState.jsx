"use client"

import { Button } from "./ui/button"
import { Calendar, PlusCircle, MapPin } from "lucide-react"

export default function EmptyState({ onAddDay }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/50 rounded-full blur-xl opacity-70"></div>
        <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 p-6 rounded-full">
          <Calendar className="h-16 w-16 text-white" />
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
        Start Planning Your Adventure
      </h2>

      <p className="text-gray-600 dark:text-gray-300 max-w-md mb-8 text-lg">
        Create your interactive travel itinerary by adding days and activities. Organize your perfect trip with our
        drag-and-drop planner.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <Button
          onClick={onAddDay}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Your First Day
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="border-blue-200 dark:border-blue-800 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <MapPin className="h-5 w-5 mr-2" />
          Browse Trip Templates
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full">
        <FeatureCard
          icon={<Calendar className="h-8 w-8 text-blue-500 dark:text-blue-400" />}
          title="Organize by Day"
          description="Plan each day of your trip with a clear, visual timeline"
        />
        <FeatureCard
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-500 dark:text-blue-400"
            >
              <path d="M14 4h-4a4 4 0 0 0-4 4v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8a4 4 0 0 0-4-4Z"></path>
              <path d="M10 2v2"></path>
              <path d="M14 2v2"></path>
              <path d="M10 10h4"></path>
              <path d="M10 14h4"></path>
            </svg>
          }
          title="Track Details"
          description="Add times, locations, costs, and notes to each activity"
        />
        <FeatureCard
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-500 dark:text-blue-400"
            >
              <path d="M12 2v4"></path>
              <path d="M12 18v4"></path>
              <path d="m4.93 4.93 2.83 2.83"></path>
              <path d="m16.24 16.24 2.83 2.83"></path>
              <path d="M2 12h4"></path>
              <path d="M18 12h4"></path>
              <path d="m4.93 19.07 2.83-2.83"></path>
              <path d="m16.24 7.76 2.83-2.83"></path>
            </svg>
          }
          title="Weather Insights"
          description="See forecasted weather for each day of your trip"
        />
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </div>
  )
}
