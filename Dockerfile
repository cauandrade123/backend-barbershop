# ESTÁGIO 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copia apenas os arquivos de dependências primeiro (otimiza o cache)
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos
COPY . .

# ESTÁGIO 2: Produção
FROM node:18-alpine

WORKDIR /app

# Copia os arquivos do estágio anterior usando o nome 'builder'
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
# Se você tiver o .env e quiser usá-lo:
# COPY --from=builder /app/.env ./

# Define a porta para evitar o erro de 'undefined'
ENV PORTA=8080
EXPOSE 8080

# Comando para iniciar (Verifique se o caminho é src/app.js ou src/utils/app.js)
CMD ["node", "src/app.js"]
