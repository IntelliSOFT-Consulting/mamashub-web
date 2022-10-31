FROM node:alpine

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .

RUN yarn

COPY . .

ENV TZ Africa/Nairobi

RUN yarn build

CMD ["yarn", "start"]