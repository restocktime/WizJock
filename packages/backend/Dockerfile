FROM node:18-alpine

WORKDIR /app

# Copy root package.json and lockfile
COPY package*.json ./

# Copy backend package.json
COPY packages/backend/package.json ./packages/backend/
COPY packages/shared-types/package.json ./packages/shared-types/

# Install dependencies
# Install dependencies (include dev dependencies for build)
RUN npm install --include=dev

# Copy source code
COPY packages/backend ./packages/backend
COPY packages/shared-types ./packages/shared-types

# Build shared types first
WORKDIR /app/packages/shared-types
RUN npm run build

# Build backend
WORKDIR /app/packages/backend
RUN npm run build

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
