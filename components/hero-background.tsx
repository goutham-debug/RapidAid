"use client"

import { useEffect, useRef } from "react"

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let width = window.innerWidth
    let height = window.innerHeight

    canvas.width = width
    canvas.height = height

    // Grid nodes
    const nodes: { x: number; y: number; vx: number; vy: number; radius: number }[] = []
    const NODE_COUNT = 60

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 1.5 + Math.random() * 1.5,
      })
    }

    // Pulse rings emanating from center
    const pulses: { x: number; y: number; radius: number; maxRadius: number; opacity: number }[] = []
    let pulseTimer = 0

    function addPulse() {
      pulses.push({
        x: width / 2,
        y: height * 0.42,
        radius: 10,
        maxRadius: 350,
        opacity: 0.3,
      })
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height)

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 180) {
            const opacity = (1 - dist / 180) * 0.08
            ctx!.strokeStyle = `rgba(56, 189, 148, ${opacity})`
            ctx!.lineWidth = 0.5
            ctx!.beginPath()
            ctx!.moveTo(nodes[i].x, nodes[i].y)
            ctx!.lineTo(nodes[j].x, nodes[j].y)
            ctx!.stroke()
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        node.x += node.vx
        node.y += node.vy
        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1

        ctx!.beginPath()
        ctx!.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx!.fillStyle = "rgba(56, 189, 148, 0.3)"
        ctx!.fill()
      }

      // Draw pulse rings
      pulseTimer++
      if (pulseTimer % 120 === 0) addPulse()

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]
        p.radius += 1.5
        p.opacity = 0.3 * (1 - p.radius / p.maxRadius)

        if (p.radius >= p.maxRadius) {
          pulses.splice(i, 1)
          continue
        }

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx!.strokeStyle = `rgba(56, 189, 148, ${p.opacity})`
        ctx!.lineWidth = 1.5
        ctx!.stroke()
      }

      // Scanning line
      const scanY = (Date.now() / 30) % height
      const scanGrad = ctx!.createLinearGradient(0, scanY - 2, 0, scanY + 2)
      scanGrad.addColorStop(0, "rgba(56, 189, 148, 0)")
      scanGrad.addColorStop(0.5, "rgba(56, 189, 148, 0.06)")
      scanGrad.addColorStop(1, "rgba(56, 189, 148, 0)")
      ctx!.fillStyle = scanGrad
      ctx!.fillRect(0, scanY - 30, width, 60)

      animationId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    />
  )
}
