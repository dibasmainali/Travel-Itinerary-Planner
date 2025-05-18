import { Sun, Cloud, CloudRain, CloudLightning, CloudSun } from "lucide-react"

export default function WeatherWidget({ weather }) {
  if (!weather) return null

  const { condition, temperature, precipitation } = weather

  const getWeatherIcon = () => {
    switch (condition) {
      case "Sunny":
        return <Sun className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
      case "Partly Cloudy":
        return <CloudSun className="h-5 w-5 text-blue-400 dark:text-blue-300" />
      case "Cloudy":
        return <Cloud className="h-5 w-5 text-gray-400 dark:text-gray-300" />
      case "Rainy":
        return <CloudRain className="h-5 w-5 text-blue-500 dark:text-blue-400" />
      case "Thunderstorm":
        return <CloudLightning className="h-5 w-5 text-purple-500 dark:text-purple-400" />
      default:
        return <Sun className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
    }
  }

  return (
    <div
      className="flex items-center gap-2 text-sm cursor-help"
      title={`${condition} - ${temperature}°C${precipitation > 0 ? ` - ${precipitation}% chance of precipitation` : ""}`}
    >
      {getWeatherIcon()}
      <div className="flex items-center gap-1">
        <span className="dark:text-gray-300">{temperature}°C</span>
        {precipitation > 0 && (
          <>
            <span className="text-gray-400 dark:text-gray-500">•</span>
            <span className="text-blue-500 dark:text-blue-400">{precipitation}% rain</span>
          </>
        )}
      </div>
    </div>
  )
}
