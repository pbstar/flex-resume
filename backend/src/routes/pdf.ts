import { Router, Request, Response } from "express";
import { generatePDF } from "../services/pdf.js";

export const pdfRouter = Router();

pdfRouter.post("/export", async (req: Request, res: Response) => {
  try {
    const { html } = req.body;

    if (!html) {
      res
        .status(400)
        .json({ error: "缺少必填参数：html（前端渲染的简历 HTML）" });
      return;
    }

    const pdfBuffer = await generatePDF(html);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="resume.pdf"');
    res.setHeader("Content-Length", pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (err: any) {
    console.error("[PDF] Error:", err.message);
    res.status(500).json({ error: "PDF 导出失败", detail: err.message });
  }
});
