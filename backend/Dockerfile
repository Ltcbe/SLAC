# /backend/Dockerfile
# Utilise npm ci si un package-lock.json est présent, sinon bascule sur npm install.
FROM node:20-alpine AS build
WORKDIR /app

# Dépendances
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then \
      npm ci --legacy-peer-deps; \
    else \
      npm install --legacy-peer-deps; \
    fi

# Sources
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

# Prisma + build TS
RUN npx prisma generate
RUN npm run build

# Runtime
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copie node_modules (build) + artefacts
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

# Réseau
ENV PORT=8080
EXPOSE 8080

# Migrations + démarrage
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
