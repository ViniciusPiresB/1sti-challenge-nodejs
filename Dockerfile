FROM node:20.13-alpine3.19

WORKDIR /app

ARG DATABASE_URL="mysql://username:password@mysql:3306/database"
ENV DATABASE_URL=$DATABASE_URL
# Não expor link de banco/Secret keys
ARG JWT_SECRET="Secret_of_your_project"
ENV JWT_SECRET=$JWT_SECRET

COPY package*.json ./

RUN npm install

COPY . .

COPY wait-for-mysql.sh /wait-for-mysql.sh

RUN chmod +x /wait-for-mysql.sh

EXPOSE 3000

# Espera até que o MySQL esteja pronto antes de iniciar a aplicação
CMD ["/bin/sh", "-c", "/wait-for-mysql.sh && npm run prisma:deploy && npm run build && node dist/main.js"]

