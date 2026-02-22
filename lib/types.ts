export interface Coordinate {
  lat: number
  lng: number
}

export interface RouteSegment {
  start: Coordinate
  end: Coordinate
  congestionLevel: "low" | "medium" | "high" | "critical"
}

export interface Route {
  id: string
  name: string
  coordinates: Coordinate[]
  segments: RouteSegment[]
  distance: number // in km
  duration: number // in minutes
  eta: string
  congestionScore: number // 0-100
  isGreenCorridor: boolean
  isActive: boolean
  color: string
}

export interface EmergencyVehicle {
  id: string
  type: "ambulance" | "fire" | "police"
  callSign: string
  position: Coordinate
  destination: Coordinate
  speed: number
  status: "responding" | "en-route" | "on-scene" | "returning"
  activeRouteId: string
  eta: string
}

export interface TrafficZone {
  id: string
  center: Coordinate
  radius: number
  congestionLevel: "low" | "medium" | "high" | "critical"
  riskScore: number
  incidentType?: string
}

export interface Alert {
  id: string
  type: "emergency" | "warning" | "info" | "clearance"
  title: string
  message: string
  timestamp: Date
  target: "authorities" | "commuters" | "all"
  location?: Coordinate
  isRead: boolean
  priority: "low" | "medium" | "high" | "critical"
}

export interface GreenCorridor {
  id: string
  name: string
  coordinates: Coordinate[]
  status: "active" | "pending" | "expired"
  vehicleId: string
  clearedSegments: number
  totalSegments: number
}

export interface DashboardStats {
  activeEmergencies: number
  avgResponseTime: string
  greenCorridorsActive: number
  congestionLevel: number
  vehiclesTracked: number
  alertsSent: number
}

export interface AgentStatus {
  name: string
  status: "active" | "idle" | "processing" | "error"
  lastAction: string
  processedCount: number
}
