"use client"

import {
  Clock,
  MapPin,
  Navigation,
  Route as RouteIcon,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"
import type { Route } from "@/lib/types"

interface RoutePanelProps {
  routes: Route[]
  selectedRouteId: string | null
  onSelectRoute: (id: string) => void
}

export default function RoutePanel({ routes, selectedRouteId, onSelectRoute }: RoutePanelProps) {
  const activeRoute = routes.find(
    (r) => r.id === selectedRouteId || (!selectedRouteId && r.isActive)
  )

  return (
    <div className="flex flex-col gap-3">
      {/* Active Route Summary */}
      {activeRoute && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Navigation className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Active Route
              </span>
            </div>
            {activeRoute.isGreenCorridor && (
              <span className="flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                <CheckCircle2 className="h-3 w-3" />
                Green Corridor
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <MetricCard
              icon={<MapPin className="h-3.5 w-3.5" />}
              label="Distance"
              value={`${activeRoute.distance} km`}
            />
            <MetricCard
              icon={<Clock className="h-3.5 w-3.5" />}
              label="Duration"
              value={`${activeRoute.duration} min`}
            />
            <MetricCard
              icon={<RouteIcon className="h-3.5 w-3.5" />}
              label="ETA"
              value={activeRoute.eta}
            />
          </div>

          <div className="mt-2">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">Congestion Level</span>
              <span className="text-[10px] font-semibold text-foreground">
                {activeRoute.congestionScore}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${activeRoute.congestionScore}%`,
                  backgroundColor: activeRoute.color,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Route Comparison */}
      <div>
        <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <RouteIcon className="h-3.5 w-3.5" />
          Route Comparison
        </h3>
        <div className="flex flex-col gap-1.5">
          {routes.map((route) => {
            const isSelected = route.id === selectedRouteId || (!selectedRouteId && route.isActive)
            return (
              <button
                key={route.id}
                onClick={() => onSelectRoute(route.id)}
                className={`flex items-center justify-between rounded-lg border p-2.5 text-left transition-all ${
                  isSelected
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-card hover:border-border hover:bg-secondary/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: route.color }}
                  />
                  <div>
                    <p className="text-xs font-medium text-foreground">{route.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {route.distance} km | {route.duration} min
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="rounded-md px-1.5 py-0.5 text-[10px] font-bold"
                    style={{
                      backgroundColor: `${route.color}20`,
                      color: route.color,
                    }}
                  >
                    {route.congestionScore}%
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-md bg-secondary/60 px-2 py-1.5 text-center">
      <div className="mb-0.5 flex items-center justify-center text-muted-foreground">{icon}</div>
      <p className="text-sm font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  )
}
