"use client"

import { useState, useRef, useEffect } from "react"
import { Eye, X, Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { chatWithAssistant, getToken } from "@/lib/api"

interface Message {
  role: "user" | "system"
  content: string
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: "system",
    content: "Welcome, Hunter. I am the System Guide. How may I assist you on your quest today?",
  },
]

export function SystemGuideChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isLoading])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: input.trim() }
    setMessages((prev) => [...prev, userMessage])
    const currentInput = input.trim()
    setInput("")
    setIsLoading(true)

    try {
      // Check if user is authenticated
      const token = getToken()
      if (!token) {
        const systemMessage: Message = {
          role: "system",
          content: "You must be logged in to use the System Guide. Please authenticate first, Hunter.",
        }
        setMessages((prev) => [...prev, systemMessage])
        setIsLoading(false)
        return
      }

      // Call the real backend API
      const response = await chatWithAssistant(currentInput)

      const systemMessage: Message = {
        role: "system",
        content: response.reply,
      }
      setMessages((prev) => [...prev, systemMessage])
    } catch (err) {
      console.error("Chat API error:", err)
      const errorMessage: Message = {
        role: "system",
        content: "Connection to the System has been disrupted. Please try again, Hunter.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full transition-all duration-300",
          "bg-zinc-900/90 border border-primary/30 backdrop-blur-sm",
          "flex items-center justify-center",
          "shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]",
          "hover:scale-105 active:scale-95",
          isOpen && "opacity-0 pointer-events-none scale-0"
        )}
        aria-label="Open System Guide"
      >
        <Eye className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full border-2 border-primary/50 animate-ping" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 w-96 h-[500px] transition-all duration-300 ease-out",
          "flex flex-col rounded-xl overflow-hidden",
          "bg-black/80 backdrop-blur-xl border border-white/10",
          "shadow-[0_0_40px_rgba(0,0,0,0.5),0_0_20px_rgba(59,130,246,0.1)]",
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Eye className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold uppercase tracking-wider text-foreground">
                  System Guide
                </span>
                <span className="text-xs text-muted-foreground">[Online]</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-emerald-500">Connected</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] px-3 py-2 rounded-lg text-sm",
                  message.role === "user"
                    ? "bg-primary/20 text-foreground rounded-br-sm"
                    : "bg-zinc-800/80 text-foreground rounded-bl-sm border-l-2 border-primary/50"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-zinc-800/80 rounded-lg rounded-bl-sm border-l-2 border-primary/50 px-4 py-3">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-white/10 bg-zinc-900/30">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the System..."
              disabled={isLoading}
              className={cn(
                "flex-1 px-3 py-2.5 rounded-lg text-sm",
                "bg-zinc-900/80 border border-white/10 text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:border-primary/50 focus:shadow-[0_0_10px_rgba(59,130,246,0.15)]",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={cn(
                "p-2.5 rounded-lg transition-all duration-200",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 active:scale-95",
                "shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:bg-primary"
              )}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
