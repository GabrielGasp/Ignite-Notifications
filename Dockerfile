FROM node:18-slim

RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --silent

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:docker"]