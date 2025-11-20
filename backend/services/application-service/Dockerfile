FROM node:23-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

FROM node:23-alpine AS production

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

COPY --from=build /app/node_modules /app/node_modules
COPY . .

EXPOSE 5555

# Production mode (Chế độ mặc định)
CMD ["node", "server.js"]

# Dev mode (Có thể dùng cho build khác nếu cần)
# CMD ["npm", "run", "dev"]