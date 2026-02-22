import type {
  Coordinate,
  Route,
  EmergencyVehicle,
  TrafficZone,
  Alert,
  GreenCorridor,
  DashboardStats,
  AgentStatus,
} from "./types"

// City center: New Delhi (India Gate area) for simulation
const CITY_CENTER: Coordinate = { lat: 28.6139, lng: 77.209 }

// Landmark locations in Delhi
const LANDMARKS = {
  indiaGate: { lat: 28.6129, lng: 77.2295 },
  aiims: { lat: 28.5672, lng: 77.21 },
  connaughtPlace: { lat: 28.6315, lng: 77.2167 },
  lotusTemple: { lat: 28.5535, lng: 77.2588 },
  redFort: { lat: 28.6562, lng: 77.241 },
  newDelhiStation: { lat: 28.6424, lng: 77.2195 },
  safdarjungHospital: { lat: 28.5686, lng: 77.2065 },
  igAirport: { lat: 28.5562, lng: 77.1 },
  nehruPlace: { lat: 28.5491, lng: 77.2533 },
  karolBagh: { lat: 28.6519, lng: 77.1904 },
}

function generateRouteCoords(start: Coordinate, end: Coordinate, points: number = 8): Coordinate[] {
  const coords: Coordinate[] = [start]
  for (let i = 1; i < points - 1; i++) {
    const t = i / (points - 1)
    const jitterLat = (Math.random() - 0.5) * 0.008
    const jitterLng = (Math.random() - 0.5) * 0.008
    coords.push({
      lat: start.lat + (end.lat - start.lat) * t + jitterLat,
      lng: start.lng + (end.lng - start.lng) * t + jitterLng,
    })
  }
  coords.push(end)
  return coords
}

function getCongestionLevel(score: number): "low" | "medium" | "high" | "critical" {
  if (score < 25) return "low"
  if (score < 50) return "medium"
  if (score < 75) return "high"
  return "critical"
}

export function generateRoutes(): Route[] {
  const routeConfigs = [
    {
      name: "Primary Route - Via Ring Road",
      start: LANDMARKS.aiims,
      end: LANDMARKS.redFort,
      congestion: 35,
      color: "#22c55e",
      isGreen: true,
    },
    {
      name: "Alternative 1 - Via ITO Bridge",
      start: LANDMARKS.aiims,
      end: LANDMARKS.redFort,
      congestion: 62,
      color: "#f59e0b",
      isGreen: false,
    },
    {
      name: "Alternative 2 - Via Pragati Maidan",
      start: LANDMARKS.aiims,
      end: LANDMARKS.redFort,
      congestion: 78,
      color: "#ef4444",
      isGreen: false,
    },
  ]

  return routeConfigs.map((config, index) => {
    const coords = generateRouteCoords(config.start, config.end, 10 + index * 2)
    const distance = 8 + Math.random() * 12
    const baseDuration = (distance / 30) * 60
    const congestionMultiplier = 1 + config.congestion / 100
    const duration = Math.round(baseDuration * congestionMultiplier)
    const now = new Date()
    now.setMinutes(now.getMinutes() + duration)

    return {
      id: `route-${index + 1}`,
      name: config.name,
      coordinates: coords,
      segments: coords.slice(0, -1).map((c, i) => ({
        start: c,
        end: coords[i + 1],
        congestionLevel: getCongestionLevel(config.congestion + (Math.random() - 0.5) * 20),
      })),
      distance: Math.round(distance * 10) / 10,
      duration,
      eta: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      congestionScore: config.congestion,
      isGreenCorridor: config.isGreen,
      isActive: index === 0,
      color: config.color,
    }
  })
}

export function generateEmergencyVehicles(): EmergencyVehicle[] {
  const vehicles: EmergencyVehicle[] = [
    {
      id: "ev-1",
      type: "ambulance",
      callSign: "AMB-101",
      position: { lat: 28.5786, lng: 77.2108 },
      destination: LANDMARKS.redFort,
      speed: 65,
      status: "en-route",
      activeRouteId: "route-1",
      eta: "8 min",
    },
    {
      id: "ev-2",
      type: "fire",
      callSign: "FIR-207",
      position: { lat: 28.6298, lng: 77.2185 },
      destination: LANDMARKS.nehruPlace,
      speed: 45,
      status: "responding",
      activeRouteId: "route-2",
      eta: "12 min",
    },
    {
      id: "ev-3",
      type: "police",
      callSign: "POL-305",
      position: { lat: 28.6452, lng: 77.2352 },
      destination: LANDMARKS.lotusTemple,
      speed: 72,
      status: "en-route",
      activeRouteId: "route-1",
      eta: "5 min",
    },
    {
      id: "ev-4",
      type: "ambulance",
      callSign: "AMB-108",
      position: { lat: 28.5621, lng: 77.1852 },
      destination: LANDMARKS.safdarjungHospital,
      speed: 58,
      status: "responding",
      activeRouteId: "route-3",
      eta: "15 min",
    },
  ]
  return vehicles
}

export function generateTrafficZones(): TrafficZone[] {
  return [
    {
      id: "tz-1",
      center: LANDMARKS.connaughtPlace,
      radius: 600,
      congestionLevel: "critical",
      riskScore: 85,
      incidentType: "Vehicle breakdown",
    },
    {
      id: "tz-2",
      center: { lat: 28.6205, lng: 77.2262 },
      radius: 450,
      congestionLevel: "high",
      riskScore: 68,
      incidentType: "Construction zone",
    },
    {
      id: "tz-3",
      center: LANDMARKS.karolBagh,
      radius: 500,
      congestionLevel: "high",
      riskScore: 72,
    },
    {
      id: "tz-4",
      center: { lat: 28.5958, lng: 77.2502 },
      radius: 350,
      congestionLevel: "medium",
      riskScore: 45,
    },
    {
      id: "tz-5",
      center: LANDMARKS.newDelhiStation,
      radius: 550,
      congestionLevel: "critical",
      riskScore: 90,
      incidentType: "Peak hour rush",
    },
    {
      id: "tz-6",
      center: { lat: 28.5824, lng: 77.2341 },
      radius: 300,
      congestionLevel: "medium",
      riskScore: 52,
    },
    {
      id: "tz-7",
      center: { lat: 28.6388, lng: 77.2095 },
      radius: 400,
      congestionLevel: "low",
      riskScore: 20,
    },
  ]
}

export function generateAlerts(): Alert[] {
  const now = new Date()
  return [
    {
      id: "alert-1",
      type: "emergency",
      title: "Critical: Multi-Vehicle Accident",
      message: "Major accident on Ring Road near AIIMS. All emergency units dispatched. Green corridor activated.",
      timestamp: new Date(now.getTime() - 2 * 60000),
      target: "all",
      location: LANDMARKS.aiims,
      isRead: false,
      priority: "critical",
    },
    {
      id: "alert-2",
      type: "clearance",
      title: "Green Corridor Active - Route 1",
      message: "Emergency green corridor activated from AIIMS to Red Fort. Commuters requested to clear inner lanes.",
      timestamp: new Date(now.getTime() - 5 * 60000),
      target: "commuters",
      location: LANDMARKS.indiaGate,
      isRead: false,
      priority: "high",
    },
    {
      id: "alert-3",
      type: "warning",
      title: "High Congestion - Connaught Place",
      message: "Traffic density exceeding 85% capacity. Rerouting advisory in effect for Connaught Place area.",
      timestamp: new Date(now.getTime() - 8 * 60000),
      target: "commuters",
      location: LANDMARKS.connaughtPlace,
      isRead: true,
      priority: "medium",
    },
    {
      id: "alert-4",
      type: "info",
      title: "Route Recalculated",
      message: "Optimal route for AMB-101 recalculated. New ETA: 8 minutes. Avoiding Karol Bagh congestion zone.",
      timestamp: new Date(now.getTime() - 12 * 60000),
      target: "authorities",
      isRead: true,
      priority: "low",
    },
    {
      id: "alert-5",
      type: "emergency",
      title: "Fire Reported - Nehru Place",
      message: "Structure fire reported near Nehru Place. Fire unit FIR-207 dispatched. ETA: 12 minutes.",
      timestamp: new Date(now.getTime() - 3 * 60000),
      target: "authorities",
      location: LANDMARKS.nehruPlace,
      isRead: false,
      priority: "critical",
    },
    {
      id: "alert-6",
      type: "warning",
      title: "Risk Zone Predicted - ITO",
      message: "AI prediction: Congestion risk spike expected at ITO junction in 15 minutes. Preemptive rerouting suggested.",
      timestamp: new Date(now.getTime() - 1 * 60000),
      target: "all",
      isRead: false,
      priority: "high",
    },
  ]
}

export function generateGreenCorridors(): GreenCorridor[] {
  return [
    {
      id: "gc-1",
      name: "AIIMS to Red Fort Corridor",
      coordinates: generateRouteCoords(LANDMARKS.aiims, LANDMARKS.redFort, 8),
      status: "active",
      vehicleId: "ev-1",
      clearedSegments: 5,
      totalSegments: 7,
    },
    {
      id: "gc-2",
      name: "Safdarjung to Nehru Place",
      coordinates: generateRouteCoords(LANDMARKS.safdarjungHospital, LANDMARKS.nehruPlace, 6),
      status: "pending",
      vehicleId: "ev-2",
      clearedSegments: 1,
      totalSegments: 5,
    },
  ]
}

export function generateDashboardStats(): DashboardStats {
  return {
    activeEmergencies: 3,
    avgResponseTime: "7.2 min",
    greenCorridorsActive: 2,
    congestionLevel: 67,
    vehiclesTracked: 4,
    alertsSent: 24,
  }
}

export function generateAgentStatuses(): AgentStatus[] {
  return [
    {
      name: "Data Ingestion Agent",
      status: "active",
      lastAction: "Processed 1,247 traffic data points",
      processedCount: 12847,
    },
    {
      name: "Risk Prediction Agent",
      status: "processing",
      lastAction: "Analyzing ITO junction risk pattern",
      processedCount: 856,
    },
    {
      name: "Route Planning Agent",
      status: "active",
      lastAction: "Recalculated route for AMB-101",
      processedCount: 342,
    },
    {
      name: "Alert Dispatch Agent",
      status: "active",
      lastAction: "Sent green corridor alert to commuters",
      processedCount: 1204,
    },
    {
      name: "Monitoring Agent",
      status: "idle",
      lastAction: "System health check complete",
      processedCount: 4521,
    },
  ]
}

// Animate vehicle position along route
export function interpolatePosition(
  vehicle: EmergencyVehicle,
  routes: Route[],
  progress: number
): Coordinate {
  const route = routes.find((r) => r.id === vehicle.activeRouteId)
  if (!route || route.coordinates.length < 2) return vehicle.position

  const totalSegments = route.coordinates.length - 1
  const currentSegment = Math.min(
    Math.floor(progress * totalSegments),
    totalSegments - 1
  )
  const segmentProgress = (progress * totalSegments) - currentSegment

  const start = route.coordinates[currentSegment]
  const end = route.coordinates[currentSegment + 1]

  return {
    lat: start.lat + (end.lat - start.lat) * segmentProgress,
    lng: start.lng + (end.lng - start.lng) * segmentProgress,
  }
}
