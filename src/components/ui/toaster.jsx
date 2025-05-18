"use client"

import { useToast } from "../../hooks/use-toast"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "../../lib/utils"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col p-4 gap-2 max-w-[420px] w-full pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </div>
  )
}

function Toast({ toast, onDismiss }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const enterTimeout = setTimeout(() => {
      setIsVisible(true)
    }, 10)

    return () => clearTimeout(enterTimeout)
  }, [])

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-black/30 border border-gray-200 dark:border-gray-700 p-4 pointer-events-auto flex items-start gap-3 transition-all duration-300 transform",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
      )}
    >
      <div className="flex-1">
        {toast.title && <h3 className="font-medium text-sm dark:text-gray-100">{toast.title}</h3>}
        {toast.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{toast.description}</p>}
      </div>
      <button onClick={onDismiss} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
