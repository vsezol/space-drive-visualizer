FROM node:20.11.1-alpine

WORKDIR /app

RUN apk add g++ make pango-dev jpeg-dev

COPY package.json package-lock.json nx.json tsconfig.base.json ./
COPY apps/core-api apps/core-api
COPY libs libs

RUN npm ci

RUN npm run build:core-api

EXPOSE 3000

CMD ["node", "dist/apps/core-api/main.js"]
