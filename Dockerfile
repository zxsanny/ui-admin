FROM node:18-alpine as build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

COPY . .
RUN yarn build

FROM node:18-alpine as production

WORKDIR /app

RUN yarn global add serve

COPY --from=build /app/build ./build

EXPOSE 3000

USER node

CMD ["serve", "-s", "build", "-l", "3000"]
