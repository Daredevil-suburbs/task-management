"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login, register } from "@/lib/api"
import { Swords, Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (isRegister) {
        await register(name, email, password)
      } else {
        await login(email, password)
      }
      router.push("/")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed"
      // Clean up API error messages for display
      if (message.includes("401") || message.includes("403")) {
        setError("Invalid email or password")
      } else if (message.includes("409") || message.includes("already")) {
        setError("An account with this email already exists")
      } else {
        setError(message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md mx-4">
        {/* Outer glow */}
        <div className="absolute -inset-1 bg-primary/10 rounded-2xl blur-xl" />

        <div className="relative rounded-xl border border-white/5 bg-zinc-900/80 backdrop-blur-xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full" />
              <div className="relative w-16 h-16 rounded-full bg-zinc-900 border-2 border-primary flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.4)]">
                <Swords className="w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              </div>
            </div>
            <h1 className="text-xl font-bold uppercase tracking-[0.3em] text-foreground">
              Hunter System
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
              {isRegister ? "Create Your Hunter ID" : "Authenticate to Continue"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Hunter Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  suppressHydrationWarning
                  className="w-full px-4 py-3 rounded-lg bg-zinc-800/50 border border-white/5 text-sm text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all"
                />
              </div>
            )}

            <div suppressHydrationWarning>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hunter@example.com"
                required
                suppressHydrationWarning
                className="w-full px-4 py-3 rounded-lg bg-zinc-800/50 border border-white/5 text-sm text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Password
              </label>
              <div className="relative" suppressHydrationWarning>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  suppressHydrationWarning
                  className="w-full px-4 py-3 rounded-lg bg-zinc-800/50 border border-white/5 text-sm text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isRegister ? "Creating Account..." : "Authenticating..."}
                </>
              ) : (
                isRegister ? "Register" : "Login"
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister)
                setError(null)
              }}
              className="text-xs text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
            >
              {isRegister
                ? "Already a hunter? Login"
                : "New hunter? Create account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
