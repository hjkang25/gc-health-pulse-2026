"use client"

import { useEffect, useRef, useState } from "react"
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react"

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: number | string
  delta: {
    type: "up" | "down" | "flat"
    text: string
  }
  valueColor?: string
  delay?: number
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  delta,
  valueColor,
  delay = 0,
}: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState<number | string>(typeof value === "number" ? 0 : value)
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          
          if (typeof value === "number") {
            const duration = 1400
            const start = performance.now()
            const isInt = Number.isInteger(value)

            const animate = (now: number) => {
              const t = Math.min((now - start) / duration, 1)
              const ease = 1 - Math.pow(1 - t, 4)
              const current = value * ease
              setDisplayValue(isInt ? Math.round(current) : parseFloat(current.toFixed(1)))
              if (t < 1) requestAnimationFrame(animate)
            }

            requestAnimationFrame(animate)
          }
        }
      },
      { threshold: 0.15 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [value])

  const deltaConfig = {
    up: { icon: TrendingUp, color: "text-destructive", bg: "bg-destructive/10" },
    down: { icon: TrendingDown, color: "text-primary", bg: "bg-primary/10" },
    flat: { icon: Minus, color: "text-muted-foreground", bg: "bg-muted" },
  }

  const DeltaIcon = deltaConfig[delta.type].icon

  return (
    <div
      ref={cardRef}
      className="group relative bg-card border border-border rounded-2xl p-6 lg:p-8 overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s, border-color 0.25s, box-shadow 0.25s`,
      }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center group-hover:border-primary/30 transition-colors">
          <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${deltaConfig[delta.type].bg}`}>
          <DeltaIcon className={`w-3.5 h-3.5 ${deltaConfig[delta.type].color}`} />
        </div>
      </div>
      
      <div className="font-mono text-xs tracking-wide uppercase text-muted-foreground mb-3">
        {label}
      </div>
      
      <div
        className="text-4xl lg:text-5xl font-bold leading-none mb-4 tracking-tight"
        style={{ color: valueColor || "var(--foreground)" }}
      >
        {typeof value === "string" ? value : displayValue}
      </div>
      
      <div className={`text-sm font-medium ${deltaConfig[delta.type].color}`}>
        {delta.text}
      </div>
    </div>
  )
}
