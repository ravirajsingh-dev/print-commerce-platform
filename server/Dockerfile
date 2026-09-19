FROM node:lts-slim

WORKDIR /tt-server

COPY ./package*.json ./

RUN apt-get update && apt-get install -y chromium

RUN npm install

CMD ["npm", "run", "server"]
