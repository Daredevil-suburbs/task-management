"use client"

import { useState, useEffect, useCallback } from "react"
import { QuestCard, type Quest } from "./quest-card"
import { Plus } from "lucide-react"
import {
  fetchTasks,
  completeTask as apiCompleteTask,
  type TaskResponse,
  type CompleteResponse,
} from "@/lib/api"
import { CreateQuestModal } from "./create-quest-modal"

// ─── Map API response → Quest shape used by QuestCard ────────────────

function mapTaskToQuest(task: TaskResponse): Quest {
  const priorityMap: Record<string, "low" | "medium" | "high"> = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
  }

  // Compute human-readable "time left" from dueDate
  let dueTime: string | undefined
  if (task.dueDate) {
    const due = new Date(task.dueDate)
    const now = new Date()
    const diffMs = due.getTime() - now.getTime()

    if (diffMs > 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffHours / 24)
      if (diffDays > 0) {
        dueTime = `${diffDays}d left`
      } else if (diffHours > 0) {
        dueTime = `${diffHours}h left`
      } else {
        const diffMin = Math.floor(diffMs / (1000 * 60))
        dueTime = `${diffMin}m left`
      }
    } else {
      dueTime = "Overdue"
    }
  }

  return {
    id: String(task.id),
    title: task.title,
    description: task.description || "",
    xpReward: task.xpReward,
    priority: priorityMap[task.priority] || "medium",
    dueTime,
    completed: task.completed,
  }
}

// ─── Skeleton loading cards ──────────────────────────────────────────

function QuestSkeleton() {
  return (
    <div className="relative rounded-lg border border-white/5 bg-zinc-900/50 p-4 min-h-[180px] overflow-hidden">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

      {/* Priority badge skeleton */}
      <div className="flex items-center justify-between mb-3">
        <div className="h-5 w-16 rounded bg-white/5 animate-pulse" />
        <div className="h-4 w-14 rounded bg-white/5 animate-pulse" />
      </div>

      {/* Title skeleton */}
      <div className="h-4 w-3/4 rounded bg-white/5 animate-pulse mb-2" />

      {/* Description skeleton */}
      <div className="space-y-1.5 mb-4">
        <div className="h-3 w-full rounded bg-white/5 animate-pulse" />
        <div className="h-3 w-2/3 rounded bg-white/5 animate-pulse" />
      </div>

      {/* Footer skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-16 rounded bg-white/5 animate-pulse" />
        <div className="h-8 w-28 rounded-md bg-white/5 animate-pulse" />
      </div>
    </div>
  )
}

// ─── Error state ─────────────────────────────────────────────────────

function QuestError({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <span className="text-2xl">⚠️</span>
      </div>
      <h2 className="text-sm font-bold uppercase tracking-widest text-foreground mb-2">
        Connection Lost
      </h2>
      <p className="text-xs text-muted-foreground max-w-sm mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all duration-200"
      >
        Retry Connection
      </button>
    </div>
  )
}

// ─── Rank-Up Toast ───────────────────────────────────────────────────

function RankUpToast({
  data,
  onDismiss,
}: {
  data: CompleteResponse
  onDismiss: () => void
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="relative rounded-lg border border-primary/30 bg-zinc-900/95 backdrop-blur-xl p-5 shadow-[0_0_40px_rgba(59,130,246,0.3)] max-w-sm">
        {/* Glow background */}
        <div className="absolute inset-0 rounded-lg bg-primary/5 blur-xl" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">⚡</span>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Quest Complete
            </span>
          </div>

          <div className="text-sm font-semibold text-yellow-500 mb-1">
            +{data.xpEarned} XP Earned
          </div>

          <div className="text-xs text-muted-foreground">
            Level {data.level} • {data.hunterRank} •{" "}
            {data.totalXp.toLocaleString()} Total XP
          </div>

          {data.rankUpOccurred && data.rankUpMessage && (
            <div className="mt-3 px-3 py-2 rounded-md bg-primary/10 border border-primary/20">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                🏆 {data.rankUpMessage}
              </span>
            </div>
          )}

          {data.newAchievements && data.newAchievements.length > 0 && (
            <div className="mt-2 text-xs text-emerald-400">
              🎖️ Unlocked: {data.newAchievements.map((a) => a.name).join(", ")}
            </div>
          )}
        </div>

        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors text-xs"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

// ─── Main QuestBoard Component ───────────────────────────────────────

export function QuestBoard() {
  const [quests, setQuests] = useState<Quest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completingId, setCompletingId] = useState<string | null>(null)
  const [rankUpData, setRankUpData] = useState<CompleteResponse | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Fetch quests from backend
  const loadQuests = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const tasks = await fetchTasks()
      setQuests(tasks.map(mapTaskToQuest))
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load quests"
      setError(message)
      console.error("Failed to fetch quests:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadQuests()
  }, [loadQuests])

  // Complete a quest via the API
  const handleComplete = async (id: string) => {
    setCompletingId(id)
    try {
      const result = await apiCompleteTask(Number(id))

      // Update local state with the completed quest
      setQuests((prev) =>
        prev.map((quest) =>
          quest.id === id ? { ...quest, completed: true } : quest
        )
      )

      // Show rank-up / XP toast
      setRankUpData(result)
    } catch (err) {
      console.error("Failed to complete quest:", err)
      // Could show an error toast here
    } finally {
      setCompletingId(null)
    }
  }

  // Sort: incomplete first, then by priority (high > medium > low)
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  const sortedQuests = [...quests].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  const activeQuests = quests.filter((q) => !q.completed).length
  const completedQuests = quests.filter((q) => q.completed).length

  // ── Error state ──
  if (error && quests.length === 0) {
    return <QuestError message={error} onRetry={loadQuests} />
  }

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Stats skeleton */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
            <div className="h-3 w-28 rounded bg-white/5 animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500/30 animate-pulse" />
            <div className="h-3 w-20 rounded bg-white/5 animate-pulse" />
          </div>
        </div>

        {/* Skeleton grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <QuestSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Active Quests:{" "}
            <span className="text-foreground font-semibold">{activeQuests}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Cleared:{" "}
            <span className="text-foreground font-semibold">
              {completedQuests}
            </span>
          </span>
        </div>
      </div>

      {/* Quest Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedQuests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            onComplete={handleComplete}
            isCompleting={completingId === quest.id}
          />
        ))}

        {/* Add Quest Card */}
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="group flex flex-col items-center justify-center min-h-[180px] rounded-lg border border-dashed border-white/10 bg-zinc-900/30 transition-all duration-300 hover:border-primary/40 hover:bg-zinc-900/50"
        >
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
            <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
            New Quest
          </span>
        </button>
      </div>

      <CreateQuestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadQuests}
      />

      {/* Rank-Up / XP Toast */}
      {rankUpData && (
        <RankUpToast
          data={rankUpData}
          onDismiss={() => setRankUpData(null)}
        />
      )}
    </div>
  )
}
