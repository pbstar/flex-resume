/**
 * 全局错误处理中间件 — 统一捕获所有路由抛出的异常
 */

import type { Request, Response, NextFunction } from "express";

/** 业务错误：可预期的、会暴露给前端的错误 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public detail?: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // 已知的业务错误
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      detail: err.detail,
    });
    return;
  }

  // JSON 解析错误
  if (err.message?.includes("JSON") || err.name === "SyntaxError") {
    res.status(400).json({ error: "请求参数格式错误", detail: err.message });
    return;
  }

  // 未知错误 — 不暴露细节
  console.error("[ErrorHandler] 未捕获错误:", err.message, err.stack);
  res.status(500).json({
    error: "服务器内部错误",
    detail: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
}
