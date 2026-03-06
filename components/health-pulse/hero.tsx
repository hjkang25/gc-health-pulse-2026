"use client"

import { Calendar, Database, MapPin, Clock } from "lucide-react"

const metaItems = [
  { icon: Calendar, label: "발행일", value: "2026. 03. 01" },
  { icon: Database, label: "데이터 포인트", value: "4,280,000+" },
  { icon: MapPin, label: "커버리지", value: "전국 17개 시도" },
  { icon: Clock, label: "분석 기간", value: "2.24 - 3.02" },
]

export function Hero() {
  return (
    <section className="relative z-10 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="font-mono text-sm text-muted-foreground tracking-wide">
              GC Weekly Health Pulse
            </span>
            <span className="text-muted-foreground/50">|</span>
            <span className="font-mono text-sm text-foreground">
              2026년 3월 1주차
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-foreground mb-6">
            대한민국
            <br />
            <span className="text-primary">건강 기상도</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-12">
            유비케어 EMR, GC Care, KDCA, 기상청 데이터를 실시간으로 통합 분석하여 국민 건강 트렌드를 제시합니다.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metaItems.map((item) => (
              <div
                key={item.label}
                className="group p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <item.icon className="w-4 h-4 text-muted-foreground mb-3 group-hover:text-primary transition-colors" />
                <div className="text-xs text-muted-foreground mb-1">
                  {item.label}
                </div>
                <div className="text-base font-semibold text-foreground">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Gradient orb decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
    </section>
  )
}
