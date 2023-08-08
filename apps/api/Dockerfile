# Base Stage
FROM node:18-alpine AS base

RUN apk add --no-cache libc6-compat
RUN apk update

RUN npm install -g pnpm
RUN npm install -g turbo

# Builder
FROM base as builder

WORKDIR /app
COPY . .
RUN turbo prune --scope=api --docker


# Dependencies Stage
FROM base AS dependencies

WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm build --filter api


# # Runner Stage
# FROM base AS runner

# WORKDIR /app

# RUN addgroup --system --gid 1001 api
# RUN adduser --system --uid 1001 api
# USER api
# COPY --from=dependencies /app .

# RUN cd apps/api
# CMD ["pnpm", "start", "--filter", "api"]
ENV NODE_PATH=/app/node_modules:/app/apps/api/node_modules
CMD ["node", "apps/api/dist/main.js"]