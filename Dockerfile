FROM node:8.9-alpine 

LABEL version="1.0"

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm install --production --silent && mv node_modules ../
COPY . .

EXPOSE 3000
CMD npm start