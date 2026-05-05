FROM node:24-alpine AS build

WORKDIR /app

COPY client/package*.json ./client/
COPY server/package*.json ./server/

RUN cd client && npm ci
RUN cd server && npm ci

COPY client/ ./client/
COPY server/ ./server/

RUN cd server && npm run build


FROM node:24-alpine AS production

WORKDIR /app

COPY --from=build /app/server/package*.json ./
RUN npm ci --omit=dev

COPY --from=build --chown=node:node /app/server/dist/ ./dist/
COPY --from=build --chown=node:node /app/server/public/ ./public/

ENV NODE_ENV=production

USER node

EXPOSE 3001

ENTRYPOINT ["node"]
CMD ["dist/server.js"]
