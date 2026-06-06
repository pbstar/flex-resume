import { Router, Request, Response } from "express";
import { RAW_RESUME, deepseekChat } from "../services/llm.js";
import { RESUME_SYSTEM_PROMPT } from "../prompts/resume-prompt.js";
import { cleanJSON } from "../utils/clean-json.js";
import { validateJD } from "../utils/validate-jd.js";
import { AppError } from "../middleware/error-handler.js";

export const resumeRouter = Router();

// POST /api/resume/generate
resumeRouter.post("/generate", async (req: Request, res: Response) => {
  const { jd, config = {} } = req.body;

  // 参数校验
  const jdError = validateJD(jd);
  if (jdError) {
    throw new AppError(400, jdError);
  }

  const userMessage = JSON.stringify({
    jd,
    rawResume: RAW_RESUME,
    config: {
      length: "一页",
      style: "专业",
      ...config,
    },
  });

  console.log("[Resume] 开始调用 DeepSeek API...");
  const startTime = Date.now();

  const text = await deepseekChat(RESUME_SYSTEM_PROMPT, userMessage);

  console.log(`[Resume] API 响应耗时: ${Date.now() - startTime}ms`);

  const adaptedResume = JSON.parse(cleanJSON(text));

  res.json({ adaptedResume });
});
