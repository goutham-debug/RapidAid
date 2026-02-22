"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import RouteInputForm from "@/components/route-input-form"
import {
  Radio,
  Cpu,
  Siren,
} from "lucide-react"

const HeroBackground = dynamic(() => import("@/components/hero-background"), {
  ssr: false,
})

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* Animated Background */}
      {mounted && <HeroBackground />}

      {/* Radial glow behind brand */}
      <div className="pointer-events-none absolute left-1/2 top-[30%] z-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-[100px]" />

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-lg flex-col items-center">
        {/* Live Badge */}
        <div
          className={`mb-6 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 backdrop-blur-sm transition-all duration-700 ${
            mounted ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-xs font-semibold tracking-wider text-primary">
            EMERGENCY MOBILITY SYSTEM
          </span>
        </div>

        {/* Brand Name */}
        <div
          className={`mb-3 flex flex-col items-center transition-all duration-700 delay-150 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h1 className="relative text-center">
            <span className="text-7xl font-black tracking-tighter text-foreground sm:text-8xl">
              Rapid
            </span>
            <span className="text-7xl font-black tracking-tighter text-primary sm:text-8xl">
              Aid
            </span>
            <span
              className="pointer-events-none absolute inset-0 text-7xl font-black tracking-tighter text-primary blur-2xl opacity-30 sm:text-8xl"
              aria-hidden="true"
            >
              {"     "}Aid
            </span>
          </h1>
        </div>

        {/* Stats Row */}
        <div
          className={`mb-8 flex items-center gap-6 transition-all duration-700 delay-300 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <MiniStat icon={<Siren className="h-3.5 w-3.5" />} value="< 7 min" label="Avg Response" />
          <div className="h-4 w-px bg-border" />
          <MiniStat icon={<Radio className="h-3.5 w-3.5" />} value="Live" label="Tracking" />
          <div className="h-4 w-px bg-border" />
          <MiniStat icon={<Cpu className="h-3.5 w-3.5" />} value="24/7" label="Monitoring" />
        </div>

        {/* Route Input Form */}
        <div
          className={`w-full transition-all duration-700 delay-500 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <RouteInputForm />
        </div>
      </div>

      {/* Bottom Attribution */}
      <div
        className={`absolute bottom-6 z-10 flex items-center gap-1.5 text-[10px] text-muted-foreground/50 transition-all duration-700 delay-700 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <span>Powered by Intelligent Emergency Routing System</span>
        <span className="mx-1">|</span>
        <span>Bangalore City Coverage</span>
      </div>
    </div>
  )
}

function MiniStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-primary">{icon}</span>
      <div className="flex flex-col">
        <span className="text-xs font-bold leading-none text-foreground">{value}</span>
        <span className="text-[9px] text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}