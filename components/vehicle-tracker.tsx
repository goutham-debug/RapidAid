"use client"

import { Truck, Flame, Shield, Navigation } from "lucide-react"
import type { EmergencyVehicle } from "@/lib/types"

interface VehicleTrackerProps {
  vehicles: EmergencyVehicle[]
}

const VEHICLE_CONFIG = {
  ambulance: {
    icon: Truck,
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.1)",
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  fire: {
    icon: Flame,
    color: "#f97316",
    bgColor: "rgba(249, 115, 22, 0.1)",
    borderColor: "rgba(249, 115, 22, 0.3)",
  },
  police: {
    icon: Shield,
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.1)",
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  responding: { label: "RESPONDING", color: "#ef4444" },
  "en-route": { label: "EN ROUTE", color: "#f59e0b" },
  "on-scene": { label: "ON SCENE", color: "#22c55e" },
  returning: { label: "RETURNING", color: "#8b5cf6" },
}

export default function VehicleTracker({ vehicles }: VehicleTrackerProps) {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Navigation className="h-3.5 w-3.5" />
        Emergency Vehicles
      </h3>
      <div className="flex flex-col gap-1.5">
        {vehicles.map((vehicle) => {
          const config = VEHICLE_CONFIG[vehicle.type]
          const status = STATUS_LABELS[vehicle.status]
          const Icon = config.icon
          return (
            <div
              key={vehicle.id}
              className="flex items-center gap-2.5 rounded-lg border p-2.5"
              style={{
                borderColor: config.borderColor,
                backgroundColor: config.bgColor,
              }}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${config.color}20` }}
              >
                <Icon className="h-4 w-4" style={{ color: config.color }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    {vehicle.callSign}
                  </span>
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase"
                    style={{
                      backgroundColor: `${status.color}20`,
                      color: status.color,
                    }}
                  >
                    {status.label}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>{vehicle.speed} km/h</span>
                  <span>|</span>
                  <span>ETA: {vehicle.eta}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
