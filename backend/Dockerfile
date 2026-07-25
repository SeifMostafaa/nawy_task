FROM node:20-alpine AS base
RUN apk add --no-cache openssl
WORKDIR /app

FROM base AS deps
COPY package*.json ./
COPY prisma ./prisma
RUN npm install

FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./
COPY prisma ./prisma

EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx prisma/seed.ts && node dist/index.js"]
