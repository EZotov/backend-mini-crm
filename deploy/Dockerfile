FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN yarn install --immutable
COPY . .

RUN yarn build

FROM node:22-alpine AS runner

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Устанавливаем PM2 глобально через npm
RUN npm install -g pm2
RUN yarn install --immutable --production

COPY --from=builder /app/dist ./dist
COPY deploy/ecosystem.config.js ./

EXPOSE 3001

# Запуск pm2-runtime напрямую
CMD ["pm2-runtime", "start", "ecosystem.config.js"]