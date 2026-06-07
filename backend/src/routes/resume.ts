import { Router, Request, Response } from "express";
import { deepseekChat } from "../services/llm.js";
import { extractResumeData } from "../services/resume-data.js";
import { buildResumePrompt } from "../prompts/resume-prompt.js";
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

  // 从原始简历中提取纯数据与自定义配置
  const { resumeData, customPrompt } = extractResumeData();

  const userMessage = JSON.stringify({
    jd,
    rawResume: resumeData,
    config: {
      length: "一页",
      style: "专业",
      ...config,
    },
  });

  const systemPrompt = buildResumePrompt(customPrompt);

  console.log("[Resume] 开始调用 DeepSeek API...");
  if (customPrompt) {
    console.log("[Resume] 已加载自定义提示词配置");
  }
  const startTime = Date.now();

  const text = await deepseekChat(systemPrompt, userMessage);

  console.log(`[Resume] API 响应耗时: ${Date.now() - startTime}ms`);

  const adaptedResume = JSON.parse(cleanJSON(text));

  res.json({ adaptedResume });
});
