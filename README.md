# AI 灵活简历工具

AI 驱动的智能简历适配平台 — 输入目标岗位 JD，自动为你生成高度匹配的定制简历，搭配多风格模板预览和一键 PDF 导出，让每次投递都精准命中。

## 功能亮点

- **🤖 AI 简历适配** — 根据岗位 JD，自动筛选相关技能、项目与经历，改写描述使其精准匹配目标岗位
- **💬 多风格打招呼话术** — 生成专业正式/亲切热情/简洁直接三种风格的自荐话术，支持一键复制
- **🎨 三套简历模板** — 简洁风（技术岗）、商务风（B端/央企）、创意风（互联网公司），自由切换
- **📄 一键 PDF 导出** — 前端渲染 + 后端 Puppeteer 生成 A4 排版 PDF，即导即用
- **⚙️ 灵活配置** — 篇幅（1-5页）、侧重点（技能/项目/综合）、风格（专业/亲和/简洁）随意组合

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 1. 安装依赖

```bash
# 后端
cd backend && npm install

# 前端
cd frontend && npm install
```

### 2. 配置环境和简历数据

```bash
# 复制环境变量模板，填入你的 API Key
cd backend
cp .env.example .env
# 编辑 .env，将 sk-your-key-here 替换为真实 Key

# 复制简历模板，填入你的简历数据
cp src/data/raw-resume.example.json src/data/raw-resume.json
# 编辑 raw-resume.json，填入你的真实简历信息
```

> DeepSeek API Key 可在 [DeepSeek 开放平台](https://platform.deepseek.com/) 免费获取。

### 3. 启动服务

```bash
# 终端 1：启动后端（端口 3001）
cd backend && npm run dev

# 终端 2：启动前端（端口 5173）
cd frontend && npm run dev
```

浏览器打开 `http://localhost:5173` 即可使用。

## 使用流程

1. 在左侧文本框粘贴目标岗位的 JD（职位描述）
2. （可选）在右侧填写目标公司信息，用于生成更精准的话术
3. 点击 **「生成简历」** → AI 分析 JD 并输出适配后的简历预览
4. 点击 **「生成话术」** → AI 生成多风格打招呼话术，可一键复制
5. 切换底部模板风格查看不同排版效果
6. 点击 **「导出 PDF」** → 下载 A4 排版 PDF

> 快捷键：`Ctrl+Enter`（Mac: `Cmd+Enter`）快速生成简历

## 项目结构

```
resume/
├── backend/          # Express + DeepSeek 后端
│   └── src/
│       ├── routes/       # REST API 路由
│       ├── prompts/      # Agent 系统 Prompt
│       ├── middleware/    # 全局中间件
│       ├── services/     # 简历加载、PDF 生成
│       └── data/         # 原始简历、历史记录
│
├── frontend/         # React + Vite 前端
│   └── src/
│       ├── pages/        # 页面组件
│       ├── components/   # 公共组件（JD输入、模板渲染、错误边界）
│       └── templates/    # 简历模板（简洁/商务/创意）
│
├── CLAUDE.md         # Claude Code 开发指引
└── README.md
```

## 技术栈

| 层   | 技术                  | 说明                    |
| ---- | --------------------- | ----------------------- |
| 后端 | Express 5             | AI Agent 驱动的内容生成 |
| LLM  | DeepSeek              | 简历改写 + 话术生成     |
| PDF  | Puppeteer             | 无头浏览器渲染          |
| 前端 | React 19 + TypeScript | 函数组件 + Hooks        |
| 构建 | Vite 8                | 开发/生产构建           |
| 样式 | 原生 CSS              | 按模板命名空间隔离      |

## 可选环境变量

| 变量           | 默认值                  | 说明               |
| -------------- | ----------------------- | ------------------ |
| `PORT`         | `3001`                  | 后端端口           |
| `LLM_MODEL`    | `deepseek-v4-pro`       | 使用的 LLM 模型    |
| `VITE_API_URL` | `http://localhost:3001` | 前端请求的后端地址 |
