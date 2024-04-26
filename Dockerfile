FROM node:18.14.2

WORKDIR /app/RetailBankingApp

COPY package.json /app/RetailBankingApp/

RUN npm install

COPY ./client/package.json /app/RetailBankingApp/client/

WORKDIR /app/RetailBankingApp/client

RUN npm install

COPY . /app/RetailBankingApp/

WORKDIR /app/RetailBankingApp

EXPOSE 3000

CMD ["npm", "run", "dev"]
