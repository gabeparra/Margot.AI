FROM node:18-alpine

WORKDIR /app

EXPOSE 8080
ENV HOST 0.0.0.0

COPY package.json package-lock.json ./

RUN npm install --silent

COPY . ./

CMD ["npm", "run", "docker-run"]
