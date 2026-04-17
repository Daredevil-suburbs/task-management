"use client"

import { cn } from "@/lib/utils"
import { Check, Clock, AlertTriangle, Swords, Loader2 } from "lucide-react"
import { useState } from "react"
import type { TaskResponse, CompleteResponse } from "@/lib/api"

export interface Quest {
  id: number
  title: string
  description: string
  xpReward: number
  priority: "low" | "medium" | "high"
  dueDate?: string | null
  completed: boolean
  status: string
}

interface QuestCardProps {
  quest: Quest
  onComplete: (id: number) => Promise<CompleteResponse | null>
}

/** Map backend enum values to display config */
const priorityConfig = {
  low: {
    label: "D-Rank",
    color: "text-zinc-400",
    bgColor: "bg-zinc-400/10",
    borderColor: "border-zinc-400/20",
  },
  medium: {
    label: "C-Rank",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  high: {
    label: "S-Rank",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
}

/** Map backend priority enum (uppercase) to frontend key (lowercase) */
export function mapPriority(backendPriority: string): "low" | "medium" | "high" {
  switch (backendPriority?.toUpperCase()) {
    case "HIGH":   return "high"
    case "MEDIUM": return "medium"
    case "LOW":
    default:       return "low"
  }
}

/** Convert a backend TaskResponse to the frontend Quest shape */
export function taskToQuest(task: TaskResponse): Quest {
  return {
    id: task.id,
    title: task.title,
    description: task.description || "",
    xpReward: task.xpReward,
    priority: mapPriority(task.priority),
    dueDate: task.dueDate,
    completed: task.completed,
    status: task.status,
  }
}

export function QuestCard({ quest, onComplete }: QuestCardProps) {
  const priority = priorityConfig[quest.priority]
  const [isCompleting, setIsCompleting] = useState(false)
  const [xpEarned, setXpEarned] = useState<number | null>(null)

  const handleComplete = async () => {
    if (quest.completed || isCompleting) return
    setIsCompleting(true)
    try {
      const result = await onComplete(quest.id)
      if (result) {
        setXpEarned(result.xpEarned)
        // Flash the XP earned for 2 seconds
        setTimeout(() => setXpEarned(null), 2500)
      }
    } finally {
      setIsCompleting(false)
    }
  }

  // Format due date for display
  const dueDisplay = quest.dueDate
    ? new Date(quest.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null

  return (
    <div
      className={cn(
        "group relative rounded-lg border border-white/5 bg-zinc-900/50 p-4 transition-all duration-300",
        "hover:border-primary/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]",
        quest.completed && "opacity-50 hover:opacity-60"
      )}
    >
      {/* XP Earned Flash */}
      {xpEarned !== null && (
        <div className="absolute -top-3 right-4 animate-bounce">
          <span className="text-sm font-bold text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]">
            +{xpEarned} XP!
          </span>
        </div>
      )}

      {/* Priority Badge & Due Date Row */}
      <div className="flex items-center justify-between mb-3">
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider",
            priority.bgColor,
            priority.color,
            priority.borderColor,
            "border"
          )}
        >
          {quest.priority === "high" && (
            <AlertTriangle className="w-3 h-3" />
          )}
          {priority.label}
        </div>
        {dueDisplay && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{dueDisplay}</span>
          </div>
        )}
      </div>

      {/* Quest Title */}
      <h3
        className={cn(
          "text-sm font-bold uppercase tracking-wide text-foreground mb-1",
          quest.completed && "line-through"
        )}
      >
        {quest.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
        {quest.description}
      </p>

      {/* Footer: XP Reward & Complete Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Swords className="w-3.5 h-3.5 text-yellow-500" />
          <span className="text-xs font-semibold text-yellow-500">
            +{quest.xpReward} XP
          </span>
        </div>

        <button
          onClick={handleComplete}
          disabled={quest.completed || isCompleting}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200",
            quest.completed
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              : isCompleting
              ? "bg-primary/60 text-primary-foreground cursor-wait"
              : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]"
          )}
        >
          {quest.completed ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Cleared
            </>
          ) : isCompleting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Completing...
            </>
          ) : (
            "Complete Quest"
          )}
        </button>
      </div>
    </div>
  )
}
