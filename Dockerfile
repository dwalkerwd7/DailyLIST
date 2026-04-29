FROM node:22-alpine AS build

WORKDIR /app

COPY client/package*.json ./client/
COPY server/package*.json ./server/

RUN cd client && npm ci
RUN cd server && npm ci

COPY client/ ./client/
COPY server/ ./server/

RUN cd server && npm run build


FROM node:22-alpine AS production

WORKDIR /app

COPY --from=build /app/server/package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/server/dist/ ./dist/
COPY --from=build /app/server/public/ ./public/

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/server.js"]
