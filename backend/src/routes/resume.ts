import { Router, Request, Response } from "express";
import { RAW_RESUME, deepseekChat } from "../services/llm.js";
import { RESUME_SYSTEM_PROMPT } from "../prompts/resume-prompt.js";

const MAX_JD_LENGTH = 20_000;

export const resumeRouter = Router();

// POST /api/resume/generate
resumeRouter.post("/generate", async (req: Request, res: Response) => {
  try {
    const { jd, config = {} } = req.body;

    // 参数校验
    if (!jd || typeof jd !== "string" || !jd.trim()) {
      res.status(400).json({ error: "缺少必填参数：jd（岗位描述）" });
      return;
    }

    if (jd.length > MAX_JD_LENGTH) {
      res
        .status(400)
        .json({ error: `JD 文本过长，请限制在 ${MAX_JD_LENGTH} 字以内` });
      return;
    }

    const userMessage = JSON.stringify({
      jd,
      rawResume: RAW_RESUME,
      config: {
        length: "一页",
        focus: "综合",
        style: "专业",
        ...config,
      },
    });

    console.log("[Resume] 开始调用 DeepSeek API...");
    const startTime = Date.now();

    const text = await deepseekChat(RESUME_SYSTEM_PROMPT, userMessage);

    console.log(`[Resume] API 响应耗时: ${Date.now() - startTime}ms`);

    // 清理可能的 markdown 代码块标记
    const jsonStr = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();

    const adaptedResume = JSON.parse(jsonStr);

    res.json({ adaptedResume });
  } catch (err: any) {
    console.error("[Resume] Error:", err.message);
    res.status(500).json({
      error: "简历生成失败",
      detail: err.message,
    });
  }
});
