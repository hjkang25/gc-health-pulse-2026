"use client"

import { useEffect, useState } from "react"
import { Calendar, Database, MapPin, Clock } from "lucide-react"

function getThisMonday(): Date {
  const today = new Date()
  const day = today.getDay() // 0=일, 1=월 ... 6=토
  const diff = day === 0 ? -6 : 1 - day // 이번 주 월요일로
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  return monday
}

function formatKoreanDate(date: Date): string {
  return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, "0")}. ${String(date.getDate()).padStart(2, "0")}`
}

function getWeekLabel(): string {
  const today = new Date()
  const month = today.getMonth() + 1
  // 이번 달 첫째 월요일 기준 몇 주차인지 계산
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const firstMonday = new Date(firstDay)
  const diff = firstDay.getDay() === 0 ? 1 : (8 - firstDay.getDay()) % 7 || 7
  firstMonday.setDate(1 + (diff === 7 ? 0 : diff))
  const monday = getThisMonday()
  const weekNum = Math.ceil((monday.getDate() - firstMonday.getDate()) / 7) + 1
  return `${today.getFullYear()}년 ${month}월 ${weekNum}주차`
}

function getAnalysisPeriod(): string {
  const monday = getThisMonday()
  const prevMonday = new Date(monday)
  prevMonday.setDate(monday.getDate() - 7)
  const prevSunday = new Date(monday)
  prevSunday.setDate(monday.getDate() - 1)

  const fmt = (d: Date) =>
    `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`
  return `${fmt(prevMonday)} - ${fmt(prevSunday)}`
}

export function Hero() {
  const [dataPoints, setDataPoints] = useState<string>("불러오는 중...")

  const monday = getThisMonday()
  const publishDate = formatKoreanDate(monday)
  const weekLabel = getWeekLabel()
  const analysisPeriod = getAnalysisPeriod()

  useEffect(() => {
    fetch("/api/health-data")
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success") {
          // 실제 API에서 data_points 필드가 있으면 사용, 없으면 기본값
          const points = json.data?.data_points
          setDataPoints(points ? points.toLocaleString() + "+" : "4,280,000+")
        } else {
          setDataPoints("4,280,000+")
        }
      })
      .catch(() => setDataPoints("4,280,000+"))
  }, [])

  const metaItems = [
    { icon: Calendar, label: "발행일", value: publishDate },
    { icon: Database, label: "데이터 포인트", value: dataPoints },
    { icon: MapPin, label: "커버리지", value: "전국 17개 시도" },
    { icon: Clock, label: "분석 기간", value: analysisPeriod },
  ]

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
              {weekLabel}
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
