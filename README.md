# 一坨答辩 — AI模拟论文答辩系统

基于大语言模型的论文答辩模拟平台。上传论文DOCX文件，三位AI导师轮流提问，评审导师自动生成评分报告。

## 技术栈

- **框架：** Next.js 16 (App Router + Turbopack)
- **语言：** TypeScript
- **样式：** Tailwind CSS v4
- **状态管理：** Zustand
- **论文解析：** mammoth (DOCX)
- **LLM：** DeepSeek API (OpenAI兼容)

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local`，填入你的 DeepSeek API Key：

```bash
cp .env.example .env.local
```

```env
DEEPSEEK_API_KEY=sk-你的密钥
LLM_BASE_URL=https://api.deepseek.com
LLM_MODEL=deepseek-chat
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 4. 放置导师头像（可选）

将4位导师的真人照片放入 `public/avatars/` 目录：

| 文件名 | 导师 |
|--------|------|
| `zhang.png` | 张明远（主审导师） |
| `wang.png` | 王建华（专业导师） |
| `lin.png` | 林婉清（学术拓展导师） |
| `chen.png` | 陈建国（评审导师） |

不放置照片时会自动显示姓氏首字作为头像。

## 项目结构

```
src/
├── app/
│   ├── page.tsx                  # 首页（论文上传）
│   ├── defense/page.tsx          # 答辩对话页
│   ├── report/page.tsx           # 评分报告页
│   └── api/
│       ├── defense/route.ts      # 答辩对话API（SSE流式）
│       └── report/route.ts       # 评分报告API
├── components/
│   ├── ui/                       # Button, Card, Loading, Avatar
│   ├── upload/                   # ThesisUploadForm
│   ├── defense/                  # DefenseStage, MentorMessage, UserAnswer, OpeningCeremony
│   └── report/                   # ScoreCard, ResultBadge, SuggestionList, DetailedFeedback
├── lib/
│   ├── llm/                      # LLM接口层 (client, stream, types)
│   ├── thesis/                   # 论文解析 (docx-parser, structure)
│   ├── defense/                  # 答辩引擎 (engine, prompt-builder)
│   ├── prompts/                  # Prompt模板（系统+4导师+追问+评分）
│   └── utils/                    # extract-json, score-colors
├── hooks/                        # useThesisParser, useDefense
├── store/defenseStore.ts         # Zustand全局状态
└── types/                        # thesis, defense, mentor
```

## 答辩流程

1. 用户上传DOCX论文 → 浏览器端解析章节结构
2. 进入答辩 → 开场仪式展示答辩委员会
3. 三位导师轮流提问（共5题，由浅入深）
4. 支持追问和引导机制
5. 答辩结束 → 评审导师生成四维度评分报告

## 四位导师

| 导师 | 角色 | 提问方向 | 压力值 |
|------|------|----------|--------|
| 张明远教授 | 主审导师 | 研究动机、论文结构、创新点 | 2/5 |
| 王建华教授 | 专业导师 | 研究方法、数据分析、工具选择 | 3/5 |
| 林婉清教授 | 学术拓展导师 | 应用场景、跨学科延伸、未来方向 | 1/5 |
| 陈建国教授 | 评审导师 | 综合评分（不提问） | - |

## 构建部署

```bash
npm run build
npm run start
```

详见 [DEPLOY.md](./DEPLOY.md)
