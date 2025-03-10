"use client"

import type React from "react"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { cn } from "@/utils/index"

interface SegmentedControlProps {
  name: string
  options: {
    label: string
    value: string
    icon?: React.ReactNode
  }[]
  defaultValue?: string
  className?: string
}

export function SegmentedControl({ name, options, defaultValue, className }: SegmentedControlProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get the current value from search params or use default
  const currentValue = searchParams.get(name) || defaultValue || options[0]?.value

  // Track hover state for animation
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null)

  // Create a new URLSearchParams instance and update it
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams],
  )

  // Handle segment selection
  const handleSegmentClick = (value: string) => {
    router.push(`${pathname}?${createQueryString(name, value)}`, { scroll: false })
  }

  return (
    <div
      className={cn(
        "relative flex h-8 rounded-lg bg-muted p-1 text-sm font-medium shadow-sm",
        "select-none",
        className,
      )}
      role="tablist"
      aria-orientation="horizontal"
    >
      {/* Active segment highlight */}
      <div className="absolute inset-0 z-0 flex p-1" aria-hidden="true">
        {options.map((option) => (
          <div
            key={option.value}
            className={cn(
              "flex-1 rounded-md transition-all duration-200 ease-in-out",
              currentValue === option.value && "bg-background shadow-sm",
            )}
            style={{
              transform: hoveredSegment === option.value && currentValue !== option.value ? "scale(0.95)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {/* Segments */}
      {options.map((option) => (
        <button
          key={option.value}
          role="tab"
          type="button"
          aria-selected={currentValue === option.value}
          aria-controls={`panel-${option.value}`}
          id={`tab-${option.value}`}
          className={cn(
            "relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1 text-sm transition-colors",
            currentValue === option.value ? "text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => handleSegmentClick(option.value)}
          onMouseEnter={() => setHoveredSegment(option.value)}
          onMouseLeave={() => setHoveredSegment(null)}
        >
          {option.icon && <span className="h-4 w-4">{option.icon}</span>}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  )
}

