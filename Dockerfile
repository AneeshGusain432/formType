FROM node:20-alpine AS base
WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY . .
RUN pnpm install --frozen-lockfile

FROM base AS api-builder
RUN pnpm --filter @repo/api build

FROM base AS web-builder
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID=""
ARG NEXT_PUBLIC_API_URL=http://api:8000
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
ENV NEXT_PUBLIC_API_URL=${API_SERVER_URL}
RUN pnpm --filter web build

FROM node:20-alpine AS api
WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY --from=base /workspace /workspace
COPY --from=api-builder /workspace/apps/api/dist /workspace/apps/api/dist

ENV PORT=8000 \
    NODE_ENV=prod \
    NEXT_PUBLIC_API_URL=http://localhost:8000

EXPOSE 8000
CMD ["sh", "-lc", "cd /workspace/apps/api && node dist/index.js"]

FROM node:20-alpine AS web
WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY --from=base /workspace/node_modules /workspace/node_modules
COPY --from=base /workspace/packages /workspace/packages
COPY --from=base /workspace/apps/web /workspace/apps/web
COPY --from=web-builder /workspace/apps/web/.next /workspace/apps/web/.next
COPY --from=web-builder /workspace/apps/web/public /workspace/apps/web/public

ENV PORT=3000 \
    NODE_ENV=production \
    NEXT_PUBLIC_API_URL=http://api:8000 \
    NEXT_PUBLIC_API_URL=http://localhost:8000 \
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=""

EXPOSE 3000
CMD ["sh", "-lc", "cd /workspace/apps/web && pnpm start"]
