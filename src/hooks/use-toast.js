"use client"

import { useState, useEffect } from "react"

// Simple toast implementation for React + Vite
export function useToast() {
  const [toasts, setToasts] = useState([])

  const toast = ({ title, description, duration = 3000 }) => {
    const id = Date.now().toString()

    setToasts((prevToasts) => [...prevToasts, { id, title, description, duration }])

    return id
  }

  const dismiss = (toastId) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId))
  }

  // Auto-dismiss toasts after their duration
  useEffect(() => {
    if (toasts.length === 0) return

    const timers = toasts.map((toast) => {
      return setTimeout(() => {
        dismiss(toast.id)
      }, toast.duration)
    })

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [toasts])

  return { toast, dismiss, toasts }
}
