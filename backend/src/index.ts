import "dotenv/config";

import express from "express";
import cors from "cors";
import { resumeRouter } from "./routes/resume.js";
import { greetingRouter } from "./routes/greeting.js";
import { pdfRouter } from "./routes/pdf.js";
import { templatesRouter } from "./routes/templates.js";
import { historyRouter } from "./routes/history.js";

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json({ limit: "5mb" }));

// 自定义路由
app.use("/api/resume", resumeRouter);
app.use("/api/greeting", greetingRouter);
app.use("/api/pdf", pdfRouter);
app.use("/api/templates", templatesRouter);
app.use("/api/history", historyRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
  console.log(`API health:  http://localhost:${PORT}/api/health`);
});
