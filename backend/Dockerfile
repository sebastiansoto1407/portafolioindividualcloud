FROM node:22-bookworm-slim AS build
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY src ./src

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production PORT=3001 HOST=0.0.0.0
COPY --from=build --chown=node:node /build/package.json ./package.json
COPY --from=build --chown=node:node /build/node_modules ./node_modules
COPY --from=build --chown=node:node /build/src ./src
USER node
EXPOSE 3001
CMD ["node", "src/server.js"]

