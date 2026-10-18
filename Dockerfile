# Production Dockerfile for MindMeshAI on Google Cloud Run
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json tsconfig.json vite.config.ts ./

# Install all dependencies including devDependencies for build
RUN npm ci

# Copy full application source
COPY . .

# Build Vite frontend bundle
RUN npm run build

# Production runtime stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled frontend and server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Expose Cloud Run service port
EXPOSE 3000

# Start server using tsx
CMD ["npx", "tsx", "server.ts"]
