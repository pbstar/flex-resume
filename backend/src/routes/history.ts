/**
 * 生成历史记录 — 本地 JSON 文件持久化（异步 IO）
 */

import { Router, Request, Response } from "express";
import { readFile, writeFile, readdir, mkdir } from "fs/promises";
import { resolve } from "path";
import { getHistoryDir } from "../utils/paths.js";
import { AppError } from "../middleware/error-handler.js";

const HISTORY_DIR = getHistoryDir(import.meta.url);

// 确保历史目录存在
await mkdir(HISTORY_DIR, { recursive: true }).catch(() => {
  // 目录已存在或无法创建，后续操作会自行处理错误
});

export const historyRouter = Router();

interface HistoryEntry {
  id: string;
  type: "resume" | "greeting";
  jd: string;
  result: unknown;
  createdAt: string;
}

/** GET /api/history — 获取最近 20 条记录 */
historyRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const files = await readdir(HISTORY_DIR);
    const jsonFiles = files
      .filter((f) => f.endsWith(".json"))
      .sort()
      .reverse()
      .slice(0, 20);

    const entries = await Promise.all(
      jsonFiles.map(async (f) => {
        const data = await readFile(resolve(HISTORY_DIR, f), "utf-8");
        const parsed = JSON.parse(data);
        return { id: f.replace(".json", ""), ...parsed };
      }),
    );

    res.json({ entries });
  } catch {
    res.json({ entries: [] });
  }
});

/** POST /api/history/save — 保存一条记录 */
historyRouter.post("/save", async (req: Request, res: Response) => {
  const { type, jd, result } = req.body;

  // 参数校验
  if (!type || !jd || !result) {
    throw new AppError(400, "缺少必填参数：type、jd、result");
  }

  const id = `${Date.now()}-${type}`;
  const entry: HistoryEntry = {
    id,
    type,
    jd: String(jd).substring(0, 200),
    result,
    createdAt: new Date().toISOString(),
  };

  await writeFile(
    resolve(HISTORY_DIR, `${id}.json`),
    JSON.stringify(entry, null, 2),
  );

  res.json({ id });
});
