"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { MapPin, Search, Route, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export default function MapView({ days, selectedDay, onAddLocation }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedDayId, setSelectedDayId] = useState(selectedDay?.id || (days.length > 0 ? days[0].id : null))
  const [showRoute, setShowRoute] = useState(false)
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const routeLayerRef = useRef(null)

  // Initialize the map when the component mounts
  useEffect(() => {
    if (typeof window !== "undefined" && !mapInstanceRef.current) {
      // Simulating map initialization - in a real app, you'd use a library like Leaflet or Google Maps
      console.log("Map initialized")
      mapInstanceRef.current = {
        setView: (coords, zoom) => {
          console.log("Map centered at:", coords, "zoom:", zoom)
        },
        addMarker: (coords, options) => {
          console.log("Marker added at:", coords, "with options:", options)
          return { id: Math.random(), coords }
        },
        removeMarker: (marker) => {
          console.log("Marker removed:", marker)
        },
        drawRoute: (points) => {
          console.log("Route drawn between points:", points)
          return { id: Math.random(), points }
        },
        clearRoute: (route) => {
          console.log("Route cleared:", route)
        },
      }
    }
  }, [])

  // Update selected day when prop changes
  useEffect(() => {
    if (selectedDay) {
      setSelectedDayId(selectedDay.id)
    }
  }, [selectedDay])

  // Update markers when selected day changes
  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      mapInstanceRef.current.removeMarker(marker)
    })
    markersRef.current = []

    // Add new markers for the selected day
    const day = days.find((d) => d.id === selectedDayId)
    if (day) {
      day.activities
        .filter((activity) => activity.coordinates)
        .forEach((activity, index) => {
          const marker = mapInstanceRef.current.addMarker(activity.coordinates, {
            title: activity.title,
            icon: "pin",
            label: (index + 1).toString(),
          })
          markersRef.current.push(marker)
        })
    }

    // Update route if enabled
    if (showRoute) {
      updateRoute()
    }
  }, [selectedDayId, days, showRoute])

  const updateRoute = () => {
    if (!mapInstanceRef.current) return

    // Clear existing route
    if (routeLayerRef.current) {
      mapInstanceRef.current.clearRoute(routeLayerRef.current)
      routeLayerRef.current = null
    }

    // Draw new route if enabled
    if (showRoute) {
      const day = days.find((d) => d.id === selectedDayId)
      if (day) {
        const points = day.activities.filter((activity) => activity.coordinates).map((activity) => activity.coordinates)

        if (points.length >= 2) {
          routeLayerRef.current = mapInstanceRef.current.drawRoute(points)
        }
      }
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchResults([])

    // Simulate a search API call
    setTimeout(() => {
      // Mock search results
      const results = [
        {
          id: "place1",
          name: searchQuery + " Park",
          address: "123 Main St, City",
          coordinates: { lat: 40.7128, lng: -74.006 },
        },
        {
          id: "place2",
          name: searchQuery + " Museum",
          address: "456 Broadway, City",
          coordinates: { lat: 40.7228, lng: -73.996 },
        },
        {
          id: "place3",
          name: searchQuery + " Restaurant",
          address: "789 5th Ave, City",
          coordinates: { lat: 40.7328, lng: -74.016 },
        },
      ]

      setSearchResults(results)
      setIsSearching(false)
    }, 1000)
  }

  const handleSelectLocation = (location) => {
    setSelectedLocation(location)

    // Center map on selected location
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(location.coordinates, 15)
    }
  }

  const handleAddToDayClick = () => {
    if (selectedLocation && selectedDayId) {
      onAddLocation(selectedDayId, selectedLocation)
      setSelectedLocation(null)
      setSearchQuery("")
      setSearchResults([])
    }
  }

  return (
    <Card className="h-[380px] flex flex-col shadow-md dark:shadow-lg dark:shadow-black/20 hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40">
        <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 dark:text-blue-400" />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Interactive Map
          </span>
        </CardTitle>
      </CardHeader>

      <Tabs defaultValue="view" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 mx-3">
          <TabsTrigger value="view" className="text-xs py-1">
            View Map
          </TabsTrigger>
          <TabsTrigger value="search" className="text-xs py-1">
            Add Location
          </TabsTrigger>
        </TabsList>

        <TabsContent value="view" className="flex-1 flex flex-col p-3 pt-2">
          <div className="flex items-center gap-2 mb-2">
            <Select value={selectedDayId} onValueChange={setSelectedDayId}>
              <SelectTrigger className="h-7 text-xs dark:bg-gray-700 dark:border-gray-600">
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                {days.map((day) => (
                  <SelectItem key={day.id} value={day.id}>
                    {day.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={showRoute ? "default" : "outline"}
              size="sm"
              className={`flex items-center gap-1 h-7 text-xs ${
                !showRoute ? "dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600" : ""
              }`}
              onClick={() => setShowRoute(!showRoute)}
            >
              <Route className="h-3 w-3" />
              {showRoute ? "Hide Route" : "Show Route"}
            </Button>
          </div>

          <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden relative">
            {/* This would be replaced with an actual map component in a real implementation */}
            <div
              ref={mapRef}
              className="w-full h-full bg-blue-50 dark:bg-gray-700 flex items-center justify-center relative"
            >
              <div className="absolute inset-0 bg-blue-100/50 dark:bg-blue-900/30 rounded-md overflow-hidden">
                {/* Map background with grid lines to simulate a map */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                ></div>
              </div>

              <div className="text-center p-3 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-sm z-10 max-w-[90%]">
                <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 dark:text-blue-400 mx-auto mb-1" />
                <h3 className="text-sm sm:text-base font-medium mb-1 dark:text-gray-200">Map View</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedDayId
                    ? `Showing locations for ${days.find((d) => d.id === selectedDayId)?.title}`
                    : "Select a day to view locations"}
                </p>
              </div>

              {/* Map markers with improved visibility */}
              {days
                .find((d) => d.id === selectedDayId)
                ?.activities.filter((a) => a.location)
                .map((activity, index) => (
                  <div
                    key={activity.id}
                    className="absolute z-20"
                    style={{
                      left: `${Math.random() * 70 + 15}%`,
                      top: `${Math.random() * 70 + 15}%`,
                    }}
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-500 dark:bg-blue-600 text-white flex items-center justify-center text-xs shadow-md border-2 border-white dark:border-gray-800 map-marker-pulse">
                      {index + 1}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="search" className="flex-1 flex flex-col p-3 pt-2">
          <form onSubmit={handleSearch} className="flex gap-2 mb-2">
            <Input
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 h-7 text-xs dark:bg-gray-700 dark:border-gray-600"
            />
            <Button type="submit" disabled={isSearching} size="sm" className="h-7 w-7 p-0">
              {isSearching ? <Loader2 className="h-3 w-3 animate-spin" /> : <Search className="h-3 w-3" />}
            </Button>
          </form>

          <div className="flex-1 overflow-hidden flex flex-col">
            {isSearching ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 dark:border-blue-400"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className={`p-2 rounded-md cursor-pointer transition-colors text-xs ${
                      selectedLocation?.id === result.id
                        ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
                        : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => handleSelectLocation(result)}
                  >
                    <div className="font-medium dark:text-gray-200">{result.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {result.address}
                    </div>
                  </div>
                ))}

                {selectedLocation && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      onClick={handleAddToDayClick}
                      className="w-full text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600"
                    >
                      Add to {days.find((d) => d.id === selectedDayId)?.title || "Day"}
                    </Button>
                  </div>
                )}
              </div>
            ) : searchQuery ? (
              <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
                No results found. Try a different search term.
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-4">
                <div>
                  <Search className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <h3 className="text-xs sm:text-sm font-medium mb-1 dark:text-gray-300">Search for Locations</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Search for attractions, restaurants, or any place to add to your itinerary.
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
