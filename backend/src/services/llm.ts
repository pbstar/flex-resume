/**
 * LLM 服务 — DeepSeek API 直连客户端
 */

const BASE_URL = "https://api.deepseek.com";
const DEFAULT_MODEL = "deepseek-v4-pro";

const DEFAULT_TIMEOUT_MS = 300_000; // 5 分钟
const MAX_RETRIES = 2;

interface ChatOptions {
  /** 模型名称，默认 deepseek-v4-pro */
  model?: string;
  thinking?: string; // enabled, disabled
  /** 请求超时（毫秒），默认 5 分钟 */
  timeout?: number;
  /** 最大重试次数（仅 5xx/网络错误），默认 2 */
  maxRetries?: number;
}

/**
 * 发送聊天请求到 DeepSeek API（带超时和自动重试）
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
  const timeoutMs = options.timeout ?? DEFAULT_TIMEOUT_MS;
  const maxRetries = options.maxRetries ?? MAX_RETRIES;

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

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      const delay = Math.min(1000 * 2 ** attempt, 8000); // 指数退避：2s, 4s, 8s
      console.log(`[LLM] 第 ${attempt} 次重试，等待 ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errText = await response.text();
        const err = new Error(
          `DeepSeek API 错误 (${response.status}): ${errText}`,
        );

        // 4xx 错误不重试（认证/参数/限流问题）
        if (response.status >= 400 && response.status < 500) {
          if (response.status === 401) {
            throw new Error("DeepSeek API Key 无效，请检查 DEEPSEEK_API_KEY");
          }
          if (response.status === 429) {
            throw new Error("DeepSeek API 请求过于频繁，请稍后重试");
          }
          throw err;
        }

        // 5xx 服务器错误，可以重试
        lastError = err;
        continue;
      }

      const data = (await response.json()) as {
        choices: Array<{ message: { content: string } }>;
      };

      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("DeepSeek API 返回内容为空");
      }

      return content;
    } catch (err: unknown) {
      // AbortError (超时) 可以重试
      if (err instanceof Error && err.name === "AbortError") {
        lastError = new Error(`DeepSeek API 请求超时（${timeoutMs / 1000}s）`);
        continue;
      }
      // 已经是不可重试的错误（如 4xx），直接抛出
      if (err instanceof Error && err.message.startsWith("DeepSeek API Key")) {
        throw err;
      }
      if (
        err instanceof Error &&
        err.message.startsWith("DeepSeek API 请求过于频繁")
      ) {
        throw err;
      }
      // 其他错误尝试重试
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError || new Error("DeepSeek API 请求失败（已达最大重试次数）");
}
