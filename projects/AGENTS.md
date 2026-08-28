# 项目上下文

### 版本技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4

## 目录结构

```
├── public/                 # 静态资源
├── scripts/                # 构建与启动脚本
├── src/
│   ├── app/                # 页面路由与布局
│   │   ├── api/            # 后端 API 路由
│   │   │   ├── start/      # 游戏场景生成 (POST)
│   │   │   ├── chat/       # 对话处理 + TTS (POST)
│   │   │   └── review/     # 复盘分析 (POST)
│   │   ├── page.tsx        # 主页（首页/游戏/复盘三阶段管理）
│   │   ├── layout.tsx      # 根布局
│   │   ├── globals.css     # 全局样式 + 游戏动画
│   │   └── types.ts        # 游戏类型定义
│   ├── components/
│   │   ├── ui/             # Shadcn UI 组件库
│   │   ├── game.tsx        # 游戏聊天组件
│   │   └── review.tsx      # 复盘展示组件
│   ├── hooks/              # 自定义 Hooks
│   ├── lib/                # 工具库
│   └── server.ts           # 自定义服务端入口
├── DESIGN.md               # 设计规范
├── next.config.ts          # Next.js 配置
├── package.json            # 项目依赖管理
└── tsconfig.json           # TypeScript 配置
```

## 项目概述

**哄哄模拟器** - AI 情景练习小游戏。用户通过文字聊天哄生气的 AI 女朋友，核心机制包括：
- 愤怒值系统（0-100，初始60，0成功/100失败/最多20轮）
- LLM 驱动的角色对话（doubao-seed-2-0-lite-260215）
- TTS 语音合成（zh_female_meilinvyou_saturn_bigtts，语速/音量随情绪变化）
- 游戏复盘分析

## API 接口

| 路由 | 方法 | 功能 | 关键参数 |
|------|------|------|----------|
| `/api/start` | POST | 生成随机场景 | 无 |
| `/api/chat` | POST | 处理对话 + 生成语音 | scenario, hiddenNeed, messages, angerLevel, round, userMessage |
| `/api/review` | POST | 生成复盘分析 | scenario, hiddenNeed, messages, gameResult |

## 包管理规范

**仅允许使用 pnpm** 作为包管理器，**严禁使用 npm 或 yarn**。
**常用命令**：
- 安装依赖：`pnpm add <package>`
- 安装开发依赖：`pnpm add -D <package>`
- 安装所有依赖：`pnpm install`
- 移除依赖：`pnpm remove <package>`

## 开发规范

### 编码规范

- 默认按 TypeScript `strict` 心智写代码；优先复用当前作用域已声明的变量、函数、类型和导入，禁止引用未声明标识符或拼错变量名。
- 禁止隐式 `any` 和 `as any`；函数参数、返回值、解构项、事件对象、`catch` 错误在使用前应有明确类型或先完成类型收窄，并清理未使用的变量和导入。

### next.config 配置规范

- 配置的路径不要写死绝对路径，必须使用 path.resolve(__dirname, ...)、import.meta.dirname 或 process.cwd() 动态拼接。

### Hydration 问题防范

1. 严禁在 JSX 渲染逻辑中直接使用 typeof window、Date.now()、Math.random() 等动态数据。**必须使用 'use client' 并配合 useEffect + useState 确保动态内容仅在客户端挂载后渲染**；同时严禁非法 HTML 嵌套（如 <p> 嵌套 <div>）。
2. **禁止使用 head 标签**，优先使用 metadata，详见文档：https://nextjs.org/docs/app/api-reference/functions/generate-metadata
   1. 三方 CSS、字体等资源可在 `globals.css` 中顶部通过 `@import` 引入或使用 next/font
   2. preload, preconnect, dns-prefetch 通过 ReactDOM 的 preload、preconnect、dns-prefetch 方法引入
   3. json-ld 可阅读 https://nextjs.org/docs/app/guides/json-ld

## UI 设计与组件规范 (UI & Styling Standards)

- 模板默认预装核心组件库 `shadcn/ui`，位于`src/components/ui/`目录下
- Next.js 项目**必须默认**采用 shadcn/ui 组件、风格和规范，**除非用户指定用其他的组件和规范。**
