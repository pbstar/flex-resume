/**
 * 清理 LLM 响应中可能的 markdown 代码块标记
 */
export function cleanJSON(text: string): string {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();
}
