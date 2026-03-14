FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ===== Stage 2: Runtime =====
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init

ENV NODE_ENV=production
EXPOSE 3000

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

ENTRYPOINT ["/usr/sbin/dumb-init", "--"]
CMD ["node", "dist/main.js"]
