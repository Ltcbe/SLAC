# Build étape: si package.json existe => build Vite; sinon => placeholder dist/
FROM node:20-alpine AS build
WORKDIR /app

# On copie tout le contexte frontend (même s'il est vide, c'est OK)
COPY . .

# Si le frontend Vite existe, on build; sinon on crée un placeholder dist/index.html
RUN if [ -f package.json ]; then \
      npm ci --legacy-peer-deps && \
      npm run build; \
    else \
      mkdir -p dist && \
      printf '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SNCB Timing</title></head><body><h1>SNCB Timing</h1><p>Frontend placeholder: pousse ton code Vite/React ici.</p></body></html>' > dist/index.html; \
    fi

# Runtime: Nginx sert /usr/share/nginx/html
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
