"use client"

import { cn } from "cn"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [systemIsDark, setSystemIsDark] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    setSystemIsDark(mql.matches)

    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches)
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])

  const isDark = mounted
    ? theme === "system"
      ? systemIsDark
      : theme === "dark"
    : false

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border/60 bg-muted/60 p-0.5 transition-colors dark:bg-muted/40",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-label="Switch to light theme"
        aria-pressed={mounted ? !isDark : undefined}
        className={cn(
          "relative flex size-6 cursor-pointer items-center justify-center rounded-full transition-all duration-200 active:scale-95 sm:size-6.5",
          mounted && !isDark
            ? "bg-background text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Sun className="size-3.5 transition-transform duration-200 sm:size-3.5" />
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-label="Switch to dark theme"
        aria-pressed={mounted ? isDark : undefined}
        className={cn(
          "relative flex size-6 cursor-pointer items-center justify-center rounded-full transition-all duration-200 active:scale-95 sm:size-6.5",
          mounted && isDark
            ? "bg-background text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Moon className="size-3.5 transition-transform duration-200 sm:size-3.5" />
      </button>
    </div>
  )
}
