# === Build Stage ===
FROM node:20-alpine AS build
WORKDIR /app

# Installer OpenSSL pour Prisma
RUN apk add --no-cache openssl1.1-compat

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npx prisma generate
RUN npm run build

# === Runtime Stage ===
FROM node:20-alpine
WORKDIR /app

# Installer OpenSSL aussi dans le runtime
RUN apk add --no-cache openssl1.1-compat

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 8080
CMD ["node", "dist/index.js"]
