/**
 * PDF 生成服务 — 接收前端渲染好的 HTML+CSS，Puppeteer 转 PDF
 */

import puppeteer, { type Browser } from "puppeteer";

function buildPage(html: string): string {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
}

let browserPromise: Promise<Browser> | null = null;

function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
  return browserPromise;
}

export async function generatePDF(html: string): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setContent(buildPage(html), { waitUntil: "load" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "1.4cm", bottom: "0.9cm", left: "0cm", right: "0cm" },
    });
    return Buffer.from(pdf);
  } finally {
    await page.close();
  }
}

/** 优雅关闭浏览器实例 */
export async function closeBrowser(): Promise<void> {
  if (browserPromise) {
    const browser = await browserPromise;
    await browser.close();
    browserPromise = null;
  }
}

// 进程退出时自动释放浏览器
process.on("SIGTERM", () => {
  closeBrowser();
});
process.on("SIGINT", () => {
  closeBrowser();
});
