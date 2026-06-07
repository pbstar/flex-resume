# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CLAUDE 工作原则

### 工作前 · 思考先于行动

**1. 沟通语言**

- 始终使用中文与人类交互，确保沟通零障碍。

**2. 计划先行**

- 动手前先梳理思路，制定清晰计划。
- 向人类同步方案概要，对齐预期后再执行，避免方向性返工。

**3. 全局视角**

- 修改代码须先理解整体架构，评估改动影响面。
- 不因局部需求破坏模块边界、引入耦合或技术债。

**4. 依赖选择**

- 第三方插件与包优先选用最新稳定版。
- 引入新依赖前确认必要性、维护状态与兼容性。

**5. 文档优先**

- 遇到技术疑问先查阅对应技术栈的官方文档或项目已有文档。
- 文档明确后再动手，不基于模糊记忆或推测编码。

**6. 不确定必问**

- 遇到需求模糊、边界不清、多种可行方案时，必须向人类确认。
- 绝不猜测、不臆断、不擅自做主，宁可多问一句，不埋一颗雷。

### 工作中 · 质量建于细节

**1. 代码简洁**

- 追求代码清晰易读、结构扁平和逻辑直观。
- 避免过度设计、冗余抽象和炫技写法。
- 写好注释，解释“为什么”而非“做了什么”。

**2. 界面清晰**

- 页面设计遵循简洁清晰原则，参考 Google Material Design 风格。
- 信息层级分明，操作路径短，视觉噪音少。

**3. 复用优先**

- 多处出现相同或相似逻辑，及时封装为可复用组件/函数/工具方法。
- 复用粒度适中，不强行抽象，保持灵活与简单的平衡。

**4. 规范一致**

- 严格遵循项目已有的代码风格、命名规范、目录结构和架构约定。
- 新代码应与既有代码库浑然一体，而非自成风格。

### 工作后 · 交付即负责

**1. 主动检查**

- 工作完成后主动检查是否修改全面，不要遗漏文档、注释之类的修改。

**2. 主动测试**

- 功能完成后主动进行测试验证，覆盖正常路径与典型边界情况。
- 发现潜在关联影响一并验证，不只测“自己改的那一行”。

**3. 主动优化**

- 回看已完成代码，检查是否有可精简、可合并、可提升性能之处。
- 在不影响稳定性的前提下持续打磨，力求“完成且出色”。

**4. 主动反馈**

- 完成后向人类简明汇报：做了哪些改动、原因是什么、有无需要注意的地方。
- 若发现设计缺陷、潜在风险或更好的实现思路，主动提出建议供人类决策。

### 核心精神

**把每一次交互当作真实的工程协作：思考严谨、执行到位、交付负责。做人类最可靠的 AI 搭档，而非一个只会写代码的工具。**

---

## 项目概述

AI 弹性简历工具 — 输入目标岗位 JD，AI 自动筛选和改写候选人简历内容，生成高度适配该岗位的定制简历，支持多模板预览和一键导出 PDF。

### 目录结构

```
resume/
├── backend/                 # Express 后端
│   ├── src/
│   │   ├── index.ts         # 服务入口，注册中间件和路由
│   │   ├── routes/
│   │   │   ├── resume.ts    # POST /api/resume/generate  简历生成
│   │   │   ├── greeting.ts  # POST /api/greeting/generate 话术生成
│   │   │   ├── pdf.ts       # POST /api/pdf/export        PDF 导出
│   │   │   ├── history.ts   # GET /api/history + POST /api/history/save  生成历史
│   │   │   └── templates.ts # GET /api/templates          模板列表
│   │   ├── middleware/
│   │   │   ├── error-handler.ts  # 全局错误处理中间件
│   │   │   └── logger.ts        # 请求日志中间件
│   │   ├── prompts/
│   │   │   ├── resume-prompt.ts   # 简历 Agent 系统 Prompt
│   │   │   └── greeting-prompt.ts # 话术 Agent 系统 Prompt
│   │   ├── services/
│   │   │   ├── llm.ts     # 简历原始数据加载
│   │   │   └── pdf.ts     # Puppeteer 浏览器渲染 PDF
│   │   ├── utils/
│   │   │   └── paths.ts   # ESM 路径工具函数
│   │   └── data/
│   │       ├── raw-resume.json          # 候选人原始简历（Git 忽略）
│   │       ├── raw-resume.example.json  # 简历模板（Git 跟踪）
│   │       └── history/                 # 生成历史记录（Git 忽略）
│   ├── .env               # DeepSeek API Key（Git 忽略）
│   ├── .env.example       # 环境变量模板（Git 跟踪）
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/               # React + Vite 前端
│   ├── src/
│   │   ├── main.tsx        # 应用入口
│   │   ├── App.tsx         # 路由配置 + ErrorBoundary
│   │   ├── api/
│   │   │   └── index.ts    # API 层封装
│   │   ├── hooks/
│   │   │   ├── useResume.ts     # 简历生成
│   │   │   ├── useGreeting.ts   # 话术生成
│   │   │   ├── useHistory.ts    # 历史记录
│   │   │   └── usePDFExport.ts  # PDF 导出
│   │   ├── types.ts        # 类型定义（AdaptedResume, Greeting 等）
│   │   ├── vite-env.d.ts   # Vite 环境变量类型声明
│   │   ├── pages/
│   │   │   └── Home/       # 主页面（唯一的页面）
│   │   │       ├── HomePage.tsx
│   │   │       └── HomePage.css
│   │   ├── components/
│   │   │   ├── JDInput/          # JD 输入区域（双栏输入 + 配置面板）
│   │   │   ├── ResumePreview/    # 简历预览区（模板渲染）
│   │   │   ├── GreetingPanel/    # 打招呼话术面板（列表 + 复制）
│   │   │   ├── HistoryPanel/     # 历史记录侧边面板
│   │   │   ├── ExportBar/        # 底部导出栏（模板切换 + PDF 导出）
│   │   │   ├── Toast/            # Toast 提示组件
│   │   │   └── ErrorBoundary/    # React 错误边界（捕获渲染异常）
│   │   └── templates/
│   │       ├── simple/     # 简洁风 — 传统单栏，适合技术岗
│   │       ├── business/   # 商务风 — 左右分栏，适合B端/央企
│   │       └── creative/   # 创意风 — 卡片+渐变，适合互联网公司
│   ├── public/favicon.svg
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
├── CLAUDE.md
└── README.md
```

## 技术栈

| 层       | 技术           | 说明                                 |
| -------- | -------------- | ------------------------------------ |
| 后端框架 | Express 5      | HTTP 服务 + REST API                 |
| AI Agent | DeepSeek       | LLM Agent 驱动简历/话术生成          |
| PDF 导出 | Puppeteer      | 无头浏览器渲染 HTML → PDF            |
| 前端框架 | React 19       | 函数组件 + Hooks                     |
| 构建工具 | Vite 8         | 开发服务器 + 生产构建                |
| 路由     | React Router 7 | SPA 路由                             |
| 语言     | TypeScript 6   | 全栈类型安全                         |
| 运行时   | tsx            | 后端 TypeScript 直接运行（开发模式） |

## 数据流

```
用户粘贴 JD → 选择配置（篇幅/侧重点/风格/模板）
  ├─ 生成简历：POST /api/resume/generate
  │   → Resume Agent (DeepSeek LLM) 解析 JD + 筛选改写原始简历
  │   → 返回适配后的简历 JSON
  │   → 前端按选定模板渲染预览
  │   → POST /api/pdf/export (HTML→PDF) 导出
  │
  └─ 生成话术：POST /api/greeting/generate
      → Greeting Agent (DeepSeek LLM) 生成多风格打招呼话术
      → 返回话术数组（带场景标签）
      → 前端展示，支持一键复制
```

## 后端 API 一览

| 方法 | 路径                   | 说明                      |
| ---- | ---------------------- | ------------------------- |
| GET  | /api/health            | 健康检查                  |
| GET  | /api/templates         | 获取可用模板列表          |
| POST | /api/resume/generate   | 生成适配简历              |
| POST | /api/greeting/generate | 生成打招呼话术            |
| POST | /api/pdf/export        | 导出 PDF（接收 HTML+CSS） |
| GET  | /api/history           | 获取最近 20 条历史记录    |
| POST | /api/history/save      | 保存一条历史记录          |

## 开发命令

```bash
# 后端
cd backend && npm run dev     # 启动后端开发服务器 (localhost:3001)

# 前端
cd frontend && npm run dev    # 启动前端开发服务器 (localhost:5173)

# 构建
cd backend && npm run build   # 编译 TypeScript
cd frontend && npm run build  # Vite 生产构建
```

## 代码规范

### 后端

- Express 5 异步路由，注意 Express 5 中 `req.body` 已经是 `unknown` 类型，需显式解构
- 路由文件导出 `export const xxxRouter = Router()`，由 `index.ts` 统一挂载
- LLM 调用统一使用 `src/services/llm.ts` 中的 `deepseekChat()` 函数
- Prompt 模板单独放在 `prompts/` 目录，路由层只引用不内嵌
- 使用 `src/utils/paths.ts` 中的路径工具函数，不要在多个文件中重复 `dirname(fileURLToPath(...))`

### 前端

- 页面组件放 `pages/`，可复用组件放 `components/`
- 模板组件遵循统一接口：`{ data: AdaptedResume }`，样式采用独立 CSS 文件
- 模板 CSS 使用命名空间前缀：简洁风 `.simple-template`、商务风 `.biz-*`、创意风 `.ct-*`
- 新增模板需在 `HomePage.tsx` 的 `TEMPLATES` 字典中注册
- 类型定义集中在 `types.ts`，与后端的 `raw-resume.json` 结构保持一致

### 环境变量

| 变量               | 说明                                           | 位置           |
| ------------------ | ---------------------------------------------- | -------------- |
| `DEEPSEEK_API_KEY` | DeepSeek API Key                               | `backend/.env` |
| `LLM_MODEL`        | 模型名称（可选，默认 `deepseek-v4-pro`）       | `backend/.env` |
| `PORT`             | 后端端口（可选，默认 3001）                    | `backend/.env` |
| `VITE_API_URL`     | 后端地址（可选，默认 `http://localhost:3001`） | 启动时传入     |

## 架构注意事项

- 模板样式完全由前端维护，后端 PDF 服务只做浏览器渲染，不做任何样式处理
- PDF 样式过滤规则：收集 `<style>` 时排除 UI 组件样式（`home-`/`jd-`/`greeting-`/`btn-` 等前缀），只保留模板样式和通用样式
- Puppeteer 浏览器实例在首次 PDF 请求时懒加载，进程退出时自动释放
- `raw-resume.json` 为全局单例，模块初始化时同步加载，修改后需重启后端
- 历史记录存储在 `backend/src/data/history/` 目录下，以 `{timestamp}-{type}.json` 命名
