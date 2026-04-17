"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  GraduationCap, 
  Code2, 
  Palette, 
  Dumbbell,
  Brain,
  Clock,
  Sparkles,
  Target,
  ChevronRight,
  ChevronLeft,
  Zap
} from "lucide-react"

type HunterClass = "student" | "developer" | "creative" | "fitness" | null
type Debuff = "procrastination" | "brain-fog" | "time-blindness" | "perfectionism"

interface HunterAwakeningProps {
  onComplete?: (data: {
    hunterClass: HunterClass
    debuffs: Debuff[]
    mainQuest: string
  }) => void
}

const classes = [
  {
    id: "student" as const,
    name: "Student",
    icon: GraduationCap,
    description: "Master of knowledge acquisition",
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/50",
    glowColor: "shadow-blue-500/30"
  },
  {
    id: "developer" as const,
    name: "Developer",
    icon: Code2,
    description: "Architect of digital realms",
    color: "from-emerald-500/20 to-green-500/20",
    borderColor: "border-emerald-500/50",
    glowColor: "shadow-emerald-500/30"
  },
  {
    id: "creative" as const,
    name: "Creative",
    icon: Palette,
    description: "Weaver of imagination",
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/50",
    glowColor: "shadow-purple-500/30"
  },
  {
    id: "fitness" as const,
    name: "Fitness",
    icon: Dumbbell,
    description: "Forger of physical power",
    color: "from-orange-500/20 to-red-500/20",
    borderColor: "border-orange-500/50",
    glowColor: "shadow-orange-500/30"
  }
]

const debuffs = [
  {
    id: "procrastination" as const,
    name: "Procrastination",
    icon: Clock,
    description: "Tasks feel impossible to start"
  },
  {
    id: "brain-fog" as const,
    name: "Brain Fog",
    icon: Brain,
    description: "Difficulty focusing or thinking clearly"
  },
  {
    id: "time-blindness" as const,
    name: "Time Blindness",
    icon: Target,
    description: "Losing track of time constantly"
  },
  {
    id: "perfectionism" as const,
    name: "Perfectionism",
    icon: Sparkles,
    description: "Nothing ever feels good enough"
  }
]

export function HunterAwakening({ onComplete }: HunterAwakeningProps) {
  const [step, setStep] = useState(1)
  const [selectedClass, setSelectedClass] = useState<HunterClass>(null)
  const [selectedDebuffs, setSelectedDebuffs] = useState<Debuff[]>([])
  const [mainQuest, setMainQuest] = useState("")
  const [isTransitioning, setIsTransitioning] = useState(false)

  const totalSteps = 4

  const handleNext = () => {
    if (step < totalSteps) {
      setIsTransitioning(true)
      setTimeout(() => {
        setStep(step + 1)
        setIsTransitioning(false)
      }, 200)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setIsTransitioning(true)
      setTimeout(() => {
        setStep(step - 1)
        setIsTransitioning(false)
      }, 200)
    }
  }

  const toggleDebuff = (debuff: Debuff) => {
    setSelectedDebuffs(prev =>
      prev.includes(debuff)
        ? prev.filter(d => d !== debuff)
        : [...prev, debuff]
    )
  }

  const handleAwaken = () => {
    onComplete?.({
      hunterClass: selectedClass,
      debuffs: selectedDebuffs,
      mainQuest
    })
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedClass !== null
      case 2:
        return true // Debuffs are optional
      case 3:
        return mainQuest.trim().length > 0
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                i + 1 === step
                  ? "w-8 bg-primary shadow-[0_0_10px_var(--primary)]"
                  : i + 1 < step
                  ? "w-4 bg-primary/60"
                  : "w-4 bg-muted"
              )}
            />
          ))}
        </div>

        {/* Step content with fade transition */}
        <div
          className={cn(
            "transition-all duration-200",
            isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          )}
        >
          {/* Step 1: Select Your Class */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold uppercase tracking-widest text-foreground">
                  Select Your Class
                </h1>
                <p className="text-muted-foreground">
                  Choose the path that defines your journey
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {classes.map((cls) => {
                  const Icon = cls.icon
                  const isSelected = selectedClass === cls.id
                  return (
                    <Card
                      key={cls.id}
                      onClick={() => setSelectedClass(cls.id)}
                      className={cn(
                        "cursor-pointer transition-all duration-300 border-white/5 bg-card/50 backdrop-blur-sm",
                        "hover:border-primary/50 hover:shadow-[0_0_20px_var(--primary)/0.2]",
                        isSelected && [
                          cls.borderColor,
                          "shadow-[0_0_30px_var(--primary)/0.3]",
                          "bg-gradient-to-br",
                          cls.color
                        ]
                      )}
                    >
                      <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                        <div
                          className={cn(
                            "p-3 rounded-lg transition-all duration-300",
                            isSelected
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          <Icon className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="font-bold uppercase tracking-wide text-foreground">
                            {cls.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {cls.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 2: Identify Your Debuffs */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold uppercase tracking-widest text-foreground">
                  Identify Your Debuffs
                </h1>
                <p className="text-muted-foreground">
                  Know your weaknesses to overcome them
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {debuffs.map((debuff) => {
                  const Icon = debuff.icon
                  const isSelected = selectedDebuffs.includes(debuff.id)
                  return (
                    <Card
                      key={debuff.id}
                      onClick={() => toggleDebuff(debuff.id)}
                      className={cn(
                        "cursor-pointer transition-all duration-300 border-white/5 bg-card/50 backdrop-blur-sm",
                        "hover:border-destructive/50 hover:shadow-[0_0_20px_var(--destructive)/0.2]",
                        isSelected && [
                          "border-destructive/50",
                          "shadow-[0_0_20px_var(--destructive)/0.3]",
                          "bg-gradient-to-br from-destructive/10 to-destructive/5"
                        ]
                      )}
                    >
                      <CardContent className="p-5 flex items-start gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-lg transition-all duration-300 shrink-0",
                            isSelected
                              ? "bg-destructive/20 text-destructive"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm text-foreground">
                            {debuff.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {debuff.description}
                          </p>
                        </div>
                        <div
                          className={cn(
                            "ml-auto w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                            isSelected
                              ? "bg-destructive border-destructive"
                              : "border-muted-foreground/30"
                          )}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 3: Set Your Main Quest */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold uppercase tracking-widest text-foreground">
                  Set Your Main Quest
                </h1>
                <p className="text-muted-foreground">
                  What is your biggest goal this month?
                </p>
              </div>

              <Card className="border-white/5 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                      <Target className="w-6 h-6" />
                      <span className="uppercase tracking-wide font-semibold text-sm">
                        Main Quest Objective
                      </span>
                    </div>
                    <Input
                      value={mainQuest}
                      onChange={(e) => setMainQuest(e.target.value)}
                      placeholder="e.g., Launch my side project"
                      className={cn(
                        "bg-background/50 border-white/10 text-lg py-6",
                        "focus:border-primary focus:shadow-[0_0_15px_var(--primary)/0.3]",
                        "placeholder:text-muted-foreground/50"
                      )}
                    />
                    <p className="text-xs text-muted-foreground">
                      This will be your guiding objective. All quests will help you achieve this.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Awaken System */}
          {step === 4 && (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold uppercase tracking-widest text-foreground">
                  System Initialization
                </h1>
                <p className="text-muted-foreground">
                  Your Hunter profile is ready
                </p>
              </div>

              <Card className="border-white/5 bg-card/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  {/* Summary */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-muted-foreground text-sm">Class</span>
                      <span className="font-semibold text-primary uppercase tracking-wide">
                        {selectedClass || "None"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-muted-foreground text-sm">Debuffs</span>
                      <span className="font-semibold text-destructive">
                        {selectedDebuffs.length || "None"}
                      </span>
                    </div>
                    <div className="py-2">
                      <span className="text-muted-foreground text-sm block mb-1">Main Quest</span>
                      <span className="font-semibold text-foreground">
                        {mainQuest || "Not set"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Awaken Button */}
              <Button
                onClick={handleAwaken}
                size="lg"
                className={cn(
                  "w-full py-6 text-lg font-bold uppercase tracking-widest",
                  "bg-linear-to-r from-primary via-accent to-primary bg-[length:200%_100%]",
                  "animate-[gradient_3s_ease_infinite]",
                  "shadow-[0_0_30px_rgba(59,130,246,0.5)]",
                  "hover:shadow-[0_0_50px_rgba(59,130,246,0.7)]",
                  "transition-shadow duration-300"
                )}
              >
                <Zap className="w-5 h-5 mr-2" />
                Awaken System
              </Button>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        {step < 4 && (
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className={cn(
                "transition-all duration-300",
                canProceed() && "shadow-[0_0_15px_var(--primary)/0.4]"
              )}
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
