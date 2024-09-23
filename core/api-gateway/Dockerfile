FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE ${API_GATEWAY_PORT}
CMD ["npm", "start"]