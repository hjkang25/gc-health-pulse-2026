"use client"

import { Briefcase, Baby, HeartPulse, Activity } from "lucide-react"
import { MetricCard } from "./metric-card"
import { SectionHeader } from "./section-header"

const metrics = [
  {
    icon: Briefcase,
    label: "직장인 활력 지수",
    value: 72.8,
    delta: { type: "up" as const, text: "+4.2% 전주 대비 상승" },
  },
  {
    icon: Baby,
    label: "영유아 등원 안심도",
    value: 85.1,
    delta: { type: "down" as const, text: "-2.1% 전주 대비 완화" },
  },
  {
    icon: HeartPulse,
    label: "시니어 혈관 주의보",
    value: 42.0,
    delta: { type: "flat" as const, text: "안정 유지 중" },
  },
  {
    icon: Activity,
    label: "처방 트렌드 (호흡기)",
    value: "+28%",
    delta: { type: "up" as const, text: "급증 - 모니터링 강화" },
    valueColor: "var(--destructive)",
  },
]

export function NationalHealth() {
  return (
    <section className="border-t border-border relative z-10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <SectionHeader 
          tag="National" 
          title="전국 건강 기상도"
          description="실시간 의료 데이터를 기반으로 국민 건강 상태를 모니터링합니다."
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {metrics.map((metric, idx) => (
            <MetricCard
              key={metric.label}
              {...metric}
              delay={0.1 * (idx + 1)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
