
# Base Stage
FROM node:18-alpine AS base

RUN npm install -g pnpm
RUN npm install -g turbo

# Builder
FROM base as builder
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
COPY . .
RUN turbo prune --scope=web --docker

# Dependencies Stage
FROM base AS dependencies

RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN pnpm build --filter web


# Runner Stage
FROM base AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 web
RUN adduser --system --uid 1001 web
USER web
COPY --from=dependencies /app .

CMD ["node", "apps/api/dist/main.js"]