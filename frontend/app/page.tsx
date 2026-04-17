"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { QuestBoard } from "@/components/quest-board"
import { SystemGuideChat } from "@/components/system-guide-chat"
import { SystemInsightPanel } from "@/components/system-insight-panel"
import { cn } from "@/lib/utils"

export default function HunterDashboard() {
  const [activeTab, setActiveTab] = useState("quest-board")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    setMounted(true)
    const handleResize = () => {
      // Listen for sidebar state changes via storage event or just detect width
      const sidebar = document.querySelector("aside")
      if (sidebar) {
        setSidebarCollapsed(sidebar.classList.contains("w-16"))
      }
    }

    // Use MutationObserver to detect sidebar class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const sidebar = mutation.target as HTMLElement
          setSidebarCollapsed(sidebar.classList.contains("w-16"))
        }
      })
    })

    const sidebar = document.querySelector("aside")
    if (sidebar) {
      observer.observe(sidebar, { attributes: true })
    }

    return () => observer.disconnect()
  }, [])

  if (!mounted) {
    return null
  }

  const handleQuestCompleted = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle gradient orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Header */}
      <Header sidebarCollapsed={sidebarCollapsed} refreshKey={refreshKey} />

      {/* Main Content */}
      <main
        className={cn(
          "pt-24 pb-8 px-6 transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <div className="max-w-7xl mx-auto">
          {activeTab === "quest-board" && (
            <QuestBoard onQuestCompleted={handleQuestCompleted} />
          )}
          
          {activeTab === "daily-grinds" && <SystemInsightPanel />}

          {activeTab === "health-stats" && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="w-20 h-20 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-4">
                <span className="text-3xl">❤️</span>
              </div>
              <h2 className="text-lg font-bold uppercase tracking-widest text-foreground mb-2">
                Health Stats
              </h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Track your strength, vitality, and mental fortitude. Every quest completed improves your stats.
              </p>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="w-20 h-20 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-4">
                <span className="text-3xl">🏆</span>
              </div>
              <h2 className="text-lg font-bold uppercase tracking-widest text-foreground mb-2">
                Achievements
              </h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Unlock badges and titles as you progress. Your journey from E-Rank to S-Rank begins here.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* System Guide Chat */}
      <SystemGuideChat />
    </div>
  )
}
