"use client"

import { Suspense, useState, useEffect, useCallback, useRef } from "react"
import { useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import DashboardHeader from "@/components/dashboard-header"
import RoutePanel from "@/components/route-panel"
import VehicleTracker from "@/components/vehicle-tracker"
import AlertsPanel from "@/components/alerts-panel"
import AgentStatusPanel from "@/components/agent-status-panel"
import MapControls from "@/components/map-controls"
import {
  generateRoutes,
  generateEmergencyVehicles,
  generateTrafficZones,
  generateAlerts,
  generateGreenCorridors,
  generateDashboardStats,
  generateAgentStatuses,
  interpolatePosition,
} from "@/lib/simulation"
import type {
  Route,
  EmergencyVehicle,
  TrafficZone,
  Alert,
  GreenCorridor,
  DashboardStats,
  AgentStatus,
} from "@/lib/types"
import {
  ChevronLeft,
  ChevronRight,
  PanelLeftOpen,
} from "lucide-react"

const MapDashboard = dynamic(() => import("@/components/map-dashboard"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm text-muted-foreground">Loading satellite map...</span>
      </div>
    </div>
  ),
})

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm text-muted-foreground">Initializing agents...</span>
          </div>
        </div>
      }
    >
      <RapidAidDashboard />
    </Suspense>
  )
}

function RapidAidDashboard() {
  const searchParams = useSearchParams()
  const origin = searchParams.get("origin") || "AIIMS Hospital"
  const destination = searchParams.get("destination") || "Red Fort"

  const [routes, setRoutes] = useState<Route[]>([])
  const [vehicles, setVehicles] = useState<EmergencyVehicle[]>([])
  const [trafficZones, setTrafficZones] = useState<TrafficZone[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [greenCorridors, setGreenCorridors] = useState<GreenCorridor[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    activeEmergencies: 0,
    avgResponseTime: "--",
    greenCorridorsActive: 0,
    congestionLevel: 0,
    vehiclesTracked: 0,
    alertsSent: 0,
  })
  const [agents, setAgents] = useState<AgentStatus[]>([])

  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [showGreenCorridors, setShowGreenCorridors] = useState(true)
  const [showAlerts, setShowAlerts] = useState(false)
  const [alertFilter, setAlertFilter] = useState<"all" | "authorities" | "commuters">("all")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const vehicleProgressRef = useRef<Record<string, number>>({})

  useEffect(() => {
    setRoutes(generateRoutes())
    setVehicles(generateEmergencyVehicles())
    setTrafficZones(generateTrafficZones())
    setAlerts(generateAlerts())
    setGreenCorridors(generateGreenCorridors())
    setStats(generateDashboardStats())
    setAgents(generateAgentStatuses())

    vehicleProgressRef.current = {
      "ev-1": 0.15,
      "ev-2": 0.05,
      "ev-3": 0.35,
      "ev-4": 0.1,
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => {
          const progress = vehicleProgressRef.current[v.id] || 0
          const newProgress = Math.min(progress + 0.008 + Math.random() * 0.005, 0.95)
          vehicleProgressRef.current[v.id] = newProgress

          const newPos = interpolatePosition(v, routes, newProgress)
          const remainingMin = Math.max(1, Math.round((1 - newProgress) * 20))

          return {
            ...v,
            position: newPos,
            speed: Math.round(40 + Math.random() * 40),
            eta: `${remainingMin} min`,
          }
        })
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [routes])

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((a) => ({
          ...a,
          processedCount: a.processedCount + Math.floor(Math.random() * 10),
          status:
            Math.random() > 0.8
              ? "processing"
              : Math.random() > 0.3
                ? "active"
                : "idle",
        }))
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        congestionLevel: Math.min(100, Math.max(30, prev.congestionLevel + Math.round((Math.random() - 0.5) * 8))),
        alertsSent: prev.alertsSent + Math.floor(Math.random() * 3),
      }))
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const handleDismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isRead: true } : a)))
  }, [])

  const unreadAlertCount = alerts.filter((a) => !a.isRead).length

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <DashboardHeader
        stats={stats}
        alertCount={unreadAlertCount}
        onToggleAlerts={() => setShowAlerts((p) => !p)}
        origin={origin}
        destination={destination}
      />

      <div className="relative flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`relative flex shrink-0 flex-col border-r border-border bg-card transition-all duration-300 ${
            sidebarCollapsed ? "w-0 overflow-hidden" : "w-80"
          }`}
        >
          <div className="flex-1 overflow-y-auto p-3">
            <div className="flex flex-col gap-4">
              <RoutePanel
                routes={routes}
                selectedRouteId={selectedRouteId}
                onSelectRoute={setSelectedRouteId}
              />
              <VehicleTracker vehicles={vehicles} />
              <AgentStatusPanel agents={agents} />
            </div>
          </div>

          <button
            onClick={() => setSidebarCollapsed((p) => !p)}
            className="absolute -right-3 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-md hover:text-foreground"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </button>
        </aside>

        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="absolute left-0 top-4 z-10 flex items-center gap-1 rounded-r-lg border border-l-0 border-border bg-card px-2 py-1.5 text-muted-foreground shadow-md hover:text-foreground"
            aria-label="Open sidebar"
          >
            <PanelLeftOpen className="h-3.5 w-3.5" />
          </button>
        )}

        <main className="relative flex-1">
          <MapDashboard
            routes={routes}
            vehicles={vehicles}
            trafficZones={trafficZones}
            greenCorridors={greenCorridors}
            selectedRouteId={selectedRouteId}
            showHeatmap={showHeatmap}
            showGreenCorridors={showGreenCorridors}
          />

          <MapControls
            showHeatmap={showHeatmap}
            showGreenCorridors={showGreenCorridors}
            onToggleHeatmap={() => setShowHeatmap((p) => !p)}
            onToggleGreenCorridors={() => setShowGreenCorridors((p) => !p)}
          />

          <div className="absolute bottom-4 left-3 z-[1000] rounded-lg border border-border bg-card/95 p-3 shadow-lg backdrop-blur-sm">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                City Congestion
              </span>
              <span className="text-sm font-bold text-foreground">
                {stats.congestionLevel}%
              </span>
            </div>
            <div className="h-2 w-40 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${stats.congestionLevel}%`,
                  background: stats.congestionLevel > 75
                    ? "linear-gradient(90deg, #f59e0b, #ef4444)"
                    : stats.congestionLevel > 50
                      ? "linear-gradient(90deg, #22c55e, #f59e0b)"
                      : "#22c55e",
                }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
              <span>Critical</span>
            </div>
          </div>

          <div className="absolute bottom-4 right-3 z-[1000] rounded-lg border border-border bg-card/95 p-3 shadow-lg backdrop-blur-sm">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Legend
            </span>
            <div className="flex flex-col gap-1">
              <LegendItem color="#22c55e" label="Green Corridor / Low" />
              <LegendItem color="#f59e0b" label="Medium Congestion" />
              <LegendItem color="#ef4444" label="High / Emergency" />
              <LegendItem color="#3b82f6" label="Police Unit" />
              <LegendItem color="#f97316" label="Fire Unit" />
            </div>
          </div>
        </main>

        <AlertsPanel
          alerts={alerts}
          isOpen={showAlerts}
          onClose={() => setShowAlerts(false)}
          onDismiss={handleDismissAlert}
          filterTarget={alertFilter}
          onFilterChange={setAlertFilter}
        />
      </div>
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  )
}
