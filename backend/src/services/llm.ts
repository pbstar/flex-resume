/**
 * LLM 服务 — 简历数据加载 + DeepSeek API 直连客户端
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { getDataDir } from "../utils/paths.js";

// ─── 简历数据 ────────────────────────────────────────────

let RAW_RESUME: unknown;

try {
  const rawResumePath = resolve(getDataDir(import.meta.url), "raw-resume.json");
  RAW_RESUME = JSON.parse(readFileSync(rawResumePath, "utf-8"));
} catch (err: any) {
  console.error("[LLM] 无法加载原始简历文件:", err.message);
  console.error(
    "[LLM] 请复制 src/data/raw-resume.example.json 为 raw-resume.json 并填入你的简历数据",
  );
  process.exit(1);
}

// ─── DeepSeek API 客户端 ──────────────────────────────────

const BASE_URL = "https://api.deepseek.com";
const DEFAULT_MODEL = "deepseek-v4-pro";

interface ChatOptions {
  /** 模型名称，默认 deepseek-v4-pro */
  model?: string;
  thinking?: string; // enabled, disabled
}

/**
 * 发送聊天请求到 DeepSeek API
 * @returns 模型回复文本
 */
export async function deepseekChat(
  systemPrompt: string,
  userMessage: string,
  options: ChatOptions = {},
): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY 环境变量未设置");
  }

  const model = options.model || process.env.LLM_MODEL || DEFAULT_MODEL;

  const body = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    thinking: {
      type: options.thinking || "enabled",
    },
  };

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`DeepSeek API 错误 (${response.status}): ${errText}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("DeepSeek API 返回内容为空");
  }

  return content;
}

export { RAW_RESUME };
