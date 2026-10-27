FROM node:26-bookworm-slim

RUN apt-get update \
  && apt-get upgrade -y \
  && rm -rf /var/lib/apt/lists/*

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
