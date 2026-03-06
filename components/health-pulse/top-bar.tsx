"use client"

import { Activity } from "lucide-react"

export function TopBar() {
  return (
    <header className="sticky top-0 z-[100] bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                GC Health Lab
              </span>
            </div>
            <div className="hidden md:block h-5 w-px bg-border" />
            <span className="hidden md:block font-mono text-xs text-muted-foreground tracking-wide">
              Vol.2026 - Week 10
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-xs text-primary font-medium">
                Live
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
