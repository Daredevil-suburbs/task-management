/**
 * Centralized API client for the Hunter System backend.
 *
 * All authenticated requests include the JWT from localStorage.
 * The backend runs on http://localhost:8080.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ── Auth helpers ────────────────────────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

// ── Core fetch wrapper ──────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401 || res.status === 403) {
    clearToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(errorBody || `API error: ${res.status}`);
  }

  // Handle 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

// ── Auth API ────────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
}

export function login(email: string, password: string) {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register(name: string, email: string, password: string) {
  return apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

// ── User Status API ─────────────────────────────────────────────────────────

export interface UserStatus {
  name: string;
  email: string;
  totalXp: number;
  level: number;
  hunterRank: string;
  xpToNextLevel: number;
  xpToNextRank: number;
  tasksCompleted: number;
  maxRank: boolean;
}

export function getUserStatus() {
  return apiFetch<UserStatus>("/api/user/status");
}

// ── Tasks API ───────────────────────────────────────────────────────────────

export interface TaskResponse {
  id: number;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string | null;
  xpReward: number;
  completed: boolean;
  completedAt: string | null;
  category: { id: number; name: string; color: string } | null;
  tags: { id: number; name: string; color: string }[] | null;
  subtasks: { id: number; title: string; completed: boolean }[] | null;
  recurringQuestId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompleteResponse {
  task: TaskResponse;
  xpEarned: number;
  totalXp: number;
  level: number;
  hunterRank: string;
  rankUpOccurred: boolean;
  rankUpMessage: string | null;
  newAchievements: { name: string; description: string; icon: string }[] | null;
}

export function getTasks(status?: string, priority?: string) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (priority) params.set("priority", priority);
  const qs = params.toString();
  return apiFetch<TaskResponse[]>(`/api/tasks${qs ? `?${qs}` : ""}`);
}

export function completeTask(id: number) {
  return apiFetch<CompleteResponse>(`/api/tasks/${id}/complete`, {
    method: "PATCH",
  });
}

export function deleteTask(id: number) {
  return apiFetch<void>(`/api/tasks/${id}`, {
    method: "DELETE",
  });
}

export function createTask(data: {
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  xpReward?: number;
  categoryId?: number;
  tagIds?: number[];
}) {
  return apiFetch<TaskResponse>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ── Chat API ────────────────────────────────────────────────────────────────

export interface ChatResponse {
  reply: string;
  hunterRank: string;
  pendingTasksToday: number;
  completedTasksToday: number;
}

export function chatWithAssistant(message: string) {
  return apiFetch<ChatResponse>("/api/chat/assistant", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

// ── Health & Daily Log API ──────────────────────────────────────────────────

export interface DailyLogRequest {
  mood: number;
  energyLevel: number;
  focusLevel: number;
  sleepHours: number;
  medsTaken: boolean;
}

export interface DailyLogResponse {
  id: number;
  logDate: string;
  mood: number;
  energyLevel: number;
  focusLevel: number;
  sleepHours: number;
  medsTaken: boolean;
}

export interface PredictionResponse {
  status: string;
  recommendation: string;
}

export function logDailyStats(data: DailyLogRequest) {
  return apiFetch<DailyLogResponse>("/api/health/log", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getRecentLogs() {
  return apiFetch<DailyLogResponse[]>("/api/health/log/recent");
}

export function getSystemPrediction() {
  return apiFetch<PredictionResponse>("/api/health/prediction");
}

