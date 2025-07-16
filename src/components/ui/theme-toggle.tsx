"use client"

import { useEffect, useState } from "react"
import { Moon, Sun, Monitor } from "lucide-react"

type Theme = "light" | "dark" | "system"

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      applyTheme("system")
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    
    // Remove existing theme classes
    root.classList.remove("light", "dark")
    
    if (newTheme === "system") {
      // Let CSS media query handle system preference
      localStorage.removeItem("theme")
    } else {
      root.classList.add(newTheme)
      localStorage.setItem("theme", newTheme)
    }
  }

  const cycleTheme = () => {
    const themes: Theme[] = ["light", "dark", "system"]
    const currentIndex = themes.indexOf(theme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    
    setTheme(nextTheme)
    applyTheme(nextTheme)
  }

  if (!mounted) {
    return (
      <button className="theme-toggle" aria-label="Toggle theme">
        <Monitor className="theme-toggle-icon" />
      </button>
    )
  }

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="theme-toggle-icon" />
      case "dark":
        return <Moon className="theme-toggle-icon" />
      case "system":
        return <Monitor className="theme-toggle-icon" />
    }
  }

  const getLabel = () => {
    switch (theme) {
      case "light":
        return "Switch to dark mode"
      case "dark":
        return "Switch to system mode"
      case "system":
        return "Switch to light mode"
    }
  }

  return (
    <button
      onClick={cycleTheme}
      className="theme-toggle"
      aria-label={getLabel()}
      data-theme={theme}
      title={getLabel()}
    >
      {getIcon()}
    </button>
  )
}