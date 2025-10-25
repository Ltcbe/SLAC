# === Build Stage ===
FROM node:20-alpine AS build
WORKDIR /app

# Installer OpenSSL 3 (remplace l'ancien openssl1.1)
RUN apk add --no-cache openssl libssl3 libcrypto3

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Générer le client Prisma avec détection OpenSSL 3
ENV PRISMA_CLI_QUERY_ENGINE_TYPE="binary"
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
RUN npx prisma generate

RUN npm run build

# === Runtime Stage ===
FROM node:20-alpine
WORKDIR /app

# Installer les libs runtime nécessaires
RUN apk add --no-cache openssl libssl3 libcrypto3

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

ENV NODE_ENV=production
ENV PRISMA_CLI_QUERY_ENGINE_TYPE="binary"
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

EXPOSE 8080
CMD ["node", "dist/index.js"]
