# /collector/Dockerfile
# Utilise npm ci si un package-lock.json est présent, sinon bascule sur npm install.
FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then \
      npm ci --legacy-peer-deps; \
    else \
      npm install --legacy-peer-deps; \
    fi

COPY src ./src
ENV NODE_ENV=production

CMD ["node", "src/index.js"]
