FROM node:alpine
WORKDIR /usr/yourapplication-name
COPY package.json .
RUN npm install\
    && npm install typescript -g && npm install --global yarn
COPY . .
RUN yarn migrate
RUN tsc
EXPOSE 8080
CMD ["node", "./build/index.js"]