FROM node:19.4.0-bullseye-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3100
CMD [ "npm", "start" ]