# EasyPoster - AI 海报生成器

使用 AI 快速生成精美海报，支持多种风格，一键下载。

## ✨ 功能特性

- 🎨 **6 种海报风格**：电商促销、极简艺术、赛博朋克、复古怀旧、自然清新、科技创新
- 🤖 **AI 驱动**：基于 DALL-E 3 模型，高质量图片生成
- ⚡ **秒级生成**：15-30 秒即可获得专业级海报
- 📥 **一键下载**：生成后可直接下载高清海报图片
- 🌙 **暗色主题**：精美的深色 UI 设计

## 🛠️ 技术栈

- **框架**：Next.js 14 (App Router) + TypeScript
- **样式**：Tailwind CSS
- **AI 接口**：KULAAI 聚合平台 (DALL-E 3)
- **部署**：Vercel

## 📦 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local`，并填入你的 API Key：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```env
# KULAAI 平台 API Key
KULAAI_API_KEY=your_kulaai_api_key_here

# KULAAI API 基础地址
KULAAI_API_BASE_URL=https://api.kulaai.com/v1

# 使用的模型
AI_MODEL=dall-e-3
```

### 3. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可使用。

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 🚀 部署到 Vercel

### 方式一：一键部署（推荐）

1. 将代码推送到 GitHub 仓库
2. 访问 [vercel.com](https://vercel.com)，使用 GitHub 登录
3. 点击 **"Add New Project"**，选择你的仓库
4. 在 **Environment Variables** 中添加：
   - `KULAAI_API_KEY` = 你的 API Key
   - `KULAAI_API_BASE_URL` = `https://api.kulaai.com/v1`
   - `AI_MODEL` = `dall-e-3`
5. 点击 **Deploy**，等待部署完成

### 方式二：Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 添加环境变量
vercel env add KULAAI_API_KEY
vercel env add KULAAI_API_BASE_URL
vercel env add AI_MODEL

# 重新部署以使环境变量生效
vercel --prod
```

## 📁 项目结构

```
EasyPoster/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts      # 后端 API 路由
│   ├── globals.css            # 全局样式
│   ├── layout.tsx             # 根布局
│   └── page.tsx               # 首页（核心前端）
├── .env.example               # 环境变量示例
├── .env.local                 # 环境变量（不提交到 Git）
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🔑 API Key 获取

1. 访问 [KULAAI](https://api.kulaai.com) 注册账号
2. 在控制台获取 API Key
3. 确保账户有足够余额

## 📝 License

MIT