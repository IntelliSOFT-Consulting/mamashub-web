FROM node:alpine

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install --silent

COPY . .

ENV TZ Africa/Nairobi

CMD ["npm", "run", "build"]