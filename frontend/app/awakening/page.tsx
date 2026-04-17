"use client"

import { HunterAwakening } from "@/components/hunter-awakening"
import { useRouter } from "next/navigation"

export default function AwakeningPage() {
  const router = useRouter()

  const handleComplete = (data: {
    hunterClass: string | null
    debuffs: string[]
    mainQuest: string
  }) => {
    // Store the awakening data (in a real app, this would go to a database)
    console.log("Hunter awakened:", data)
    
    // Navigate to the main dashboard
    router.push("/")
  }

  return <HunterAwakening onComplete={handleComplete} />
}
