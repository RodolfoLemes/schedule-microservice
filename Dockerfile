FROM node:16.3.0-alpine AS builder

WORKDIR /home/app

COPY . ./

RUN yarn

RUN yarn build

FROM node:16.3.0-alpine

WORKDIR /home/app

ENV NODE_ENV production

COPY package.json ./
COPY yarn.lock ./

RUN yarn && yarn cache clean

COPY --from=builder /home/app/dist ./dist

CMD [ "yarn", "start:prod" ]