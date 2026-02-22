import { NextResponse } from "next/server"
import {
  generateRoutes,
  generateEmergencyVehicles,
  generateTrafficZones,
  generateAlerts,
  generateGreenCorridors,
  generateDashboardStats,
  generateAgentStatuses,
} from "@/lib/simulation"

// GET: Fetch full simulation state
export async function GET() {
  const data = {
    routes: generateRoutes(),
    vehicles: generateEmergencyVehicles(),
    trafficZones: generateTrafficZones(),
    alerts: generateAlerts(),
    greenCorridors: generateGreenCorridors(),
    stats: generateDashboardStats(),
    agents: generateAgentStatuses(),
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(data)
}

// POST: Trigger agent actions (simulate agentic AI)
export async function POST(request: Request) {
  const body = await request.json()
  const { action, payload } = body

  switch (action) {
    case "recalculate_route": {
      // Route Planning Agent: Recalculates optimal route
      const routes = generateRoutes()
      return NextResponse.json({
        agent: "Route Planning Agent",
        action: "recalculate_route",
        result: {
          routes,
          message: `Route recalculated for vehicle ${payload?.vehicleId || "unknown"}. New optimal path via Ring Road with ${routes[0].congestionScore}% congestion.`,
        },
        timestamp: new Date().toISOString(),
      })
    }

    case "predict_risk": {
      // Risk Prediction Agent: Analyzes congestion patterns
      const zones = generateTrafficZones()
      const criticalZones = zones.filter((z) => z.riskScore > 70)
      return NextResponse.json({
        agent: "Risk Prediction Agent",
        action: "predict_risk",
        result: {
          criticalZones,
          prediction: `Identified ${criticalZones.length} high-risk zones. Congestion spike predicted at ITO junction in 15 minutes.`,
          confidence: 0.87,
        },
        timestamp: new Date().toISOString(),
      })
    }

    case "dispatch_alert": {
      // Alert Dispatch Agent: Sends notifications
      return NextResponse.json({
        agent: "Alert Dispatch Agent",
        action: "dispatch_alert",
        result: {
          alertId: `alert-${Date.now()}`,
          dispatched: true,
          targets: payload?.target || "all",
          message: payload?.message || "Emergency alert dispatched to all units.",
        },
        timestamp: new Date().toISOString(),
      })
    }

    case "activate_green_corridor": {
      // Route Planning + Alert Dispatch: Activate green corridor
      const corridors = generateGreenCorridors()
      return NextResponse.json({
        agent: "Route Planning Agent + Alert Dispatch Agent",
        action: "activate_green_corridor",
        result: {
          corridor: corridors[0],
          signalChanges: 12,
          commuters_alerted: 1847,
          message: "Green corridor activated. Traffic signals adjusted for priority passage.",
        },
        timestamp: new Date().toISOString(),
      })
    }

    case "ingest_data": {
      // Data Ingestion Agent: Process incoming traffic data
      return NextResponse.json({
        agent: "Data Ingestion Agent",
        action: "ingest_data",
        result: {
          dataPointsProcessed: Math.floor(Math.random() * 500) + 800,
          sources: ["traffic_sensors", "gps_feeds", "incident_reports"],
          latency: `${Math.floor(Math.random() * 50) + 10}ms`,
          message: "Traffic data ingested and processed. All sensors reporting nominal.",
        },
        timestamp: new Date().toISOString(),
      })
    }

    default:
      return NextResponse.json(
        { error: "Unknown agent action", availableActions: [
          "recalculate_route", "predict_risk", "dispatch_alert",
          "activate_green_corridor", "ingest_data"
        ]},
        { status: 400 }
      )
  }
}
