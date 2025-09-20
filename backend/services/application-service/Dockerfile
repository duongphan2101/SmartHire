FROM node:23-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5555

# Dev mode
CMD ["npm", "run", "dev"]

# Production mode:
# CMD ["node", "server.js"]
