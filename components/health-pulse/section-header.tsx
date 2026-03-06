"use client"

import { useEffect, useRef, useState } from "react"

interface SectionHeaderProps {
  tag: string
  title: string
  description?: string
}

export function SectionHeader({ tag, title, description }: SectionHeaderProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.15 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="mb-12 transition-all duration-700"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-xs font-medium tracking-wider uppercase text-primary px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-md">
          {tag}
        </span>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base text-muted-foreground max-w-xl">
          {description}
        </p>
      )}
    </div>
  )
}
