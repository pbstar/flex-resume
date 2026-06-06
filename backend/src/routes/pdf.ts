import { Router, Request, Response } from "express";
import { generatePDF } from "../services/pdf.js";
import { AppError } from "../middleware/error-handler.js";

export const pdfRouter = Router();

pdfRouter.post("/export", async (req: Request, res: Response) => {
  const { html } = req.body;

  if (!html) {
    throw new AppError(400, "缺少必填参数：html（前端渲染的简历 HTML）");
  }

  const pdfBuffer = await generatePDF(html);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="resume.pdf"');
  res.setHeader("Content-Length", pdfBuffer.length);
  res.send(pdfBuffer);
});
