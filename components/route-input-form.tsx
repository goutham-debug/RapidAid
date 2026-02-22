"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  MapPin,
  Navigation,
  ArrowRight,
  Locate,
  Clock,
  Shield,
  Zap,
} from "lucide-react"

type RouteType = {
  origin: string
  destination: string
  congestion: "Moderate" | "High" | "Severe"
}

const POPULAR_ROUTES: RouteType[] = [
  {
    origin: "Silk Board Junction",
    destination: "Electronic City Phase 1",
    congestion: "High",
  },
  {
    origin: "Marathahalli Bridge",
    destination: "Whitefield ITPL",
    congestion: "Severe",
  },
  {
    origin: "KR Puram Railway Station",
    destination: "Manyata Tech Park",
    congestion: "High",
  },
  {
    origin: "Hebbal Flyover",
    destination: "Kempegowda International Airport",
    congestion: "Moderate",
  },
]

export default function RouteInputForm() {

  const router = useRouter()

  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [isLaunching, setIsLaunching] = useState(false)

  const handleLaunch = () => {
    if (!origin.trim() || !destination.trim()) return

    setIsLaunching(true)

    const params = new URLSearchParams({
      origin: origin.trim(),
      destination: destination.trim(),
    })

    setTimeout(() => {
      router.push(`/dashboard?${params.toString()}`)
    }, 800)
  }

  const handleQuickRoute = (route: RouteType) => {
    setOrigin(route.origin)
    setDestination(route.destination)
  }

  const getCongestionColor = (level: RouteType["congestion"]) => {
    switch (level) {
      case "Severe":
        return "text-red-500"
      case "High":
        return "text-orange-400"
      case "Moderate":
        return "text-yellow-400"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="relative w-full max-w-lg">

      {/* Main Form */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card/80 p-6 shadow-2xl backdrop-blur-xl">
        <div className="pointer-events-none absolute -inset-px rounded-2xl bg-primary/[0.03]" />

        <div className="relative flex flex-col gap-5">

          {/* Origin */}
          <div className="group relative">
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15">
                <MapPin className="h-3 w-3 text-primary" />
              </div>
              Start Point
            </label>

            <div className="relative">
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Enter starting location..."
                className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3.5 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setOrigin("Bangalore Current Location")}
              >
                <Locate className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="absolute left-[22px] h-full w-px bg-border" style={{ top: "-12px", height: "calc(100% + 24px)" }} />
            <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card shadow-sm">
              <ArrowRight className="h-3.5 w-3.5 text-primary rotate-90" />
            </div>
          </div>

          {/* Destination */}
          <div className="group relative">
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive/15">
                <Navigation className="h-3 w-3 text-destructive" />
              </div>
              Destination
            </label>

            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination..."
              className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3.5 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Launch Button */}
          <button
            onClick={handleLaunch}
            disabled={!origin.trim() || !destination.trim() || isLaunching}
            className="group relative mt-1 flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-6 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:brightness-110 disabled:opacity-40"
          >
            {isLaunching ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                <span>Activating Green Corridor...</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                <span>Launch Route Analysis</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}