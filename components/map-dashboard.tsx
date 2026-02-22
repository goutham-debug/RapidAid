"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet.heat"

const TOMTOM_KEY = process.env.NEXT_PUBLIC_TOMTOM_KEY

// ==============================
// GEOCODE
// ==============================
async function geocode(place:string){

  const res = await fetch(
    `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(place)}.json?key=${TOMTOM_KEY}`
  )

  const data = await res.json()

  return data.results?.[0]?.position || null
}

// ==============================
// GET ROUTES
// ==============================
async function getRoutes(origin:any,destination:any){

  const originLat = origin.lat
  const originLng = origin.lng ?? origin.lon

  const destLat = destination.lat
  const destLng = destination.lng ?? destination.lon

  const url =
`https://api.tomtom.com/routing/1/calculateRoute/${originLat},${originLng}:${destLat},${destLng}/json?traffic=true&maxAlternatives=2&computeTravelTimeFor=all&sectionType=traffic&key=${TOMTOM_KEY}`

  const res = await fetch(url)
  const data = await res.json()

  return data.routes || []
}

export default function MapDashboard(){

  const searchParams = useSearchParams()

  const origin = searchParams.get("origin")
  const destination = searchParams.get("destination")

  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const layerGroupRef = useRef<L.LayerGroup | null>(null)

  const [routes,setRoutes] = useState<any[]>([])
  const [originCoords,setOriginCoords] = useState<any>(null)
  const [destCoords,setDestCoords] = useState<any>(null)

  // ==============================
  // INIT MAP (RUN ONLY ONCE)
  // ==============================
  useEffect(()=>{

    if(mapRef.current || !mapContainerRef.current) return

    const map = L.map(mapContainerRef.current,{
      center:[12.9716,77.5946],
      zoom:12
    })

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    ).addTo(map)

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
      { subdomains:"abcd", maxZoom:19 }
    ).addTo(map)

    layerGroupRef.current = L.layerGroup().addTo(map)

    mapRef.current = map

  },[])

  // ==============================
  // LOAD ROUTES
  // ==============================
  useEffect(()=>{

    async function load(){

      if(!origin || !destination) return

      let o:any

      if(origin.toLowerCase().includes("current")){
        o = await new Promise(resolve=>{
          navigator.geolocation.getCurrentPosition(pos=>{
            resolve({
              lat:pos.coords.latitude,
              lng:pos.coords.longitude
            })
          })
        })
      }else{
        o = await geocode(origin)
      }

      const d = await geocode(destination)

      if(!o || !d) return

      setOriginCoords(o)
      setDestCoords(d)

      const r = await getRoutes(o,d)

      setRoutes(r)
    }

    load()

  },[origin,destination])

  // ==============================
  // DRAW EVERYTHING (ONE PLACE)
  // ==============================
  useEffect(()=>{

    const map = mapRef.current
    const group = layerGroupRef.current

    if(!map || !group) return
    if(routes.length===0) return

    group.clearLayers()

    const colors=["#22c55e","#facc15","#ef4444"]

    routes.forEach((routeData,index)=>{

      const points = routeData?.legs?.[0]?.points
      if(!points) return

      const latLngs = points.map((p:any)=>[p.latitude,p.longitude])

      // main route glow
      if(index===0){

        L.polyline(latLngs,{
          color:"#22c55e",
          weight:14,
          opacity:0.15
        }).addTo(group)

        // heatmap
        const heatPoints = points.map((p:any)=>[
          p.latitude,
          p.longitude,
          Math.random()
        ])

        ;(L as any).heatLayer(heatPoints,{
          radius:25,
          blur:20
        }).addTo(group)

        // green corridor overlay
        L.polyline(latLngs,{
          color:"#00ff88",
          weight:8,
          opacity:0.3,
          dashArray:"12,12"
        }).addTo(group)
      }

      const line=L.polyline(latLngs,{
        color:colors[index],
        weight:index===0?6:4,
        opacity:index===0?1:0.7
      }).addTo(group)

      if(index===0){
        map.fitBounds(line.getBounds(),{padding:[50,50]})
      }
    })

    // markers
    if(originCoords){
      L.marker([
        originCoords.lat,
        originCoords.lng ?? originCoords.lon
      ]).addTo(group)
    }

    if(destCoords){
      L.marker([
        destCoords.lat,
        destCoords.lng ?? destCoords.lon
      ]).addTo(group)
    }

  },[routes,originCoords,destCoords])

  return(
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full"/>
    </div>
  )
}