"use client"

import {
  AlertTriangle,
  Bell,
  Info,
  ShieldCheck,
  X,
  Users,
  Building2,
} from "lucide-react"
import type { Alert } from "@/lib/types"

interface AlertsPanelProps {
  alerts: Alert[]
  isOpen: boolean
  onClose: () => void
  onDismiss: (id: string) => void
  filterTarget: "all" | "authorities" | "commuters"
  onFilterChange: (target: "all" | "authorities" | "commuters") => void
}

const ALERT_CONFIG = {
  emergency: {
    icon: AlertTriangle,
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.08)",
    borderColor: "rgba(239, 68, 68, 0.25)",
  },
  warning: {
    icon: Bell,
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.08)",
    borderColor: "rgba(245, 158, 11, 0.25)",
  },
  info: {
    icon: Info,
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.08)",
    borderColor: "rgba(59, 130, 246, 0.25)",
  },
  clearance: {
    icon: ShieldCheck,
    color: "#22c55e",
    bgColor: "rgba(34, 197, 94, 0.08)",
    borderColor: "rgba(34, 197, 94, 0.25)",
  },
}

const PRIORITY_DOT: Record<string, string> = {
  critical: "#ef4444",
  high: "#f59e0b",
  medium: "#3b82f6",
  low: "#6b7280",
}

export default function AlertsPanel({
  alerts,
  isOpen,
  onClose,
  onDismiss,
  filterTarget,
  onFilterChange,
}: AlertsPanelProps) {
  const filteredAlerts =
    filterTarget === "all"
      ? alerts
      : alerts.filter((a) => a.target === filterTarget || a.target === "all")

  function formatTimeAgo(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    if (diffMin < 1) return "Just now"
    if (diffMin < 60) return `${diffMin}m ago`
    const diffHr = Math.floor(diffMin / 60)
    return `${diffHr}h ago`
  }

  if (!isOpen) return null

  return (
    <div className="absolute right-0 top-0 z-50 flex h-full w-80 flex-col border-l border-border bg-card shadow-2xl">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Alerts & Notifications</h2>
          <span className="rounded-full bg-destructive/15 px-1.5 py-0.5 text-[10px] font-bold text-destructive">
            {alerts.filter((a) => !a.isRead).length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label="Close alerts"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-border px-2 py-1.5">
        {[
          { key: "all" as const, label: "All", icon: Bell },
          { key: "authorities" as const, label: "Authorities", icon: Building2 },
          { key: "commuters" as const, label: "Commuters", icon: Users },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => onFilterChange(tab.key)}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              filterTarget === tab.key
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-3 w-3" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex flex-col gap-1.5">
          {filteredAlerts.map((alert) => {
            const config = ALERT_CONFIG[alert.type]
            const Icon = config.icon
            return (
              <div
                key={alert.id}
                className={`relative rounded-lg border p-3 transition-all ${alert.isRead ? "opacity-60" : ""}`}
                style={{
                  borderColor: config.borderColor,
                  backgroundColor: config.bgColor,
                }}
              >
                <div className="flex items-start gap-2">
                  <div
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                    style={{ backgroundColor: `${config.color}15` }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: config.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-semibold text-foreground">
                        {alert.title}
                      </h4>
                      <button
                        onClick={() => onDismiss(alert.id)}
                        className="shrink-0 text-muted-foreground hover:text-foreground"
                        aria-label="Dismiss alert"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
                      {alert.message}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: PRIORITY_DOT[alert.priority] }}
                        />
                        <span className="text-[9px] font-medium uppercase text-muted-foreground">
                          {alert.priority}
                        </span>
                      </div>
                      <span className="text-[9px] text-muted-foreground">
                        {formatTimeAgo(alert.timestamp)}
                      </span>
                      <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[9px] text-muted-foreground">
                        {alert.target}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
