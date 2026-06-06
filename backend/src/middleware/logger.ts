/**
 * 请求日志中间件
 */

import type { Request, Response, NextFunction } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const icon = status >= 500 ? "❌" : status >= 400 ? "⚠️" : "✓";

    console.log(
      `${icon} ${req.method} ${req.originalUrl} → ${status} (${duration}ms)`,
    );
  });

  next();
}
