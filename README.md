# backend-barbershop
A web api using nodeJS, mysql, docker, aws, and gateway of payment

## Execução

1. Copie `.env.example` para `.env` e preencha as credenciais do MySQL e o segredo JWT.
2. Instale as dependências com `npm install`.
3. Inicie a API com `npm start`.

Variáveis obrigatórias: `DB_HOST` (ou `HOST` para compatibilidade), `DB_USER`, `DB_NAME`, `DB_PWD` e `JWT_SECRET`. A API testa a conexão com o banco antes de começar a aceitar requisições.

## Testes

Execute `npm test` para rodar os testes de validação e das rotas sem banco de dados.

## Frontend

A pasta `frontend/` tem uma SPA em React + Vite que consome esta API (cadastro,
login, listagem de serviços, agendamento, remarcação e um painel admin). Para
rodar:

1. `cd frontend && npm install`.
2. Copie `frontend/.env.example` para `frontend/.env` e ajuste `VITE_API_URL`
   se a API não estiver em `http://localhost:3000`.
3. `npm run dev` (com a API rodando em paralelo).

Veja `frontend/README.md` para mais detalhes.
