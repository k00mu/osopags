FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE ${SERVICE_ANALYTICS_PORT}
CMD ["npm", "start"]