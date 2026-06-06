import { Router, Request, Response } from "express";
import { RAW_RESUME, deepseekChat } from "../services/llm.js";
import { GREETING_SYSTEM_PROMPT } from "../prompts/greeting-prompt.js";
import { cleanJSON } from "../utils/clean-json.js";
import { validateJD } from "../utils/validate-jd.js";
import { AppError } from "../middleware/error-handler.js";

export const greetingRouter = Router();

// POST /api/greeting/generate
greetingRouter.post("/generate", async (req: Request, res: Response) => {
  const { jd, companyIntro, config = {} } = req.body;

  // 参数校验
  const jdError = validateJD(jd);
  if (jdError) {
    throw new AppError(400, jdError);
  }

  const userMessage = JSON.stringify({
    jd,
    rawResume: RAW_RESUME,
    companyIntro: companyIntro || null,
    config: {
      count: 3,
      style: "专业正式",
      maxWords: "50-150字",
      ...config,
    },
  });

  console.log("[Greeting] 开始调用 DeepSeek API...");
  const startTime = Date.now();

  const text = await deepseekChat(GREETING_SYSTEM_PROMPT, userMessage, {
    thinking: "disabled",
  });

  console.log(`[Greeting] API 响应耗时: ${Date.now() - startTime}ms`);

  const greetings = JSON.parse(cleanJSON(text));

  res.json({ greetings });
});
