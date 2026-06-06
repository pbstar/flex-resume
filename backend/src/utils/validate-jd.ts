/**
 * JD 参数校验 — resume 和 greeting 路由共用
 */

const MAX_JD_LENGTH = 20_000;

/**
 * 校验 JD 字符串，返回 null 表示通过，返回错误消息表示校验失败
 */
export function validateJD(jd: unknown): string | null {
  if (!jd || typeof jd !== "string" || !jd.trim()) {
    return "缺少必填参数：jd（岗位描述）";
  }
  if (jd.length > MAX_JD_LENGTH) {
    return `JD 文本过长，请限制在 ${MAX_JD_LENGTH} 字以内`;
  }
  return null;
}
