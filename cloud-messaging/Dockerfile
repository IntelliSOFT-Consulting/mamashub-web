FROM node:alpine

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install --silent

COPY . .

RUN npm run fcm-keygen

ENV TZ Africa/Nairobi

CMD ["npm", "run", "build"]