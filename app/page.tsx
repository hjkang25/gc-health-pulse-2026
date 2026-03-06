import { TopBar } from "@/components/health-pulse/top-bar"
import { Hero } from "@/components/health-pulse/hero"
import { NationalHealth } from "@/components/health-pulse/national-health"
import { InsightPanel } from "@/components/health-pulse/insight-panel"
import { LabCommentary } from "@/components/health-pulse/lab-commentary"
import { Footer } from "@/components/health-pulse/footer"

export default function HealthPulsePage() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <TopBar />
      <Hero />
      <NationalHealth />
      <InsightPanel />
      <LabCommentary />
      <Footer />
    </main>
  )
}
