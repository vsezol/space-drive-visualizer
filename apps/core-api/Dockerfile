FROM node:18.18.0-alpine

WORKDIR /app

RUN apk add pango-dev g++ make jpeg-dev giflib-dev librsvg-dev

COPY apps/core/package.json .
COPY apps/core/package-lock.json .

RUN npm ci

RUN npm run build:core-api

RUN ls -la

COPY dist/apps/core .

EXPOSE 3000

CMD ["node", "main.js"]
