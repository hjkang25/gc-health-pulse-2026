"use client"

import { useEffect, useRef, useState } from "react"
import { SectionHeader } from "./section-header"
import { Quote, FlaskConical } from "lucide-react"

export function LabCommentary() {
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
    <section className="relative z-10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <SectionHeader tag="Lab" title="GC 데이터 랩 코멘트" />

        <div
          ref={ref}
          className="relative bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-3xl p-10 lg:p-14 overflow-hidden transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          {/* Large quote icon */}
          <Quote className="absolute top-8 right-8 w-32 h-32 text-primary/15 rotate-180" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="font-mono text-xs text-primary uppercase tracking-wider font-medium">
                Official Commentary
              </span>
            </div>

            <blockquote className="text-2xl lg:text-3xl text-foreground leading-relaxed max-w-3xl mb-10 font-medium">
              이번 주 지표는 대한민국 경제활동 인구의 누적된 피로도가 한계점에 도달했음을 시사합니다. 단순한 증상 완화를 넘어 전주기적 건강 관리가 필요한 시점입니다.
            </blockquote>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-lg font-semibold text-foreground">
                  GC 헬스데이터 연구소장
                </div>
                <div className="text-sm text-muted-foreground">
                  GC Health Data Lab | 2026.03.01
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
