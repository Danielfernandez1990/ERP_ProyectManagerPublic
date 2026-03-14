FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ===== Stage 2: Runtime =====
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
EXPOSE 5173

COPY package*.json ./
RUN npm ci --only=production
RUN npm install -g vite

COPY --from=builder /app/dist ./dist
COPY vite.config.js .

CMD ["vite", "preview", "--host", "0.0.0.0"]
