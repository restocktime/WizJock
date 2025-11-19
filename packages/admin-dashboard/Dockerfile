# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
COPY packages/admin-dashboard/package.json ./packages/admin-dashboard/
COPY packages/shared-types/package.json ./packages/shared-types/

RUN npm install

COPY packages/admin-dashboard ./packages/admin-dashboard
COPY packages/shared-types ./packages/shared-types

WORKDIR /app/packages/shared-types
RUN npm run build

WORKDIR /app/packages/admin-dashboard
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/packages/admin-dashboard/dist /usr/share/nginx/html

# Copy custom nginx config if needed (optional for now, default might work for SPA if configured)
# COPY packages/admin-dashboard/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
