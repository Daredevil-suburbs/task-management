"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createTask } from "@/lib/api"
import { Loader2, Swords } from "lucide-react"

interface CreateQuestModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateQuestModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateQuestModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM")
  const [xpReward, setXpReward] = useState("100")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await createTask({
        title,
        description: description || undefined,
        priority,
        xpReward: parseInt(xpReward) || 100,
      })
      
      // Reset form and close
      setTitle("")
      setDescription("")
      setPriority("MEDIUM")
      setXpReward("100")
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create quest")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-white/10 text-foreground">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Swords className="w-5 h-5 text-primary" />
            <DialogTitle className="text-sm font-bold uppercase tracking-widest">
              Forge New Quest
            </DialogTitle>
          </div>
        </DialogHeader>

        {error && (
          <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 p-2 rounded mb-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              Quest Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Defeat the Frost Serpent"
              required
              className="bg-zinc-800/50 border-white/5 focus:border-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              Objective Details
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the trial ahead..."
              className="bg-zinc-800/50 border-white/5 focus:border-primary/50 min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                Difficulty
              </Label>
              <Select
                value={priority}
                onValueChange={(value: "LOW" | "MEDIUM" | "HIGH") => setPriority(value)}
              >
                <SelectTrigger className="bg-zinc-800/50 border-white/5 focus:border-primary/50">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10">
                  <SelectItem value="LOW">E-Rank (Low)</SelectItem>
                  <SelectItem value="MEDIUM">C-Rank (Med)</SelectItem>
                  <SelectItem value="HIGH">S-Rank (High)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="xp" className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                XP Reward
              </Label>
              <Input
                id="xp"
                type="number"
                value={xpReward}
                onChange={(e) => setXpReward(e.target.value)}
                min="0"
                className="bg-zinc-800/50 border-white/5 focus:border-primary/50"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-white/5"
            >
              Withdraw
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !title}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs px-6 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Forging...
                </>
              ) : (
                "Issue Quest"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
