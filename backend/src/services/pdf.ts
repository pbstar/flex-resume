/**
 * PDF 生成服务 — 接收前端渲染好的 HTML+CSS，Puppeteer 转 PDF
 */

import puppeteer, { type Browser, type Page } from "puppeteer";

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
let sharedPage: Page | null = null;

async function getBrowser(): Promise<Browser> {
  if (browserPromise) {
    try {
      const browser = await browserPromise;
      // 检查浏览器是否仍然连接
      if (browser.connected) {
        return browser;
      }
    } catch {
      // 浏览器已断开，重新初始化
      console.log("[PDF] 浏览器实例已断开，正在重新启动...");
    }
  }

  // 重置并重新启动
  browserPromise = null;
  sharedPage = null;

  browserPromise = puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage", // 减少内存占用
    ],
  });

  const browser = await browserPromise;

  // 监听断开事件，自动清理
  browser.on("disconnected", () => {
    console.log("[PDF] 浏览器已断开连接");
    browserPromise = null;
    sharedPage = null;
  });

  return browser;
}

async function getPage(browser: Browser): Promise<Page> {
  if (sharedPage && !sharedPage.isClosed()) {
    return sharedPage;
  }
  sharedPage = await browser.newPage();
  return sharedPage;
}

export async function generatePDF(html: string): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await getPage(browser);

  await page.setContent(buildPage(html), {
    waitUntil: "load",
    timeout: 30_000, // 30 秒超时，避免卡死
  });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "1.4cm", bottom: "0.9cm", left: "0cm", right: "0cm" },
  });

  return Buffer.from(pdf);
}

/** 优雅关闭浏览器实例 */
export async function closeBrowser(): Promise<void> {
  if (sharedPage && !sharedPage.isClosed()) {
    await sharedPage.close();
    sharedPage = null;
  }
  if (browserPromise) {
    const browser = await browserPromise;
    await browser.close();
    browserPromise = null;
  }
}

// 进程退出时自动释放浏览器
for (const signal of ["SIGTERM", "SIGINT"] as const) {
  process.on(signal, () => {
    closeBrowser();
  });
}
