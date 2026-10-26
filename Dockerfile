FROM node:latest

WORKDIR /app/RetailBankingApp

COPY package.json /app/RetailBankingApp/

RUN npm ci --only=production --ignore-scripts

COPY ./client/package.json /app/RetailBankingApp/client/

WORKDIR /app/RetailBankingApp/client

RUN npm ci --only=production --ignore-scripts

COPY . /app/RetailBankingApp/

WORKDIR /app/RetailBankingApp

EXPOSE 3000

CMD ["npm", "run", "dev"]
