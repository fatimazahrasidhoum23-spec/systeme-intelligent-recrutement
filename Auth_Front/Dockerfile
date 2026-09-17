# ── Stage 1 : Build Angular ───────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build -- --configuration production

# ── Stage 2 : Servir avec Nginx ───────────────────────────────────────────
FROM nginx:alpine
# Le build Angular copie public/ automatiquement dans dist/
COPY --from=build /app/dist/auth-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 4200
