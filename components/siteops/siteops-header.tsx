"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Bot } from "lucide-react"

export function SiteOpsHeader() {
  return (
    <header className="sticky top-0 right-0 left-0 z-10 flex items-center justify-between gap-2 border-b border-border bg-background px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Bot className="size-6" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-semibold tracking-tight sm:text-base">
            SiteOps Agent
          </h1>
          <p className="text-xs text-muted-foreground">
            Autonomous Material & Expense Orchestrator
          </p>
        </div>
      </div>

      <ThemeToggle />
    </header>
  )
}
