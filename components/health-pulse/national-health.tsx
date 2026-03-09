"use client"

import { useEffect, useState } from "react"
import { Briefcase, Baby, HeartPulse, Activity } from "lucide-react"
import { MetricCard } from "./metric-card"
import { SectionHeader } from "./section-header"

interface HealthData {
  vitality: number
  safety: number
  senior: number
  weather: {
    t_current: number
    t_min: number
    t_max: number
    temp_diff: number
  }
  updated_at: string
}

export function NationalHealth() {
  const [data, setData] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch("/api/health-data")
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success") {
          setData(json.data)
        } else {
          setError(true)
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const metrics = data
    ? [
        {
          icon: Briefcase,
          label: "직장인 활력 지수",
          value: data.vitality,
          delta: {
            type: data.vitality >= 60 ? ("up" as const) : ("down" as const),
            text: data.vitality >= 60 ? "이번 주 활력 양호" : "이번 주 활력 주의",
          },
        },
        {
          icon: Baby,
          label: "소아·청소년 안전 지수",
          value: data.safety,
          delta: {
            type: data.safety >= 70 ? ("up" as const) : ("down" as const),
            text: data.safety >= 70 ? "감염병 위험 낮음" : "감염병 위험 주의",
          },
        },
        {
          icon: HeartPulse,
          label: "시니어 혈관 위험도",
          value: data.senior,
          delta: {
            type: data.senior <= 50 ? ("up" as const) : ("down" as const),
            text: `최저기온 ${data.weather.t_min}°C · 일교차 ${data.weather.temp_diff}°C`,
          },
        },
        {
          icon: Activity,
          label: "현재 기온 (기상청)",
          value: `${data.weather.t_current}°C`,
          delta: {
            type: "flat" as const,
            text: `최저 ${data.weather.t_min}°C / 최고 ${data.weather.t_max}°C`,
          },
        },
      ]
    : []

  return (
    <section className="border-t border-border relative z-10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <SectionHeader
          tag="National"
          title="대한민국 건강 현황판"
          description="실시간 공공 데이터를 기반으로 산출한 국민 건강 상태를 한눈에 보여드립니다."
        />

        {loading && (
          <p className="text-muted-foreground text-sm mt-4">
            데이터 불러오는 중...
          </p>
        )}

        {error && (
          <p className="text-destructive text-sm mt-4">
            데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
          </p>
        )}

        {!loading && !error && data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {metrics.map((metric, idx) => (
                <MetricCard
                  key={metric.label}
                  {...metric}
                  delay={0.1 * (idx + 1)}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-6 text-right">
              마지막 업데이트: {data.updated_at}
            </p>
          </>
        )}
      </div>
    </section>
  )
}
