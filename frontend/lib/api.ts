/**
 * Hunter System API Client
 * Connects the Next.js frontend to the Spring Boot backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

// ─── Types matching Spring Boot DTOs ─────────────────────────────────

export interface TaskResponse {
  id: number
  title: string
  description: string
  status: "TODO" | "IN_PROGRESS" | "DONE"
  priority: "LOW" | "MEDIUM" | "HIGH"
  dueDate: string | null
  xpReward: number
  completed: boolean
  completedAt: string | null
  category: { id: number; name: string; color: string } | null
  tags: { id: number; name: string; color: string }[] | null
  subtasks: { id: number; title: string; completed: boolean }[] | null
  recurringQuestId: number | null
  createdAt: string
  updatedAt: string
}

export interface CompleteResponse {
  task: TaskResponse
  xpEarned: number
  totalXp: number
  level: number
  hunterRank: string
  rankUpOccurred: boolean
  rankUpMessage: string | null
  newAchievements: { name: string; description: string; icon: string }[] | null
}

export interface UserStatus {
  name: string
  email: string
  totalXp: number
  level: number
  hunterRank: string
  xpToNextLevel: number
  xpToNextRank: number
  tasksCompleted: number
  maxRank: boolean
}

export interface AuthResponse {
  token: string
  email: string
  name: string
}

// ─── Token Management ────────────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("hunter_token")
}

export function setToken(token: string): void {
  localStorage.setItem("hunter_token", token)
}

export function clearToken(): void {
  localStorage.removeItem("hunter_token")
}

// ─── Core Fetch Wrapper ──────────────────────────────────────────────

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (res.status === 401) {
    clearToken()
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
    throw new Error("Unauthorized — session expired")
  }

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "Unknown error")
    throw new Error(`API Error ${res.status}: ${errorBody}`)
  }

  // Handle 204 No Content
  if (res.status === 204) {
    return undefined as T
  }

  return res.json()
}

// ─── Auth ────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
  setToken(data.token)
  return data
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  })
  setToken(data.token)
  return data
}

// ─── Tasks (Quests) ──────────────────────────────────────────────────

export async function fetchTasks(filters?: {
  status?: string
  priority?: string
}): Promise<TaskResponse[]> {
  const params = new URLSearchParams()
  if (filters?.status) params.set("status", filters.status)
  if (filters?.priority) params.set("priority", filters.priority)

  const query = params.toString()
  return apiFetch<TaskResponse[]>(`/api/tasks${query ? `?${query}` : ""}`)
}

export async function fetchTaskById(id: number): Promise<TaskResponse> {
  return apiFetch<TaskResponse>(`/api/tasks/${id}`)
}

export async function createTask(task: {
  title: string
  description?: string
  priority?: "LOW" | "MEDIUM" | "HIGH"
  dueDate?: string
  xpReward?: number
  categoryId?: number
  tagIds?: number[]
}): Promise<TaskResponse> {
  return apiFetch<TaskResponse>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  })
}

export async function updateTask(
  id: number,
  task: {
    title?: string
    description?: string
    status?: "TODO" | "IN_PROGRESS" | "DONE"
    priority?: "LOW" | "MEDIUM" | "HIGH"
    dueDate?: string
    xpReward?: number
  }
): Promise<TaskResponse> {
  return apiFetch<TaskResponse>(`/api/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(task),
  })
}

export async function completeTask(id: number): Promise<CompleteResponse> {
  return apiFetch<CompleteResponse>(`/api/tasks/${id}/complete`, {
    method: "PATCH",
  })
}

export async function deleteTask(id: number): Promise<void> {
  return apiFetch<void>(`/api/tasks/${id}`, {
    method: "DELETE",
  })
}

// ─── User ────────────────────────────────────────────────────────────

export async function fetchUserStatus(): Promise<UserStatus> {
  return apiFetch<UserStatus>("/api/user/status")
}
