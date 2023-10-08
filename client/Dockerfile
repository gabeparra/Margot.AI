FROM node:18-alpine

WORKDIR /app

EXPOSE 3030

COPY package.json package-lock.json ./

RUN npm install --silent

COPY . ./

CMD ["npm", "run", "docker-run"]
