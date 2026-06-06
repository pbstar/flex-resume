/**
 * API 层封装 — 统一管理所有后端请求
 */

import type {
  AdaptedResume,
  Greeting,
  ResumeConfig,
  GreetingConfig,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function request<T>(
  url: string,
  options: RequestInit & { signal?: AbortSignal } = {},
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || data.error || "请求失败");
  }

  return data;
}

// ─── 简历 ──────────────────────────────────────────────

export function generateResume(
  jd: string,
  config: ResumeConfig,
  signal?: AbortSignal,
): Promise<{ adaptedResume: AdaptedResume }> {
  return request("/api/resume/generate", {
    method: "POST",
    body: JSON.stringify({ jd, config }),
    signal,
  });
}

// ─── 话术 ──────────────────────────────────────────────

export function generateGreeting(
  jd: string,
  companyIntro: string,
  config: GreetingConfig,
  signal?: AbortSignal,
): Promise<{ greetings: Greeting[] }> {
  return request("/api/greeting/generate", {
    method: "POST",
    body: JSON.stringify({
      jd,
      companyIntro: companyIntro || undefined,
      config,
    }),
    signal,
  });
}

// ─── PDF ───────────────────────────────────────────────

export async function exportPDF(html: string): Promise<Blob> {
  const res = await fetch(`${API_BASE_URL}/api/pdf/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || data.error || "PDF 导出失败");
  }

  return res.blob();
}

// ─── 历史 ──────────────────────────────────────────────

export function getHistory(): Promise<{
  entries: import("../types").HistoryEntry[];
}> {
  return request("/api/history");
}

export function saveHistory(
  type: "resume" | "greeting",
  jd: string,
  result: unknown,
): Promise<{ id: string }> {
  return request("/api/history/save", {
    method: "POST",
    body: JSON.stringify({ type, jd, result }),
  });
}
