FROM node:20.12

WORKDIR /usr/src/app

# copy package.json and package-lock.json
COPY package*.json ./

RUN npm i

# copy the rest of the code
COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
