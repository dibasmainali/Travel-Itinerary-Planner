"use client"

import { useState, createContext, useContext } from "react"
import { cn } from "../../lib/utils"

const TooltipContext = createContext({})

export function TooltipProvider({ children }) {
  return <>{children}</>
}

export function Tooltip({ children, ...props }) {
  const [open, setOpen] = useState(false)

  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-flex">{children}</div>
    </TooltipContext.Provider>
  )
}

export const TooltipTrigger = ({ children, asChild, ...props }) => {
  const { setOpen } = useContext(TooltipContext)

  const handleMouseEnter = () => setOpen(true)
  const handleMouseLeave = () => setOpen(false)
  const handleFocus = () => setOpen(true)
  const handleBlur = () => setOpen(false)

  if (asChild) {
    return (
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      >
        {children}
      </div>
    )
  }

  return (
    <button
      type="button"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    >
      {children}
    </button>
  )
}

export const TooltipContent = ({ className, children, ...props }) => {
  const { open } = useContext(TooltipContext)

  if (!open) return null

  return (
    <div
      className={cn(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
