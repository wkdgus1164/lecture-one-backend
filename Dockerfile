FROM node:17 AS builder
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build

FROM node:17-alpine
WORKDIR /app
COPY --from=builder /app ./

CMD ["yarn", "start:dev"]
