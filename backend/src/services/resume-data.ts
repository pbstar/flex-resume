/**
 * 简历数据服务 — 加载原始简历并剥离配置字段
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { getDataDir } from "../utils/paths.js";

// ─── 加载原始简历 ──────────────────────────────────────────

let RAW_RESUME: Record<string, unknown>;

try {
  const rawResumePath = resolve(getDataDir(import.meta.url), "raw-resume.json");
  RAW_RESUME = JSON.parse(readFileSync(rawResumePath, "utf-8"));
} catch (err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error("[ResumeData] 无法加载原始简历文件:", msg);
  console.error(
    "[ResumeData] 请复制 src/data/raw-resume.example.json 为 raw-resume.json 并填入你的简历数据",
  );
  process.exit(1);
}

// ─── 提取纯简历数据 ────────────────────────────────────────

/** 配置类字段名，传给 LLM 时需要剥离 */
const META_FIELDS = new Set(["customPrompt"]);

export interface ResumePayload {
  /** 纯简历数据（已剥离 customPrompt 等配置字段） */
  resumeData: Record<string, unknown>;
  /** 自定义提示词（可选） */
  customPrompt?: string;
}

/**
 * 从原始简历 JSON 中提取纯简历数据和自定义配置
 *
 * 配置字段（customPrompt 等）会从 resumeData 中剥离，
 * 避免无关内容进入 LLM 上下文。
 */
export function extractResumeData(): ResumePayload {
  const customPrompt = RAW_RESUME.customPrompt as string | undefined;

  const resumeData: Record<string, unknown> = {};
  for (const key of Object.keys(RAW_RESUME)) {
    if (!META_FIELDS.has(key)) {
      resumeData[key] = RAW_RESUME[key];
    }
  }

  return { resumeData, customPrompt };
}

export { RAW_RESUME };
