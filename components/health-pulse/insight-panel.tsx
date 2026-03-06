"use client"

import { useState, useEffect } from "react"
import { SectionHeader } from "./section-header"
import { AlertTriangle, CheckCircle, Eye, ArrowRight } from "lucide-react"

interface ChartData {
  day: string
  value: number
}

interface InsightData {
  id: string
  tabLabel: string
  chipType: "warning" | "safe" | "observe"
  chipText: string
  title: string
  body: string
  action: string
  chartTitle: string
  chartData: ChartData[]
}

const insights: InsightData[] = [
  {
    id: "worker",
    tabLabel: "30-40 직장인",
    chipType: "warning",
    chipText: "주의 필요",
    title: "직장인 스트레스와 위장의 경고 신호",
    body: "유비케어 EMR 통계 기준 오피스 밀집 지역(강남, 여의도, 판교) 위염 처방이 전주 대비 급증했습니다. 야간 검색 데이터와 교차 분석 결과, 번아웃 징후가 복합적으로 포착됩니다.\n\n특히 30~40대 직장인의 소화기계 연관 검색 패턴은 업무 강도가 높은 수, 목요일에 집중되어, 단순 피로가 아닌 만성 스트레스 누적으로 해석됩니다.",
    action: "고함량 비타민 B군 섭취 + 점심 후 15분 산책 루틴 도입",
    chartTitle: "위험도 주간 추이 (위염 처방 기준)",
    chartData: [
      { day: "월", value: 45 },
      { day: "화", value: 52 },
      { day: "수", value: 60 },
      { day: "목", value: 85 },
      { day: "금", value: 92 },
    ],
  },
  {
    id: "parent",
    tabLabel: "영유아 부모",
    chipType: "safe",
    chipText: "비교적 안전",
    title: "어린이집 호흡기 감염 위험 지도",
    body: "KDCA 감염병 동향과 GC Care 소아과 처방 데이터를 결합한 결과, 수도권 북부 지역(도봉, 노원, 의정부) 영유아 호흡기 감염 위험이 소폭 상승했습니다.\n\n전반적 안심도는 85.1점으로 전주 대비 안정화 추세이나, 기온 급변이 예상되는 목, 금요일 등원 시 방한 조치를 강화할 것을 권장합니다.",
    action: "등원 전 체온 체크 + 손 씻기 강화, 수도권 북부 보호자 특별 주의",
    chartTitle: "주간 안심도 지수 (높을수록 안전)",
    chartData: [
      { day: "월", value: 88 },
      { day: "화", value: 86 },
      { day: "수", value: 84 },
      { day: "목", value: 82 },
      { day: "금", value: 85 },
    ],
  },
  {
    id: "senior",
    tabLabel: "액티브 시니어",
    chipType: "observe",
    chipText: "관찰 중",
    title: "시니어 혈관 건강 겨울-봄 전환기 주의",
    body: "일교차 10도 이상이 반복되는 현재 기상 패턴은 혈압 변동성을 높입니다. GC Care 내과 처방 데이터 기준, 65세 이상 고혈압 약물 처방 건수는 안정적이나 심근경색 관련 응급실 내원은 목요일 새벽 시간대에 집중되는 패턴이 포착됩니다.\n\n이른 아침 외출 자제 및 실내외 기온 적응 시간 확보가 중요합니다.",
    action: "오전 6-8시 야외 운동 자제 + 혈압 일일 2회 측정 권장",
    chartTitle: "혈관 주의보 지수 (낮을수록 안전)",
    chartData: [
      { day: "월", value: 40 },
      { day: "화", value: 44 },
      { day: "수", value: 42 },
      { day: "목", value: 48 },
      { day: "금", value: 42 },
    ],
  },
]

function BarChart({ data, isActive }: { data: ChartData[]; isActive: boolean }) {
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    if (isActive) {
      setAnimationKey((k) => k + 1)
    }
  }, [isActive])

  return (
    <div className="flex flex-col gap-4">
      {data.map((item, idx) => (
        <div key={item.day} className="flex items-center gap-4">
          <span className="font-mono text-sm text-muted-foreground w-8">
            {item.day}
          </span>
          <div className="flex-1 h-3 bg-border rounded-full overflow-hidden">
            <div
              key={animationKey}
              className="h-full rounded-full bg-gradient-to-r from-accent to-primary"
              style={{
                width: `${item.value}%`,
                transform: isActive ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left",
                transition: `transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) ${idx * 0.1}s`,
              }}
            />
          </div>
          <span className="font-mono text-sm font-medium text-foreground w-10 text-right">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  )
}

const chipConfig = {
  warning: { 
    icon: AlertTriangle, 
    bg: "bg-amber-500/10", 
    border: "border-amber-500/25", 
    text: "text-amber-600" 
  },
  safe: { 
    icon: CheckCircle, 
    bg: "bg-primary/10", 
    border: "border-primary/25", 
    text: "text-primary" 
  },
  observe: { 
    icon: Eye, 
    bg: "bg-amber-500/10", 
    border: "border-amber-500/25", 
    text: "text-amber-600" 
  },
}

export function InsightPanel() {
  const [activeTab, setActiveTab] = useState("worker")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <section className="border-t border-border relative z-10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <SectionHeader tag="Insight" title="나를 위한 1분 브리핑" />
          <div className="h-[500px] bg-card border border-border rounded-2xl animate-pulse" />
        </div>
      </section>
    )
  }

  return (
    <section className="border-t border-border relative z-10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <SectionHeader 
          tag="Insight" 
          title="나를 위한 1분 브리핑"
          description="연령대와 생활 패턴에 맞춤화된 건강 인사이트를 제공합니다."
        />

        {/* Tab Row */}
        <div className="flex gap-2 mb-10 p-2 bg-card border border-border rounded-2xl w-fit">
          {insights.map((insight) => (
            <button
              key={insight.id}
              onClick={() => setActiveTab(insight.id)}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === insight.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {insight.tabLabel}
            </button>
          ))}
        </div>

        {/* Insight Cards */}
        {insights.map((insight) => {
          const ChipIcon = chipConfig[insight.chipType].icon
          
          return (
            <div
              key={insight.id}
              className={activeTab === insight.id ? "block" : "hidden"}
            >
              <div className="bg-card border border-border rounded-3xl overflow-hidden">
                <div className="grid lg:grid-cols-5 gap-0">
                  {/* Content Side */}
                  <div className="lg:col-span-3 p-8 lg:p-12">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6 ${chipConfig[insight.chipType].bg} ${chipConfig[insight.chipType].border}`}>
                      <ChipIcon className={`w-4 h-4 ${chipConfig[insight.chipType].text}`} />
                      <span className={`text-sm font-medium ${chipConfig[insight.chipType].text}`}>
                        {insight.chipText}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight mb-6">
                      {insight.title}
                    </h3>
                    
                    <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line mb-8">
                      {insight.body}
                    </p>
                    
                    <div className="p-5 bg-primary/5 border border-primary/15 rounded-2xl">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowRight className="w-4 h-4 text-primary" />
                        <span className="font-mono text-xs uppercase tracking-wider text-primary font-medium">
                          이번 주 권장 액션
                        </span>
                      </div>
                      <p className="text-base text-foreground font-medium">
                        {insight.action}
                      </p>
                    </div>
                  </div>
                  
                  {/* Chart Side */}
                  <div className="lg:col-span-2 bg-muted/30 p-8 lg:p-12 border-t lg:border-t-0 lg:border-l border-border">
                    <div className="font-mono text-xs text-muted-foreground mb-8 uppercase tracking-wider">
                      {insight.chartTitle}
                    </div>
                    <BarChart data={insight.chartData} isActive={activeTab === insight.id} />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
