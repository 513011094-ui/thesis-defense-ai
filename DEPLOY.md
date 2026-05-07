# 部署说明

## 本地开发

```bash
npm install
cp .env.example .env.local   # 填入 API Key
npm run dev                    # http://localhost:3000
```

## 生产构建

```bash
npm run build
npm run start                  # http://localhost:3000
```

## Vercel 部署（推荐）

1. 将代码推送到 GitHub 仓库
2. 在 [vercel.com](https://vercel.com) 导入该仓库
3. 在 Vercel 项目设置中添加环境变量：
   - `DEEPSEEK_API_KEY` = 你的API密钥
   - `LLM_BASE_URL` = `https://api.deepseek.com`
   - `LLM_MODEL` = `deepseek-chat`
4. 点击 Deploy，等待构建完成

## Docker 部署

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start"]
```

```bash
docker build -t thesis-defense-ai .
docker run -p 3000:3000 \
  -e DEEPSEEK_API_KEY=sk-xxx \
  -e LLM_BASE_URL=https://api.deepseek.com \
  -e LLM_MODEL=deepseek-chat \
  thesis-defense-ai
```

## 环境变量说明

| 变量 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `DEEPSEEK_API_KEY` | 是 | - | DeepSeek API密钥 |
| `LLM_BASE_URL` | 否 | `https://api.deepseek.com` | LLM API地址 |
| `LLM_MODEL` | 否 | `deepseek-chat` | 模型名称 |

## 注意事项

- API Key **仅在服务端使用**，不会暴露给前端
- 论文解析在浏览器端完成，不会上传到服务器
- 如需更换LLM提供商，修改 `LLM_BASE_URL` 和 `LLM_MODEL` 即可（需兼容OpenAI格式）
