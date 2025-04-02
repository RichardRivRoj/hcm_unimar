FROM node:20-alpine

# Instalar curl y dependencias necesarias
RUN apk add --no-cache curl

WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache git python3 make g++
RUN npm install --include=dev
CMD ["npm", "run", "dev"]