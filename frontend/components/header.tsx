"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Shield, Zap, Loader2 } from "lucide-react"
import { getUserStatus, type UserStatus } from "@/lib/api"

interface HeaderProps {
  sidebarCollapsed?: boolean
  /** Increment this counter to trigger a re-fetch of user stats */
  refreshKey?: number
}

export function Header({ sidebarCollapsed, refreshKey = 0 }: HeaderProps) {
  const [status, setStatus] = useState<UserStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  const fetchStatus = useCallback(async () => {
    try {
      const data = await getUserStatus()
      setStatus((prev) => {
        // Trigger XP animation if XP changed
        if (prev && data.totalXp !== prev.totalXp) {
          setIsAnimating(true)
          setTimeout(() => setIsAnimating(false), 1000)
        }
        return data
      })
    } catch (err) {
      console.error("Failed to fetch status:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch on mount + whenever refreshKey changes (quest completed)
  useEffect(() => {
    fetchStatus()
  }, [fetchStatus, refreshKey])

  // Calculate XP progress bar percentage
  const xpPercentage = status
    ? status.maxRank
      ? 100
      : status.xpToNextRank > 0
      ? ((status.xpToNextRank - (status.xpToNextRank - 0)) /
          (status.xpToNextRank + (status.totalXp - (status.totalXp - status.xpToNextRank < 0 ? 0 : 0)))) *
        100
      : 0
    : 0

  // Simpler calculation: XP within current rank as percentage to next rank
  const currentRankProgress = status
    ? status.maxRank
      ? 100
      : status.xpToNextRank > 0
      ? Math.round(
          ((status.totalXp % (status.xpToNextRank + status.totalXp)) /
            (status.xpToNextRank + status.totalXp)) *
            100 *
            10
        ) / 10
      : 100
    : 0

  // Better: use totalXp and xpToNextRank to get a meaningful bar
  // xpToNextRank = how much MORE xp needed. So progress = 1 - (xpToNextRank / rankSpan)
  // We can estimate rankSpan from the rank thresholds, but simpler to show totalXp/nextRankXp
  const nextRankTotalXp = status ? status.totalXp + status.xpToNextRank : 1
  const progressPercent = status
    ? status.maxRank
      ? 100
      : Math.min(100, Math.round((status.totalXp / nextRankTotalXp) * 100))
    : 0

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
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs uppercase tracking-wider">Loading...</span>
          </div>
        ) : status ? (
          <div className="flex items-center gap-6">
            {/* Hunter Rank Badge */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className={cn(
                  "absolute inset-0 bg-primary/30 blur-md rounded-full transition-all duration-500",
                  isAnimating && "bg-yellow-400/50 blur-lg"
                )} />
                <div className={cn(
                  "relative w-10 h-10 rounded-full bg-zinc-900 border-2 border-primary flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all duration-500",
                  isAnimating && "border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.6)]"
                )}>
                  <Shield className={cn(
                    "w-5 h-5 text-primary drop-shadow-[0_0_4px_rgba(59,130,246,0.8)] transition-all duration-500",
                    isAnimating && "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]"
                  )} />
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Hunter Rank
                </div>
                <div className={cn(
                  "text-sm font-bold text-primary uppercase tracking-wide transition-all duration-500",
                  isAnimating && "text-yellow-400"
                )}>
                  {status.hunterRank}
                </div>
              </div>
            </div>

            {/* Level */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center">
                <Zap className={cn(
                  "w-4 h-4 text-yellow-500 transition-all duration-500",
                  isAnimating && "text-yellow-300 drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]"
                )} />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Level
                </div>
                <div className={cn(
                  "text-sm font-bold text-foreground transition-all duration-300",
                  isAnimating && "text-yellow-400"
                )}>
                  {status.level}
                </div>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="w-48">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Experience
                </span>
                <span className={cn(
                  "text-xs text-primary font-medium transition-all duration-500",
                  isAnimating && "text-yellow-400"
                )}>
                  {status.totalXp.toLocaleString()} XP
                </span>
              </div>
              <div className="relative h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                {/* Glow effect */}
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 bg-primary/30 blur-sm transition-all duration-700",
                    isAnimating && "bg-yellow-400/40"
                  )}
                  style={{ width: `${progressPercent}%` }}
                />
                {/* Actual bar */}
                <div
                  className={cn(
                    "relative h-full bg-linear-to-r from-primary to-blue-400 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(59,130,246,0.6)]",
                    isAnimating && "from-yellow-500 to-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.6)]"
                  )}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {!status.maxRank && (
                <div className="text-[9px] text-muted-foreground mt-0.5 text-right">
                  {status.xpToNextRank.toLocaleString()} XP to next rank
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}
