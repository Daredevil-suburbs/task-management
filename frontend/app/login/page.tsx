"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login, register, setToken } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Shield, Flame } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Register form state
  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await login(loginEmail, loginPassword)
      setToken(res.token)
      router.push("/")
    } catch (err: any) {
      setError(err.message || "Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await register(regName, regEmail, regPassword)
      setToken(res.token)
      router.push("/awakening")
    } catch (err: any) {
      setError(err.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#070707] relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse duration-700" />
      
      <div className="z-10 w-full max-w-md px-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] mb-4">
            <Zap className="w-10 h-10 text-white fill-white" />
          </div>
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
            Hunter <span className="text-primary underline decoration-2 underline-offset-4">System</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-2 uppercase tracking-[0.2em] font-medium">Level up your life</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-900/50 border border-white/5 p-1 rounded-xl mb-6">
            <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
              Awaken
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="bg-zinc-900/40 border-white/10 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle className="text-xl text-white font-bold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" /> Authenticate
                  </CardTitle>
                  <CardDescription className="text-zinc-400">Enter your credentials to access the system.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                      ⚠️ {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="hunter@leveling.com" 
                      className="bg-zinc-950/50 border-white/10 focus:border-primary/50 text-white h-11"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" id="password-label" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="bg-zinc-950/50 border-white/10 focus:border-primary/50 text-white h-11"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest h-11 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all active:scale-95"
                    disabled={loading}
                  >
                    {loading ? "Authenticating..." : "Login"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="bg-zinc-900/40 border-white/10 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
              <form onSubmit={handleRegister}>
                <CardHeader>
                  <CardTitle className="text-xl text-white font-bold flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" /> New Awakening
                  </CardTitle>
                  <CardDescription className="text-zinc-400">Register as a new Hunter to start your journey.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                      ⚠️ {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Hunter Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Sung Jin-Woo" 
                      className="bg-zinc-950/50 border-white/10 focus:border-primary/50 text-white h-11"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Email Address</Label>
                    <Input 
                      id="reg-email" 
                      type="email" 
                      placeholder="shadowmonarch@system.com" 
                      className="bg-zinc-950/50 border-white/10 focus:border-primary/50 text-white h-11"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Access Key (Password)</Label>
                    <Input 
                      id="reg-password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="bg-zinc-950/50 border-white/10 focus:border-primary/50 text-white h-11"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest h-11 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all active:scale-95"
                    disabled={loading}
                  >
                    {loading ? "Awakening..." : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-center text-zinc-600 text-[10px] mt-12 uppercase tracking-widest font-bold">
          Authorized personnel only • System version 2.4.1
        </p>
      </div>
    </div>
  )
}
