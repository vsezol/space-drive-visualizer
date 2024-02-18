FROM node:20.11.1-alpine

WORKDIR /app

RUN apk add g++ make pango-dev jpeg-dev

COPY dist/apps/core-api .

RUN npm ci

EXPOSE 3000

CMD ["node", "main.js"]
