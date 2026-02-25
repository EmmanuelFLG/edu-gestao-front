# ---------- Stage 1: Build ----------
FROM node:20-alpine AS build

WORKDIR /app

# Copia package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Build da aplicação Vite
RUN npm run build

# ---------- Stage 2: Serve via Nginx ----------
FROM nginx:alpine

# Copia build para Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia configuração custom de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]