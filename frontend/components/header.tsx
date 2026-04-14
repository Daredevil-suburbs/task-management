"use client"

import { cn } from "@/lib/utils"
import { Shield, Zap } from "lucide-react"

interface HeaderProps {
  sidebarCollapsed?: boolean
}

export function Header({ sidebarCollapsed }: HeaderProps) {
  const currentXP = 2450
  const maxXP = 4000
  const xpPercentage = (currentXP / maxXP) * 100

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 transition-all duration-300",
        "bg-zinc-950/80 backdrop-blur-md border-b border-white/5",
        sidebarCollapsed ? "left-16" : "left-64"
      )}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Left: Page Title */}
        <h1 className="text-lg font-bold uppercase tracking-widest text-foreground">
          Quest Board
        </h1>

        {/* Right: Hunter Stats */}
        <div className="flex items-center gap-6">
          {/* Hunter Rank Badge */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-md rounded-full" />
              <div className="relative w-10 h-10 rounded-full bg-zinc-900 border-2 border-primary flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                <Shield className="w-5 h-5 text-primary drop-shadow-[0_0_4px_rgba(59,130,246,0.8)]" />
              </div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Hunter Rank
              </div>
              <div className="text-sm font-bold text-primary uppercase tracking-wide">
                Rank C
              </div>
            </div>
          </div>

          {/* Level */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-yellow-500" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Level
              </div>
              <div className="text-sm font-bold text-foreground">14</div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="w-48">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Experience
              </span>
              <span className="text-xs text-primary font-medium">
                {currentXP.toLocaleString()} / {maxXP.toLocaleString()} XP
              </span>
            </div>
            <div className="relative h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
              {/* Glow effect */}
              <div
                className="absolute inset-y-0 left-0 bg-primary/30 blur-sm transition-all duration-500"
                style={{ width: `${xpPercentage}%` }}
              />
              {/* Actual bar */}
              <div
                className="relative h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
