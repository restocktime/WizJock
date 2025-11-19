# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
COPY packages/client-app/package.json ./packages/client-app/
COPY packages/shared-types/package.json ./packages/shared-types/

RUN npm install

COPY packages/client-app ./packages/client-app
COPY packages/shared-types ./packages/shared-types

WORKDIR /app/packages/shared-types
RUN npm run build

WORKDIR /app/packages/client-app
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/packages/client-app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
