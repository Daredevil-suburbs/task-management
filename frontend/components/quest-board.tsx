"use client"

import { useState, useEffect, useCallback } from "react"
import { QuestCard, taskToQuest, type Quest } from "./quest-card"
import { Plus, Loader2, RefreshCw } from "lucide-react"
import { getTasks, completeTask, type CompleteResponse } from "@/lib/api"

interface QuestBoardProps {
  onQuestCompleted?: (result: CompleteResponse) => void
}

export function QuestBoard({ onQuestCompleted }: QuestBoardProps) {
  const [quests, setQuests] = useState<Quest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ── Fetch quests from backend ──────────────────────────────────────────
  const fetchQuests = useCallback(async () => {
    try {
      setError(null)
      const tasks = await getTasks()
      setQuests(tasks.map(taskToQuest))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quests")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQuests()
  }, [fetchQuests])

  // ── Complete quest → call API, update local state, notify parent ────────
  const handleComplete = async (id: number): Promise<CompleteResponse | null> => {
    try {
      const result = await completeTask(id)

      // Optimistically update local state — mark quest as completed
      setQuests((prev) =>
        prev.map((quest) =>
          quest.id === id ? { ...quest, completed: true, status: "DONE" } : quest
        )
      )

      // Notify parent to refresh header stats (XP, rank, level)
      onQuestCompleted?.(result)

      return result
    } catch (err) {
      console.error("Failed to complete quest:", err)
      setError(err instanceof Error ? err.message : "Failed to complete quest")
      return null
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

  // ── Loading state ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-sm text-muted-foreground uppercase tracking-wider">
          Loading quests...
        </p>
      </div>
    )
  }

  // ── Error state ────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-sm text-red-400 mb-4">{error}</p>
        <button
          onClick={() => { setIsLoading(true); fetchQuests(); }}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
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
            <span className="text-foreground font-semibold">{completedQuests}</span>
          </span>
        </div>
        <button
          onClick={() => { setIsLoading(true); fetchQuests(); }}
          className="ml-auto p-1.5 rounded-md hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
          title="Refresh quests"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Empty state */}
      {quests.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[30vh] text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-4">
            <span className="text-2xl">⚔️</span>
          </div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-foreground mb-2">
            No Quests Found
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Create your first quest to begin your journey, Hunter.
          </p>
        </div>
      )}

      {/* Quest Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedQuests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} onComplete={handleComplete} />
        ))}

        {/* Add Quest Card */}
        <button className="group flex flex-col items-center justify-center min-h-[180px] rounded-lg border border-dashed border-white/10 bg-zinc-900/30 transition-all duration-300 hover:border-primary/40 hover:bg-zinc-900/50">
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
            <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
            New Quest
          </span>
        </button>
      </div>
    </div>
  )
}
