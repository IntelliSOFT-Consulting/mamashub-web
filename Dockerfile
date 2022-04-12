FROM node:alpine
WORKDIR /usr/nndak-api
COPY package.json .
RUN npm install typescript yarn -g --force
RUN yarn install
COPY . .
RUN yarn getClient
RUN tsc
EXPOSE 8080
CMD ["node", "./build/index.js"]