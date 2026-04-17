"use client"

import { useState } from "react"
import { logDailyStats, getSystemPrediction } from "@/lib/api"
import { Zap, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface HunterStats {
  mood: number
  energy: number
  focus: number
  sleep: string
  potionsTaken: boolean
}

export function SystemInsightPanel() {
  const [stats, setStats] = useState<HunterStats>({
    mood: 3,
    energy: 3,
    focus: 3,
    sleep: "7",
    potionsTaken: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPrediction, setShowPrediction] = useState(false)
  const [predictionLoading, setPredictionLoading] = useState(false)
  const [predictionData, setPredictionData] = useState<{ recommendation: string; status: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSliderChange = (key: keyof Omit<HunterStats, "sleep" | "potionsTaken">, value: number) => {
    setStats((prev: HunterStats) => ({ ...prev, [key]: value }))
  }

  const handleSleepChange = (value: string) => {
    setStats((prev: HunterStats) => ({ ...prev, sleep: value }))
  }

  const handlePotionsChange = (checked: boolean) => {
    setStats((prev: HunterStats) => ({ ...prev, potionsTaken: checked }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      // 1. Log the stats to the backend
      await logDailyStats({
        mood: stats.mood,
        energyLevel: stats.energy,
        focusLevel: stats.focus,
        sleepHours: parseFloat(stats.sleep) || 0,
        medsTaken: stats.potionsTaken
      })

      setShowPrediction(true)
      setPredictionLoading(true)

      // 2. Fetch the AI prediction
      const result = await getSystemPrediction()
      setPredictionData(result)
    } catch (err: any) {
      console.error("Failed to sync stats:", err)
      setError(err.message || "Failed to sync with System")
    } finally {
      setIsSubmitting(false)
      setPredictionLoading(false)
    }
  }

  // Fallback prediction text (used if API fails or for immediate UI feedback)
  const getDisplayStatus = () => {
    if (predictionData) return { 
      text: predictionData.recommendation, 
      status: predictionData.status,
      color: predictionData.status === "Analyzed" ? "text-blue-400" : "text-emerald-400"
    }

    const avgScore = (stats.mood + stats.energy + stats.focus) / 3
    if (avgScore < 2) return { text: "Critical condition detected.", status: "Critical", color: "text-red-400" }
    if (avgScore < 3) return { text: "Energy levels depleted.", status: "Caution", color: "text-yellow-400" }
    return { text: "Optimal condition.", status: "Optimal", color: "text-emerald-400" }
  }

  const { text: displayPrediction, status: displayStatus, color: statusColor } = getDisplayStatus()

  const SliderInput = ({
    label,
    value,
    onChange,
    icon,
  }: {
    label: string
    value: number
    onChange: (val: number) => void
    icon?: string
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-foreground">{label}</label>
        <span className="text-sm font-bold text-primary">{value}/5</span>
      </div>
      <div className="flex items-center gap-3">
        {icon && <span className="text-lg">{icon}</span>}
        <input
          type="range"
          min="1"
          max="5"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="flex-1 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>
    </div>
  )

  const SkeletonPulse = () => (
    <div className="space-y-3 animate-pulse">
      <div className="h-3 bg-zinc-800/50 rounded w-3/4" />
      <div className="h-3 bg-zinc-800/50 rounded w-full" />
      <div className="h-3 bg-zinc-800/50 rounded w-4/5" />
    </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Section 1: Daily Hunter Log */}
      <div className="space-y-4">
        <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/30">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Daily Hunter Log</span>
        </div>

        <div className="p-6 rounded-xl backdrop-blur-md bg-zinc-900/40 border border-white/10 space-y-6">
          <SliderInput
            label="Mood"
            value={stats.mood}
            onChange={(val) => handleSliderChange("mood", val)}
            icon="😊"
          />

          <SliderInput
            label="Energy"
            value={stats.energy}
            onChange={(val) => handleSliderChange("energy", val)}
            icon="⚡"
          />

          <SliderInput
            label="Focus"
            value={stats.focus}
            onChange={(val) => handleSliderChange("focus", val)}
            icon="🎯"
          />

          <div className="space-y-2 pt-2">
            <label htmlFor="sleep" className="text-xs font-bold uppercase tracking-wider text-foreground block">
              Sleep (Hours)
            </label>
            <input
              id="sleep"
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={stats.sleep}
              onChange={(e) => handleSleepChange(e.target.value)}
              className={cn(
                "w-full px-3 py-2.5 rounded-lg text-sm",
                "bg-zinc-900/60 border border-white/10 text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:border-primary/50 focus:shadow-[0_0_10px_rgba(59,130,246,0.15)]",
                "transition-all duration-200"
              )}
              placeholder="8"
            />
          </div>

          {/* Potions Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/40 border border-white/5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">Potions Taken</p>
              <p className="text-xs text-muted-foreground mt-0.5">Meds / Supplements</p>
            </div>
            <button
              onClick={() => handlePotionsChange(!stats.potionsTaken)}
              className={cn(
                "relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300",
                stats.potionsTaken ? "bg-primary" : "bg-zinc-700"
              )}
            >
              <span
                className={cn(
                  "inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200",
                  stats.potionsTaken ? "translate-x-7" : "translate-x-1"
                )}
              />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-300">
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={cn(
              "w-full py-3 px-4 rounded-lg text-sm font-bold uppercase tracking-wider",
              "bg-primary text-primary-foreground transition-all duration-200",
              "shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]",
              "hover:bg-primary/90 active:scale-95",
              "disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none",
              isSubmitting && "opacity-75 cursor-wait"
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Syncing...
              </span>
            ) : "Sync to System"}
          </button>
        </div>
      </div>

      {/* Section 2: System Prediction */}
      <div className="space-y-4">
        <div className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/30">
          <span className="text-xs font-bold uppercase tracking-wider text-accent">System Analysis</span>
        </div>

        {showPrediction ? (
          <div className="p-6 rounded-xl backdrop-blur-md bg-zinc-900/40 border border-white/10 space-y-4">
            {/* Status Indicator */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div
                className={cn(
                  "w-3 h-3 rounded-full animate-pulse",
                  displayStatus === "Analyzed" ? "bg-blue-400" : displayStatus === "Critical" ? "bg-red-400" : displayStatus === "Caution" ? "bg-yellow-400" : "bg-emerald-400"
                )}
              />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">System Status</p>
                <p className={cn("text-sm font-bold uppercase tracking-wider", statusColor)}>{displayStatus}</p>
              </div>
            </div>

            {/* Prediction Text */}
            {predictionLoading ? (
              <SkeletonPulse />
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Today&apos;s Analysis</p>
                <p className="text-sm leading-relaxed text-foreground italic">
                  "{displayPrediction}"
                </p>
              </div>
            )}

            {/* Stats Summary */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase">Mood</p>
                <p className={cn("text-lg font-bold mt-1", stats.mood >= 4 ? "text-emerald-400" : stats.mood <= 2 ? "text-red-400" : "text-yellow-400")}>
                  {stats.mood}/5
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase">Energy</p>
                <p className={cn("text-lg font-bold mt-1", stats.energy >= 4 ? "text-emerald-400" : stats.energy <= 2 ? "text-red-400" : "text-yellow-400")}>
                  {stats.energy}/5
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase">Focus</p>
                <p className={cn("text-lg font-bold mt-1", stats.focus >= 4 ? "text-emerald-400" : stats.focus <= 2 ? "text-red-400" : "text-yellow-400")}>
                  {stats.focus}/5
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-xl backdrop-blur-md bg-zinc-900/40 border border-white/10 border-dashed flex flex-col items-center justify-center min-h-[320px] text-center">
            <Zap className="w-12 h-12 text-primary/40 mb-3" />
            <p className="text-sm text-muted-foreground">Sync your hunter stats to receive system analysis and daily predictions.</p>
          </div>
        )}
      </div>
    </div>
  )
}