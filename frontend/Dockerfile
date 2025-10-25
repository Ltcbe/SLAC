# Étape 1 — Build du frontend
FROM node:20-alpine AS build
WORKDIR /app

# Copie des manifests (avec lockfile si présent)
COPY package.json package-lock.json* ./

# Utilise npm ci si le lockfile est là, sinon bascule sur npm install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copie du code et build
COPY . .
RUN npm run build

# Étape 2 — Serveur statique (SPA)
FROM nginx:stable-alpine
# Nginx pour SPA : fallback sur index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
