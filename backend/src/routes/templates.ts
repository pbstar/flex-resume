import { Router, Request, Response } from "express";

export const templatesRouter = Router();

// GET /api/templates
templatesRouter.get("/", (_req: Request, res: Response) => {
  res.json({
    templates: [
      {
        id: "simple",
        name: "简洁风",
        description: "干净利落，适合技术岗位",
        thumbnail: null,
      },
      {
        id: "business",
        name: "商务风",
        description: "专业稳重，适合B端/央企岗位",
        thumbnail: null,
      },
      {
        id: "creative",
        name: "创意风",
        description: "现代活泼，适合互联网/创业公司",
        thumbnail: null,
      },
    ],
  });
});
