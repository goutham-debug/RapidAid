"use client"

import { Bot, Cpu } from "lucide-react"
import type { AgentStatus } from "@/lib/types"

interface AgentStatusPanelProps {
  agents: AgentStatus[]
}

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  active: { color: "#22c55e", label: "Active" },
  idle: { color: "#6b7280", label: "Idle" },
  processing: { color: "#f59e0b", label: "Processing" },
  error: { color: "#ef4444", label: "Error" },
}

export default function AgentStatusPanel({ agents }: AgentStatusPanelProps) {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Bot className="h-3.5 w-3.5" />
        AI Agent Status
      </h3>
      <div className="flex flex-col gap-1">
        {agents.map((agent) => {
          const status = STATUS_CONFIG[agent.status]
          return (
            <div
              key={agent.name}
              className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 p-2"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary">
                <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-foreground">
                    {agent.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <span
                      className="text-[9px] font-semibold uppercase"
                      style={{ color: status.color }}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {agent.lastAction}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
