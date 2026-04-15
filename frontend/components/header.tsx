"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Shield, Zap } from "lucide-react"
import { fetchUserStatus, type UserStatus } from "@/lib/api"

interface HeaderProps {
  sidebarCollapsed?: boolean
}

export function Header({ sidebarCollapsed }: HeaderProps) {
  const [status, setStatus] = useState<UserStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadStatus() {
      try {
        const data = await fetchUserStatus()
        if (!cancelled) setStatus(data)
      } catch (err) {
        console.error("Failed to fetch user status:", err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadStatus()

    // Poll every 30s to keep XP/level fresh
    const interval = setInterval(loadStatus, 30000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  // Derive XP bar values
  const currentXP = status?.totalXp ?? 0
  const level = status?.level ?? 1
  const xpToNext = status?.xpToNextLevel ?? 100
  // XP within the current level: each level = 100 XP (from HunterRank.levelFromXp)
  const xpInLevel = currentXP % 100
  const maxXPInLevel = 100
  const xpPercentage = (xpInLevel / maxXPInLevel) * 100

  const hunterRank = status?.hunterRank ?? "E Rank"

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
              {isLoading ? (
                <div className="h-4 w-14 rounded bg-white/5 animate-pulse mt-0.5" />
              ) : (
                <div className="text-sm font-bold text-primary uppercase tracking-wide">
                  {hunterRank}
                </div>
              )}
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
              {isLoading ? (
                <div className="h-4 w-6 rounded bg-white/5 animate-pulse mt-0.5" />
              ) : (
                <div className="text-sm font-bold text-foreground">{level}</div>
              )}
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="w-48">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Experience
              </span>
              {isLoading ? (
                <div className="h-3 w-24 rounded bg-white/5 animate-pulse" />
              ) : (
                <span className="text-xs text-primary font-medium">
                  {currentXP.toLocaleString()} XP (Lv {level})
                </span>
              )}
            </div>
            <div className="relative h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
              {/* Glow effect */}
              <div
                className="absolute inset-y-0 left-0 bg-primary/30 blur-sm transition-all duration-500"
                style={{ width: `${isLoading ? 0 : xpPercentage}%` }}
              />
              {/* Actual bar */}
              <div
                className="relative h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                style={{ width: `${isLoading ? 0 : xpPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
