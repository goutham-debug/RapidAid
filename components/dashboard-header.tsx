"use client"

import {
  Activity,
  Bell,
  Shield,
  Zap,
  MapPin,
  ArrowRight,
} from "lucide-react"
import type { DashboardStats } from "@/lib/types"

interface DashboardHeaderProps {
  stats: DashboardStats
  alertCount: number
  onToggleAlerts: () => void
  origin?: string
  destination?: string
}

export default function DashboardHeader({ stats, alertCount, onToggleAlerts, origin, destination }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-2.5">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none tracking-tight text-foreground">
              RapidAid
            </h1>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Emergency Mobility Platform
            </p>
          </div>
        </div>

        {origin && destination && (
          <>
            <div className="mx-2 h-6 w-px bg-border" />
            <div className="hidden items-center gap-1.5 rounded-lg bg-secondary/70 px-3 py-1.5 md:flex">
              <MapPin className="h-3 w-3 text-primary" />
              <span className="max-w-[120px] truncate text-xs font-medium text-foreground">{origin}</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <MapPin className="h-3 w-3 text-destructive" />
              <span className="max-w-[120px] truncate text-xs font-medium text-foreground">{destination}</span>
            </div>
          </>
        )}

        <div className="mx-4 h-6 w-px bg-border" />

        <div className="hidden items-center gap-5 md:flex">
          <StatChip
            icon={<Activity className="h-3.5 w-3.5" />}
            label="Active"
            value={stats.activeEmergencies.toString()}
            color="text-destructive"
          />
          <StatChip
            icon={<Shield className="h-3.5 w-3.5" />}
            label="Green Corridors"
            value={stats.greenCorridorsActive.toString()}
            color="text-primary"
          />
          <StatChip
            label="Avg Response"
            value={stats.avgResponseTime}
            color="text-warning"
          />
          <StatChip
            label="Vehicles"
            value={stats.vehiclesTracked.toString()}
            color="text-foreground"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-xs font-semibold text-primary">LIVE</span>
        </div>

        <button
          onClick={onToggleAlerts}
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Toggle alerts panel"
        >
          <Bell className="h-4 w-4" />
          {alertCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {alertCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}

function StatChip({
  icon,
  label,
  value,
  color,
}: {
  icon?: React.ReactNode
  label: string
  value: string
  color: string
}) {
  return (
    <div className="flex items-center gap-1.5">
      {icon && <span className={color}>{icon}</span>}
      <span className="text-[11px] text-muted-foreground">{label}:</span>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  )
}
