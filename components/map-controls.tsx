"use client"

import { Layers, Eye, EyeOff, Shield, Thermometer } from "lucide-react"

interface MapControlsProps {
  showHeatmap: boolean
  showGreenCorridors: boolean
  onToggleHeatmap: () => void
  onToggleGreenCorridors: () => void
}

export default function MapControls({
  showHeatmap,
  showGreenCorridors,
  onToggleHeatmap,
  onToggleGreenCorridors,
}: MapControlsProps) {
  return (
    <div className="absolute left-3 top-3 z-[1000] flex flex-col gap-1.5">
      <div className="rounded-lg border border-border bg-card/95 p-1.5 shadow-lg backdrop-blur-sm">
        <div className="mb-1 flex items-center gap-1 px-1.5 py-0.5">
          <Layers className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Map Layers
          </span>
        </div>

        <ControlButton
          icon={<Thermometer className="h-3.5 w-3.5" />}
          label="Congestion Heatmap"
          active={showHeatmap}
          onClick={onToggleHeatmap}
          activeColor="#ef4444"
        />

        <ControlButton
          icon={<Shield className="h-3.5 w-3.5" />}
          label="Green Corridors"
          active={showGreenCorridors}
          onClick={onToggleGreenCorridors}
          activeColor="#22c55e"
        />
      </div>
    </div>
  )
}

function ControlButton({
  icon,
  label,
  active,
  onClick,
  activeColor,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
  activeColor: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors ${
        active ? "bg-secondary" : "hover:bg-secondary/50"
      }`}
    >
      <span style={{ color: active ? activeColor : "var(--muted-foreground)" }}>
        {icon}
      </span>
      <span
        className={`flex-1 text-[11px] font-medium ${
          active ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
      {active ? (
        <Eye className="h-3 w-3 text-foreground" />
      ) : (
        <EyeOff className="h-3 w-3 text-muted-foreground" />
      )}
    </button>
  )
}
