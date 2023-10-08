FROM node:18-alpine

WORKDIR /app

EXPOSE 8080

COPY package.json package-lock.json ./

RUN npm install --silent

COPY . ./

CMD ["npm", "run", "docker-run"]
