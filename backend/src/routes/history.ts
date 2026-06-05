/**
 * 生成历史记录 — 本地 JSON 文件持久化
 */

import { Router, Request, Response } from "express";
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "fs";
import { resolve } from "path";
import { getHistoryDir } from "../utils/paths.js";

const HISTORY_DIR = getHistoryDir(import.meta.url);

// 确保历史目录存在
try {
  mkdirSync(HISTORY_DIR, { recursive: true });
} catch {
  // 目录已存在或无法创建，后续操作会自行处理错误
}

export const historyRouter = Router();

interface HistoryEntry {
  id: string;
  type: "resume" | "greeting";
  jd: string;
  result: unknown;
  createdAt: string;
}

/** GET /api/history — 获取最近 20 条记录 */
historyRouter.get("/", (_req: Request, res: Response) => {
  try {
    const files = readdirSync(HISTORY_DIR)
      .filter((f) => f.endsWith(".json"))
      .sort()
      .reverse()
      .slice(0, 20);

    const entries = files.map((f) => {
      const data = JSON.parse(readFileSync(resolve(HISTORY_DIR, f), "utf-8"));
      return { id: f.replace(".json", ""), ...data };
    });

    res.json({ entries });
  } catch {
    res.json({ entries: [] });
  }
});

/** POST /api/history — 保存一条记录 */
historyRouter.post("/", (req: Request, res: Response) => {
  try {
    const { type, jd, result } = req.body;

    // 参数校验
    if (!type || !jd || !result) {
      res.status(400).json({ error: "缺少必填参数：type、jd、result" });
      return;
    }

    const id = `${Date.now()}-${type}`;
    const entry: HistoryEntry = {
      id,
      type,
      jd: String(jd).substring(0, 200),
      result,
      createdAt: new Date().toISOString(),
    };
    writeFileSync(
      resolve(HISTORY_DIR, `${id}.json`),
      JSON.stringify(entry, null, 2),
    );
    res.json({ id });
  } catch (err: any) {
    res.status(500).json({ error: "保存历史失败", detail: err.message });
  }
});
