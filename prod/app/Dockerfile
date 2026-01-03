# Multi-stage Dockerfile for SvelteKit (adapter-node)
# Stage 1: Build with devDependencies
FROM node:23-alpine AS builder
WORKDIR /app
ENV NODE_ENV=development
# Install all dependencies (including devDependencies)
COPY package*.json ./
RUN npm ci
# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Runtime with production dependencies only
FROM node:23-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
# Copy built artifacts
COPY --from=builder /app/build ./build
# SvelteKit adapter-node serves on 3000 by default
EXPOSE 3000
CMD ["node", "build"]
