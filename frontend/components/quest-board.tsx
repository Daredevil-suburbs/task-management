"use client"

import { useState } from "react"
import { QuestCard, type Quest } from "./quest-card"
import { Plus } from "lucide-react"

const initialQuests: Quest[] = [
  {
    id: "1",
    title: "Complete Project Proposal",
    description: "Finish the draft for the Q2 marketing initiative and submit for review.",
    xpReward: 150,
    priority: "high",
    dueTime: "2h left",
    completed: false,
  },
  {
    id: "2",
    title: "Review Pull Requests",
    description: "Review and approve pending code changes from the development team.",
    xpReward: 75,
    priority: "medium",
    dueTime: "4h left",
    completed: false,
  },
  {
    id: "3",
    title: "Update Documentation",
    description: "Refresh API documentation with the latest endpoint changes.",
    xpReward: 50,
    priority: "low",
    completed: false,
  },
  {
    id: "4",
    title: "Team Standup Meeting",
    description: "Attend daily sync with the engineering team and provide status update.",
    xpReward: 25,
    priority: "medium",
    dueTime: "30m left",
    completed: true,
  },
  {
    id: "5",
    title: "Fix Critical Bug",
    description: "Investigate and resolve the authentication issue reported in production.",
    xpReward: 200,
    priority: "high",
    dueTime: "1h left",
    completed: false,
  },
]

export function QuestBoard() {
  const [quests, setQuests] = useState<Quest[]>(initialQuests)

  const handleComplete = (id: string) => {
    setQuests((prev) =>
      prev.map((quest) =>
        quest.id === id ? { ...quest, completed: true } : quest
      )
    )
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
      </div>

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
