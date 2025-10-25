# ===========================
#  BUILD STAGE
# ===========================
FROM node:20-alpine AS build

# 🧰 Installer OpenSSL et glibc pour Prisma
RUN apk add --no-cache openssl1.1-compat

WORKDIR /app

COPY package*.json ./
RUN if [ -f package-lock.json ]; then \
      npm ci --legacy-peer-deps; \
    else \
      npm install --legacy-peer-deps; \
    fi

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate
RUN npm run build

# ===========================
#  RUNTIME STAGE
# ===========================
FROM node:20-alpine

# 🧰 Installer OpenSSL runtime
RUN apk add --no-cache openssl1.1-compat

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "dist/index.js"]
