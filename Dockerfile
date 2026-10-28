# Dockerfile - dong goi ung dung devops-demo thanh Image
FROM node:22-alpine

# Phien bien ung dung, co the thay doi luc build: --build-arg APP_VERSION=2.0
ARG APP_VERSION=1.0
ENV APP_VERSION=${APP_VERSION}

WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY src ./src

EXPOSE 3000
USER node

# Kiem tra suc khoe: Docker/Swarm dung ket qua nay de biet Container da san sang
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "src/server.js"]
